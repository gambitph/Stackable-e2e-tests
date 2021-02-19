/**
 * Internal dependencies
 */
import { registerBlockSnapshots } from './blockSnapshots'

/**
 * External dependencies
 */
import {
	lowerCase,
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
		cy.openInspector( blockName, 'Layout', index )
		if ( ! index ) {
			cy.wait( '@designLibrary' )
		}
		cy.adjustDesign( design )
	} )
	cy.publish()
	cy.reload()
	cy.assertBlockError()
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
		cy.openInspector( blockName, 'Layout', index )
		if ( typeof layout === 'string' ) {
			cy.adjustLayout( layout )
		}
		if ( typeof layout === 'object' && ! Array.isArray( layout ) ) {
			const { value, selector } = layout
			cy.adjustLayout( value )
			if ( selector ) {
				cy.get( selector ).should( 'exist' )
			}
		}
	} )

	cy.publish()

	cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
		cy.visit( previewUrl )
		layouts.forEach( layout => {
			const { selector } = layout
			if ( selector ) {
				cy.get( selector ).should( 'exist' )
			}
		} )
		cy.visit( editorUrl )
	} )

	cy.assertBlockError()
	cy.publish()
}

/*
* Helper function for generating text align assertion commands.
*
* @param {string} name
* @param {string} selector
* @param {Object} options
* @param {Object} assertOptions
*/
export const assertAligns = ( name, selector, options = {}, assertOptions = {} ) => {
	const aligns = [ 'left', 'center', 'right' ]
	aligns.forEach( align => {
		cy.adjust( name, align, options ).assertComputedStyle( {
			[ selector ]: {
				'text-align': align,
			},
		}, assertOptions )
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
			return () => callback( viewport, assertDesktopOnlyFunction, registerBlockSnapshots )
		}
		return () => {
			it( `should adjust ${ lowerCase( viewport ) } options inside ${ lowerCase( tab ) } tab`, () => {
				callback( viewport, assertDesktopOnlyFunction, registerBlockSnapshots )
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
* @param {Object} assertOptions
*/
export const assertTypography = ( selector, options = {}, assertOptions = {} ) => {
	const {
		viewport = 'Desktop',
	} = options

	if ( viewport === 'Desktop' ) {
		cy.adjust( 'Typography', {
			'Size': { value: 50, unit: 'px' },
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
		}, assertOptions )
	}
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
	}, assertOptions )
	cy.adjust( 'Typography', {
		'Size': {
			viewport,
			value: 5,
			unit: 'em',
		},
		'Line-Height': {
			viewport,
			value: 24,
			unit: 'px',
		},
	} ).assertComputedStyle( {
		[ selector ]: {
			'font-size': '5em',
			'line-height': '24px',
		},
	}, assertOptions )
}

export const assertContainer = ( selector, options = {}, attrNameTemplate = 'column%sBackgroundMediaUrl' ) => {
	const {
		viewport,
	} = options
	const desktopOnly = callback => viewport === 'Desktop' && callback()
	const attributeName = attrNameTemplate.replace( '%s', viewport === 'Desktop' ? '' : viewport )

	// Adjust single container color options.
	desktopOnly( () => {
		cy.adjust( 'Background', {
			'Color Type': 'single',
			'Background Color': '#632d2d',
		} ).assertComputedStyle( {
			[ selector ]: {
				'background-color': 'rgb(99, 45, 45)',
			},
			[ `${ selector }:before` ]: {
				'background-color': '#632d2d',
			},
		} )
	} )

	// Adjust gradient container color options.
	desktopOnly( () => {
		cy.adjust( 'Background', {
			'Color Type': 'gradient',
			'Background Color #1': '#a92323',
			'Background Color #2': '#404633',
			'Adv. Gradient Color Settings': {
				'Gradient Direction (degrees)': 180,
				'Color 1 Location': '11%',
				'Color 2 Location': '80%',
				'Background Gradient Blend Mode': 'hard-light',
			},
		} ).assertComputedStyle( {
			[ `${ selector }:before` ]: {
				'background-image': 'linear-gradient(180deg, #a92323 11%, #404633)',
				'mix-blend-mode': 'hard-light',
			},
		} )
	} )

	cy.setBlockAttribute( {
		[ attributeName ]: Cypress.env( 'DUMMY_IMAGE_URL' ),
	} )

	desktopOnly( () => {
		cy.adjust( 'Background', {
			'Background Media Tint Strength': 5,
			'Fixed Background': true,
			'Adv. Background Image Settings': {
				'Image Blend Mode': 'hue',
			},
		} ).assertComputedStyle( {
			[ `${ selector }:before` ]: {
				'background-blend-mode': 'hue',
				'background-image': `url("${ Cypress.env( 'DUMMY_IMAGE_URL' ) }")`,
				'background-attachment': 'fixed',
			},
		} )
	} )

	cy.adjust( 'Background', {
		'Adv. Background Image Settings': {
			'Image Position': {
				viewport,
				value: 'center center',
			},
			'Image Repeat': {
				viewport,
				value: 'repeat-x',
			},
			'Image Size': {
				viewport,
				value: 'custom',
			},
			'Custom Size': {
				viewport,
				value: 19,
				unit: '%',
			},
		},
	} ).assertComputedStyle( {
		[ selector ]: {
			'background-position': '50% 50%',
			'background-repeat': 'repeat-x',
			'background-size': '19%',
		},
	} )

	// Test Border Radius
	desktopOnly( () => {
		cy.adjust( 'Border Radius', 30 ).assertComputedStyle( {
			[ selector  ]: {
				'border-radius': '30px',
			},
		} )
	} )

	// Test Border Options
	cy.adjust( 'Borders', 'solid' )
	desktopOnly( () => {
		cy.adjust( 'Border Color', '#f1f1f1' ).assertComputedStyle( {
			[ selector ]: {
				'border-style': 'solid',
				'border-color': '#f1f1f1',
			},
		} )
	} )
	cy.adjust( 'Border Width', 3, { viewport } ).assertComputedStyle( {
		[ selector ]: {
			'border-top-width': '3px',
			'border-bottom-width': '3px',
			'border-left-width': '3px',
			'border-right-width': '3px',
		},

	} )

	// Test Shadow / Outline
	desktopOnly( () => {
		cy.adjust( 'Shadow / Outline', 9 )
			.assertClassName( selector, 'ugb--shadow-9' )
	} )
}
