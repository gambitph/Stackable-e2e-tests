/**
 * External dependencies
 */
import { lowerCase } from 'lodash'
import {
	assertUrlPopover, assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, assertContainerLink, assertBlockTitleDescriptionContent, responsiveAssertHelper, assertAligns, assertBlockTitleDescription, assertBlockBackground, assertSeparators, assertTypography, assertContainer, assertAdvancedTab,
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

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/card' ).asBlock( 'cardBlock', { isStatic: true } )

		cy.typeBlock( 'ugb/card', '.ugb-card__title', 'Hello World! 1' )
			.assertBlockContent( '.ugb-card__title', 'Hello World! 1' )
		cy.typeBlock( 'ugb/card', '.ugb-card__subtitle', 'Helloo World!! 12' )
			.assertBlockContent( '.ugb-card__subtitle', 'Helloo World!! 12' )
		cy.typeBlock( 'ugb/card', '.ugb-card__description', 'Hellooo World!!! 123' )
			.assertBlockContent( '.ugb-card__description', 'Hellooo World!!! 123' )
		cy.typeBlock( 'ugb/card', '.ugb-button--inner', 'Helloooo World!!!! 1234' )
			.assertBlockContent( '.ugb-button--inner', 'Helloooo World!!!! 1234' )

		cy.openInspector( 'ugb/card', 'Style' )
		assertBlockTitleDescriptionContent( 'ugb/card' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/card' ).asBlock( 'cardBlock', { isStatic: true } )
		cy.openInspector( 'ugb/card', 'Style' )
		cy.collapse( 'General' )
		cy.adjust( 'Columns', 3 )
		cy.setBlockAttribute( {
			'image1Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
			'image2Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
			'image3Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
		} )
	} )

	afterEach( () => cy.assertFrontendStyles( '@cardBlock' ) )

	it( `should assert General options in ${ lowerCase( viewport ) }`, () => {
		cy.get( '.ugb-card__item3' ).should( 'exist' )
		assertAligns( 'Align', '.ugb-inner-block', { viewport } )
	} )

	it( `should assert Container options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Container' )
		assertContainer( '.ugb-card__item', { viewport }, 'column%sBackgroundMediaUrl' )
	} )

	it( `should assert Image options in ${ lowerCase( viewport ) }`, () => {
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
	} )

	it( `should assert Title options in ${ lowerCase( viewport ) }`, () => {
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
	} )

	it( `should assert Subtitle options in ${ lowerCase( viewport ) }`, () => {
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
	} )

	it( `should assert Description options in ${ lowerCase( viewport ) }`, () => {
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
	} )

	it( `should assert Button options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Button' )
		cy.waitFA()
		cy.adjust( 'Icon', 'info' )
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
			assertTypography( '.ugb-button .ugb-button--inner', { enableLineHeight: false } )
			cy.adjust( 'Button Size', 'large' )
				.assertClassName( '.ugb-button', 'ugb-button--size-large' )
			cy.adjust( 'Border Radius', 40 )
			cy.adjust( 'Vertical Padding', 15 )
			cy.adjust( 'Horizontal Padding', 43 )
			cy.adjust( 'Shadow', 4 )
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
	} )

	it( `should assert Effects options in ${ lowerCase( viewport ) }`, () => {
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
	} )

	it( `should assert Block Title & Description options in ${ lowerCase( viewport ) }`, () => {
		assertBlockTitleDescription( { viewport } )
	} )

	it( `should assert Spacing options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Spacing' )
		cy.adjust( 'Paddings', [ 25, 26, 27, 28 ], { viewport, unit: 'px' } ).assertComputedStyle( {
			'.ugb-card__content': {
				'padding-top': '25px',
				'padding-right': '26px',
				'padding-bottom': '27px',
				'padding-left': '28px',
			},
		} )
		cy.adjust( 'Paddings', [ 3, 4, 5, 6 ], { viewport, unit: 'em' } ).assertComputedStyle( {
			'.ugb-card__content': {
				'padding-top': '3em',
				'padding-right': '4em',
				'padding-bottom': '5em',
				'padding-left': '6em',
			},
		} )
		cy.adjust( 'Paddings', [ 17, 18, 19, 20 ], { viewport, unit: '%' } ).assertComputedStyle( {
			'.ugb-card__content': {
				'padding-top': '17%',
				'padding-right': '18%',
				'padding-bottom': '19%',
				'padding-left': '20%',
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
	} )

	it( `should assert Block Background options in ${ lowerCase( viewport ) }`, () => {
		assertBlockBackground( '.ugb-card', { viewport } )
	} )

	it( `should assert Top & Bottom Separator options in ${ lowerCase( viewport ) }`, () => {
		assertSeparators( { viewport } )
	} )
	it( `should assert Container Link options in ${ lowerCase( viewport ) }`, () => {
		assertContainerLink( '.ugb-card__item', { viewport } )
	} )
	it( `should assert button URL popover in ${ lowerCase( viewport ) }`, () => {
		assertUrlPopover( 'ugb/card', 0, {
			editorSelector: '.ugb-card__item%s .ugb-button',
			frontendSelector: '.ugb-card__item%s .ugb-button',
		}, { viewport } )
	} )
}

function advancedTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/card' ).asBlock( 'cardBlock', { isStatic: true } )

	cy.openInspector( 'ugb/card', 'Advanced' )

	assertAdvancedTab( '.ugb-card', {
		viewport,
		verticalAlignSelector: '.ugb-card__content',
		customCssSelectors: [
			'.ugb-card__title',
			'.ugb-card__subtitle',
			'.ugb-card__description',
			'.ugb-button',
			'.ugb-button--inner',
		],
		 } )

	// Add more block specific tests.
	cy.assertFrontendStyles( '@cardBlock' )
}
