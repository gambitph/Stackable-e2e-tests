/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, responsiveAssertHelper, assertAligns, assertBlockTitleDescription, assertBlockBackground, assertSeparators, assertTypography, assertContainer, assertAdvancedTab,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Card Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	desktopStyle,
	tabletStyle,
	mobileStyle,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/card', '.ugb-card' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/card' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/card', [
		{ value: 'Basic', selector: '.ugb-card--design-basic' },
		{ value: 'Plain', selector: '.ugb-card--design-plain' },
		{ value: 'Horizontal', selector: '.ugb-card--design-horizontal' },
		{ value: 'Full', selector: '.ugb-card--design-full' },
		{ value: 'Faded', selector: '.ugb-card--design-faded' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/card', [
		'Angled Card',
		'Arch Card',
		'Aspire Card',
		'Aurora Card',
		'Bean Card',
		'Capital Card',
		'Cary Card 1',
		'Cary Card 2',
		'Chic Card',
		'Decora Card',
		'Detour Card',
		'Devour Card',
		'Dim Card',
		'Dustin Card',
		'Glow Card',
		'Heights Card',
		'Hue Card',
		'Lounge Card',
		'Lush Card',
		'Peplum Card',
		'Prime Card',
		'Speck Card',
		'Yule Card',
	] ) )
}

function styleTab( viewport, desktopOnly, registerBlockSnapshots ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/card' ).as( 'cardBlock' )
	const cardBlock = registerBlockSnapshots( 'cardBlock' )
	cy.openInspector( 'ugb/card', 'Style' )

	cy.collapse( 'General' )
	cy.adjust( 'Columns', 3 )
		.assertClassName( '.ugb-card', 'ugb-card--columns-3' )
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	cy.collapse( 'Container' )

	cy.setBlockAttribute( {
		'image1Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
		'image2Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
		'image3Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
	} )

	assertContainer( '.ugb-card__item', { viewport }, 'column%sBackgroundMediaUrl' )

	cy.collapse( 'Image' )
	// TODO: Image Size assertion
	// We won't be able to assert image size for now since it requires server handling.
	desktopOnly( () => {
		cy.adjust( 'Background Image Position', 'center center' )
		cy.adjust( 'Background Image Repeat', 'repeat-x' )
		cy.adjust( 'Background Image Size', 'custom' )
		cy.adjust( 'Custom Size', 198, { unit: 'px' } ).assertComputedStyle( {
			'.ugb-card__image': {
				'background-position': '50% 50%',
				'background-repeat': 'repeat-x',
				'background-size': '198px',
			},
		} )
		cy.adjust( 'Background Image Size', 'custom' )
		cy.adjust( 'Custom Size', 75, { unit: '%' } ).assertComputedStyle( {
			'.ugb-card__image': {
				'background-size': '75%',
			},
		} )
	} )

	cy.adjust( 'Image Height', 395, { viewport } ).assertComputedStyle( {
		'.ugb-card__image': {
			'height': '395px',
		},
	} )

	// Test Title options
	cy.collapse( 'Title' )
	desktopOnly( () => {
		cy.adjust( 'Title HTML Tag', 'h6' )
			.assertHtmlTag( '.ugb-card__title', 'h6' )
		cy.adjust( 'Title Color', '#ff7979' ).assertComputedStyle( {
			'.ugb-card__title': {
				'color': '#ff7979',
			},
		} )
	} )

	assertTypography( '.ugb-card__title', { viewport } )
	assertAligns( 'Align', '.ugb-card__title', { viewport } )

	// Test Subtitle options
	cy.collapse( 'Subtitle' )
	desktopOnly( () => {
		cy.adjust( 'Subtitle Color', '#ff7979' ).assertComputedStyle( {
			'.ugb-card__subtitle': {
				'color': '#ff7979',
			},
		} )
	} )

	assertTypography( '.ugb-card__subtitle', { viewport } )
	assertAligns( 'Align', '.ugb-card__subtitle', { viewport } )

	// Test Description options
	cy.collapse( 'Description' )
	desktopOnly( () => {
		cy.adjust( 'Description Color', '#ff7979' ).assertComputedStyle( {
			'.ugb-card__description': {
				'color': '#ff7979',
			},
		} )
	} )

	assertTypography( '.ugb-card__description', { viewport } )
	assertAligns( 'Align', '.ugb-card__description', { viewport } )

	// Test Button options
	cy.collapse( 'Button' )
	cy.waitFA()
	desktopOnly( () => {
		cy.adjust( 'Color Type', 'gradient' )
		cy.adjust( 'Button Color #1', '#a13939' )
		cy.adjust( 'Button Color #2', '#4e59d4' )
		cy.adjust( 'Gradient Direction (degrees)', 138 )
		cy.adjust( 'Text Color', '#ffa03b' )
		cy.adjust( 'Hover Effect', 'scale' )
			.assertClassName( '.ugb-button', 'ugb--hover-effect-scale' )
		cy.adjust( 'Hover Opacity', 0.6 )
		cy.adjust( 'Hover Colors', {
			'Button Color #1': '#bd8b8b',
			'Button Color #2': '#3fa35b',
			'Gradient Direction (degrees)': 72,
			'Text Color': '#80194d',
		} )
		cy.adjust( 'Typography', {
			'Size': 50,
			'Weight': '700',
			'Transform': 'lowercase',
			'Letter Spacing': 2.9,
		} )
		cy.adjust( 'Button Size', 'large' )
			.assertClassName( '.ugb-button', 'ugb-button--size-large' )
		cy.adjust( 'Border Radius', 40 )
		cy.adjust( 'Vertical Padding', 15 )
		cy.adjust( 'Horizontal Padding', 43 )
		cy.adjust( 'Shadow', 4 )
		cy.adjust( 'Opacity', 0.6 ).assertComputedStyle( {
			'.ugb-button .ugb-button--inner': {
				'font-size': '50px',
				'font-weight': '700',
				'text-transform': 'lowercase',
				'letter-spacing': '2.9px',
			},
			'.ugb-button': {
				'background-color': '#a13939',
				'background-image': 'linear-gradient(138deg, #a13939, #4e59d4)',
				'padding-top': '15px',
				'padding-right': '43px',
				'padding-bottom': '15px',
				'padding-left': '43px',
				'opacity': '0.6',
				'border-radius': '40px',
			},
		} )
		cy.adjust( 'Typography', {
			'Size': {
				unit: 'em',
				value: 7,
			},
		} ).assertComputedStyle( {
			'.ugb-button .ugb-button--inner': {
				'font-size': '7em',
			},
		} )
		cy.adjust( 'Icon', 'info' )
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
	} )

	const tabletMobileViewports = [ 'Tablet', 'Mobile' ]
	if ( tabletMobileViewports.some( _viewport => _viewport === viewport ) ) {
		cy.adjust( 'Typography', {
			'Size': {
				viewport,
				value: 50,
			},
		} ).assertComputedStyle( {
			'.ugb-button .ugb-button--inner': {
				'font-size': '50px',
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
	}

	assertAligns( 'Align', '.ugb-button-container', { viewport } )

	// Test Effects option
	desktopOnly( () => {
		cy.collapse( 'Effects' )
		const effects = [
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
		effects.forEach( effect => {
			cy.adjust( 'Hover Effect', effect )
				.assertClassName( '.ugb-card__item', `ugb--hover-${ effect }` )
		} )
	} )

	// Test Block Title and Description
	assertBlockTitleDescription( { viewport } )

	// Test Spacing options
	cy.collapse( 'Spacing' )
	cy.adjust( 'Block Title', 35, { viewport } ).assertComputedStyle( {
		'.ugb-block-title': {
			'margin-bottom': '35px',
		},
	} )
	cy.adjust( 'Block Description', 41, { viewport } ).assertComputedStyle( {
		'.ugb-block-description': {
			'margin-bottom': '41px',
		},
	} )
	cy.adjust( 'Paddings', 21, { viewport, unit: 'px' } ).assertComputedStyle( {
		'.ugb-card__content': {
			'padding-top': '21px',
			'padding-bottom': '21px',
			'padding-right': '21px',
			'padding-left': '21px',
		},
	} )
	cy.adjust( 'Paddings', 3, { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-card__content': {
			'padding-top': '3em',
			'padding-bottom': '3em',
			'padding-right': '3em',
			'padding-left': '3em',
		},
	} )
	cy.adjust( 'Paddings', 19, { viewport, unit: '%' } ).assertComputedStyle( {
		'.ugb-card__content': {
			'padding-top': '19%',
			'padding-bottom': '19%',
			'padding-right': '19%',
			'padding-left': '19%',
		},
	} )
	cy.adjust( 'Title', 25, { viewport } ).assertComputedStyle( {
		'.ugb-card__title': {
			'margin-bottom': '25px',
		},
	} )
	cy.adjust( 'Subtitle', 61, { viewport } ).assertComputedStyle( {
		'.ugb-card__subtitle': {
			'margin-bottom': '61px',
		},
	} )
	cy.adjust( 'Description', 43, { viewport } ).assertComputedStyle( {
		'.ugb-card__description': {
			'margin-bottom': '43px',
		},
	} )
	cy.adjust( 'Button', 26, { viewport } ).assertComputedStyle( {
		'.ugb-button-container': {
			'margin-bottom': '26px',
		},
	} )

	// Test Block Background
	assertBlockBackground( '.ugb-card', { viewport } )
	assertSeparators( { viewport } )
	cardBlock.assertFrontendStyles()
}

function advancedTab( viewport, desktopOnly, registerBlockSnapshots ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/card' ).as( 'cardBlock' )
	const cardBlock = registerBlockSnapshots( 'cardBlock' )

	cy.openInspector( 'ugb/card', 'Advanced' )

	assertAdvancedTab( '.ugb-card', { viewport } )

	// Add more block specific tests.
	cardBlock.assertFrontendStyles()
}
