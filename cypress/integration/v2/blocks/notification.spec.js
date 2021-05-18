/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, responsiveAssertHelper, assertAligns, assertTypography, assertBlockBackground, assertContainer, assertAdvancedTab,
} from '~stackable-e2e/helpers'
import { registerBlockSnapshots } from '~gutenberg-e2e/plugins'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Notification Block', registerTests( [
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
	it( 'should show the block', assertBlockExist( 'ugb/notification', '.ugb-notification' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/notification' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/notification', [
		{ value: 'Basic', selector: '.ugb-notification--design-basic' },
		{ value: 'Plain', selector: '.ugb-notification--design-plain' },
		{ value: 'Bordered', selector: '.ugb-notification--design-bordered' },
		{ value: 'Outlined', selector: '.ugb-notification--design-outlined' },
		{ value: 'Large Icon', selector: '.ugb-notification--design-large-icon' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/notification', [
		'Chic Notification',
		'Detour Notification',
		'Elevate Notification',
		'Heights Notification',
		'Lounge Notification',
		'Propel Notification',
		'Seren Notification',
		'Upland Notification',
		'Yule Notification',
	] ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/notification' ).as( 'notificationBlock' )
		registerBlockSnapshots( 'notificationBlock' )

		cy.typeBlock( 'ugb/notification', '.ugb-notification__title', 'Hello World! 1' )
			.assertBlockContent( '.ugb-notification__title', 'Hello World! 1' )
		cy.typeBlock( 'ugb/notification', '.ugb-notification__description', 'Helloo World!! 12' )
			.assertBlockContent( '.ugb-notification__description', 'Helloo World!! 12' )
		cy.typeBlock( 'ugb/notification', '.ugb-button--inner', 'Hellooo World!!! 123' )
			.assertBlockContent( '.ugb-button--inner', 'Hellooo World!!! 123' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/notification' ).as( 'notificationBlock' )
	const notificationBlock = registerBlockSnapshots( 'notificationBlock' )
	cy.openInspector( 'ugb/notification', 'Style' )

	// Test General options
	cy.collapse( 'General' )
	desktopOnly( () => {
		const types = [
			'success',
			'error',
			'warning',
			'info',
		]
		types.forEach( type => {
			cy.adjust( 'Notification Type', type )
				.assertClassName( '.ugb-notification', `ugb-notification--type-${ type }` )
		} )
	} )
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	// Test Container options
	cy.collapse( 'Container' )
	assertContainer( '.ugb-notification__item', { viewport }, 'column%sBackgroundMediaUrl' )

	// Test Dismissible
	cy.collapse( 'Dismissible' )
	cy.toggleStyle( 'Dismissible' )

	desktopOnly( () => {
		cy.adjust( 'Icon Color', '#ffffff' ).assertComputedStyle( {
			'.ugb-notification__close-button svg': {
				'fill': '#ffffff',
			},
		} )
	} )
	cy.adjust( 'Icon Size', 24, { viewport } ).assertComputedStyle( {
		'.ugb-notification__close-button': {
			'width': '24px',
			'height': '24px',
		},
	} )

	// Test Icon options
	cy.collapse( 'Icon' )
	cy.toggleStyle( 'Icon' )
	cy.waitFA()
	desktopOnly( () => {
		cy.adjust( 'Icon', 'info' )
		cy.adjust( 'Color Type', 'gradient' )
		cy.adjust( 'Icon Color #1', '#e4dd57' )
		cy.adjust( 'Icon Color #2', '#34f8ff' )
		cy.adjust( 'Gradient Direction (degrees)', 123 )
		cy.adjust( 'Icon Opacity', 0.8 )
		cy.adjust( 'Icon Rotation', 325 ).assertComputedStyle( {
			'.ugb-notification__icon': {
				'opacity': '0.8',
			},
			'.ugb-icon-inner-svg': {
				'fill': 'url("#grad-e4dd57-34f8ff-123")',
				'rotation': 'matrix(0.819152, -0.573576, 0.573576, 0.819152, 0, 0)',
			},
		} )
	} )

	cy.adjust( 'Icon Size', 63, { viewport } ).assertComputedStyle( {
		'.ugb-icon-inner-svg': {
			'height': '63px',
			'width': '63px',
		},
		'.ugb-notification__icon': {
			'height': '63px',
			'width': '63px',
		},
	} )

	cy.adjust( 'Align', 'left', { viewport } ).assertComputedStyle( {
		'.ugb-notification__icon': {
			'margin-left': '0',
			'margin-right': 'auto',
		},
	} )
	cy.adjust( 'Align', 'center', { viewport } ).assertComputedStyle( {
		'.ugb-notification__icon': {
			'margin-left': 'auto',
			'margin-right': 'auto',
		},
	} )
	cy.adjust( 'Align', 'right', { viewport } ).assertComputedStyle( {
		'.ugb-notification__icon': {
			'margin-left': 'auto',
			'margin-right': '0',
		},
	} )

	// Test Spacing options
	cy.collapse( 'Spacing' )
	cy.adjust( 'Paddings', [ 25, 26, 27, 28 ], { viewport, unit: 'px' } ).assertComputedStyle( {
		'.ugb-notification__item': {
			'padding-top': '25px',
			'padding-right': '26px',
			'padding-bottom': '27px',
			'padding-left': '28px',
		},
	} )
	cy.adjust( 'Paddings', [ 3, 4, 5, 6 ], { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-notification__item': {
			'padding-top': '3em',
			'padding-right': '4em',
			'padding-bottom': '5em',
			'padding-left': '6em',
		},
	} )
	cy.adjust( 'Paddings', [ 17, 18, 19, 20 ], { viewport, unit: '%' } ).assertComputedStyle( {
		'.ugb-notification__item': {
			'padding-top': '17%',
			'padding-right': '18%',
			'padding-bottom': '19%',
			'padding-left': '20%',
		},
	} )
	cy.adjust( 'Icon', 52, { viewport } ).assertComputedStyle( {
		'.ugb-notification__icon': {
			'margin-bottom': '52px',
		},
	} )
	cy.adjust( 'Title', 37, { viewport } ).assertComputedStyle( {
		'.ugb-notification__title': {
			'margin-bottom': '37px',
		},
	} )
	cy.adjust( 'Description', 45, { viewport } ).assertComputedStyle( {
		'.ugb-notification__description': {
			'margin-bottom': '45px',
		},
	} )
	cy.adjust( 'Button', 31, { viewport } ).assertComputedStyle( {
		'.ugb-button-container': {
			'margin-bottom': '31px',
		},
	} )

	// Test Title options
	cy.collapse( 'Title' )
	desktopOnly( () => {
		cy.adjust( 'Title HTML Tag', 'h6' )
			.assertHtmlTag( '.ugb-notification__title', 'h6' )
		cy.adjust( 'Title Color', '#ff7979' ).assertComputedStyle( {
			'.ugb-notification__title': {
				'color': '#ff7979',
			},
		} )
	} )

	assertTypography( '.ugb-notification__title', { viewport } )
	assertAligns( 'Align', '.ugb-notification__title', { viewport } )

	// Test Description options
	cy.collapse( 'Description' )
	desktopOnly( () => {
		cy.adjust( 'Description Color', '#ff7979' ).assertComputedStyle( {
			'.ugb-notification__description': {
				'color': '#ff7979',
			},
		} )
	} )

	assertTypography( '.ugb-notification__description', { viewport } )
	assertAligns( 'Align', '.ugb-notification__description', { viewport } )

	// Test Button options
	cy.collapse( 'Button' )
	cy.waitFA()
	desktopOnly( () => {
		cy.adjust( 'Design', {
			label: 'Basic',
			value: 'basic',
		} )
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
		assertTypography( '.ugb-button .ugb-button--inner', { enableLineHeight: false } )
		cy.adjust( 'Button Size', 'large' )
			.assertClassName( '.ugb-button', 'ugb-button--size-large' )
		cy.adjust( 'Border Radius', 40 )
		cy.adjust( 'Vertical Padding', 15 )
		cy.adjust( 'Horizontal Padding', 43 )
		cy.adjust( 'Shadow', 4 )
			.assertClassName( '.ugb-button', 'ugb--shadow-4' )
		cy.adjust( 'Opacity', 0.6 ).assertComputedStyle( {
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

	if ( viewport !== 'Desktop' ) {
		assertTypography( '.ugb-button .ugb-button--inner', {
			viewport,
			enableWeight: false,
			enableTransform: false,
			enableLineHeight: false,
			enableLetterSpacing: false,
		} )
	}

	assertAligns( 'Align', '.ugb-button-container', { viewport } )

	// Test Block Background
	assertBlockBackground( '.ugb-notification', { viewport } )
	notificationBlock.assertFrontendStyles()
}

function advancedTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/notification' ).as( 'notificationBlock' )
	const notificationBlock = registerBlockSnapshots( 'notificationBlock' )

	cy.openInspector( 'ugb/notification', 'Advanced' )

	assertAdvancedTab( '.ugb-notification', {
		viewport,
		customCssSelectors: [
			'.ugb-notification__item',
			'.ugb-notification__title',
			'.ugb-notification__description',
			'.ugb-button-container',
			'.ugb-button',
			'.ugb-button .ugb-button--inner',
		],
	} )

	// Add more block specific tests.
	notificationBlock.assertFrontendStyles()
}
