/**
 * External dependencies
 */
import {
	lowerCase, isEmpty, range,
} from 'lodash'
import { registerTests as _registerTests } from '~gutenberg-e2e/helpers'

/**
 * Export Block Module assertions.
 */
export {
	assertBlockTitleDescription, assertBlockTitleDescriptionContent, assertBlockBackground, assertSeparators, assertContainerBackground, assertContainerSizeSpacing, assertContainerBordersShadow,
} from './modules'

/*
* Export Tab assertions.
*/
export { assertAdvancedTab, Advanced } from './advanced'
export { Block } from './block'

/**
 * Helper function for creating block validation test.
 *
 * @param {string} blockName
 * @param {Object} addBlockOptions
 */
export const blockErrorTest = ( blockName = 'ugb/accordion', addBlockOptions = {} ) =>
	() => {
		cy.setupWP()
		if ( Array( 'ugb/blog-posts', 'stackable/posts' ).includes( blockName ) ) {
			cy.registerPosts( { numOfPosts: 1 } )
		}
		cy.newPage()
		cy.addBlock( blockName, addBlockOptions )
		cy.savePost()
		cy.reload()
	}

/**
 * Helper function for creating block exist assertion.
 *
 * @param {string} blockName
 * @param {string} selector
 * @param {Object} addBlockOptions
 */
export const assertBlockExist = ( blockName = 'ugb/accordion', selector = '.ugb-accordion', addBlockOptions = {} ) => () => {
	cy.setupWP()
	if ( Array( 'ugb/blog-posts', 'stackable/posts' ).includes( blockName ) ) {
		cy.registerPosts( { numOfPosts: 1 } )
	}
	cy.newPage()
	cy.addBlock( blockName, addBlockOptions )
	cy.get( selector ).should( 'exist' )
	cy.savePost()
}

/**
 * Helper function for switching designs.
 *
 * @param {string} blockName
 * @param {Array} designs
 */
export const switchDesigns = ( blockName = 'ugb/accordion', designs = [] ) => () => {
	cy.setupWP()
	if ( Array( 'ugb/blog-posts', 'stackable/posts' ).includes( blockName ) ) {
		cy.registerPosts( { numOfPosts: 1 } )
	}
	cy.newPage()
	designs.forEach( ( design, index ) => {
		cy.addBlock( blockName )
		cy.openInspector( blockName, 'Layout', index )
		if ( ! index ) {
			cy.wait( '@designLibrary' )
		}
		cy.adjustDesign( design )
	} )
	cy.savePost()
	cy.reload()
	cy.assertBlockError()
	cy.savePost()
}

/**
 * Helper function for switching layouts.
 *
 * @param {string} blockName
 * @param {Array} layouts
 */
export const switchLayouts = ( blockName = 'ugb/accordion', layouts = [] ) => () => {
	cy.setupWP()
	if ( Array( 'ugb/blog-posts', 'stackable/posts' ).includes( blockName ) ) {
		cy.registerPosts( { numOfPosts: 1 } )
	}
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

	cy.savePost()

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
	cy.savePost()
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
 * Helper function for registering stackable tests.
 *
 * @param {Array} testsList
 */
export const registerTests = ( testsList = [] ) => () => _registerTests(
	testsList,
	() => {
		beforeEach( () => {
			cy.server()
			cy.route( {
				method: 'GET',
				url: /design_library/,
				status: 200,
			} ).as( 'designLibrary' )
		} )
	}
)

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
* @param {Object} assertOptions
*/
export const assertTypography = ( selector, options = {}, assertOptions = {} ) => {
	const {
		viewport = 'Desktop',
		enableFontFamily = true,
		enableSize = true,
		enableWeight = true,
		enableTransform = true,
		enableLineHeight = true,
		enableLetterSpacing = true,
	} = options

	// Initialize assertion objects.
	const typographyAssertions = {
		0: { adjust: {}, assert: {} },
		1: { adjust: {}, assert: {} },
		2: { adjust: {}, assert: {} },
	}

	if ( enableFontFamily ) {
		typographyAssertions[ 1 ].adjust[ 'Font Family' ] = 'Abel'
		typographyAssertions[ 1 ].assert[ 'font-family' ] = '"Abel", Sans-serif'
	}

	if ( enableSize ) {
		typographyAssertions[ 0 ].adjust.Size = { value: 50, unit: 'px' }
		typographyAssertions[ 1 ].adjust.Size = {
			viewport, value: 50, unit: 'px',
		}
		typographyAssertions[ 2 ].adjust.Size = {
			viewport, value: 5, unit: 'em',
		}
		typographyAssertions[ 0 ].assert[ 'font-size' ] = '50px'
		typographyAssertions[ 1 ].assert[ 'font-size' ] = '50px'
		typographyAssertions[ 2 ].assert[ 'font-size' ] = '5em'
	}

	if ( enableWeight ) {
		typographyAssertions[ 0 ].adjust.Weight = '700'
		typographyAssertions[ 0 ].assert[ 'font-weight' ] = '700'
	}

	if ( enableTransform ) {
		typographyAssertions[ 0 ].adjust.Transform = 'lowercase'
		typographyAssertions[ 0 ].assert[ 'text-transform' ] = 'lowercase'
	}

	if ( enableLetterSpacing ) {
		typographyAssertions[ 0 ].adjust[ 'Letter Spacing' ] = 2.9
		typographyAssertions[ 0 ].assert[ 'letter-spacing' ] = '2.9px'
	}

	if ( enableLineHeight ) {
		typographyAssertions[ 0 ].adjust[ 'Line-Height' ] = 4
		typographyAssertions[ 1 ].adjust[ 'Line-Height' ] = {
			viewport, value: 4, unit: 'em',
		}
		typographyAssertions[ 2 ].adjust[ 'Line-Height' ] = {
			viewport, value: 24, unit: 'px',
		}
		typographyAssertions[ 0 ].assert[ 'line-height' ] = '4em'
		typographyAssertions[ 1 ].assert[ 'line-height' ] = '4em'
		typographyAssertions[ 2 ].assert[ 'line-height' ] = '24px'
	}

	if ( viewport === 'Desktop' && ! isEmpty( typographyAssertions[ 0 ].adjust ) ) {
		cy.adjust( 'Typography', typographyAssertions[ 0 ].adjust )
			.assertComputedStyle( { [ selector ]: typographyAssertions[ 0 ].assert }, assertOptions )
	}
	if ( ! isEmpty( typographyAssertions[ 1 ].adjust ) ) {
		cy.adjust( 'Typography', typographyAssertions[ 1 ].adjust )
			.assertComputedStyle( { [ selector ]: typographyAssertions[ 1 ].assert }, assertOptions )
	}
	if ( ! isEmpty( typographyAssertions[ 2 ].adjust ) ) {
		cy.adjust( 'Typography', typographyAssertions[ 2 ].adjust )
			.assertComputedStyle( { [ selector ]: typographyAssertions[ 2 ].assert }, assertOptions )
	}
}

/*
* Helper function for Container panel assertion.
*
* @param {string} selector
* @param {Object} options
* @param {string} attrNameTemplate
*/
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
				'background-image': 'linear-gradient(180deg, #a92323 11%, #404633, 80%)',
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
			[ selector ]: {
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

/*
* Helper function for Container link panel assertion.
*
* @param {string} selector
* @param {Object} options
* @param {Object} assertOptions
*/
export const assertContainerLink = ( selector, options = {}, assertOptions = {} ) => {
	const {
		viewport = 'Desktop',
	} = options
	const desktopOnly = callback => viewport === 'Desktop' && callback()

	desktopOnly( () => {
		cy.collapse( 'Container Link' )
		cy.toggleStyle( 'Container Link' )

		cy.getBlockAttributes().then( ( { columns } ) => {
			if ( columns && columns !== 1 ) {
				cy.adjust( 'Link / URL #1', 'https://www.google.com/' ).assertHtmlAttribute( `${ selector } > a`, 'href', 'https://www.google.com/', assertOptions )
				cy.adjust( 'Link 1 Title', 'Sample Link Title' ).assertHtmlAttribute( `${ selector } > a`, 'title', 'Sample Link Title', assertOptions )
			} else {
				cy.adjust( 'Link / URL', 'https://www.google.com/' ).assertHtmlAttribute( `${ selector } > a`, 'href', 'https://www.google.com/', assertOptions )
				cy.adjust( 'Link Title', 'Sample Link Title' ).assertHtmlAttribute( `${ selector } > a`, 'title', 'Sample Link Title', assertOptions )
			}
			cy.adjust( 'Open link in new tab', true ).assertHtmlAttribute( `${ selector } > a`, 'rel', /noopener noreferrer/, Object.assign( assertOptions, { assertBackend: false } ) )
			cy.adjust( 'Nofollow link', true ).assertHtmlAttribute( `${ selector } > a`, 'rel', /nofollow/, Object.assign( assertOptions, { assertBackend: false } ) )
			cy.adjust( 'Sponsored', true ).assertHtmlAttribute( `${ selector } > a`, 'rel', /sponsored/, Object.assign( assertOptions, { assertBackend: false } ) )
			cy.adjust( 'UGC', true ).assertHtmlAttribute( `${ selector } > a`, 'rel', /ugc/, Object.assign( assertOptions, { assertBackend: false } ) )
		} )
	} )
}

/**
 * Helper function for asserting the URL popover of the buttons.
 *
 * @param {string} blockName
 * @param {string | number | Object} blockSelector
 * @param {Object} options
 * @param {Object} assertOptions
 */
export const assertUgbButtons = ( blockName, blockSelector, options = {}, assertOptions = {} ) => {
	const {
		editorSelector = '',
		frontendSelector = '',
		viewport = 'Desktop',
	} = options
	const desktopOnly = callback => viewport === 'Desktop' && callback()

	desktopOnly( () => {
		cy.get( '.is-selected' ).then( $block => {
			// Count the number of buttons
			const count = $block.find( editorSelector.replace( '%s', '' ) ).length
			if ( count === 0 ) {
				return
			}

			const parentSelector = '.components-popover__content .block-editor-link-control'
			const supportedDelimiter = [ ' ' ]

			range( 1, count + 1 ).forEach( number => {
				cy.get( '.is-selected' ).find( editorSelector.replace( '%s', number ) ).click( { force: true } )

				/**
				 * TODO: This will not work on dynamic blocks since we need to do some extra steps
				 * before adjusting the options again.
				 */

				cy.get( '.components-popover__content .block-editor-link-control' ).then( () => {
					cy.get( '.components-popover__content .block-editor-link-control' )
						.find( 'input.block-editor-url-input__input' )
						.type( `{selectall}https://wpstackable${ number }.com/{enter}`, { force: true } )
					cy
						.selectBlock( blockName, blockSelector )
						.assertHtmlAttribute( frontendSelector.replace( '%s', number ), 'href', `https://wpstackable${ number }.com/`, Object.assign( assertOptions, { assertBackend: false } ) )

					cy.adjust( 'Opens in new tab', true, {
						parentSelector,
						supportedDelimiter,
					} ).assertHtmlAttribute( frontendSelector.replace( '%s', number ), 'rel', /noopener noreferrer/, Object.assign( assertOptions, { assertBackend: false } ) )

					cy.adjust( 'Nofollow link', true, {
						parentSelector,
						supportedDelimiter,
					} ).assertHtmlAttribute( frontendSelector.replace( '%s', number ), 'rel', /nofollow/, Object.assign( assertOptions, { assertBackend: false } ) )

					cy.adjust( 'Sponsored', true, {
						parentSelector,
						supportedDelimiter,
					} ).assertHtmlAttribute( frontendSelector.replace( '%s', number ), 'rel', /sponsored/, Object.assign( assertOptions, { assertBackend: false } ) )

					cy.adjust( 'UGC', true, {
						parentSelector,
						supportedDelimiter,
					} ).assertHtmlAttribute( frontendSelector.replace( '%s', number ), 'rel', /ugc/, Object.assign( assertOptions, { assertBackend: false } ) )
				} )
			} )
		} )
	} )
}

/**
 * Helper function for asserting the loaded js files of a block
 *
 * @param {string} blockName
 * @param {string} selector
 * @param {Object} addBlockOptions
 */
export const checkJsFiles = ( blockName = 'stackable/accordion', selector = '#stk-frontend-accordion-js', addBlockOptions = {} ) => () => {
	cy.setupWP()
	cy.newPage()
	cy.typePostTitle( 'Check frontend files' )
	cy.addBlock( blockName, addBlockOptions )
	cy.savePost()

	cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
		cy.visit( previewUrl )
		cy.document().then( doc => {
			assert.isTrue(
				doc.querySelector( selector ) !== null,
				`Expected '${ blockName }' js files are loaded in the frontend`
			)
		} )
		// Remove the block and assert that files does not exist in frontend
		cy.visit( editorUrl )
		cy.deleteBlock( blockName )
		cy.savePost()
		cy.visit( previewUrl )
		cy.document().then( doc => {
			assert.isTrue(
				doc.querySelector( selector ) === null,
				`Expected '${ blockName }' js files are not loaded in the frontend`
			)
		} )
	} )
}

/**
 * Helper function for asserting the presence of inner blocks.
 *
 * @param {string} blockName
 * @param {Array} innerBlockSelectors
 * @param {Object} addBlockOptions
 */
export const assertInnerBlocks = ( blockName = 'stackable/accordion', innerBlockSelectors = [], addBlockOptions = {} ) => () => {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( blockName, addBlockOptions )
	innerBlockSelectors.forEach( selector => {
		cy.selectBlock( blockName )
			.find( selector )
			.should( 'exist' )
	} )
	cy.savePost()
}

/**
 * Helper function for asserting the typography panel of v3 blocks
 *
 * @param {Object} options
 */
export function assertTypographyModule( options = {} ) {
	const {
		selector,
		viewport,
		enableContent = true,
		enableTextColor = true,
		enableShadowOutline = true,
		enableRemoveMargin = false,
		enableHtmlTag = false,
		enableAlign = false,
		panelName = 'Typography',
		frontendSelector = null,
		assertOptions = {},
		alignmentSelector = null,
	} = options

	const desktopOnly = callback => viewport === 'Desktop' && callback()

	if ( panelName === 'Typography' ) {
		cy.collapse( 'Typography' )
	}

	desktopOnly( () => {
		if ( enableContent ) {
			cy.adjust( 'Content', 'Hello Stackable' ).assertBlockContent( selector, 'Hello Stackable' )
			cy.getBaseControl( 'Content' ).find( 'button[aria-label="Dynamic Fields"]' ).should( 'exist' )
		}

		if ( enableRemoveMargin ) {
			cy.adjust( 'Remove extra text margins', true ).assertComputedStyle( {
				[ selector ]: {
					'margin': '0px',
				},
			} )
		}

		if ( enableHtmlTag ) {
			cy.adjust( 'Title HTML Tag', 'h4' ).assertHtmlTag( selector, 'h4' )
		}

		cy.adjust( 'Typography', {
			'Font Family': 'Abel',
			'Weight': '500',
			'Transform': 'lowercase',
			'Font Style': 'italic',
			'Letter Spacing': 0.7,
		} ).assertComputedStyle( {
			[ `${ frontendSelector ? frontendSelector : selector }` ]: {
				'font-family': '"Abel", Sans-serif',
				'font-weight': '500',
				'text-transform': 'lowercase',
				'font-style': 'italic',
				'letter-spacing': '0.7px',
			},
		}, assertOptions )

		if ( enableTextColor ) {
			cy.adjust( 'Color Type', 'gradient' )
			cy.adjust( 'Text Color #1', '#3884ff' )
			cy.adjust( 'Text Color #2', '#ff1a1d' )
			cy.adjust( 'Gradient Direction (degrees)', 236 ).assertComputedStyle( {
				[ `${ frontendSelector ? frontendSelector : selector }` ]: {
					'background-image': 'linear-gradient(236deg, #3884ff, #ff1a1d)',
				},
			}, assertOptions )

			cy.adjust( 'Color Type', 'single' )
			cy.adjust( 'Text Color', '#233491', { state: 'hover' } ).assertComputedStyle( {
				[ `${ frontendSelector ? frontendSelector : selector }:hover` ]: {
					'color': '#233491',
				},
			}, assertOptions )
			cy.adjust( 'Text Color', '#18875a', { state: 'normal' } ).assertComputedStyle( {
				[ `${ frontendSelector ? frontendSelector : selector }` ]: {
					'color': '#18875a',
				},
			}, assertOptions )
		}

		if ( enableShadowOutline ) {
			cy.adjust( 'Shadow / Outline', 7, { state: 'hover' } ).assertComputedStyle( {
				[ `${ frontendSelector ? frontendSelector : selector }:hover` ]: {
					'text-shadow': '25px 10px 14px rgba(18, 63, 82, 0.3)',
				},
			}, assertOptions )
			cy.adjust( 'Shadow / Outline', 5, { state: 'normal' } ).assertComputedStyle( {
				[ `${ frontendSelector ? frontendSelector : selector }` ]: {
					'text-shadow': '4px 4px 0px rgba(0, 0, 0, 1)',
				},
			}, assertOptions )
			cy.resetStyle( 'Shadow / Outline', { state: 'normal' } )
			cy.resetStyle( 'Shadow / Outline', { state: 'hover' } )

			// Adjust Adv. Shadow Options - normal
			const parentSelector = '.components-popover__content .stk-control-content'
			// Press the cog symbol to open Shadow settings
			cy.get( 'button[aria-label="Shadow Settings"]' ).click( { force: true } )
			cy.adjust( 'Horizontal Offset', 8, { parentSelector, state: 'normal' } )
			cy.adjust( 'Vertical Offset', 11, { parentSelector, state: 'normal' } )
			cy.adjust( 'Blur', 25, { parentSelector, state: 'normal' } )
			cy.adjust( 'Shadow Color', '#2a8a62', { parentSelector, state: 'normal' } )
			cy.adjust( 'Shadow Opacity', 0.6, { parentSelector, state: 'normal' } ).assertComputedStyle( {
				[ `${ frontendSelector ? frontendSelector : selector }` ]: {
					'text-shadow': '8px 11px 25px rgba(42, 138, 98, 0.6)',
				},
			}, assertOptions )

			const selectAdvancedShadowHoverState = () => cy
				.adjust( 'Advanced Shadow Options', null, { state: 'hover', parentSelector: '.components-popover__content .components-panel__body' } )

			cy.resetStyle( 'Shadow / Outline', { state: 'normal' } )
			cy.resetStyle( 'Shadow / Outline', { state: 'hover' } )
			// Adjust Adv. Shadow Options - hover
			selectAdvancedShadowHoverState()
			cy.adjust( 'Horizontal Offset', 7, { parentSelector } )
			selectAdvancedShadowHoverState()
			cy.adjust( 'Vertical Offset', 31, { parentSelector } )
			selectAdvancedShadowHoverState()
			cy.adjust( 'Blur', 71, { parentSelector } )
			selectAdvancedShadowHoverState()
			cy.adjust( 'Shadow Color', '#0f9294', { parentSelector } )
			selectAdvancedShadowHoverState()
			cy.adjust( 'Shadow Opacity', 0.4, { parentSelector } ).assertComputedStyle( {
				[ `${ frontendSelector ? frontendSelector : selector }:hover` ]: {
					'text-shadow': '7px 31px 71px rgba(15, 146, 148, 0.4)',
				},
			}, assertOptions )
		}
	} )

	const lineHeightAssertion = [
		{
			value: '2.8',
			unit: 'em',
		},
		{
			value: '11',
			unit: 'rem',
		},
		{
			value: '114',
			unit: 'px',
		},
	]

	lineHeightAssertion.forEach( lineHeight => {
		cy.adjust( 'Typography', {
			'Line-Height': {
				value: lineHeight.value,
				unit: lineHeight.unit,
				viewport,
			},
		} ).assertComputedStyle( {
			[ `${ frontendSelector ? frontendSelector : selector }` ]: {
				'line-height': `${ lineHeight.value }${ lineHeight.unit }`,
			},
		}, assertOptions )
	} )

	const sizeAssertion = [
		{
			value: '26',
			unit: 'px',
		},
		{
			value: '1.6',
			unit: 'em',
		},
		{
			value: '4',
			unit: 'rem',
		},
	]
	sizeAssertion.forEach( size => {
		cy.adjust( 'Size', size.value, { unit: size.unit, viewport } ).assertComputedStyle( {
			[ `${ frontendSelector ? frontendSelector : selector }` ]: {
				'font-size': `${ size.value }${ size.unit }`,
			},
		}, assertOptions )
	} )

	if ( enableAlign ) {
		const aligns = [ 'left', 'center', 'right' ]
		const responsiveClass = viewport !== 'Desktop' ? `-${ lowerCase( viewport ) }` : ''
		aligns.forEach( align => {
			cy.adjust( 'Align', align, { viewport } ).assertClassName( `${ alignmentSelector ? alignmentSelector : selector }`, `has-text-align-${ align }${ responsiveClass }` )
		} )
	}
}

/**
 * Helper function for asserting the image panel of v3 blocks
 *
 * @param {Object} options
 */
export function assertImageModule( options = {} ) {
	const {
		selector,
		viewport,
		panelName = 'Image',
		enableWidth = false,
		enableShadowOutline = false,
		enableBorderRadius = false,
		enableImageShape = false,
		shadowEditorSelector = '',
		shadowFrontendSelector = '',
		isStaticBlock = false,
	} = options

	const desktopOnly = callback => viewport === 'Desktop' && callback()

	if ( panelName === 'Image' ) {
		cy.collapse( 'Image' )
		cy.adjust( 'Select Image', 1 )
	}

	// Default is px unit
	cy.adjust( 'Height', 284, { viewport } ).assertComputedStyle( {
		[ selector ]: {
			'height': '284px',
		},
	} )

	if ( enableWidth ) {
		cy.adjust( 'Width', 471, { viewport, unit: 'px' } )
		cy.adjust( 'Height', 559, { viewport, unit: 'px' } ).assertComputedStyle( {
			[ selector ]: {
				'width': '471px',
				'height': '559px',
			},
		} )

		cy.adjust( 'Width', 62, { viewport, unit: '%' } )
		cy.adjust( 'Height', 91, { viewport, unit: '%' } ).assertComputedStyle( {
			[ selector ]: {
				'width': '62%',
				'height': '91%',
			},
		} )

		cy.adjust( 'Width', 32, { viewport, unit: 'vw' } )
		cy.adjust( 'Height', 65, { viewport, unit: 'vh' } ).assertComputedStyle( {
			[ selector ]: {
				'width': '32vw',
				'height': '65vh',
			},
		} )
	}

	desktopOnly( () => {
		if ( panelName === 'Image' ) {
			// Dynamic Fields button should be present
			cy.getBaseControl( '.ugb-image-control:contains(Select Image)' ).find( 'button[aria-label="Dynamic Fields"]' ).should( 'exist' )
			cy.adjust( 'Image Alt', 'stackable the best' ).assertHtmlAttribute( `${ selector } img`, 'alt', 'stackable the best', { assertBackend: false } )
		}
		cy.adjust( 'Zoom', 0.73, { state: 'hover' } ).assertComputedStyle( {
			[ `${ selector } img:hover` ]: {
				'transform': 'scale(0.73)',
			},
		} )
		cy.adjust( 'Zoom', 1.27, { state: 'normal' } ).assertComputedStyle( {
			[ `${ selector } img` ]: {
				'transform': 'scale(1.27)',
			},
		} )

		if ( enableShadowOutline ) {
			cy.adjust( 'Shadow / Outline', 6, { state: 'hover' } ).assertComputedStyle( {
				[ `${ shadowEditorSelector }:hover` ]: {
					'filter': 'drop-shadow(0px 10px 30px rgba(0, 0, 0, 0.1))',
				},
			}, { assertFrontend: false } )
			cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
				[ `${ shadowFrontendSelector }:hover` ]: {
					'filter': 'drop-shadow(0px 10px 30px rgba(0, 0, 0, 0.1))',
				},
			}, { assertBackend: false } )
			cy.adjust( 'Shadow / Outline', 3, { state: 'normal' } ).assertComputedStyle( {
				[ shadowEditorSelector ]: {
					'filter': 'drop-shadow(0px 5px 10px rgba(153, 153, 153, 0.35))',
				},
			}, { assertFrontend: false } )
			cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
				[ shadowFrontendSelector ]: {
					'filter': 'drop-shadow(0px 5px 10px rgba(153, 153, 153, 0.35))',
				},
			}, { assertBackend: false } )

			cy.resetStyle( 'Shadow / Outline', { state: 'normal' } )
			cy.resetStyle( 'Shadow / Outline', { state: 'hover' } )

			const parentSelector = '.components-popover__content .stk-control-content'
			const selectAdvancedShadowHoverState = () => cy
				.adjust( 'Advanced Shadow Options', null, { state: 'hover', parentSelector: '.components-popover__content .components-panel__body' } )
			const pressShadowSettings = () => cy
				.get( 'button[aria-label="Shadow Settings"]' ).click( { force: true } )
				// Press the cog symbol to open Shadow settings

			pressShadowSettings()
			// Adjust Adv. Shadow Options - normal
			cy.adjust( 'Horizontal Offset', 8, { parentSelector, state: 'normal' } )
			cy.adjust( 'Vertical Offset', 11, { parentSelector, state: 'normal' } )
			cy.adjust( 'Blur', 25, { parentSelector, state: 'normal' } )
			cy.adjust( 'Shadow Color', '#2a8a62', { parentSelector, state: 'normal' } )
			cy.adjust( 'Shadow Opacity', 0.6, { parentSelector, state: 'normal' } ).assertComputedStyle( {
				[ shadowEditorSelector ]: {
					'filter': 'drop-shadow(8px 11px 25px rgba(42, 138, 98, 0.6))',
				},
			}, { assertFrontend: false } )
			cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
				[ shadowFrontendSelector ]: {
					'filter': 'drop-shadow(8px 11px 25px rgba(42, 138, 98, 0.6))',
				},
			}, { assertBackend: false } )

			cy.resetStyle( 'Shadow / Outline', { state: 'normal' } )
			if ( isStaticBlock ) {
				pressShadowSettings()
			} else {
				cy.resetStyle( 'Shadow / Outline', { state: 'hover' } )
			}

			// Adjust Adv. Shadow Options - hover
			selectAdvancedShadowHoverState()
			cy.adjust( 'Horizontal Offset', 7, { parentSelector } )
			selectAdvancedShadowHoverState()
			cy.adjust( 'Vertical Offset', 31, { parentSelector } )
			selectAdvancedShadowHoverState()
			cy.adjust( 'Blur', 71, { parentSelector } )
			selectAdvancedShadowHoverState()
			cy.adjust( 'Shadow Color', '#0f9294', { parentSelector } )
			selectAdvancedShadowHoverState()
			cy.adjust( 'Shadow Opacity', 0.4, { parentSelector } ).assertComputedStyle( {
				[ `${ shadowEditorSelector }:hover` ]: {
					'filter': 'drop-shadow(7px 31px 71px rgba(15, 146, 148, 0.4))',
				},
			}, { assertFrontend: false } )
			cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
				[ `${ shadowFrontendSelector }:hover` ]: {
					'filter': 'drop-shadow(7px 31px 71px rgba(15, 146, 148, 0.4))',
				},
			}, { assertBackend: false } )
		}

		// We won't be able to assert image size for now since it requires server handling.
		// `assertHtmlAttribute` command was introduced for the purpose of asserting html attribute values in a selected DOM Element.
		// TODO: Add assertion for Image Size
		cy.adjust( 'Image Size', 'large' )

		if ( enableBorderRadius ) {
			cy.adjust( 'Border Radius', 41 ).assertComputedStyle( {
				[ `${ selector } img` ]: {
					'border-radius': '41px',
				},
			} )
		}

		if ( enableImageShape ) {
			cy.adjust( 'Image Shape', {
				'Shape': {
					label: 'Blob 1',
					value: 'blob1',
				},
				'Flip Shape Horizontally': true,
				'Flip Shape Vertically': true,
			} ).assertComputedStyle( {
				[ `${ selector } img` ]: {
					'-webkit-mask-image': 'url(\'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB0cmFuc2Zvcm09InNjYWxlKC0xLC0xKSI+PHBhdGggZD0iTTE4OC41IDMxLjljMTIuOSAxNS45IDEyLjUgNDMuMyAxMC4zIDc3LjFzLTYuMiA3NC4yLTI2LjIgODYuNS01Ni4xLTMuMy04OS40LTIxLjItNjMuNy0zOC4xLTc2LjQtNjkuOEMtNS45IDczLS44IDI5LjkgMjEuNiAxMS43IDQ0LTYuNCA4My44LjUgMTE2LjcgNi4xczU5IDEwIDcxLjggMjUuOHoiPjwvcGF0aD48L3N2Zz4=\')',
				},
			} )

			cy.adjust( 'Image Shape', {
				'Stretch Shape Mask': true,
			} ).assertClassName( selector, 'stk-image--shape-stretch' )
		}

		// Adjust Image Filter
		const parentSelector = '.stk-image-filter-control .stk-control-content'

		cy.adjust( 'Image Filter', {
			'Blur': {
				value: 2,
				parentSelector,
			},
			'Brightness': {
				value: 1.3,
				parentSelector,
			},
			'Contrast': {
				value: 0.9,
				parentSelector,
			},
			'Grayscale': {
				value: 0.22,
				parentSelector,
			},
			'Hue Rotate': {
				value: 166,
				parentSelector,
			},
			'Invert': {
				value: 0.14,
				parentSelector,
			},
			'Opacity': {
				value: 0.83,
				parentSelector,
			},
			'Saturate': {
				value: 1.8,
				parentSelector,
			},
			'Sepia': {
				value: 0.28,
				parentSelector,
			},
		} ).assertComputedStyle( {
			[ `${ selector } img` ]: {
				'filter': 'blur(2px) brightness(1.3) contrast(0.9) grayscale(0.22) hue-rotate(166deg) invert(0.14) opacity(0.83) saturate(1.8) sepia(0.28)',
			},
		} )

		cy.resetStyle( 'Image Filter', { state: 'normal' } )

		cy.adjust( 'Image Filter', {
			'Image Filter': { value: null, state: 'hover' },
			'Blur': { value: 0.5, parentSelector },
		} )
		cy.adjust( 'Image Filter', {
			'Image Filter': { value: null, state: 'hover' },
			'Brightness': { value: 1.9, parentSelector },
		} )
		cy.adjust( 'Image Filter', {
			'Image Filter': { value: null, state: 'hover' },
			'Contrast': { value: 0.8, parentSelector },
		} )
		cy.adjust( 'Image Filter', {
			'Image Filter': { value: null, state: 'hover' },
			'Grayscale': { value: 0.61, parentSelector },
		} )
		cy.adjust( 'Image Filter', {
			'Image Filter': { value: null, state: 'hover' },
			'Hue Rotate': { value: 47, parentSelector },
		} )
		cy.adjust( 'Image Filter', {
			'Image Filter': { value: null, state: 'hover' },
			'Invert': { value: 0.33, parentSelector },
		} )
		cy.adjust( 'Image Filter', {
			'Image Filter': { value: null, state: 'hover' },
			'Opacity': { value: 0.76, parentSelector },
		} )
		cy.adjust( 'Image Filter', {
			'Image Filter': { value: null, state: 'hover' },
			'Saturate': { value: 0.9, parentSelector },
		} )
		cy.adjust( 'Image Filter', {
			'Image Filter': { value: null, state: 'hover' },
			'Sepia': { value: 0.34, parentSelector },
		} ).assertComputedStyle( {
			[ `${ selector } img:hover` ]: {
				'filter': 'blur(0.5px) brightness(1.9) contrast(0.8) grayscale(0.61) hue-rotate(47deg) invert(0.33) opacity(0.76) saturate(0.9) sepia(0.34)',
			},
		} )
	} )
	cy.adjust( 'Focal point', [ 32, 59 ], { viewport, state: 'hover' } ).assertComputedStyle( {
		[ `${ selector } img:hover` ]: {
			'object-position': '32% 59%',
		},
	} )
	cy.adjust( 'Focal point', [ 63, 53 ], { viewport, state: 'normal' } ).assertComputedStyle( {
		[ `${ selector } img` ]: {
			'object-position': '63% 53%',
		},
	} )
	cy.adjust( 'Image Fit', 'contain', { viewport } ).assertComputedStyle( {
		[ `${ selector } img` ]: {
			'object-fit': 'contain',
		},
	} )
}

/**
 * Helper function for asserting the Link panel (Style tab) in v3 blocks
 *
 * @param {Object} options
 */
export function assertLinks( options = {} ) {
	const {
		selector,
		viewport,
	} = options

	const desktopOnly = callback => viewport === 'Desktop' && callback()

	desktopOnly( () => {
		cy.collapse( 'Link' )
		cy.adjust( 'Link / URL', 'https://wpstackable.com/' ).assertHtmlAttribute( selector, 'href', 'https://wpstackable.com/', { assertBackend: false } )
		// The dynamic content for Link / URL should exist
		cy.getBaseControl( '.stk-link-control:contains(Link / URL)' ).find( 'button[aria-label="Dynamic Fields"]' ).should( 'exist' )

		cy.adjust( 'Open in new tab', true ).assertHtmlAttribute( selector, 'rel', /noreferrer noopener/, { assertBackend: false } )
		cy.get( '.block-editor-block-list__block.is-selected' ).assertHtmlAttribute( selector, 'target', '_blank', { assertBackend: false } )
		cy.adjust( 'Link rel', 'ugc sponsored' ).assertHtmlAttribute( selector, 'rel', /ugc sponsored/, { assertBackend: false } )

		cy.adjust( 'Link Title', 'Stackable site' ).assertHtmlAttribute( selector, 'title', 'Stackable site', { assertBackend: false } )
		// The dynamic content for Link Title should exist
		cy.getBaseControl( '.components-base-control:contains(Link Title)' ).find( 'button[aria-label="Dynamic Fields"]' ).should( 'exist' )
		cy.savePost()
	} )
}
