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
	designs.forEach( ( design, index ) => {
		cy.addBlock( blockName )
		cy.openInspector( blockName, 'Layout' )
		cy.wait( '@designLibrary' )
		cy.adjustDesign( design )
		cy.publish()
		cy.reload()
		cy.assertBlockError()
		if ( index !== designs.length - 1 ) {
			cy.deleteBlock( blockName )
		}
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
	layouts.forEach( ( layout, index ) => {
		cy.addBlock( blockName )
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
			cy.publish()
			if ( selector ) {
				getAddresses( ( { currUrl, previewUrl } ) => {
					cy.get( selector ).should( 'exist' )
					cy.visit( previewUrl )
					cy.get( selector ).should( 'exist' )
					cy.visit( currUrl )
					cy.assertBlockError()
				} )
			} else {
				cy.reload()
				cy.assertBlockError()
			}
		}

		if ( index !== layouts.length - 1 ) {
			cy.deleteBlock( blockName )
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
		wait = 0,
		viewportFrontend = false,
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

					publish()

					cy.wait( wait )

					if ( assertBackend ) {
						getPreviewMode( previewMode => {
							editorCallback( {
								parsedClassList, viewport: previewMode,
							} )
						} )
					}

					if ( assertFrontend ) {
						getPreviewMode( previewMode => {
							getAddresses( ( { currUrl, previewUrl } ) => {
								cy.visit( previewUrl )
								if ( viewportFrontend && viewportFrontend !== 'Desktop' ) {
									cy.viewport( config[ `viewport${ viewportFrontend }Width` ] || config.viewportWidth, config.viewportHeight )
								} else if ( previewMode !== 'Desktop' ) {
									cy.viewport( config[ `viewport${ previewMode }Width` ] || config.viewportWidth, config.viewportHeight )
								}

								cy.wait( wait )

								frontendCallback( {
									parsedClassList, viewport: previewMode,
								} )

								cy.viewport( config.viewportWidth, config.viewportHeight )

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
				'text-align': align,
			},
		} )
	} )
}

/**
 * Helper function for registering tests.
 *
 * @param {Array} testsList
 * @param {Function} onTestsStart
 */
export const registerTests = ( testsList = [], onTestsStart = () => {
	beforeEach( () => {
		cy.server()
		cy.route( {
			method: 'GET',
			url: /stk_design_library/,
			status: 200,
		} ).as( 'designLibrary' )
	} )
} ) => () => {
	onTestsStart()
	testsList.forEach( test => typeof test === 'function' && test() )
}

/**
 * Helper function for creating responsive assertions.
 *
 * @param {Function} callback
 * @param {Object} options
 */
export const responsiveAssertHelper = ( callback = () => {}, options = {} ) => {
	const {
		tab = 'Style',
		disableItAssertion = false,
	} = options
	const viewports = [ 'Desktop', 'Tablet', 'Mobile' ]

	const generateAssertDesktopOnlyFunction = viewport => ( desktopCallback = () => {} ) => {
		if ( typeof desktopCallback === 'function' && viewport === 'Desktop' ) {
			desktopCallback()
		}
	}

	const responsiveAssertFunctions = viewports.map( viewport => {
		const assertDesktopOnlyFunction = generateAssertDesktopOnlyFunction( viewport )
		if ( disableItAssertion ) {
			return () => callback( viewport, assertDesktopOnlyFunction )
		}
		return () => {
			it( `should adjust ${ lowerCase( viewport ) } options inside ${ lowerCase( tab ) } tab`, () => {
				callback( viewport, assertDesktopOnlyFunction )
			} )
		}
	} )

	return responsiveAssertFunctions
}

/*
* Helper function for Typography popover assertion.
*
* @param {string} selector
* @param {Object} options
*/
export const assertTypography = ( selector, options = {} ) => {
	const {
		viewport = 'Desktop',
	} = options

	if ( viewport === 'Desktop' ) {
		cy.adjust( 'Typography', {
			'Size': 50,
			'Weight': '700',
			'Transform': 'lowercase',
			'Line-Height': 4,
			'Letter Spacing': 2.9,
		} ).assertComputedStyle( {
			[ selector ]: {
				'font-size': '50px',
				'font-weight': '700',
				'text-transform': 'lowercase',
				'line-height': '4em',
				'letter-spacing': '2.9px',
			},
		} )
	}
	cy.adjust( 'Typography', {
		'Size': {
			viewport,
			value: 2,
			unit: 'em',
		},
		'Line-Height': {
			viewport,
			value: 24,
			unit: 'px',
		},
	} ).assertComputedStyle( {
		[ selector ]: {
			'font-size': '2em',
			'line-height': '24px',
		},
	} )
	cy.adjust( 'Typography', {
		'Size': {
			viewport,
			value: 50,
			unit: 'px',
		},
		'Line-Height': {
			viewport,
			value: 4,
			unit: 'em',
		},
	} ).assertComputedStyle( {
		[ selector ]: {
			'font-size': '50px',
			'line-height': '4em',
		},
	} )
}
