/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, assertAligns, assertBlockBackground, assertSeparators, responsiveAssertHelper, assertTypography, assertContainer, assertAdvancedTab,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Header', registerTests( [
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
	it( 'should show the block', assertBlockExist( 'ugb/header', '.ugb-header' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/header' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/header', [
		{ value: 'Basic', selector: '.ugb-header--design-basic' },
		{ value: 'Plain', selector: '.ugb-header--design-plain' },
		{ value: 'Half Overlay', selector: '.ugb-header--design-half-overlay' },
		{ value: 'Center Overlay', selector: '.ugb-header--design-center-overlay' },
		{ value: 'Side Overlay', selector: '.ugb-header--design-side-overlay' },
		{ value: 'Half', selector: '.ugb-header--design-half' },
		{ value: 'Huge', selector: '.ugb-header--design-huge' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/header', [
		'Angled Header',
		'Arch Header 1',
		'Arch Header 2',
		'Aspire Header',
		'Aurora Header',
		'Bean Header',
		'Capital Header',
		'Cary Header',
		'Chic Header',
		'Dare Header',
		'Decora Header',
		'Detour Header',
		'Devour Header',
		'Dim Header',
		'Dustin Header',
		'Elevate Header',
		'Flex Header 1',
		'Flex Header 2',
		'Glow Header',
		'Heights Header',
		'Hue Header',
		'Lounge Header',
		'Lume Header',
		'Lush Header',
		'Peplum Header',
		'Prime Header',
		'Proact Header',
		'Propel Header 1',
		'Propel Header 2',
		'Seren Header',
		'Speck Header',
		'Upland Header',
		'Yule Header',
	] ) )
}

function styleTab( viewport, desktopOnly, registerBlockSnapshots ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/header' ).as( 'headerBlock' )
	const headerBlock = registerBlockSnapshots( 'headerBlock' )
	cy.openInspector( 'ugb/header', 'Style' )

	cy.collapse( 'General' )
	desktopOnly( () => {
		cy.adjust( 'Full Height', true )
			.assertClassName( '.ugb-header__item', 'ugb--full-height' )
	} )
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	cy.collapse( 'Container' )
	assertContainer( '.ugb-header__item', { viewport }, 'column%sBackgroundMediaUrl' )

	cy.collapse( 'Spacing' )
	desktopOnly( () => {
		cy.adjust( 'Paddings', [ 166, 268, 87, 181 ], { unit: 'px' } ).assertComputedStyle( {
			'.ugb-header__item': {
				'padding-top': '166px',
				'padding-bottom': '87px',
				'padding-right': '268px',
				'padding-left': '181px',
			},
		} )

		cy.adjust( 'Paddings', [ 12, 4, 18, 3 ], { unit: 'em' } ).assertComputedStyle( {
			'.ugb-header__item': {
				'padding-top': '12em',
				'padding-bottom': '18em',
				'padding-right': '4em',
				'padding-left': '3em',
			},
		} )

		cy.adjust( 'Paddings', [ 24, 12, 34, 21 ], { unit: '%' } ).assertComputedStyle( {
			'.ugb-header__item': {
				'padding-top': '24%',
				'padding-bottom': '34%',
				'padding-right': '12%',
				'padding-left': '21%',
			},
		} )
	} )

	const tabletMobileViewports = [ 'Tablet', 'Mobile' ]
	if ( tabletMobileViewports.some( _viewport => _viewport === viewport ) ) {
		cy.adjust( 'Paddings', [ 24, 12, 13, 8 ], { unit: 'px', viewport } ).assertComputedStyle( {
			'.ugb-header__item': {
				'padding-top': '24px',
				'padding-bottom': '12px',
				'padding-right': '13px',
				'padding-left': '8px',
			},
		} )

		cy.adjust( 'Paddings', [ 12, 4, 10, 3 ], { unit: 'em', viewport } ).assertComputedStyle( {
			'.ugb-header__item': {
				'padding-top': '12em',
				'padding-bottom': '4em',
				'padding-right': '10em',
				'padding-left': '3em',
			},
		} )

		cy.adjust( 'Paddings', [ 24, 12, 12, 21 ], { unit: '%', viewport } ).assertComputedStyle( {
			'.ugb-header__item': {
				'padding-top': '24%',
				'padding-bottom': '12%',
				'padding-right': '12%',
				'padding-left': '21%',
			},
		} )
	}

	cy.adjust( 'Title', 42, { viewport } )
	cy.adjust( 'Subtitle', 21, { viewport } )
	cy.adjust( 'Button', 43, { viewport } ).assertComputedStyle( {
		'.ugb-header__title': {
			'margin-bottom': '42px',
		},
		'.ugb-header__subtitle': {
			'margin-bottom': '21px',
		},
		'.ugb-button-container': {
			'margin-bottom': '43px',
		},
	} )

	cy.collapse( 'Title' )
	cy.toggleStyle( 'Title' )
	desktopOnly( () => {
		cy.adjust( 'Title HTML Tag', 'h4' )
			.assertHtmlTag( '.ugb-header__title', 'h4' )
		cy.adjust( 'Title Color', '#742f2f' ).assertComputedStyle( {
			'.ugb-header__title': {
				'color': '#742f2f',
			},
		} )
	} )
	assertTypography( '.ugb-header__title', { viewport } )
	assertAligns( 'Align', '.ugb-header__title', { viewport } )

	cy.collapse( 'Subtitle' )
	cy.toggleStyle( 'Subtitle' )
	desktopOnly( () => {
		cy.adjust( 'Subtitle Color', '#742f2f' ).assertComputedStyle( {
			'.ugb-header__subtitle': {
				'color': '#742f2f',
			},
		} )
	} )
	assertTypography( '.ugb-header__subtitle', { viewport } )
	assertAligns( 'Align', '.ugb-header__subtitle', { viewport } )

	cy.typeBlock( 'ugb/header', '.ugb-button1 .ugb-button--inner', 'Button 1' )
	cy.collapse( 'Button #1' )
	cy.toggleStyle( 'Button #1' )
	desktopOnly( () => {
		cy.adjust( 'Color Type', 'gradient' )
		cy.adjust( 'Button Color #1', '#a13939' )
		cy.adjust( 'Button Color #2', '#4e59d4' )
		cy.adjust( 'Gradient Direction (degrees)', 138 )
		cy.adjust( 'Text Color', '#ffa03b' )
		cy.adjust( 'Hover Effect', 'scale' )
			.assertClassName( '.ugb-button1', 'ugb--hover-effect-scale' )
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
			.assertClassName( '.ugb-button1', 'ugb-button--size-large' )
		cy.adjust( 'Border Radius', 40 )
		cy.adjust( 'Vertical Padding', 15 )
		cy.adjust( 'Horizontal Padding', 43 )
		cy.adjust( 'Shadow', 4 )
		cy.adjust( 'Opacity', 0.6 ).assertComputedStyle( {
			'.ugb-button1 .ugb-button--inner': {
				'font-size': '50px',
				'font-weight': '700',
				'text-transform': 'lowercase',
				'letter-spacing': '2.9px',
			},
			'.ugb-button1': {
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
			'.ugb-button1 .ugb-button--inner': {
				'font-size': '7em',
			},
		} )
		cy.waitFA()
		cy.adjust( 'Icon', 'info' )
		cy.adjust( 'Adv. Icon Settings', {
			'Icon Size': 41,
			'Icon Spacing': 25,
		} ).assertComputedStyle( {
			'.ugb-button1 svg': {
				'height': '41px',
				'width': '41px',
				'margin-right': '25px',
			},
		} )
	} )

	if ( tabletMobileViewports.some( _viewport => _viewport === viewport ) ) {
		cy.adjust( 'Typography', {
			'Size': {
				viewport,
				value: 50,
			},
		} ).assertComputedStyle( {
			'.ugb-button1 .ugb-button--inner': {
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
			'.ugb-button1 .ugb-button--inner': {
				'font-size': '7em',
			},
		} )
	}

	cy.collapse( 'Button #2' )
	cy.toggleStyle( 'Button #2' )
	cy.typeBlock( 'ugb/header', '.ugb-button2 .ugb-button--inner', 'Button 2' )
	desktopOnly( () => {
		cy.adjust( 'Color Type', 'gradient' )
		cy.adjust( 'Button Color #1', '#a13939' )
		cy.adjust( 'Button Color #2', '#4e59d4' )
		cy.adjust( 'Gradient Direction (degrees)', 138 )
		cy.adjust( 'Text Color', '#ffa03b' )
		cy.adjust( 'Hover Effect', 'scale' )
			.assertClassName( '.ugb-button2', 'ugb--hover-effect-scale' )
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
			.assertClassName( '.ugb-button2', 'ugb-button--size-large' )
		cy.adjust( 'Border Radius', 40 )
		cy.adjust( 'Vertical Padding', 15 )
		cy.adjust( 'Horizontal Padding', 43 )
		cy.adjust( 'Shadow', 4 )
		cy.adjust( 'Opacity', 0.6 ).assertComputedStyle( {
			'.ugb-button2 .ugb-button--inner': {
				'font-size': '50px',
				'font-weight': '700',
				'text-transform': 'lowercase',
				'letter-spacing': '2.9px',
			},
			'.ugb-button2': {
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
			'.ugb-button2 .ugb-button--inner': {
				'font-size': '7em',
			},
		} )
		cy.waitFA()
		cy.adjust( 'Icon', 'info' )
		cy.adjust( 'Adv. Icon Settings', {
			'Icon Size': 41,
			'Icon Spacing': 25,
		} ).assertComputedStyle( {
			'.ugb-button2 svg': {
				'height': '41px',
				'width': '41px',
				'margin-right': '25px',
			},
		} )
	} )

	if ( tabletMobileViewports.some( _viewport => _viewport === viewport ) ) {
		cy.adjust( 'Typography', {
			'Size': {
				viewport,
				value: 50,
			},
		} ).assertComputedStyle( {
			'.ugb-button2 .ugb-button--inner': {
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
			'.ugb-button2 .ugb-button--inner': {
				'font-size': '7em',
			},
		} )
	}

	cy.adjust( 'Align', 'left', { viewport } ).assertComputedStyle( {
		'.ugb-header__buttons': {
			'justify-content': 'flex-start',
		},
	} )
	cy.adjust( 'Align', 'center', { viewport } ).assertComputedStyle( {
		'.ugb-header__buttons': {
			'justify-content': 'center',
		},
	} )
	cy.adjust( 'Align', 'right', { viewport } ).assertComputedStyle( {
		'.ugb-header__buttons': {
			'justify-content': 'flex-end',
		},
	} )

	assertBlockBackground( '.ugb-header', { viewport } )
	assertSeparators( { viewport } )
	headerBlock.assertFrontendStyles()
}

function advancedTab( viewport, desktopOnly, registerBlockSnapshots ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/header' ).as( 'headerBlock' )
	const headerBlock = registerBlockSnapshots( 'headerBlock' )

	cy.openInspector( 'ugb/header', 'Advanced' )

	assertAdvancedTab( '.ugb-header', { viewport } )

	// Add more block specific tests.
	headerBlock.assertFrontendStyles()
}
