/**
 * External dependencies
 */
import { lowerCase } from 'lodash'
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, assertContainerLink, responsiveAssertHelper, assertBlockTitleDescriptionContent, assertAligns, assertBlockTitleDescription, assertBlockBackground, assertSeparators, assertTypography, assertAdvancedTab,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

export {
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
}

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

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/count-up' ).asBlock( 'countUpBlock', { isStatic: true } )

		cy.typeBlock( 'ugb/count-up', '.ugb-countup__title', 'Hello World! 1' )
			.assertBlockContent( '.ugb-countup__title', 'Hello World! 1' )
		cy.typeBlock( 'ugb/count-up', '.ugb-countup__counter', '1234' )
			.assertBlockContent( '.ugb-countup__counter', '1234' )
		cy.typeBlock( 'ugb/count-up', '.ugb-countup__description', 'Helloo World!! 12' )
			.assertBlockContent( '.ugb-countup__description', 'Helloo World!! 12' )

		cy.openInspector( 'ugb/count-up', 'Style' )
		assertBlockTitleDescriptionContent( 'ugb/count-up' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/count-up' ).asBlock( 'countUpBlock', { isStatic: true } )
		cy.openInspector( 'ugb/count-up', 'Style' )
		cy.collapse( 'General' )
		cy.adjust( 'Columns', 2 )
	} )

	// eslint-disable-next-line no-undef
	afterEach( () => cy.assertFrontendStyles( '@countUpBlock' ) )

	it( `should assert General options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'General' )
		desktopOnly( () => {
			cy.adjust( 'Columns', 4 )
			cy.get( '.ugb-countup__item4' ).should( 'exist' )
			cy.adjust( 'Columns', 2 )
		} )
		assertAligns( 'Align', '.ugb-inner-block', { viewport } )
	} )

	it( `should assert Icon options in ${ lowerCase( viewport ) }`, () => {
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
	} )

	it( `should assert Spacing options in ${ lowerCase( viewport ) }`, () => {
		cy.toggleStyle( 'Icon' )
		cy.collapse( 'Spacing' )
		cy.adjust( 'Paddings', [ 25, 26, 27, 28 ], { viewport, unit: 'px' } ).assertComputedStyle( {
			'.ugb-countup__item': {
				'padding-top': '25px',
				'padding-right': '26px',
				'padding-bottom': '27px',
				'padding-left': '28px',
			},
		} )
		cy.resetStyle( 'Paddings' )
		cy.adjust( 'Paddings', [ 3, 4, 5, 6 ], { viewport, unit: 'em' } ).assertComputedStyle( {
			'.ugb-countup__item': {
				'padding-top': '3em',
				'padding-right': '4em',
				'padding-bottom': '5em',
				'padding-left': '6em',
			},
		} )
		cy.resetStyle( 'Paddings' )
		cy.adjust( 'Paddings', [ 17, 18, 19, 20 ], { viewport, unit: '%' } ).assertComputedStyle( {
			'.ugb-countup__item': {
				'padding-top': '17%',
				'padding-right': '18%',
				'padding-bottom': '19%',
				'padding-left': '20%',
			},
		} )

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
	} )

	it( `should assert Title options in ${ lowerCase( viewport ) }`, () => {
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
	} )

	it( `should assert Number options in ${ lowerCase( viewport ) }`, () => {
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
	} )

	it( `should assert Description options in ${ lowerCase( viewport ) }`, () => {
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
	} )

	it( `should assert Block Title & Description options in ${ lowerCase( viewport ) }`, () => {
		assertBlockTitleDescription( { viewport } )
	} )

	it( `should assert Block Background options in ${ lowerCase( viewport ) }`, () => {
		assertBlockBackground( '.ugb-count-up', { viewport } )
	} )

	it( `should assert Top & Bottom Separator options in ${ lowerCase( viewport ) }`, () => {
		assertSeparators( { viewport } )
	} )

	it( `should assert Container Link options in ${ lowerCase( viewport ) }`, () => {
		assertContainerLink( '.ugb-countup__item', { viewport } )
	} )
}

function advancedTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/count-up' ).asBlock( 'countUpBlock', { isStatic: true } )

	cy.openInspector( 'ugb/count-up', 'Advanced' )

	assertAdvancedTab( '.ugb-count-up', {
		viewport,
		customCssSelectors: [
			'.ugb-countup__item',
			'.ugb-countup__title',
			'.ugb-countup__counter',
			'.ugb-countup__description',
		],
	} )

	// Add more block specific tests.
	cy.assertFrontendStyles( '@countUpBlock' )
}
