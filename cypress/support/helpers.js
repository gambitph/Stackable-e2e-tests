/**
 * Internal dependencies
 */
import { publish } from './commands'
import {
	getActiveTab, getAddresses, getPreviewMode, parseClassList,
} from './util'
import config from '../../cypress.json'
import { collapse, openSidebar } from './commands/inspector'

/**
 * External dependencies
 */
import {
	startCase, keys, compact,
} from 'lodash'

/**
 * Helper function for creating block validation test.
 *
 * @param {string} blockName
 */
export const blockErrorTest = ( blockName = 'ugb/accordion' ) =>
	() => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( blockName )
		cy.publish()
		cy.reload()
	}

/**
 * Helper function for creating block exist assertion.
 *
 * @param {string} blockName
 * @param {string} selector
 */
export const assertBlockExist = ( blockName = 'ugb/accordion', selector = '.ugb-accordion' ) => () => {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( blockName )
	cy.get( selector ).should( 'exist' )
}

/**
 * Helper function for switching designs.
 *
 * @param {string} blockName
 * @param {Array} designs
 */
export const switchDesigns = ( blockName = 'ugb/accordion', designs = [] ) => () => {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( blockName )
	designs.forEach( design => {
		cy.openInspector( blockName, 'Layout' )
		cy.adjustDesign( design )
		cy.publish()
		cy.reload()
	} )
}

/**
 * Helper function for switching layouts.
 *
 * @param {string} blockName
 * @param {Array} layouts
 */
export const switchLayouts = ( blockName = 'ugb/accordion', layouts = [] ) => () => {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( blockName )
	layouts.forEach( layout => {
		cy.openInspector( blockName, 'Layout' )
		cy.adjustLayout( layout )
		cy.publish()
		cy.reload()
	} )
}

/**
 * Helper function for generating assertion commands
 *
 * @param {*} subject
 * @param {Function} editorCallback
 * @param {Function} frontendCallback
 * @param {Object} options
 */
export const assertFunction = ( subject, editorCallback = () => {}, frontendCallback = () => {}, options = {} ) => {
	const {
		assertFrontend = true,
	} = options
	getActiveTab( tab => {
		cy.document().then( doc => {
			const activePanel = doc.querySelector( 'button.components-panel__body-toggle[aria-expanded="true"]' ).innerText
			cy
				.get( subject )
				.find( '.ugb-main-block' )
				.invoke( 'attr', 'class' )
				.then( classList => {
					const parsedClassList = parseClassList( classList )
					cy.window().then( editorWin => {
						cy.document().then( editorDoc => {
							editorCallback( {
								parsedClassList, win: editorWin, doc: editorDoc,
							} )
						} )
					} )

					if ( assertFrontend ) {
						getPreviewMode( previewMode => {
							publish()
							getAddresses( ( { currUrl, previewUrl } ) => {
								cy.visit( previewUrl )
								if ( previewMode !== 'Desktop' ) {
									cy.viewport( config[ `viewport${ previewMode }Width` ], config.viewportHeight )
								}

								cy.window().then( frontendWin => {
									cy.document().then( frontendDoc => {
										frontendCallback( {
											parsedClassList, win: frontendWin, doc: frontendDoc,
										} )
									} )
								} )

								if ( previewMode !== 'Desktop' ) {
									cy.viewport( config.viewportWidth, config.viewportHeight )
								}

								cy.visit( currUrl )
								cy.get( parsedClassList ).click( { force: true } )
								openSidebar( 'Settings' )
								cy.get( `button[aria-label="${ startCase( tab ) } Tab"]` ).click( { force: true } )
								collapse( activePanel )
							} )
						} )
					}
				} )
		} )
	} )
}

/*
* Helper function for generating text align assertion commands.
*
* @param {string} name
* @param {string} selector
* @param {Object} options
*/
export const assertAligns = ( name, selector, options = {} ) => {
	const aligns = [ 'left', 'center', 'right' ]
	aligns.forEach( align => {
		cy.adjust( name, align, options ).assertComputedStyle( {
			[ selector ]: {
				[ `text-align` ]: align,
			},
		} )
	} )
}

export const assertAdvancedTab = ( name, options = {}, desktopCallback = () => {}, tabletCallback = () => {}, mobileCallback = {} ) => {
	const {
		enableMarginTop = true,
		enableMarginRight = true,
		enableMarginBottom = true,
		enableMarginLeft = true,
		enablePaddingTop = true,
		enablePaddingRight = true,
		enablePaddingBottom = true,
		enablePaddingLeft = true,
	} = options

	return () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( name )
		cy.openInspector( name, 'Advanced' )

		const MAIN_SELECTOR = '.ugb-main-block'

		const _adjust = ( adjustName, value, options = {}, assertionFunc, args = [] ) => {
			cy.get( '.ugb-toggle-panel-body.is-opened' )
				.then( $panel => {
					if ( $panel.text().includes( adjustName ) ) {
						if ( args.length ) {
							cy.adjust( adjustName, value, options )[ assertionFunc ]( ...args )
						} else {
							cy.adjust( adjustName, value, options )
						}
					}
				} )
		}

		cy.collapse( 'General' )

		// Test Block HTML Tag
		const tags = [ 'div', 'blockquote', 'section', 'article', 'aside', ',main', 'header', 'footer', 'nav', 'address', 'hgroup' ]
		tags.forEach( tag => {
			_adjust( 'Block HTML Tag', tag, {}, 'assertHtmlTag', [
				MAIN_SELECTOR,
				tag,
			] )
		} )

		// Test Opacity
		_adjust( 'Opacity', 0.7, {}, 'assertComputedStyle', [ {
			[ MAIN_SELECTOR ]: {
				[ `opacity` ]: '0.7',
			},
		} ] )

		// Test Z-index
		_adjust( 'Z-index', 6, {}, 'assertComputedStyle', [ {
			[ MAIN_SELECTOR ]: {
				[ `z-index` ]: '6',
			},
		} ] )

		cy.collapse( 'Block Spacing' )

		const generateFourRangeControlAssertion = ( top, right, bottom, left, values = [], template = 'margin', unit = 'px' ) => {
			const fourRangeControl = {
				top: top && values[ 0 ],
				right: right && values[ 1 ],
				bottom: bottom && values[ 2 ],
				left: left && values[ 3 ],
			}

			const asserts = {}
			if ( top ) {
				asserts[ `${ template }-top` ] = `${ values[ 0 ] }${ unit }`
			}
			if ( right ) {
				asserts[ `${ template }-right` ] = `${ values[ 1 ] }${ unit }`
			}
			if ( bottom ) {
				asserts[ `${ template }-bottom` ] = `${ values[ 2 ] }${ unit }`
			}
			if ( left ) {
				asserts[ `${ template }-left` ] = `${ values[ 3 ] }${ unit }`
			}

			return [ compact( keys( fourRangeControl ).map( k => fourRangeControl[ k ] ) ), asserts ]
		}

		const [ margins, marginAsserts ] = generateFourRangeControlAssertion(
			enableMarginTop,
			enableMarginRight,
			enableMarginBottom,
			enableMarginLeft,
			[ 12, 65, 34, 23 ],
			'margin',
			'px'
		)

		_adjust( 'Block Margins', margins, { unit: 'px' }, 'assertComputedStyle', [ { [ MAIN_SELECTOR ]: marginAsserts } ] )

		const [ paddings, paddingAsserts ] = generateFourRangeControlAssertion(
			enablePaddingTop,
			enablePaddingRight,
			enablePaddingBottom,
			enablePaddingLeft,
			[ 12, 65, 34, 23 ],
			'padding',
			'px'
		)

		_adjust( 'Block Paddings', paddings, { unit: 'px' }, 'assertComputedStyle', [ { [ MAIN_SELECTOR ]: paddingAsserts } ] )

		cy.openInspector( name, 'Advanced' )
		desktopCallback()

		// Tablet Assertions.

		cy.openInspector( name, 'Advanced' )
		tabletCallback()

		// Mobile Assertions.

		cy.openInspector( name, 'Advanced' )
		mobileCallback()
	}
}
