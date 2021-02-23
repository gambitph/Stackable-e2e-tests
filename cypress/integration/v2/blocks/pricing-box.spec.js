/**
 * External dependencies
 */
import { startCase } from 'lodash'
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, responsiveAssertHelper, assertAligns, assertContainer, assertTypography, assertBlockTitleDescription, assertBlockBackground, assertSeparators,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )

describe( 'Pricing Box Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/pricing-box', '.ugb-pricing-box' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/pricing-box' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/pricing-box', [
		{ value: 'Basic', selector: '.ugb-pricing-box--design-basic' },
		{ value: 'Plain', selector: '.ugb-pricing-box--design-plain' },
		{ value: 'Compact', selector: '.ugb-pricing-box--design-compact' },
		{ value: 'Colored', selector: '.ugb-pricing-box--design-colored' },
		{ value: 'Sectioned', selector: '.ugb-pricing-box--design-sectioned' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/pricing-box', [
		'Aurora Pricing Box',
		'Bean Pricing Box',
		'Cary Pricing Box',
		'Decora Pricing Box',
		'Detour Pricing Box',
		'Dim Pricing Box',
		'Dustin Pricing Box',
		'Elevate Pricing Box',
		'Flex Pricing Box',
		'Heights Pricing Box',
		'Hue Pricing Box',
		'Lounge Pricing Box',
		'Lume Pricing Box',
		'Lush Pricing Box',
		'Prime Pricing Box',
		'Speck Pricing Box',
		'Upland Pricing Box',
		'Yule Pricing Box',
	] ) )
}

function styleTab( viewport, desktopOnly, registerBlockSnapshots ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/pricing-box' ).as( 'pricingBoxBlock' )
	const pricingBoxBlock = registerBlockSnapshots( 'pricingBoxBlock' )
	cy.openInspector( 'ugb/pricing-box', 'Style' )

	//General Tab
	cy.collapse( 'General' )

	desktopOnly( () => {
		cy.adjust( 'Columns', 3 )
		cy.get( '.ugb-pricing-box__item3' ).should( 'exist' )
	} )
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	// Container Tab
	cy.collapse( 'Container' )

	assertContainer( '.ugb-pricing-box__item', { viewport }, 'column%sBackgroundMediaUrl' )

	// Spacing Tab
	cy.collapse( 'Spacing' )

	cy.adjust( 'Paddings', 30, { viewport } ).assertComputedStyle( {
		'.ugb-pricing-box__item': {
			'padding-top': '30px',
			'padding-bottom': '30px',
			'padding-right': '30px',
			'padding-left': '30px',
		},
	} )
	cy.resetStyle( 'Paddings' )
	cy.adjust( 'Paddings', 5, { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-pricing-box__item': {
			'padding-top': '5em',
			'padding-bottom': '5em',
			'padding-right': '5em',
			'padding-left': '5em',
		},
	} )
	cy.resetStyle( 'Paddings' )
	cy.adjust( 'Paddings', 25, { viewport, unit: '%' } ).assertComputedStyle( {
		'.ugb-pricing-box__item': {
			'padding-top': '25%',
			'padding-bottom': '25%',
			'padding-right': '25%',
			'padding-left': '25%',
		},
	} )

	cy.adjust( 'Image', 13, { viewport } )
	cy.adjust( 'Title', 18, { viewport } )
	cy.adjust( 'Price', 23, { viewport } )
	cy.adjust( 'Sub Price', 28, { viewport } )
	cy.adjust( 'Button', 33, { viewport } )
	cy.adjust( 'Description', 38, { viewport } )
		.assertComputedStyle( {
			'.ugb-pricing-box__image': {
				'margin-bottom': '13px',
			},
			'.ugb-pricing-box__title': {
				'margin-bottom': '18px',
			},
			'.ugb-pricing-box__price-wrapper': {
				'margin-bottom': '23px',
			},
			'.ugb-pricing-box__subprice': {
				'margin-bottom': '28px',
			},
			'.ugb-pricing-box__button': {
				'margin-bottom': '33px',
			},
			'.ugb-pricing-box__description': {
				'margin-bottom': '38px',
			},
		} )

	// Image Tab
	cy.collapse( 'Image' )

	cy.setBlockAttribute( {
		'image1Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
	} )

	desktopOnly( () => {
		cy.adjust( 'Shape', {
			label: 'Blob 1',
			value: 'blob1',
		} )
		cy.adjust( 'Flip Shape Horizontally', true )
		cy.adjust( 'Flip Shape Vertically', true )
		cy.adjust( 'Stretch Shape Mask', true ).assertClassName( 'img.ugb-img--shape', 'ugb-image--shape-stretch' )

		// We won't be able to assert image size for now since it requires server handling.
	} )

	cy.adjust( 'Image Width', 300, { viewport } )
	cy.adjust( 'Force square image', true, { viewport } ).assertComputedStyle( {
		'.ugb-img': {
			'width': '300px',
			'height': '300px',
		},
	} )
	// TO DO: Make assert align for image

	// Title, Price, Price Prefix, Price Suffix, Sub Price and Description Tabs
	const typographyAssertions = [ 'title', 'price', 'price-prefix', 'price-suffix', 'subprice', 'description' ]
	typographyAssertions.forEach( typographyAssertion => {
		// Handle Sub Price label
		const label = typographyAssertion === 'subprice' ? 'Sub Price' : typographyAssertion.split( '-' ).map( word => startCase( word ) ).join( ' ' )

		cy.collapse( label )

		if ( typographyAssertion === 'title' ) {
			desktopOnly( () => {
				cy.adjust( 'Title HTML Tag', 'h4' ).assertHtmlTag( '.ugb-pricing-box__title', 'h4' )
			} )
		}

		desktopOnly( () => {
			const colorTitle = ( ! typographyAssertion.includes( 'price' ) ) ? label : 'Text'
			cy.adjust( `${ colorTitle } Color`, '#742f2f' ).assertComputedStyle( {
				[ `.ugb-pricing-box__${ typographyAssertion }` ]: {
					'color': '#742f2f',
				},
			} )
		} )

		const textClass = typographyAssertion === 'price' ? 'price-line' : typographyAssertion
		cy.adjust( 'Size', 55, { viewport, unit: 'px' } ).assertComputedStyle( {
			[ `.ugb-pricing-box__${ textClass }` ]: {
				'font-size': '55px',
			},
		} )
		cy.adjust( 'Size', 2, { viewport, unit: 'em' } ).assertComputedStyle( {

			[ `.ugb-pricing-box__${ textClass }` ]: {
				'font-size': '2em',
			},
		} )

		// Only for Title, Price, Sub Price and Description
		if ( ! typographyAssertion.includes( 'price-' ) ) {
			assertTypography( `.ugb-pricing-box__${ textClass }`, { viewport } )
		} else {
			desktopOnly( () => {
				cy.adjust( 'Typography', {
					'Weight': '700',
				} ).assertComputedStyle( {
					[ `.ugb-pricing-box__${ textClass }` ]: {
						'font-weight': '700',
					},
				} )
			} )

			cy.adjust( 'Typography', {
				'Size': { value: 50, unit: 'px' },
				'Line-Height': { value: 40, unit: 'px' },
			}, { viewport } ).assertComputedStyle( {
				[ `.ugb-pricing-box__${ textClass }` ]: {
					'font-size': '50px',
					'line-height': '40px',
				},
			} )

			cy.adjust( 'Typography', {
				'Size': { value: 3, unit: 'em' },
				'Line-Height': { value: 2, unit: 'em' },
			}, { viewport } ).assertComputedStyle( {
				[ `.ugb-pricing-box__${ textClass }` ]: {
					'font-size': '3em',
					'line-height': '2em',
				},
			} )
		}
		// Only for Title, Sub Price, and Description
		if ( ! typographyAssertion.includes( 'price' ) || typographyAssertion === 'subprice' ) {
			assertAligns( 'Align', `.ugb-pricing-box__${ typographyAssertion }`, { viewport } )

		// Only for Price
		} else if ( typographyAssertion === 'price' ) {
			cy.adjust( 'Align', 'left', { viewport } ).assertComputedStyle( {
				'.ugb-pricing-box__price-line': {
					'justify-content': 'flex-start',
				},
			} )
			cy.adjust( 'Align', 'center', { viewport } ).assertComputedStyle( {
				'.ugb-pricing-box__price-line': {
					'justify-content': 'center',
				},
			} )
			cy.adjust( 'Align', 'right', { viewport } ).assertComputedStyle( {
				'.ugb-pricing-box__price-line': {
					'justify-content': 'flex-end',
				},
			} )
		}
	} )

	// Button Tab
	cy.collapse( 'Button' )
	cy.waitFA()

	desktopOnly( () => {
		const buttonDesigns = [ 'ghost', 'plain', 'link' ]
		buttonDesigns.forEach( design => {
			cy.adjust( 'Design', {
				label: startCase( design ),
				value: design,
			} ).assertClassName( '.ugb-button', `ugb-button--design-${ design }` )
		} )
		cy.adjust( 'Design', {
			label: 'Basic',
			value: 'basic',
		} )
		cy.adjust( 'Color Type', 'gradient' )
		cy.adjust( 'Button Color #1', '#a13939' )
		cy.adjust( 'Button Color #2', '#4e59d4' )
		cy.adjust( 'Gradient Direction (degrees)', 138 )
		cy.adjust( 'Text Color', '#ffa03b' )
		cy.adjust( 'Hover Effect', 'scale' ).assertClassName( '.ugb-button', 'ugb--hover-effect-scale' )
		cy.adjust( 'Hover Opacity', 0.6 )
		cy.adjust( 'Hover Colors', {
			'Button Color #1': '#bd8b8b',
			'Button Color #2': '#3fa35b',
			'Gradient Direction (degrees)': 72,
			'Text Color': '#80194d',
		} )
		cy.adjust( 'Typography', {
			'Weight': '700',
			'Transform': 'lowercase',
			'Letter Spacing': 2.9,
		} )
		cy.adjust( 'Button Size', 'small' ).assertClassName( '.ugb-button', 'ugb-button--size-small' )
		cy.adjust( 'Border Radius', 40 )
		cy.adjust( 'Vertical Padding', 15 )
		cy.adjust( 'Horizontal Padding', 20 )
		cy.adjust( 'Shadow', 4 )
		cy.adjust( 'Opacity', 0.6 ).assertComputedStyle( {
			'.ugb-button .ugb-button--inner': {
				'font-weight': '700',
				'text-transform': 'lowercase',
				'letter-spacing': '2.9px',
				'color': '#ffa03b',
			},
			'.ugb-button': {
				'background-color': '#a13939',
				'background-image': 'linear-gradient(138deg, #a13939, #4e59d4)',
				'padding-top': '15px',
				'padding-right': '20px',
				'padding-bottom': '15px',
				'padding-left': '20px',
				'opacity': '0.6',
				'border-radius': '40px',
			},
		} )

		cy.adjust( 'Icon', 'barcode' )
		cy.adjust( 'Adv. Icon Settings', {
			'Icon Size': 41,
			'Icon Spacing': 25,
		} ).assertComputedStyle( {
			'.ugb-button svg': {
				'height': '41px',
				'width': '41px',
				'margin-right': '25px',
			},
		} )
		cy.adjust( 'Adv. Icon Settings', {
			'Icon Position': 'Right',
		} ).assertClassName( '.ugb-button', 'ugb-button--icon-position-right' )
	} )

	cy.adjust( 'Typography', {
		'Size': {
			viewport,
			value: 31,
		},
	} ).assertComputedStyle( {
		'.ugb-button .ugb-button--inner': {
			'font-size': '31px',
		},
	} )

	cy.adjust( 'Typography', {
		'Size': {
			viewport,
			unit: 'em',
			value: 7,
		},
	} ).assertComputedStyle( {
		'.ugb-button .ugb-button--inner': {
			'font-size': '7em',
		},
	} )

	assertAligns( 'Align', '.ugb-button-container', { viewport } )

	// Effects Tab
	cy.collapse( 'Effects' )

	desktopOnly( () => {
		cy.adjust( 'Hover Effect', 'lift-more' ).assertClassName( '.ugb-pricing-box__item', 'ugb--hover-lift-more' )
	} )

	assertBlockTitleDescription( { viewport } )
	assertBlockBackground( '.ugb-pricing-box', { viewport } )
	assertSeparators( { viewport } )

	pricingBoxBlock.assertFrontendStyles()
}
