/**
 * External dependencies
 */
import { lowerCase } from 'lodash'
import {
	assertUgbButtons, assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, assertContainerLink, assertAligns, assertBlockBackground, assertSeparators, responsiveAssertHelper, assertTypography, assertContainer, assertAdvancedTab,
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

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/header' ).asBlock( 'headerBlock', { isStatic: true } )

		cy.typeBlock( 'ugb/header', '.ugb-header__title', 'Hello World! 1' )
			.assertBlockContent( '.ugb-header__title', 'Hello World! 1' )
		cy.typeBlock( 'ugb/header', '.ugb-header__subtitle', 'Helloo World!! 12' )
			.assertBlockContent( '.ugb-header__subtitle', 'Helloo World!! 12' )
		cy.typeBlock( 'ugb/header', '.ugb-button--inner', 'Hellooo World!!! 123' )
			.assertBlockContent( '.ugb-button--inner', 'Hellooo World!!! 123' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/header' ).asBlock( 'headerBlock', { isStatic: true } )
		cy.openInspector( 'ugb/header', 'Style' )
	} )

	afterEach( () => cy.assertFrontendStyles( '@headerBlock' ) )

	it( `should assert General options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'General' )
		desktopOnly( () => {
			cy.adjust( 'Full Height', true )
				.assertClassName( '.ugb-header__item', 'ugb--full-height' )
		} )
		assertAligns( 'Align', '.ugb-inner-block', { viewport } )
	} )

	it( `should assert Container options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Container' )
		assertContainer( '.ugb-header__item', { viewport }, 'column%sBackgroundMediaUrl' )
	} )

	it( `should assert Spacing options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Spacing' )
		cy.adjust( 'Paddings', [ 25, 26, 27, 28 ], { viewport, unit: 'px' } ).assertComputedStyle( {
			'.ugb-header__item': {
				'padding-top': '25px',
				'padding-right': '26px',
				'padding-bottom': '27px',
				'padding-left': '28px',
			},
		} )
		cy.resetStyle( 'Paddings', { viewport } )
		cy.adjust( 'Paddings', [ 3, 4, 5, 6 ], { viewport, unit: 'em' } ).assertComputedStyle( {
			'.ugb-header__item': {
				'padding-top': '3em',
				'padding-right': '4em',
				'padding-bottom': '5em',
				'padding-left': '6em',
			},
		} )
		cy.resetStyle( 'Paddings', { viewport } )
		cy.adjust( 'Paddings', [ 17, 18, 19, 20 ], { viewport, unit: '%' } ).assertComputedStyle( {
			'.ugb-header__item': {
				'padding-top': '17%',
				'padding-right': '18%',
				'padding-bottom': '19%',
				'padding-left': '20%',
			},
		} )

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
	} )

	it( `should assert Title options in ${ lowerCase( viewport ) }`, () => {
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
	} )

	it( `should assert Subtitle options in ${ lowerCase( viewport ) }`, () => {
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
	} )

	it( `should assert Button 1 options in ${ lowerCase( viewport ) }`, () => {
		cy.typeBlock( 'ugb/header', '.ugb-button1 .ugb-button--inner', 'Button 1' )
		cy.collapse( 'Button #1' )
		cy.toggleStyle( 'Button #1' )
		desktopOnly( () => {
			cy.adjust( 'Link / URL', 'https://www.google.com/' ).assertHtmlAttribute( '.ugb-button1', 'href', 'https://www.google.com/', { assertBackend: false } )
			cy.adjust( 'Open link in new tab', true ).assertHtmlAttribute( '.ugb-button1', 'rel', /noopener noreferrer/, { assertBackend: false } )
			cy.adjust( 'Nofollow link', true ).assertHtmlAttribute( '.ugb-button1', 'rel', /nofollow/, { assertBackend: false } )
			cy.adjust( 'Sponsored', true ).assertHtmlAttribute( '.ugb-button1', 'rel', /sponsored/, { assertBackend: false } )
			cy.adjust( 'UGC', true ).assertHtmlAttribute( '.ugb-button1', 'rel', /ugc/, { assertBackend: false } )
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

			assertTypography( '.ugb-button1 .ugb-button--inner', { enableLineHeight: false } )
			cy.adjust( 'Button Size', 'large' )
				.assertClassName( '.ugb-button1', 'ugb-button--size-large' )
			cy.adjust( 'Border Radius', 40 )
			cy.adjust( 'Vertical Padding', 15 )
			cy.adjust( 'Horizontal Padding', 43 )
			cy.adjust( 'Shadow', 4 )
			cy.adjust( 'Opacity', 0.6 ).assertComputedStyle( {
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

		if ( viewport !== 'Desktop' ) {
			assertTypography( '.ugb-button1 .ugb-button--inner', {
				viewport,
				enableWeight: false,
				enableTransform: false,
				enableLineHeight: false,
				enableLetterSpacing: false,
			} )
		}
	} )

	it( `should assert Button 2 options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Button #2' )
		cy.toggleStyle( 'Button #2' )
		cy.typeBlock( 'ugb/header', '.ugb-button2 .ugb-button--inner', 'Button 2' )
		desktopOnly( () => {
			cy.adjust( 'Link / URL', 'https://www.google.com/' ).assertHtmlAttribute( '.ugb-button2', 'href', 'https://www.google.com/', { assertBackend: false } )
			cy.adjust( 'Open link in new tab', true ).assertHtmlAttribute( '.ugb-button2', 'rel', /noopener noreferrer/, { assertBackend: false } )
			cy.adjust( 'Nofollow link', true ).assertHtmlAttribute( '.ugb-button2', 'rel', /nofollow/, { assertBackend: false } )
			cy.adjust( 'Sponsored', true ).assertHtmlAttribute( '.ugb-button2', 'rel', /sponsored/, { assertBackend: false } )
			cy.adjust( 'UGC', true ).assertHtmlAttribute( '.ugb-button2', 'rel', /ugc/, { assertBackend: false } )
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
			assertTypography( '.ugb-button2 .ugb-button--inner', { enableLineHeight: false } )
			cy.adjust( 'Button Size', 'large' )
				.assertClassName( '.ugb-button2', 'ugb-button--size-large' )
			cy.adjust( 'Border Radius', 40 )
			cy.adjust( 'Vertical Padding', 15 )
			cy.adjust( 'Horizontal Padding', 43 )
			cy.adjust( 'Shadow', 4 )
			cy.adjust( 'Opacity', 0.6 ).assertComputedStyle( {
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

		if ( viewport !== 'Desktop' ) {
			assertTypography( '.ugb-button2 .ugb-button--inner', {
				viewport,
				enableWeight: false,
				enableTransform: false,
				enableLineHeight: false,
				enableLetterSpacing: false,
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
	} )

	it( `should assert Block Background options in ${ lowerCase( viewport ) }`, () => {
		assertBlockBackground( '.ugb-header', { viewport } )
	} )

	it( `should assert Top & Bottom Separator options in ${ lowerCase( viewport ) }`, () => {
		assertSeparators( { viewport } )
	} )

	it( `should assert Container Link options in ${ lowerCase( viewport ) }`, () => {
		assertContainerLink( '.ugb-header__item', { viewport } )
	} )

	it( `should assert button URL popover in ${ lowerCase( viewport ) }`, () => {
		cy.toggleStyle( 'Button #2' )
		assertUgbButtons( 'ugb/header', 0, {
			editorSelector: '.ugb-header__item .ugb-button%s',
			frontendSelector: '.ugb-header__item .ugb-button%s',
			viewport,
		} )
	} )
}

function advancedTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/header' ).asBlock( 'headerBlock', { isStatic: true } )
	cy.openInspector( 'ugb/header', 'Advanced' )

	assertAdvancedTab( '.ugb-header', {
		viewport,
		customCssSelectors: [
			'.ugb-header__title',
			'.ugb-header__subtitle',
			'.ugb-header__buttons > div:nth-child(1) .ugb-button',
			'.ugb-header__buttons > div:nth-child(1) .ugb-button--inner',
		],
	} )

	// Add more block specific tests.
	cy.assertFrontendStyles( '@headerBlock' )
}
