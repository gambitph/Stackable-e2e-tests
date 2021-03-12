/**
 * External dependencies
 */
import {
	keys, camelCase, isEmpty, first, pick, last, get, toUpper,
} from 'lodash'

/**
 * Internal dependencies
 */
import {
	getBlockStringPath, createElementFromHTMLString, overwriteAssert,
} from '../util'

/**
 * Register Cypress Commands
 */
Cypress.Commands.add( 'assertComputedStyle', { prevSubject: 'element' }, assertComputedStyle )
Cypress.Commands.add( 'assertClassName', { prevSubject: 'element' }, assertClassName )
Cypress.Commands.add( 'assertHtmlTag', { prevSubject: 'element' }, assertHtmlTag )
Cypress.Commands.add( 'assertHtmlAttribute', { prevSubject: 'element' }, assertHtmlAttribute )

// Temporary overwrite fix. @see stackable/commands/assertions.js
Cypress.Commands.overwrite( 'assertComputedStyle', overwriteAssert( { argumentLength: 3 } ) )
Cypress.Commands.overwrite( 'assertClassName', overwriteAssert( { argumentLength: 4 } ) )
Cypress.Commands.overwrite( 'assertHtmlTag', overwriteAssert( { argumentLength: 4 } ) )
Cypress.Commands.overwrite( 'assertHtmlAttribute', overwriteAssert( { argumentLength: 5 } ) )

export function _assertComputedStyle( selector, pseudoEl, _cssObject, assertType, viewport = 'Desktop' ) {
	const removeAnimationStyles = [
		'-webkit-transition: none !important',
		'-moz-transition: none !important',
		'-o-transition: none !important',
		'transition: none !important',
		'transition-duration: 0s !important',
	]

	cy.window().then( win => {
		cy.document().then( doc => {
			cy
				.get( selector )
				.then( $block => {
					const element = first( $block )

					const parentEl = assertType === 'Editor'
						? doc.querySelector( '.edit-post-visual-editor' )
						: doc.querySelector( 'body' )

					const convertExpectedValueForEnqueue = expectedValue => {
						// Handle conversion of vw to px.
						if ( expectedValue.match( /vw$/ ) ) {
							const visualEl = doc.querySelector( '.edit-post-visual-editor' )
							if ( visualEl && assertType === 'Editor' && viewport !== 'Desktop' ) {
								const currEditorWidth = pick( win.getComputedStyle( visualEl ), 'width' ).width
								return `${ parseFloat( ( parseInt( expectedValue ) ) / 100 * currEditorWidth ) }px`
							}
						}
						return expectedValue
					}

					// Remove animations.
					element.setAttribute( 'style', removeAnimationStyles.join( '; ' ) )
					element.parentElement.setAttribute( 'style', removeAnimationStyles.join( '; ' ) )
					parentEl.parentElement.setAttribute( 'style', removeAnimationStyles.join( '; ' ) )

					const computedStyles = pick( win.getComputedStyle( element, pseudoEl ? `:${ pseudoEl }` : undefined ), ...keys( _cssObject ).map( camelCase ) )
					const expectedStylesToEnqueue = keys( _cssObject ).map( key =>
						`${ key }: ${ convertExpectedValueForEnqueue( _cssObject[ key ] ) } !important` )

					element.setAttribute( 'style', `${ [ ...removeAnimationStyles, ...expectedStylesToEnqueue ].join( '; ' ) }` )
					const expectedStyles = pick( win.getComputedStyle( element, pseudoEl ? `:${ pseudoEl }` : undefined ), ...keys( _cssObject ).map( camelCase ) )

					keys( _cssObject ).forEach( key => {
						const computedStyle = computedStyles[ camelCase( key ) ]
						const expectedStyle = expectedStyles[ camelCase( key ) ]
						assert.equal(
							computedStyle,
							expectedStyle,
							`'${ camelCase( key ) }' expected to be ${ expectedStyle } in ${ assertType }. Found '${ computedStyle }'.`
						)
					} )
				} )
		} )
	} )
}

/**
 * Command for asserting the computed style of a block.
 *
 * @param {*} subject
 * @param {Object} cssObject
 * @param {Object} options
 */
export function assertComputedStyle( subject, cssObject = {}, options = {} ) {
	const {
		assertFrontend = true,
		assertBackend = true,
		delay = 0,
		viewportFrontend = false,
		afterFrontendAssert = () => {},
		afterBackendAssert = () => {},
	} = options

	cy.wp().then( wp => {
		cy.publish()
		cy.wait( delay )

		const block = wp.data.select( 'core/block-editor' ).getBlock( subject.data( 'block' ) )
		const saveElement = createElementFromHTMLString( wp.blocks.getBlockContent( block ) )
		const blockPath = getBlockStringPath( wp.data.select( 'core/block-editor' ).getBlocks(), subject.data( 'block' ) )

		cy.getPreviewMode().then( previewMode => {
			if ( assertBackend ) {
				keys( cssObject ).forEach( _selector => {
					const selector = _selector.split( ':' )

					// Assert editor computed style.
					_assertComputedStyle(
						`.is-selected${ ` ${ first( selector ) }` }`,
						selector.length === 2 && last( selector ),
						cssObject[ _selector ],
						'Editor',
						previewMode
					)
				} )
				afterBackendAssert()
			}
		} )

		if ( assertFrontend ) {
			const parsedClassList = Array.from( saveElement.classList ).map( _class => `.${ _class }` ).join( '' )
			cy.getPreviewMode().then( previewMode => {
				cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
					cy.visit( previewUrl )
					const selectedViewport = viewportFrontend || previewMode
					if ( typeof selectedViewport === 'string' ) {
						if ( selectedViewport !== 'Desktop' ) {
						// Change viewport based on preferred preview mode.
							cy.viewport(
								Cypress.config( `viewport${ selectedViewport }Width` ) || Cypress.config( 'viewportWidth' ),
								Cypress.config( 'viewportHeight' )
							)
						}
					} else {
						// Change viewport based on preferred width.
						cy.viewport(
							selectedViewport,
							Cypress.config( 'viewportHeight' )
						)
					}

					// Assert frontend computed style.
					cy.wait( delay )
					keys( cssObject ).forEach( _selector => {
						const selector = _selector.split( ':' )
						const selectorWithSpace = first( selector ).split( ' ' )
						const [ , ...restOfTheSelectors ] = [ ...selectorWithSpace ]

						const documentSelector = `${ parsedClassList }${ first( selectorWithSpace ).match( /\./ )
							?	( parsedClassList.match( first( selectorWithSpace ) )
								? ` ${ restOfTheSelectors.join( ' ' ) }`
								: ` ${ first( selector ) }` )
							: ` ${ first( selector ) }` }`.trim()

						_assertComputedStyle(
							documentSelector,
							selector.length === 2 && last( selector ),
							cssObject[ _selector ],
							'Frontend'
						)
					} )

					cy.viewport( Cypress.config( 'viewportWidth' ), Cypress.config( 'viewportHeight' ) )
					cy.visit( editorUrl )
					cy.wp().then( _wp => {
						const { clientId, name } = get( _wp.data.select( 'core/block-editor' ).getBlocks(), blockPath ) || {}
						cy.selectBlock( name, { clientId } )
						afterFrontendAssert()
					} )
				} )
			} )
		}
	} )
}

/**
 * Command for asserting the included classNames.
 *
 * @param  {*} subject
 * @param {string} customSelector
 * @param {string} expectedValue
 * @param {Object} options
 */
export function assertClassName( subject, customSelector = '', expectedValue = '', options = {} ) {
	const {
		assertBackend = true,
		assertFrontend = true,
		delay = 0,
		afterFrontendAssert = () => {},
		afterBackendAssert = () => {},
	} = options

	cy.wp().then( wp => {
		cy.publish()
		cy.wait( delay )
		const blockPath = getBlockStringPath( wp.data.select( 'core/block-editor' ).getBlocks(), subject.data( 'block' ) )

		cy.getBlockAttributes().then( attributes => {
			const selector = `.${ attributes.className }`
			cy
				.get( subject )
				.then( $block => {
					// Assert editor classes.
					if ( assertBackend ) {
						assert.isTrue(
							!! $block.find( `${ customSelector }.${ expectedValue }` ).length,
							`${ expectedValue } class must be present in ${ customSelector } in Editor`
						)
						afterBackendAssert()
					}

					// Assert frontend classes
					if ( assertFrontend ) {
						cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
							cy.visit( previewUrl )
							cy.document().then( doc => {
								const element = doc.querySelector( selector )
								if ( element ) {
									const parsedClassNames = Array.from( element.classList ).map( _class => `.${ _class }` ).join( '' )
									// Check if we're asserting the parent element.
									if ( parsedClassNames.match( customSelector ) ) {
										assert.isTrue(
											!! parsedClassNames.match( expectedValue ),
											`${ expectedValue } class must be present in ${ customSelector } in Frontend`
										)
									} else {
										// Otherwise, search the element
										assert.isTrue(
											!! Array.from( element.querySelector( customSelector ).classList ).includes( expectedValue ),
											`${ expectedValue } class must be present in ${ customSelector } in Frontend`
										)
									}
								}
							} )
							cy.visit( editorUrl )
							cy.wp().then( _wp => {
								const { clientId, name } = get( _wp.data.select( 'core/block-editor' ).getBlocks(), blockPath ) || {}
								cy.selectBlock( name, { clientId } )
								afterFrontendAssert()
							} )
						} )
					}
				} )
		} )
	} )
}

/**
 * Command for asserting the html tag
 *
 * @param {*} subject
 * @param {string} customSelector
 * @param {string} expectedValue
 * @param {Object} options
 */
export function assertHtmlTag( subject, customSelector = '', expectedValue = '', options = {} ) {
	const {
		assertBackend = true,
		assertFrontend = true,
		delay = 0,
		afterFrontendAssert = () => {},
		afterBackendAssert = () => {},
	} = options

	cy.wp().then( wp => {
		cy.publish()
		cy.wait( delay )
		const blockPath = getBlockStringPath( wp.data.select( 'core/block-editor' ).getBlocks(), subject.data( 'block' ) )

		cy.getBlockAttributes().then( attributes => {
			const selector = `.${ attributes.className }`
			cy
				.get( subject )
				.then( $block => {
					// Assert editor classes.
					if ( assertBackend ) {
						assert.isTrue(
							! isEmpty( $block.find( `${ expectedValue }${ customSelector }` ) ),
							`${ customSelector } must have HTML tag '${ expectedValue }' in Editor'`
						)
						afterBackendAssert()
					}

					// Assert frontend classes
					if ( assertFrontend ) {
						cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
							cy.visit( previewUrl )
							cy.document().then( doc => {
								const element = doc.querySelector( selector )
								if ( element ) {
									const parsedClassNames = Array.from( element.classList ).map( _class => `.${ _class }` ).join( '' )
									// Check if we're asserting the parent element.
									if ( parsedClassNames.match( customSelector ) ) {
										assert.isTrue(
											element.tagName === toUpper( expectedValue ),
											`${ customSelector } must have HTML tag '${ expectedValue }' in Frontend'`
										)
									} else {
										// Otherwise, search the element
										assert.isTrue(
											element.querySelector( customSelector ).tagName === toUpper( expectedValue ),
											`${ customSelector } must have HTML tag '${ expectedValue }' in Frontend'`
										)
									}
								}
							} )
							cy.visit( editorUrl )
							cy.wp().then( _wp => {
								const { clientId, name } = get( _wp.data.select( 'core/block-editor' ).getBlocks(), blockPath ) || {}
								cy.selectBlock( name, { clientId } )
								afterFrontendAssert()
							} )
						} )
					}
				} )
		} )
	} )
}

/**
 * Command for asserting the html attribute
 *
 * @param {*} subject
 * @param {string} customSelector
 * @param {string} attribute
 * @param {*} expectedValue
 * @param {Object} options
 */
export function assertHtmlAttribute( subject, customSelector = '', attribute = '', expectedValue = '', options = {} ) {
	const {
		assertBackend = true,
		assertFrontend = true,
		delay = 0,
		afterFrontendAssert = () => {},
		afterBackendAssert = () => {},
	} = options

	cy.wp().then( wp => {
		cy.publish()
		cy.wait( delay )
		const blockPath = getBlockStringPath( wp.data.select( 'core/block-editor' ).getBlocks(), subject.data( 'block' ) )

		cy.getBlockAttributes().then( attributes => {
			const selector = `.${ attributes.className }`
			cy
				.get( subject )
				.find( customSelector )
				.invoke( 'attr', attribute )
				.then( $attribute => {
					// Assert editor classes.
					if ( assertBackend ) {
						if ( typeof expectedValue === 'string' ) {
							assert.isTrue(
								$attribute === expectedValue,
								`${ customSelector } must have a ${ attribute } = "${ expectedValue }" in Editor`
							)
						} else if ( expectedValue instanceof RegExp ) {
							assert.isTrue(
								( $attribute || '' ).match( expectedValue ),
								`${ customSelector } must have a ${ attribute } = "${ expectedValue }" in Editor` )
						}
						afterBackendAssert()
					}

					// Assert frontend classes
					if ( assertFrontend ) {
						cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
							cy.visit( previewUrl )
							cy.document().then( doc => {
								const element = doc.querySelector( selector )
								if ( element ) {
									const parsedClassNames = Array.from( element.classList ).map( _class => `.${ _class }` ).join( '' )
									// Check if we're asserting the parent element.
									if ( parsedClassNames.match( customSelector ) ) {
										assert.isTrue(
											attribute instanceof RegExp
												? !! element.getAttribute( attribute ).match( expectedValue )
												: element.getAttribute( attribute ) === expectedValue,
											`${ customSelector } must have ${ attribute } = "${ expectedValue } in Frontend"`
										)
									} else {
										// Otherwise, search the element
										assert.isTrue(
											attribute instanceof RegExp
												? !! element.querySelector( customSelector ).getAttribute( attribute ).match( expectedValue )
												: element.querySelector( customSelector ).getAttribute( attribute ) === expectedValue,
											`${ customSelector } must have ${ attribute } = "${ expectedValue } in Frontend"`
										)
									}
								}
							} )
							cy.visit( editorUrl )
							cy.wp().then( _wp => {
								const { clientId, name } = get( _wp.data.select( 'core/block-editor' ).getBlocks(), blockPath ) || {}
								cy.selectBlock( name, { clientId } )
								afterFrontendAssert()
							} )
						} )
					}
				} )
		} )
	} )
}
