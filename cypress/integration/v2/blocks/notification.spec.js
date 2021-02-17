/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, responsiveAssertHelper, assertAligns, assertTypography, assertBlockBackground,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )

describe( 'Notification Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	desktopStyle,
	tabletStyle,
	mobileStyle,
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

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/notification' )
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
	cy.setBlockAttribute( {
		[ `column${ viewport === 'Desktop' ? '' : viewport }BackgroundMediaUrl` ]: Cypress.env( 'DUMMY_IMAGE_URL' ),
	} )
	desktopOnly( () => {
		cy.adjust( 'Background', {
			'Color Type': 'gradient',
			'Background Color #1': '#ff5c5c',
			'Background Color #2': '#7bff5a',
			'Adv. Gradient Color Settings': {
				'Gradient Direction (degrees)': 160,
				'Color 1 Location': 28,
				'Color 2 Location': 75,
				'Background Gradient Blend Mode': 'multiply',
			},
			'Background Media Tint Strength': 6,
			'Fixed Background': true,
			'Adv. Background Image Settings': {
				'Image Blend Mode': 'exclusion',
			},
		} ).assertComputedStyle( {
			'.ugb-notification__item:before': {
				'background-image': 'linear-gradient(160deg, #ff5c5c 28%, #7bff5a 75%)',
				'opacity': '0.6',
				'mix-blend-mode': 'multiply',
			},
			'.ugb-notification__item': {
				'background-color': '#ff5c5c',
				'background-attachment': 'fixed',
				'background-blend-mode': 'exclusion',
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
		'.ugb-notification__item': {
			'background-position': '50% 50%',
			'background-repeat': 'repeat-x',
			'background-size': '19%',
		},
	} )

	cy.adjust( 'Background', {
		'Adv. Background Image Settings': {
			'Image Size': {
				viewport,
				value: 'custom',
			},
			'Custom Size': {
				viewport,
				value: 160,
				unit: 'px',
			},
		},
	} ).assertComputedStyle( {
		'.ugb-notification__item': {
			'background-size': '160px',
		},
	} )

	cy.adjust( 'Background', {
		'Adv. Background Image Settings': {
			'Image Size': {
				viewport,
				value: 'custom',
			},
			'Custom Size': {
				viewport,
				value: 8,
				unit: 'vw',
			},
		},
	} ).assertComputedStyle( {
		'.ugb-notification__item': {
			'background-size': '8vw',
		},
	} )

	cy.adjust( 'Borders', 'dashed' )
	desktopOnly( () => {
		cy.adjust( 'Border Color', '#3f3f3f' )
		cy.adjust( 'Border Radius', 23 ).assertComputedStyle( {
			'.ugb-notification__item': {
				'border-color': '#3f3f3f',
				'border-radius': '23px',
			},
		} )
		cy.adjust( 'Shadow / Outline', 7 )
			.assertClassName( '.ugb-notification__item', 'ugb--shadow-7' )
	} )
	cy.adjust( 'Border Width', 23, { viewport } ).assertComputedStyle( {
		'.ugb-notification__item': {
			'border-style': 'dashed',
			'border-top-width': '23px',
			'border-right-width': '23px',
			'border-bottom-width': '23px',
			'border-left-width': '23px',
		},
	} )

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
		cy.adjust( 'Icon Color Type', 'gradient' )
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
	cy.adjust( 'Paddings', 27, { viewport, unit: 'px' } ).assertComputedStyle( {
		'.ugb-notification__item': {
			'padding-top': '27px',
			'padding-bottom': '27px',
			'padding-right': '27px',
			'padding-left': '27px',
		},
	} )
	cy.adjust( 'Paddings', 8, { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-notification__item': {
			'padding-top': '8em',
			'padding-bottom': '8em',
			'padding-right': '8em',
			'padding-left': '8em',
		},
	} )
	cy.adjust( 'Paddings', 22, { viewport, unit: '%' } ).assertComputedStyle( {
		'.ugb-notification__item': {
			'padding-top': '22%',
			'padding-bottom': '22%',
			'padding-right': '22%',
			'padding-left': '22%',
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
		cy.adjust( 'Button Design', {
			label: 'Basic',
			value: 'basic',
		} )
		cy.adjust( 'Button Color Type', 'gradient' )
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
			.assertClassName( '.ugb-button', 'ugb--shadow-4' )
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

	// Test Block Background
	assertBlockBackground( '.ugb-notification', { viewport } )
}
