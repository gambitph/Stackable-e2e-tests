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
	startCase, lowerCase,
} from 'lodash'

/**
 * Export Block Module assertions.
 */
export {
	assertBlockTitleDescription, assertBlockBackground, assertSeparators,
} from './modules'

/*
* Export Advanced Tab assertions.
*/
export { assertAdvancedTab } from './advanced'

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
	cy.publish()
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
		cy.assertBlockError()
	} )
	cy.publish()
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
		if ( typeof layout === 'string' ) {
			cy.adjustLayout( layout )
			cy.publish()
			cy.reload()
			cy.assertBlockError()
		}
		if ( typeof layout === 'object' && ! Array.isArray( layout ) ) {
			const { selector, value } = layout
			cy.adjustLayout( value )
			if ( selector ) {
				getAddresses( ( { currUrl, previewUrl } ) => {
					cy.publish()
					cy.get( selector ).should( 'exist' )
					cy.visit( previewUrl )
					cy.get( selector ).should( 'exist' )
					cy.visit( currUrl )
					cy.assertBlockError()
				} )
			} else {
				cy.publish()
				cy.reload()
				cy.assertBlockError()
			}
		}
	} )
	cy.publish()
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
		assertBackend = true,
		wait = false,
	} = options
	getActiveTab( tab => {
		cy.document().then( doc => {
			const activePanel = doc.querySelector( 'button.components-panel__body-toggle[aria-expanded="true"]' ).innerText
			const blockSelector = Array.from( subject[ 0 ].classList ).includes( 'wp-block' ) ? '.ugb-main-block' : '.wp-block > *'
			cy
				.get( subject )
				.find( blockSelector )
				.invoke( 'attr', 'class' )
				.then( classList => {
					const parsedClassList = parseClassList( classList )
					if ( wait ) {
						cy.wait( wait )
					}
					cy.window().then( editorWin => {
						cy.document().then( editorDoc => {
							publish()
							if ( assertBackend ) {
								editorCallback( {
									parsedClassList, win: editorWin, doc: editorDoc,
								} )
							}
						} )
					} )

					if ( assertFrontend ) {
						getPreviewMode( previewMode => {
							getAddresses( ( { currUrl, previewUrl } ) => {
								cy.visit( previewUrl )
								if ( previewMode !== 'Desktop' ) {
									cy.viewport( config[ `viewport${ previewMode }Width` ], config.viewportHeight )
								}

								if ( wait ) {
									cy.wait( wait )
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

/**
 * Helper function for registering tests.
 *
 * @param {Array} testsList
 */
export const registerTests = ( testsList = [] ) => () => testsList.forEach( test => typeof test === 'function' && test() )

/**
 * Helper function for creating responsive assertions.
 *
 * @param {Function} callback
 * @param {string} tab
 */
export const responsiveAssertHelper = ( callback = () => {}, tab = 'Style' ) => {
	const viewports = [ 'Desktop', 'Tablet', 'Mobile' ]

	const generateAssertDesktopOnlyFunction = viewport => ( desktopCallback = () => {} ) => {
		if ( typeof desktopCallback === 'function' && viewport === 'Desktop' ) {
			desktopCallback()
		}
	}

	const responsiveAssertFunctions = viewports.map( viewport => {
		const assertDesktopOnlyFunction = generateAssertDesktopOnlyFunction( viewport )
		return () => {
			it( `should adjust ${ lowerCase( viewport ) } options inside ${ lowerCase( tab ) } tab`, () => {
				callback( viewport, assertDesktopOnlyFunction )
			} )
		}
	} )

	return responsiveAssertFunctions
}
