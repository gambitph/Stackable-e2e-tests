/**
 * External dependencies
 */
import {
	 keys, camelCase, isEmpty, first, pick, toUpper, last, get,
} from 'lodash'

/**
 * Internal dependencies
 */
import { getBlockStringPath, createElementFromHTMLString } from '../util'

/**
 * Register Cypress Commands
 */
Cypress.Commands.add( 'assertComputedStyle', { prevSubject: 'element' }, assertComputedStyle )
Cypress.Commands.add( 'assertClassName', { prevSubject: 'element' }, assertClassName )
Cypress.Commands.add( 'assertHtmlTag', { prevSubject: 'element' }, assertHtmlTag )
Cypress.Commands.add( 'assertHtmlAttribute', { prevSubject: 'element' }, assertHtmlAttribute )

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
			}
		} )

		if ( assertFrontend ) {
			const parsedClassList = Array.from( saveElement.classList ).map( _class => `.${ _class }` ).join( '' )
			cy.getPreviewMode().then( previewMode => {
				cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
					cy.visit( previewUrl )
					if ( viewportFrontend && viewportFrontend !== 'Desktop' ) {
						cy.viewport(
							Cypress.config( `viewport${ viewportFrontend }Width` ) || Cypress.config( 'viewportWidth' ),
							Cypress.config( 'viewportHeight' )
						)
					} else if ( previewMode !== 'Desktop' ) {
						cy.viewport(
							Cypress.config( `viewport${ previewMode }Width` ) || Cypress.config( 'viewportWidth' ),
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
	} = options

	cy.wp().then( wp => {
		cy.publish()
		cy.wait( delay )

		const block = wp.data.select( 'core/block-editor' ).getBlock( subject.data( 'block' ) )

		cy
			.get( subject )
			.then( $block => {
				// Assert editor classes.
				if ( assertBackend ) {
					assert.isTrue(
						!! $block.find( `${ customSelector }.${ expectedValue }` ).length,
						`${ expectedValue } class must be present in ${ customSelector } in Editor`
					)
				}

				// Assert frontend classes.
				// Check if we're asserting the parent element.
				if ( assertFrontend ) {
					const saveElement = createElementFromHTMLString( wp.blocks.getBlockContent( block ) )
					const parsedClassList = Array.from( saveElement.classList ).map( _class => `.${ _class }` ).join( '' )
					if ( parsedClassList.match( customSelector ) ) {
						assert.isTrue(
							!! parsedClassList.match( expectedValue ),
							`${ expectedValue } class must be present in ${ customSelector } in Editor`
						)
					} else {
						// Otherwise, search the element
						assert.isTrue(
							!! Array.from( saveElement.querySelector( customSelector ).classList ).includes( expectedValue ),
							`${ expectedValue } class must be present in ${ customSelector } in Editor`
						)
					}
				}
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
	} = options

	cy.wp().then( wp => {
		cy.publish()
		cy.wait( delay )

		const block = wp.data.select( 'core/block-editor' ).getBlock( subject.data( 'block' ) )

		cy
			.get( subject )
			.then( $block => {
				// Assert editor HTML tag.
				if ( assertBackend ) {
					assert.isTrue(
						! isEmpty( $block.find( `${ expectedValue }${ customSelector }` ) ),
						`${ customSelector } must have HTML tag '${ expectedValue }' in Editor'`
					)
				}

				// Check if we're asserting the parent element.
				if ( assertFrontend ) {
					const saveElement = createElementFromHTMLString( wp.blocks.getBlockContent( block ) )
					const parsedClassList = Array.from( saveElement.classList ).map( _class => `.${ _class }` ).join( '' )
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
				}
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
	} = options

	cy.wp().then( wp => {
		cy.publish()
		cy.wait( delay )

		const block = wp.data.select( 'core/block-editor' ).getBlock( subject.data( 'block' ) )

		cy
			.get( subject )
			.find( customSelector )
			.invoke( 'attr', attribute )
			.then( $attribute => {
				// Assert editor HTML attributes.
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
				}

				// Check if we're asserting the parent element.
				if ( assertFrontend ) {
					const saveElement = createElementFromHTMLString( wp.blocks.getBlockContent( block ) )
					const parsedClassList = Array.from( saveElement.classList ).map( _class => `.${ _class }` ).join( '' )
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
				}
			} )
	} )
}
