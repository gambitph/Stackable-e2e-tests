/**
 * External dependencies
 */
import { range, startCase } from 'lodash'
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, assertBlockTitleDescriptionContent, responsiveAssertHelper, assertAligns, assertContainer, assertTypography, assertBlockTitleDescription, assertBlockBackground, assertSeparators, assertAdvancedTab,
} from '~stackable-e2e/helpers'
import { registerBlockSnapshots } from '~gutenberg-e2e/plugins'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Pricing Box Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	typeContent,
	desktopStyle,
	tabletStyle,
	mobileStyle,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
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

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/pricing-box' ).as( 'pricingBoxBlock' )
		registerBlockSnapshots( 'pricingBoxBlock' )

		cy.openInspector( 'ugb/pricing-box', 'Style' )
		cy.collapse( 'General' )
		cy.adjust( 'Columns', 1 )

		cy.typeBlock( 'ugb/pricing-box', '.ugb-pricing-box__title', 'Hello World! 1' )
			.assertBlockContent( '.ugb-pricing-box__title', 'Hello World! 1' )
		cy.typeBlock( 'ugb/pricing-box', '.ugb-pricing-box__price-prefix', 'P' )
			.assertBlockContent( '.ugb-pricing-box__price-prefix', 'P' )
		cy.typeBlock( 'ugb/pricing-box', '.ugb-pricing-box__price', '12' )
			.assertBlockContent( '.ugb-pricing-box__price', '12' )
		cy.typeBlock( 'ugb/pricing-box', '.ugb-pricing-box__price-suffix', '1234' )
			.assertBlockContent( '.ugb-pricing-box__price-suffix', '1234' )
		cy.typeBlock( 'ugb/pricing-box', '.ugb-pricing-box__subprice', '123456' )
			.assertBlockContent( '.ugb-pricing-box__subprice', '123456' )
		cy.typeBlock( 'ugb/pricing-box', '.ugb-button--inner', 'Helloo World!! 12' )
			.assertBlockContent( '.ugb-button--inner', 'Helloo World!! 12' )
		cy.typeBlock( 'ugb/pricing-box', '.ugb-pricing-box__description', 'Hellooo World!!! 123' )
			.assertBlockContent( '.ugb-pricing-box__description', 'Hellooo World!!! 123' )

		assertBlockTitleDescriptionContent( 'ugb/pricing-box' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/pricing-box' ).as( 'pricingBoxBlock' )
	const pricingBoxBlock = registerBlockSnapshots( 'pricingBoxBlock' )
	cy.openInspector( 'ugb/pricing-box', 'Style' )

	// General Tab
	cy.collapse( 'General' )

	desktopOnly( () => {
		cy.adjust( 'Columns', 3 )
		cy.get( '.ugb-pricing-box__item3' ).should( 'exist' )
	} )
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	// Container Tab
	cy.collapse( 'Container' )

	assertContainer( '.ugb-pricing-box__item', { viewport }, 'column%sBackgroundMediaUrl' )

	range( 1, 4 ).forEach( idx => {
		cy.setBlockAttribute( {
			[ `image${ idx }Url` ]: Cypress.env( 'DUMMY_IMAGE_URL' ),
		} )
	} )

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

	cy.adjust( 'Image Width', 300, { viewport } ).assertComputedStyle( {
		'.ugb-img': {
			'width': '300px',
		},
	} )
	desktopOnly( () => {
		cy.adjust( 'Force square image', true ).assertComputedStyle( {
			'.ugb-img': {
				'height': '300px',
			},
		} )
	} )

	cy.adjust( 'Align', 'left', { viewport } ).assertComputedStyle( {
		'.ugb-pricing-box__image': {
			'margin-left': '0px',
			'margin-right': 'auto',
		},
	} )
	cy.adjust( 'Align', 'center', { viewport } ).assertComputedStyle( {
		'.ugb-pricing-box__image': {
			'margin-left': 'auto',
			'margin-right': 'auto',
		},
	} )
	cy.adjust( 'Align', 'right', { viewport } ).assertComputedStyle( {
		'.ugb-pricing-box__image': {
			'margin-left': 'auto',
			'margin-right': '0px',
		},
	} )

	// Title, Price, Price Prefix, Price Suffix, Sub Price and Description Tabs
	const typographyAssertions = [ 'title', 'price', 'price-prefix', 'price-suffix', 'subprice', 'description' ]
	typographyAssertions.forEach( typographyAssertion => {
		// Handle Sub Price label
		const label = typographyAssertion === 'subprice' ? 'Sub Price' : startCase( typographyAssertion )

		cy.collapse( label )

		if ( typographyAssertion === 'title' ) {
			desktopOnly( () => {
				cy.adjust( 'Title HTML Tag', 'h4' ).assertHtmlTag( '.ugb-pricing-box__title', 'h4' )
			} )
		}

		desktopOnly( () => {
			const colorTitle = ( ! typographyAssertion.match( /price/ ) ) ? label : 'Text'
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

		// Only for Price Prefix and Price Suffix
		if ( typographyAssertion.match( /price-/ ) ) {
			assertTypography( `.ugb-pricing-box__${ textClass }`, {
				viewport,
				enableTransform: false,
				enableLetterSpacing: false,
			} )
		} else {
			assertTypography( `.ugb-pricing-box__${ textClass }`, { viewport } )
		}

		// Only for Title, Sub Price, and Description
		if ( Array( 'title', 'subprice', 'description' ).includes( typographyAssertion ) ) {
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
		cy.adjust( 'Button Size', 'small' ).assertClassName( '.ugb-button', 'ugb-button--size-small' )
		cy.adjust( 'Border Radius', 40 )
		cy.adjust( 'Vertical Padding', 15 )
		cy.adjust( 'Horizontal Padding', 20 )
		cy.adjust( 'Shadow', 4 )
		cy.adjust( 'Opacity', 0.6 ).assertComputedStyle( {
			'.ugb-button .ugb-button--inner': {
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

	assertTypography( '.ugb-button .ugb-button--inner', {
		viewport,
		enableWeight: false,
		enableTransform: false,
		enableLineHeight: false,
		enableLetterSpacing: false,
	} )
	assertAligns( 'Align', '.ugb-button-container', { viewport } )

	desktopOnly( () => {
		// Effects Tab
		cy.collapse( 'Effects' )

		const hoverEffects = [
			'shadow',
			'lift',
			'lift-more',
			'lift-shadow',
			'lift-staggered',
			'lift-shadow-staggered',
			'scale',
			'scale-more',
			'scale-shadow',
			'lower',
			'lower-more',
		]
		hoverEffects.forEach( hoverEffect => {
			cy.adjust( 'Hover Effect', `${ hoverEffect }` ).assertClassName( '.ugb-pricing-box__item', `ugb--hover-${ hoverEffect }` )
		} )
	} )

	assertBlockTitleDescription( { viewport } )
	assertBlockBackground( '.ugb-pricing-box', { viewport } )
	assertSeparators( { viewport } )

	pricingBoxBlock.assertFrontendStyles()
}

function advancedTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/pricing-box' ).as( 'pricingBoxBlock' )
	const pricingBoxBlock = registerBlockSnapshots( 'pricingBoxBlock' )

	cy.openInspector( 'ugb/pricing-box', 'Advanced' )

	assertAdvancedTab( '.ugb-pricing-box', { viewport } )

	desktopOnly( () => {
		cy.setBlockAttribute( {
			'image1Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
			'image2Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
		} )
		range( 1, 3 ).forEach( idx => {
			cy.collapse( `Column #${ idx }` )
			cy.adjust( 'Column Background', '#a03b3b' ).assertComputedStyle( {
				[ `.ugb-pricing-box__item${ idx }` ]: {
					'background-color': '#a03b3b',
				},
			} )
			cy.collapse( `Image #${ idx }` )
			cy.adjust( 'Shape', {
				label: 'Blob 3',
				value: 'blob3',
			} )
			cy.adjust( 'Flip Shape Horizontally', true )
			cy.adjust( 'Flip Shape Vertically', true )
			cy.adjust( 'Stretch Shape Mask', true ).assertClassName( `.ugb-pricing-box__item${ idx } img.ugb-img--shape`, 'ugb-image--shape-stretch' )
		} )
	} )
	pricingBoxBlock.assertFrontendStyles()
}
