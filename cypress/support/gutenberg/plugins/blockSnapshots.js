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

class BlockSnapshots {
	constructor() {
		// Set Cypress Alias
		this.alias = null
	}

	/**
	 * Asynchronously initialize contentSnapshots and stubbedStyles
	 * using Cypress alias.
	 *
	 * @param {string} alias
	 * @see https://docs.cypress.io/guides/core-concepts/variables-and-aliases.html
	 */
	registerAlias( alias ) {
		this.alias = alias
		cy.wrap( [] ).as( `${ alias }.contentSnapshots` )
		cy.wrap( [] ).as( `${ alias }.stubbedStyles` )
	}

	/**
	 * Asynchronously stub the current block snapshot and save its
	 * stringified HTML content using `wp.blocks.getBlockContent`.
	 */
	createContentSnapshot() {
		const self = this
		cy.wp().then( wp => {
			cy.get( `@${ self.alias }` ).then( _block => {
				cy.document().then( doc => {
					const { className } = _block.attributes
					const blockElement = doc.querySelector( `.${ className }` ).parentElement
					const clientId = blockElement.getAttribute( 'data-block' )
					// Get the parent block first.
					const parentBlockClientId = first( wp.data.select( 'core/block-editor' ).getBlockParents( clientId ) )
					const block = wp.data.select( 'core/block-editor' ).getBlock( parentBlockClientId || clientId )
					const blockContent = wp.blocks.getBlockContent( block )
					cy.get( `@${ self.alias }.contentSnapshots` ).then( $snapShots => {
						cy.wrap( [ ...$snapShots, blockContent ] ).as( `${ self.alias }.contentSnapshots` )
					} )
				} )
			} )
		} )
	}

	/**
	 * Asynchronously stub the current cssObject.
	 *
	 * @param {Object} style
	 * @param {string} viewport
	 */
	stubStyles( style, viewport ) {
		const self = this
		cy.get( `@${ self.alias }.stubbedStyles` ).then( $stubbedStyles => {
			$stubbedStyles.push( { style, viewport } )
			cy.wrap( $stubbedStyles ).as( `${ self.alias }.stubbedStyles` ).then( () => {
			} )
		} )
	}

	/**
	 * Enqueue all stubbed html contents to the frontend.
	 * Individually assert its computed style.
	 */
	assertFrontendStyles() {
		const self = this
		cy.get( `@${ self.alias }.stubbedStyles` ).then( $stubbedStyles => {
			cy.get( `@${ self.alias }.contentSnapshots` ).then( $contentSnapshots => {
				cy.get( `@${ self.alias }` ).then( $block => {
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
								const classSelector = `.${ $block.attributes.className }`
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

									const documentSelector = `${ classSelector }${ first( selectorWithSpace ).match( /\./ )
										?	( classSelector.match( first( selectorWithSpace ) )
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
		} )
	}
}

/**
 * Function used to register block snapshots in
 * block tests. It also overwrites assertion commands.
 *
 * @param {string} alias
 */
export const registerBlockSnapshots = alias => {
	const blockSnapshots = new BlockSnapshots()
	blockSnapshots.registerAlias( alias )

	/**
	 * Overwrite `assertComputedStyle` by passing `blockSnapshots` option
	 */
	Cypress.Commands.overwrite( 'assertComputedStyle', ( originalFn, ...args ) => {
		function modifiedFn( ...passedArgs ) {
			cy.getPreviewMode().then( viewport => {
				const options = passedArgs.pop()
				// Since Cypress commands are asynchronous, we need to pass a separate object to originalFn to avoid directly mutating the options argument.
				const optionsToPass = cloneDeep( options )
				optionsToPass.assertFrontend = false
				if ( options.assertFrontend === undefined || ( isBoolean( options.assertFrontend ) && options.assertFrontend ) ) {
					blockSnapshots.stubStyles( passedArgs[ 1 ], options.viewportFrontend || viewport )
					blockSnapshots.createContentSnapshot()
				}
				originalFn( ...[ ...passedArgs, optionsToPass ] )
			} )
		}

		if ( args.length === 3 ) {
			return modifiedFn( ...args )
		}
		return modifiedFn( ...[ ...args, {} ] )
	} )

	Cypress.Commands.overwrite( 'assertClassName', ( originalFn, ...args ) => {
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

	Cypress.Commands.overwrite( 'assertHtmlTag', ( originalFn, ...args ) => {
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

	Cypress.Commands.overwrite( 'assertHtmlAttribute', ( originalFn, ...args ) => {
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

	/**
	 * Overwrite `assertBlockContent` by passing `blockSnapshots` option
	 */
	 Cypress.Commands.overwrite( 'assertBlockContent', ( originalFn, ...args ) => {
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

	return blockSnapshots
}

export default BlockSnapshots
