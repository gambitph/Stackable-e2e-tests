/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, responsiveAssertHelper, assertAligns, assertBlockBackground, assertSeparators, assertTypography, assertContainer, assertAdvancedTab,
} from '~stackable-e2e/helpers'
import { registerBlockSnapshots } from '~gutenberg-e2e/plugins'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Call To Action Block', registerTests( [
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
	it( 'should show the block', assertBlockExist( 'ugb/cta', '.ugb-cta' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/cta' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/cta', [
		'Basic',
		{ value: 'Plain', selector: '.ugb-cta--design-plain' },
		{ value: 'Horizontal', selector: '.ugb-cta--design-horizontal' },
		{ value: 'Horizontal 2', selector: '.ugb-cta--design-horizontal-2' },
		{ value: 'Horizontal 3', selector: '.ugb-cta--design-horizontal-3' },
		{ value: 'Split Centered', selector: '.ugb-cta--design-split-centered' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/cta', [
		'Angled Call to Action 1',
		'Angled Call to Action 2',
		'Arch Call to Action',
		'Arch Call to Action 2',
		'Aspire Call to Action',
		'Aurora Call to Action 1',
		'Aurora Call to Action 2',
		'Bean Call to Action',
		'Capital Call to Action 1',
		'Capital Call to Action 2',
		'Cary Call to Action',
		'Chic Call to Action',
		'Dare Call to Action',
		'Decora Call to Action',
		'Devour Call to Action 1',
		'Devour Call to Action 2',
		'Dim Call to Action 1',
		'Dim Call to Action 2',
		'Dim Call to Action 3',
		'Dustin Call to Action 1',
		'Dustin Call to Action 2',
		'Elevate Call to Action',
		'Flex Call to Action',
		'Glow Call to Action',
		'Heights Call to Action 1',
		'Heights Call to Action 2',
		'Hue Call to Action 1',
		'Hue Call to Action 2',
		'Lounge Call to Action',
		'Lume Call to Action',
		'Lush Call to Action',
		'Peplum Call to Action',
		'Prime Call to Action',
		'Proact Call to Action 1',
		'Proact Call to Action 2',
		'Propel Call to Action',
		'Seren Call to Action',
		'Speck Call to Action',
		'Upland Call to Action',
		'Yule Call to Action',
	] ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/cta' ).as( 'ctaBlock' )
		registerBlockSnapshots( 'ctaBlock' )

		cy.typeBlock( 'ugb/cta', '.ugb-cta__title', 'Hello World! 1' )
			.assertBlockContent( '.ugb-cta__title', 'Hello World! 1' )
		cy.typeBlock( 'ugb/cta', '.ugb-cta__description', 'Helloo World!! 12' )
			.assertBlockContent( '.ugb-cta__description', 'Helloo World!! 12' )
		cy.typeBlock( 'ugb/cta', '.ugb-button--inner', 'Hellooo World!!! 123' )
			.assertBlockContent( '.ugb-button--inner', 'Hellooo World!!! 123' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/cta' ).as( 'ctaBlock' )
	const ctaBlock = registerBlockSnapshots( 'ctaBlock' )
	cy.openInspector( 'ugb/cta', 'Style' )

	// Test General options
	cy.collapse( 'General' )
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	// Test Container options
	cy.collapse( 'Container' )
	assertContainer( '.ugb-cta__item', { viewport }, 'column%sBackgroundMediaUrl' )

	// Test Spacing options
	cy.collapse( 'Spacing' )
	cy.adjust( 'Paddings', [ 25, 26, 27, 28 ], { viewport, unit: 'px' } ).assertComputedStyle( {
		'.ugb-cta__item': {
			'padding-top': '25px',
			'padding-right': '26px',
			'padding-bottom': '27px',
			'padding-left': '28px',
		},
	} )
	cy.resetStyle( 'Paddings' )
	cy.adjust( 'Paddings', [ 3, 4, 5, 6 ], { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-cta__item': {
			'padding-top': '3em',
			'padding-right': '4em',
			'padding-bottom': '5em',
			'padding-left': '6em',
		},
	} )
	cy.resetStyle( 'Paddings' )
	cy.adjust( 'Paddings', [ 17, 18, 19, 20 ], { viewport, unit: '%' } ).assertComputedStyle( {
		'.ugb-cta__item': {
			'padding-top': '17%',
			'padding-right': '18%',
			'padding-bottom': '19%',
			'padding-left': '20%',
		},
	} )
	cy.adjust( 'Title', 47, { viewport } ).assertComputedStyle( {
		'.ugb-cta__title': {
			'margin-bottom': '47px',
		},
	} )
	cy.adjust( 'Description', 28, { viewport } ).assertComputedStyle( {
		'.ugb-cta__description': {
			'margin-bottom': '28px',
		},
	} )
	cy.adjust( 'Button', 9, { viewport } ).assertComputedStyle( {
		'.ugb-button-container': {
			'margin-bottom': '9px',
		},
	} )

	// Test Title options
	cy.collapse( 'Title' )

	desktopOnly( () => {
		cy.adjust( 'Title HTML Tag', 'h5' )
			.assertHtmlTag( '.ugb-cta__title', 'h5' )
		cy.adjust( 'Title Color', '#333333' ).assertComputedStyle( {
			'.ugb-cta__title': {
				'color': '#333333',
			},
		} )
	} )
	assertTypography( '.ugb-cta__title', { viewport } )
	assertAligns( 'Align', '.ugb-cta__title', { viewport } )

	// Test Description options
	cy.collapse( 'Description' )

	desktopOnly( () => {
		cy.adjust( 'Description Color', '#333333' ).assertComputedStyle( {
			'.ugb-cta__description': {
				'color': '#333333',
			},
		} )
	} )
	assertTypography( '.ugb-cta__description', { viewport } )
	assertAligns( 'Align', '.ugb-cta__description', { viewport } )

	// Test Button options
	cy.collapse( 'Button' )
	cy.waitFA()

	desktopOnly( () => {
		cy.adjust( 'Color Type', 'single' )
		cy.adjust( 'Button Color', '#ff0000' )
		cy.adjust( 'Text Color', '#ffffff' ).assertComputedStyle( {
			'.ugb-button': {
				'background-color': '#ff0000',
			},
			'.ugb-button--inner': {
				'color': '#ffffff',
			},
		} )
		cy.adjust( 'Color Type', 'gradient' )
		cy.adjust( 'Button Color #1', '#000000' )
		cy.adjust( 'Button Color #2', '#ff0000' )
		cy.adjust( 'Gradient Direction (degrees)', 130 ).assertComputedStyle( {
			'.ugb-button': {
				'background-image': 'linear-gradient(130deg, #000000, #ff0000)',
			},
		} )
		cy.adjust( 'Hover Effect', 'lift' )
			.assertClassName( '.ugb-button', 'ugb--hover-effect-lift' )
		cy.adjust( 'Hover Opacity', 0.6 )
		cy.adjust( 'Hover Colors', {
			'Button Color #1': '#ffffff',
			'Button Color #2': '#ff0000',
			'Gradient Direction (degrees)': 72,
			'Text Color': '#000000',
		} )
		assertTypography( '.ugb-button--inner', { enableLineHeight: false } )
		cy.adjust( 'Button Size', 'medium' )
			.assertClassName( '.ugb-button', 'ugb-button--size-medium' )
		cy.adjust( 'Border Radius', 35 )
		cy.adjust( 'Vertical Padding', 4 )
		cy.adjust( 'Horizontal Padding', 27 )
		cy.adjust( 'Shadow', 2 )
			.assertClassName( '.ugb-button', 'ugb--shadow-2' )
		cy.adjust( 'Opacity', 0.6 ).assertComputedStyle( {
			'.ugb-button': {
				'border-radius': '35px',
				'padding-top': '4px',
				'padding-bottom': '4px',
				'padding-left': '27px',
				'padding-right': '27px',
				'opacity': '0.6',
			},
		} )
		cy.adjust( 'Icon', 'info' )
		cy.adjust( 'Adv. Icon Settings', {
			'Icon Size': 18,
			'Icon Position': 'right',
			'Icon Spacing': 29,
		} ).assertComputedStyle( {
			'.ugb-button svg': {
				'width': '18px',
				'height': '18px',
				'margin-left': '29px',
			},
		} )
	} )

	assertTypography( '.ugb-button--inner', {
		viewport,
		enableWeight: false,
		enableTransform: false,
		enableLineHeight: false,
		enableLetterSpacing: false,
	} )
	assertAligns( 'Align', '.ugb-button-container', { viewport } )

	desktopOnly( () => {
		cy.collapse( 'Effects' )
		cy.adjust( 'Hover Effect', 'lift' )
			.assertClassName( '.ugb-cta__item', 'ugb--hover-lift' )
	} )

	assertBlockBackground( '.ugb-cta', { viewport } )

	assertSeparators( { viewport } )
	ctaBlock.assertFrontendStyles()
}

function advancedTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/cta' ).as( 'ctaBlock' )
	const ctaBlock = registerBlockSnapshots( 'ctaBlock' )

	cy.openInspector( 'ugb/cta', 'Advanced' )

	assertAdvancedTab( '.ugb-cta', {
		viewport,
		customCssSelectors: [
			'.ugb-cta__title',
			'.ugb-cta__description',
			'.ugb-button',
		],
	} )

	// Add more block specific tests.
	ctaBlock.assertFrontendStyles()
}
