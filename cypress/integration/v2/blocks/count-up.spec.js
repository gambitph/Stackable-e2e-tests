/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, responsiveAssertHelper, registerTests, assertAligns, assertBlockTitleDescription, assertBlockBackground, assertSeparators, assertTypography,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )

describe( 'Count Up Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/count-up', '.ugb-count-up' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/count-up' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/count-up', [
		'Plain',
		{ value: 'Plain 2', selector: '.ugb-countup--design-plain-2' },
		{ value: 'Side', selector: '.ugb-countup--design-side' },
		{ value: 'Abstract', selector: '.ugb-countup--design-abstract' },
		{ value: 'Boxed', selector: '.ugb-countup--design-boxed' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/count-up', [
		'Bean Count Up',
		'Capital Count Up',
		'Chic Count Up',
		'Elevate Count Up',
		'Glow Count Up',
		'Heights Count Up',
		'Lounge Count Up',
		'Lume Count Up',
		'Lush Count Up',
		'Propel Count Up 1',
		'Propel Count Up 2',
		'Speck Count Up',
		'Upland Count Up',
	] ) )
}

function styleTab( viewport, desktopOnly, registerBlockSnapshots ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/count-up' ).as( 'countUpBlock' )
	const countUpBlock = registerBlockSnapshots( 'countUpBlock' )
	cy.openInspector( 'ugb/count-up', 'Style' )

	cy.collapse( 'General' )
	desktopOnly( () => {
		cy.adjust( 'Columns', 4 )
			.assertClassName( '.ugb-count-up', 'ugb-countup--columns-4' )
	} )

	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	cy.collapse( 'Icon' )
	cy.toggleStyle( 'Icon' )
	cy.waitFA()
	cy.adjust( 'Icon #1', 'info' )
	cy.adjust( 'Icon #2', 'info' )

	desktopOnly( () => {
		cy.adjust( 'Color Type', 'single' )
		cy.adjust( 'Icon Color', '#d77777' ).assertComputedStyle( {
			'.ugb-icon-inner-svg': {
				'color': '#d77777',
			},
		} )
		cy.adjust( 'Color Type', 'gradient' )
		cy.adjust( 'Icon Color #1', '#8f8f8f' )
		cy.adjust( 'Icon Color #2', '#a43333' )
		cy.adjust( 'Gradient Direction (degrees)', 135 ).assertComputedStyle( {
			'.ugb-icon-inner-svg svg': {
				'fill': 'url("#grad-8f8f8f-a43333-135")',
			},
		} )
	} )

	cy.adjust( 'Icon Size', 52, { viewport } ).assertComputedStyle( {
		'.ugb-icon-inner-svg svg': {
			'width': '52px',
			'height': '52px',
		},
	} )

	desktopOnly( () => {
		cy.adjust( 'Icon Opacity', 0.7 )
		cy.adjust( 'Icon Rotation', 48 ).assertComputedStyle( {
			'.ugb-countup__icon': {
				'opacity': '0.7',
			},
			'.ugb-icon-inner-svg': {
				'transform': 'matrix(0.669131, 0.743145, -0.743145, 0.669131, 0, 0)',
			},
		} )
		cy.adjust( 'Background Shape', true )
		cy.adjust( 'Shape Color', '#000000' )
		cy.adjust( 'Shape Opacity', 0.8 )
		cy.adjust( 'Shape Size', 1.2 )
		cy.adjust( 'Horizontal Offset', 6 )
		cy.adjust( 'Vertical Offset', 1 ).assertComputedStyle( {
			'.ugb-icon__bg-shape': {
				'fill': '#000000',
				'color': '#000000',
				'opacity': '0.8',
				'transform': 'matrix(1.2, 0, 0, 1.2, -17.8, -23.8)',
			},
		} )
	} )

	cy.adjust( 'Align', 'left', { viewport } ).assertComputedStyle( {
		'.ugb-countup__icon': {
			'margin-left': '0px',
			'margin-right': 'auto',
		},
	} )
	cy.adjust( 'Align', 'center', { viewport } ).assertComputedStyle( {
		'.ugb-countup__icon': {
			'margin-right': 'auto',
			'margin-left': 'auto',
		},
	} )
	cy.adjust( 'Align', 'right', { viewport } ).assertComputedStyle( {
		'.ugb-countup__icon': {
			'margin-right': '0px',
			'margin-left': 'auto',
		},
	} )

	cy.collapse( 'Spacing' )
	desktopOnly( () => {
		cy.adjust( 'Paddings', [ 166, 268, 87, 181 ], { unit: 'px' } ).assertComputedStyle( {
			'.ugb-countup__item': {
				'padding-top': '166px',
				'padding-bottom': '87px',
				'padding-right': '268px',
				'padding-left': '181px',
			},
		} )
		cy.adjust( 'Paddings', [ 12, 4, 18, 3 ], { unit: 'em' } ).assertComputedStyle( {
			'.ugb-countup__item': {
				'padding-top': '12em',
				'padding-bottom': '18em',
				'padding-right': '4em',
				'padding-left': '3em',
			},
		} )
		cy.adjust( 'Paddings', [ 10, 11, 12, 13 ], { unit: '%' } ).assertComputedStyle( {
			'.ugb-countup__item': {
				'padding-top': '10%',
				'padding-bottom': '12%',
				'padding-right': '11%',
				'padding-left': '13%',
			},
		} )
	} )
	const tabletMobileViewports = [ 'Tablet', 'Mobile' ]
	if ( tabletMobileViewports.some( _viewport => _viewport === viewport ) ) {
		cy.adjust( 'Paddings', [ 24, 12, 13, 8 ], { unit: 'px', viewport } ).assertComputedStyle( {
			'.ugb-countup__item': {
				'padding-top': '24px',
				'padding-bottom': '12px',
				'padding-right': '13px',
				'padding-left': '8px',
			},
		} )
		cy.adjust( 'Paddings', [ 12, 4, 10, 3 ], { unit: 'em', viewport } ).assertComputedStyle( {
			'.ugb-countup__item': {
				'padding-top': '12em',
				'padding-bottom': '4em',
				'padding-right': '10em',
				'padding-left': '3em',
			},
		} )
		cy.adjust( 'Paddings', [ 10, 11, 12, 13 ], { unit: '%', viewport } ).assertComputedStyle( {
			'.ugb-countup__item': {
				'padding-top': '10%',
				'padding-bottom': '11%',
				'padding-right': '12%',
				'padding-left': '13%',
			},
		} )
	}

	cy.adjust( 'Icon', 7, { viewport } ).assertComputedStyle( {
		'.ugb-countup__icon': {
			'margin-bottom': '7px',
		},
	} )

	cy.adjust( 'Title', 21, { viewport } ).assertComputedStyle( {
		'.ugb-countup__title': {
			'margin-bottom': '21px',
		},
	} )

	cy.adjust( 'Number', 18, { viewport } ).assertComputedStyle( {
		'.ugb-countup__counter': {
			'margin-bottom': '18px',
		},
	} )

	cy.adjust( 'Description', 9, { viewport } ).assertComputedStyle( {
		'.ugb-countup__description': {
			'margin-bottom': '9px',
		},
	} )

	cy.collapse( 'Title' )

	desktopOnly( () => {
		cy.adjust( 'Title HTML Tag', 'h6' )
			.assertHtmlTag( '.ugb-countup__title', 'h6' )
		cy.adjust( 'Title Color', '#dc6b6b' ).assertComputedStyle( {
			'.ugb-countup__title': {
				'color': '#dc6b6b',
			},
		} )
	} )
	assertTypography( '.ugb-countup__title', { viewport } )
	assertAligns( 'Align', '.ugb-countup__title', { viewport } )

	cy.collapse( 'Number' )

	desktopOnly( () => {
		cy.adjust( 'Number Color', '#dc6b6b' ).assertComputedStyle( {
			'.ugb-countup__counter': {
				'color': '#dc6b6b',
			},
		} )
	} )
	assertTypography( '.ugb-countup__counter', { viewport } )
	assertAligns( 'Align', '.ugb-countup__counter', { viewport } )

	cy.collapse( 'Description' )

	desktopOnly( () => {
		cy.adjust( 'Description Color', '#dc6b6b' ).assertComputedStyle( {
			'.ugb-countup__description': {
				'color': '#dc6b6b',
			},
		} )
	} )
	assertTypography( '.ugb-countup__description', { viewport } )
	assertAligns( 'Align', '.ugb-countup__description', { viewport } )

	assertBlockTitleDescription( { viewport } )
	assertBlockBackground( '.ugb-count-up', { viewport } )
	assertSeparators( { viewport } )
	countUpBlock.assertFrontendStyles()
}
