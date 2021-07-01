/**
 * Block Snapshots
 * `wp.blocks.getBlockContent` can be used to generate block HTML content. With this,
 * we can overwrite `getComputedStyle` to stub all generated HTML contents and CSS objects for future assertions.
 *
 * Usage:
 * // import registerBlockSnapshots to create an instance of BlockSnapshots
 * import { registerBlockSnapshots } from '~gutenberg-e2e/plugins'
 *
 * function desktopStyles( viewport, desktopOnly ) {
 * 	cy.setupWP()
 * 	cy.newPage()
 * 	cy.addBlock( 'ugb/accordion' ).as( 'accordionBlock' )
 * 	const accordionBlock = registerblockSnapshots( 'accordionBlock' )
 *
 * 	// More tests...
 * 	// All assertion commands will no longer assert the frontend every call.
 * 	// Instead, block snapshots will be stubbed and can be enqueued before the end of the test
 *
 * 	// Enqueue all block snapshots and assert frontend styles
 * 	accordionBlock.assertFrontendStyles
 * }
 */

/**
 * Internal dependencies
 */
import {
	createElementFromHTMLString,
} from '../util'
import { _assertComputedStyle } from '../commands/assertions'

/**
 * External dependencies
 */
import {
	first, keys, last, isBoolean, cloneDeep, toUpper,
} from 'lodash'

/**
 * Asynchronously initialize contentSnapshots and stubbedStyles
 * using Cypress alias.
 *
 * @param {string} alias
 * @see https://docs.cypress.io/guides/core-concepts/variables-and-aliases.html
 */
function registerAlias( alias ) {
	cy.wrap( [] ).as( `${ alias }.contentSnapshots` )
	cy.wrap( [] ).as( `${ alias }.stubbedStyles` )
	cy.get( `@${ alias }` ).then( $block => {
		cy.get( '@blockSnapshotBlocks' ).then( $blockSnapshotBlocks =>
			cy.wrap( [ ...$blockSnapshotBlocks, Object.assign( $block, { alias } ) ] ).as( 'blockSnapshotBlocks' ) )
	} )
}

/**
 * Asynchronously stub the current block snapshot and save its
 * stringified HTML content using `wp.blocks.getBlockContent`.
 *
 * @param {string} alias
 */
function createContentSnapshot( alias ) {
	cy.wp().then( wp => {
		cy.get( `@${ alias }` ).then( _block => {
			cy.get( 'body' ).then( $body => {
				const { className } = _block.attributes
				const blockElement = $body.find( `.${ className }` ).closest( '[data-block]' )
				const clientId = blockElement.data( 'block' )
				// Get the parent block first.
				const parentBlockClientId = first( wp.data.select( 'core/block-editor' ).getBlockParents( clientId ) )
				const block = wp.data.select( 'core/block-editor' ).getBlock( parentBlockClientId || clientId )
				const blockContent = wp.blocks.getBlockContent( block )
				cy.get( `@${ alias }.contentSnapshots` ).then( $snapShots => {
					cy.wrap( [ ...$snapShots, blockContent ] ).as( `${ alias }.contentSnapshots` )
				} )
			} )
		} )
	} )
}

/**
 * Asynchronously stub the current cssObject.
 *
 * @param {string} alias
 * @param {Object} style
 * @param {string} viewport
 */
function stubStyles( alias, style, viewport ) {
	cy.get( `@${ alias }.stubbedStyles` ).then( $stubbedStyles => {
		$stubbedStyles.push( { style, viewport } )
		cy.wrap( $stubbedStyles ).as( `${ alias }.stubbedStyles` ).then( () => {
		} )
	} )
}

/**
 * Enqueue all stubbed html contents to the frontend.
 * Individually assert its computed style.
 *
 * @param {string} alias
 */
function assertFrontendStyles( alias ) {
	cy.get( `@${ alias }.stubbedStyles` ).then( $stubbedStyles => {
		cy.get( `@${ alias }.contentSnapshots` ).then( $contentSnapshots => {
			// Combine all stubbed styles and content snapshots into one array.
			const combinedStubbed = $contentSnapshots.map( ( htmlContent, index ) => {
				return {
					htmlContent,
					viewport: $stubbedStyles[ index ].viewport,
					style: $stubbedStyles[ index ].style,
				}
			} )

			if ( ! combinedStubbed.length ) {
				return
			}

			cy.savePost()
			cy.getPostUrls().then( ( { previewUrl } ) => {
				cy.visit( previewUrl )
				combinedStubbed.forEach( combinedStubbedContent => {
					cy.document().then( doc => {
						const {
							viewport, htmlContent, style,
						} = combinedStubbedContent

						// Create a DOMElement based on the HTML string.
						const blockElement = createElementFromHTMLString( htmlContent )
						// Get the class selector.
						const classList = Array.from( blockElement.classList ).map( _class => `.${ _class }` ).join( '' )
						// Remove all blocks inside .entry-content.
						doc.querySelector( '.entry-content' ).innerHTML = ''

						// Change the viewport.
						if ( typeof viewport === 'string' ) {
							if ( viewport !== 'Desktop' ) {
								cy.viewport( Cypress.config( `viewport${ viewport }Width` ) || Cypress.config( 'viewportWidth' ), Cypress.config( 'viewportHeight' ) )
							}
						} else {
							cy.viewport(
								viewport,
								Cypress.config( 'viewportHeight' )
							)
						}

						// Append the stubbed block in .entry-content
						doc.querySelector( '.entry-content' ).appendChild( blockElement )

						keys( style ).forEach( _selector => {
							const selector = _selector.split( ':' )
							const selectorWithSpace = first( selector ).split( ' ' )
							const [ , ...restOfTheSelectors ] = [ ...selectorWithSpace ]

							const documentSelector = `${ classList }${ first( selectorWithSpace ).match( /\./ )
								?	( classList.match( first( selectorWithSpace ) )
									? ` ${ restOfTheSelectors.join( ' ' ) }`
									: ` ${ first( selector ) }` )
								: ` ${ first( selector ) }` }`.trim()

							// Assert computed style.
							_assertComputedStyle(
								documentSelector,
								selector.length && last( selector ),
								style[ _selector ],
								'Frontend',
								viewport )
						} )

						// Revert the viewport
						cy.viewport( Cypress.config( 'viewportWidth' ), Cypress.config( 'viewportHeight' ) )
					} )
				} )
			} )
		} )
	} )
}

export function blockSnapshotsAssertComputedStyle( originalFn, ...args ) {
	return cy.get( '@blockSnapshotBlocks' ).then( $blockSnapshotBlocks => {
		const isWithBlockSnapshotAlias = $blockSnapshotBlocks.find( ( { clientId } ) => clientId === first( args ).data( 'block' ) )
		if ( ! isWithBlockSnapshotAlias ) {
			return originalFn( ...args )
		}

		const { alias } = isWithBlockSnapshotAlias

		function modifiedFn( ...passedArgs ) {
			cy.getPreviewMode().then( viewport => {
				const options = passedArgs.pop()
				// Since Cypress commands are asynchronous, we need to pass a separate object to originalFn to avoid directly mutating the options argument.
				const optionsToPass = cloneDeep( options )
				optionsToPass.assertFrontend = false
				if ( options.assertFrontend === undefined || ( isBoolean( options.assertFrontend ) && options.assertFrontend ) ) {
					stubStyles( alias, passedArgs[ 1 ], options.viewportFrontend || viewport )
					createContentSnapshot( alias )
				}
				originalFn( ...[ ...passedArgs, optionsToPass ] )
			} )
		}

		if ( args.length === 3 ) {
			return modifiedFn( ...args )
		}
		return modifiedFn( ...[ ...args, {} ] )
	} )
}

export function blockSnapshotsAssertClassName( originalFn, ...args ) {
	return cy.get( '@blockSnapshotBlocks' ).then( $blockSnapshotBlocks => {
		const isWithBlockSnapshotAlias = $blockSnapshotBlocks.find( ( { clientId } ) => clientId === first( args ).data( 'block' ) )
		if ( ! isWithBlockSnapshotAlias ) {
			return originalFn( ...args )
		}

		function modifiedFn( ...passedArgs ) {
			const options = passedArgs.pop()
			const [ subject, customSelector, expectedValue ] = passedArgs
			// Since Cypress commands are asynchronous, we need to pass a separate object to originalFn to avoid directly mutating the options argument.
			const optionsToPass = cloneDeep( options )
			optionsToPass.assertFrontend = false
			if ( options.assertFrontend === undefined || ( isBoolean( options.assertFrontend ) && options.assertFrontend ) ) {
				cy.wp().then( wp => {
					const block = wp.data.select( 'core/block-editor' ).getBlock( subject.data( 'block' ) )
					const saveElement = createElementFromHTMLString( wp.blocks.getBlockContent( block ) )
					// Assert frontend classes.
					// Check if we're asserting the parent element.
					const parsedClassList = Array.from( saveElement.classList ).map( _class => `.${ _class }` ).join( '' )
					if ( parsedClassList.match( customSelector ) ) {
						assert.isTrue(
							!! parsedClassList.match( expectedValue ),
							`${ expectedValue } class must be present in ${ customSelector } in Frontend`
						)
					} else {
					// Otherwise, search the element
						assert.isTrue(
							!! Array.from( saveElement.querySelector( customSelector ).classList ).includes( expectedValue ),
							`${ expectedValue } class must be present in ${ customSelector } in Frontend`
						)
					}
				} )
			}
			originalFn( ...[ ...passedArgs, optionsToPass ] )
		}

		if ( args.length === 4 ) {
			return modifiedFn( ...args )
		}
		return modifiedFn( ...[ ...args, {} ] )
	} )
}

export function blockSnapshotsAssertHtmlTag( originalFn, ...args ) {
	return cy.get( '@blockSnapshotBlocks' ).then( $blockSnapshotBlocks => {
		const isWithBlockSnapshotAlias = $blockSnapshotBlocks.find( ( { clientId } ) => clientId === first( args ).data( 'block' ) )
		if ( ! isWithBlockSnapshotAlias ) {
			return originalFn( ...args )
		}

		function modifiedFn( ...passedArgs ) {
			const options = passedArgs.pop()
			const [ subject, customSelector, expectedValue ] = passedArgs
			// Since Cypress commands are asynchronous, we need to pass a separate object to originalFn to avoid directly mutating the options argument.
			const optionsToPass = cloneDeep( options )
			optionsToPass.assertFrontend = false
			if ( options.assertFrontend === undefined || ( isBoolean( options.assertFrontend ) && options.assertFrontend ) ) {
				cy.wp().then( wp => {
					const block = wp.data.select( 'core/block-editor' ).getBlock( subject.data( 'block' ) )
					const saveElement = createElementFromHTMLString( wp.blocks.getBlockContent( block ) )
					const parsedClassList = Array.from( saveElement.classList ).map( _class => `.${ _class }` ).join( '' )
					// Check if we're asserting the parent element.
					if ( parsedClassList.match( customSelector ) ) {
						assert.isTrue(
							saveElement.tagName === toUpper( expectedValue ),
							`${ customSelector } must have HTML tag '${ expectedValue }' in Frontend'`
						)
					} else {
					// Otherwise, search the element
						assert.isTrue(
							saveElement.querySelector( customSelector ).tagName === toUpper( expectedValue ),
							`${ customSelector } must have HTML tag '${ expectedValue }' in Frontend'`
						)
					}
				} )
			}
			originalFn( ...[ ...passedArgs, optionsToPass ] )
		}

		if ( args.length === 4 ) {
			return modifiedFn( ...args )
		}
		return modifiedFn( ...[ ...args, {} ] )
	} )
}

export function blockSnapshotsAssertHtmlAttribute( originalFn, ...args ) {
	return cy.get( '@blockSnapshotBlocks' ).then( $blockSnapshotBlocks => {
		const isWithBlockSnapshotAlias = $blockSnapshotBlocks.find( ( { clientId } ) => clientId === first( args ).data( 'block' ) )
		if ( ! isWithBlockSnapshotAlias ) {
			return originalFn( ...args )
		}

		function modifiedFn( ...passedArgs ) {
			const options = passedArgs.pop()
			const [ subject, customSelector, attribute, expectedValue ] = passedArgs
			// Since Cypress commands are asynchronous, we need to pass a separate object to originalFn to avoid directly mutating the options argument.
			const optionsToPass = cloneDeep( options )
			optionsToPass.assertFrontend = false
			if ( options.assertFrontend === undefined || ( isBoolean( options.assertFrontend ) && options.assertFrontend ) ) {
				cy.wp().then( wp => {
					const block = wp.data.select( 'core/block-editor' ).getBlock( subject.data( 'block' ) )
					const saveElement = createElementFromHTMLString( wp.blocks.getBlockContent( block ) )
					const parsedClassList = Array.from( saveElement.classList ).map( _class => `.${ _class }` ).join( '' )
					// Check if we're asserting the parent element.
					if ( parsedClassList.match( customSelector ) ) {
						assert.isTrue(
							attribute instanceof RegExp
								? !! saveElement.getAttribute( attribute ).match( expectedValue )
								: saveElement.getAttribute( attribute ) === expectedValue,
							`${ customSelector } must have ${ attribute } = "${ expectedValue } in Frontend"`
						)
					} else {
					// Otherwise, search the element
						assert.isTrue(
							attribute instanceof RegExp
								? !! saveElement.querySelector( customSelector ).getAttribute( attribute ).match( expectedValue )
								: saveElement.querySelector( customSelector ).getAttribute( attribute ) === expectedValue,
							`${ customSelector } must have ${ attribute } = "${ expectedValue } in Frontend"`
						)
					}
				} )
			}
			originalFn( ...[ ...passedArgs, optionsToPass ] )
		}

		if ( args.length === 5 ) {
			return modifiedFn( ...args )
		}
		return modifiedFn( ...[ ...args, {} ] )
	} )
}

export function blockSnapshotsAssertBlockContent( originalFn, ...args ) {
	return cy.get( '@blockSnapshotBlocks' ).then( $blockSnapshotBlocks => {
		const isWithBlockSnapshotAlias = $blockSnapshotBlocks.find( ( { clientId } ) => clientId === first( args ).data( 'block' ) )
		if ( ! isWithBlockSnapshotAlias ) {
			return originalFn( ...args )
		}

		function modifiedFn( ...passedArgs ) {
			const options = passedArgs.pop()
			// Since Cypress commands are asynchronous, we need to pass a separate object to originalFn to avoid directly mutating the options argument.
			const optionsToPass = cloneDeep( options )
			optionsToPass.assertFrontend = false
			const [ subject, customSelector, expectedValue ] = passedArgs

			cy.wp().then( wp => {
				const block = wp.data.select( 'core/block-editor' ).getBlock( subject.data( 'block' ) )
				const saveElement = createElementFromHTMLString( wp.blocks.getBlockContent( block ) )
				const parsedClassList = Array.from( saveElement.classList ).map( _class => `.${ _class }` ).join( '' )

				assert.isTrue(
					( parsedClassList.match( customSelector ) ? saveElement : saveElement.querySelector( customSelector ) ).textContent === expectedValue,
					`${ customSelector } must have content '${ expectedValue }' in Frontend'`
				)
			} )

			originalFn( ...[ ...passedArgs, optionsToPass ] )
		}

		if ( args.length === 4 ) {
			return modifiedFn( ...args )
		}
		return modifiedFn( ...[ ...args, {} ] )
	} )
}

/**
 * Function used to register block snapshots in
 * block tests. It also overwrites assertion commands.
 *
 * @param {string} alias
 */
export const registerBlockSnapshots = alias => {
	registerAlias( alias )

	return { assertFrontendStyles: () => assertFrontendStyles( alias ) }
}

