/**
 * External dependencies
 */
import { lowerCase, range } from 'lodash'
import {
	assertUrlPopover, assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, responsiveAssertHelper, assertBlockTitleDescriptionContent, assertAligns, assertTypography, assertBlockTitleDescription, assertBlockBackground, assertSeparators, assertAdvancedTab,
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
	it( 'should show the block', assertBlockExist( 'ugb/image-box', '.ugb-image-box' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/image-box' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/image-box', [
		{ value: 'Basic', selector: '.ugb-image-box--design-basic' },
		{ value: 'Plain', selector: '.ugb-image-box--design-plain' },
		{ value: 'Box', selector: '.ugb-image-box--design-box' },
		{ value: 'Captioned', selector: '.ugb-image-box--design-captioned' },
		{ value: 'Fade', selector: '.ugb-image-box--design-fade' },
		{ value: 'Line', selector: '.ugb-image-box--design-line' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/image-box', [
		'Aspire Image Box',
		'Aurora Image Box',
		'Bean Image Box',
		'Cary Image Box',
		'Dare Image Box',
		'Detour Image Box',
		'Devour Image Box',
		'Dim Image Box',
		'Elevate Image Box',
		'Flex Image Box 1',
		'Flex Image Box 2',
		'Glow Image Box',
		'Lume Image Box 1',
		'Lume Image Box 2',
		'Lush Image Box 1',
		'Lush Image Box 2',
		'Peplum Image Box',
		'Proact Image Box',
		'Upland Image Box 1',
		'Upland Image Box 2',
	] ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/image-box' ).asBlock( 'imageBoxBlock', { isStatic: true } )

		cy.typeBlock( 'ugb/image-box', '.ugb-image-box__subtitle', 'Hello World! 1' )
			.assertBlockContent( '.ugb-image-box__subtitle', 'Hello World! 1' )
		cy.typeBlock( 'ugb/image-box', '.ugb-image-box__title', 'Helloo World!! 12' )
			.assertBlockContent( '.ugb-image-box__title', 'Helloo World!! 12' )
		cy.typeBlock( 'ugb/image-box', '.ugb-image-box__description', 'Hellooo World!!! 123' )
			.assertBlockContent( '.ugb-image-box__description', 'Hellooo World!!! 123' )

		cy.openInspector( 'ugb/image-box', 'Style' )
		assertBlockTitleDescriptionContent( 'ugb/image-box' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/image-box' ).asBlock( 'imageBoxBlock', { isStatic: true } )
		cy.openInspector( 'ugb/image-box', 'Style' )
		cy.setBlockAttribute( {
			'image1Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
			'image2Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
			'image3Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
		} )
	} )

	afterEach( () => cy.assertFrontendStyles( '@imageBoxBlock' ) )

	it( `should assert General options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'General' )
		desktopOnly( () => {
			range( 1, 5 ).forEach( idx => {
				cy.adjust( 'Columns', idx )
				cy.get( `.ugb-image-box__item${ idx }` ).should( 'exist' )
			} )
			cy.adjust( 'Columns', 3 )
		} )

		cy.adjust( 'Height', 287, { viewport } ).assertComputedStyle( {
			'.ugb-image-box__item': {
				'height': '287px',
			},
		} )

		cy.adjust( 'Borders', 'solid' )
		desktopOnly( () => {
			cy.adjust( 'Border Color', '#ff0000' )
			cy.adjust( 'Border Radius', 31 ).assertComputedStyle( {
				'.ugb-image-box__box': {
					'border-radius': '31px',
				},
				'.ugb-image-box__item': {
					'border-style': 'solid',
					'border-color': '#ff0000',
				},
			} )
			cy.adjust( 'Shadow / Outline', 9 )
				.assertClassName( '.ugb-image-box__item', 'ugb--shadow-9' )
		} )
		cy.adjust( 'Border Width', 9, { viewport } ).assertComputedStyle( {
			'.ugb-image-box__item': {
				'border-top-width': '9px',
				'border-right-width': '9px',
				'border-bottom-width': '9px',
				'border-left-width': '9px',
			},
		} )

		const aligns = [ 'flex-start', 'center', 'flex-end' ]
		aligns.forEach( align => {
			cy.adjust( 'Content Vertical Align', align, { viewport } ).assertComputedStyle( {
				'.ugb-block-content > *': {
					'justify-content': align,
				},
				'.ugb-image-box__item': {
					'justify-content': align,
				},
			} )
		} )

		assertAligns( 'Align', '.ugb-inner-block', { viewport } )
	} )

	it( `should assert Image options in ${ lowerCase( viewport ) }`, () => {
		desktopOnly( () => {
			cy.collapse( 'Image' )
			// TODO: Image Size assertion
			cy.adjust( 'Background Image Position', 'center center' )
			cy.adjust( 'Background Image Repeat', 'repeat-x' )
			cy.adjust( 'Background Image Size', 'custom' )
			cy.adjust( 'Custom Size', 226, { unit: 'px' } ).assertComputedStyle( {
				'.ugb-image-box__image': {
					'background-position': '50% 50%',
					'background-repeat': 'repeat-x',
					'background-size': '226px',
				},
			} )
			cy.adjust( 'Background Image Size', 'custom' )
			cy.adjust( 'Custom Size', 83, { unit: '%' } ).assertComputedStyle( {
				'.ugb-image-box__image': {
					'background-size': '83%',
				},
			} )
		} )
	} )

	it( `should assert Overlay Color options in ${ lowerCase( viewport ) }`, () => {
		desktopOnly( () => {
			cy.collapse( 'Overlay Color' )
			cy.toggleStyle( 'Overlay Color' )
			cy.adjust( 'Color Type', 'single' )
			cy.adjust( 'Overlay Color', '#b2b2b2' )
			cy.adjust( 'Opacity', 0.3 ).assertComputedStyle( {
				'.ugb-image-box__overlay': {
					'background-color': '#b2b2b2',
					'opacity': '0.3',
				},
			} )

			cy.adjust( 'Color Type', 'gradient' )
			cy.adjust( 'Overlay Color #1', '#a36868' )
			cy.adjust( 'Overlay Color #2', '#4581a0' )
			cy.adjust( 'Adv. Gradient Color Settings', {
				'Gradient Direction (degrees)': 135,
				'Color 1 Location': 61,
				'Color 2 Location': 25,
				'Background Gradient Blend Mode': 'multiply',
			} ).assertComputedStyle( {
				'.ugb-image-box__overlay': {
					'background-image': 'linear-gradient(135deg, #a36868 61%, #4581a0 25%)',
					'mix-blend-mode': 'multiply',
				},
			} )
		} )
	} )

	it( `should assert Overlay Hover Color options in ${ lowerCase( viewport ) }`, () => {
		desktopOnly( () => {
			cy.collapse( 'Overlay Hover Color' )
			cy.adjust( 'Color Type', 'single' )
			cy.adjust( 'Overlay Color', '#5959ba' )
			cy.adjust( 'Opacity', 0.4 ).assertComputedStyle( {
				'.ugb-image-box__overlay-hover': {
					'background-color': '#5959ba',
				},
			} )

			cy.adjust( 'Color Type', 'gradient' )
			cy.adjust( 'Overlay Color #1', '#a36868' )
			cy.adjust( 'Overlay Color #2', '#4581a0' )
			cy.adjust( 'Adv. Gradient Color Settings', {
				'Gradient Direction (degrees)': 135,
				'Color 1 Location': 61,
				'Color 2 Location': 25,
				'Background Gradient Blend Mode': 'multiply',
			} ).assertComputedStyle( {
				'.ugb-image-box__overlay-hover': {
					'background-image': 'linear-gradient(135deg, #a36868 61%, #4581a0 25%)',
					'mix-blend-mode': 'multiply',
				},
			} )
		} )
	} )

	it( `should assert Effects options in ${ lowerCase( viewport ) }`, () => {
		desktopOnly( () => {
			cy.collapse( 'Effects' )
			const effects = [
				'zoom-in',
				'zoom-out',
				'tilt',
				'zoom-tilt',
				'up',
				'down',
				'left',
				'right',
				'blur-in',
				'blur-out',
				'grayscale-in',
				'grayscale-out',
			]
			effects.forEach( effect => {
				cy.adjust( 'Image Hover Effect', effect )
					.assertClassName( '.ugb-image-box', `ugb-image-box--effect-${ effect }` )
			} )

			const boxEffects = [
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
			boxEffects.forEach( effect => {
				cy.adjust( 'Box Hover Effect', effect )
					.assertClassName( '.ugb-image-box__item', `ugb--hover-${ effect }` )
			} )
		} )
	} )

	it( `should assert Subtitle options in ${ lowerCase( viewport ) }`, () => {
		// Test Subtitle options
		cy.collapse( 'Subtitle' )
		desktopOnly( () => {
			cy.adjust( 'Subtitle Color', '#ff7979' ).assertComputedStyle( {
				'.ugb-image-box__subtitle': {
					'color': '#ff7979',
				},
			} )
		} )

		assertTypography( '.ugb-image-box__subtitle', { viewport } )
		assertAligns( 'Align', '.ugb-image-box__subtitle', { viewport } )
	} )

	it( `should assert Title options in ${ lowerCase( viewport ) }`, () => {
		// Test Title options
		cy.collapse( 'Title' )
		desktopOnly( () => {
			cy.adjust( 'Title HTML Tag', 'h6' )
				.assertHtmlTag( '.ugb-image-box__title', 'h6' )
			cy.adjust( 'Title Color', '#ff7979' ).assertComputedStyle( {
				'.ugb-image-box__title': {
					'color': '#ff7979',
				},
			} )
		} )

		assertTypography( '.ugb-image-box__title', { viewport } )
		assertAligns( 'Align', '.ugb-image-box__title', { viewport } )
	} )

	it( `should assert Description options in ${ lowerCase( viewport ) }`, () => {
		// Test Description options
		cy.collapse( 'Description' )
		desktopOnly( () => {
			cy.adjust( 'Description Color', '#ff7979' ).assertComputedStyle( {
				'.ugb-image-box__description': {
					'color': '#ff7979',
				},
			} )
		} )

		assertTypography( '.ugb-image-box__description', { viewport } )
		assertAligns( 'Align', '.ugb-image-box__description', { viewport } )
	} )

	it( `should assert Arrow options in ${ lowerCase( viewport ) }`, () => {
		// Test Arrow options
		cy.toggleStyle( 'Arrow' )
		desktopOnly( () => {
			cy.adjust( 'Color', '#000000' ).assertComputedStyle( {
				'.ugb-image-box__arrow svg': {
					'fill': '#000000',
				},
			} )
		} )
		cy.adjust( 'Size', 24, { viewport } ).assertComputedStyle( {
			'.ugb-image-box__arrow svg': {
				'width': '24px',
			},
		} )
		assertAligns( 'Align', '.ugb-image-box__arrow', { viewport } )
	} )

	it( `should assert Block Title & Description options in ${ lowerCase( viewport ) }`, () => {
		// Test Block Title and Description
		assertBlockTitleDescription( { viewport } )
	} )

	it( `should assert Spacing options in ${ lowerCase( viewport ) }`, () => {
		cy.toggleStyle( 'Arrow' )
		// Test Spacing options
		cy.collapse( 'Spacing' )
		cy.adjust( 'Paddings', [ 25, 26, 27, 28 ], { viewport, unit: 'px' } ).assertComputedStyle( {
			'.ugb-image-box__item': {
				'padding-top': '25px',
				'padding-right': '26px',
				'padding-bottom': '27px',
				'padding-left': '28px',
			},
		} )
		cy.adjust( 'Paddings', [ 3, 4, 5, 6 ], { viewport, unit: 'em' } ).assertComputedStyle( {
			'.ugb-image-box__item': {
				'padding-top': '3em',
				'padding-right': '4em',
				'padding-bottom': '5em',
				'padding-left': '6em',
			},
		} )
		cy.adjust( 'Paddings', [ 17, 18, 19, 20 ], { viewport, unit: '%' } ).assertComputedStyle( {
			'.ugb-image-box__item': {
				'padding-top': '17%',
				'padding-right': '18%',
				'padding-bottom': '19%',
				'padding-left': '20%',
			},
		} )
		cy.adjust( 'Subtitle', 34, { viewport } )
		cy.adjust( 'Title', 18, { viewport } )
		cy.adjust( 'Description', 7, { viewport } )
		cy.adjust( 'Arrow', 15, { viewport } ).assertComputedStyle( {
			'.ugb-image-box__subtitle': {
				'margin-bottom': '34px',
			},
			'.ugb-image-box__title': {
				'margin-bottom': '18px',
			},
			'.ugb-image-box__description': {
				'margin-bottom': '7px',
			},
			'.ugb-image-box__arrow': {
				'margin-bottom': '15px',
			},
		} )
	} )

	it( `should assert Block Background options in ${ lowerCase( viewport ) }`, () => {
		// Test Block Background
		assertBlockBackground( '.ugb-image-box', {
			viewport,
			disableColumnHeight: true,
		} )
	} )

	it( `should assert Top & Bottom Separator options in ${ lowerCase( viewport ) }`, () => {
		// Test Separators
		assertSeparators( { viewport } )
	} )

	it( `should assert button URL popover in ${ lowerCase( viewport ) }`, () => {
		// Test image box URL popover for each column.
		cy.collapse( 'General' )
		cy.adjust( 'Columns', 4 )
		assertUrlPopover( 'ugb/image-box', 0, {
			editorSelector: '.ugb-image-box__item%s > .ugb-image-box__overlay-hover',
			frontendSelector: '.ugb-image-box__item%s .ugb-image-box__overlay-link',
		}, { viewport } )
	} )
}

function advancedTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/image-box' ).asBlock( 'imageBoxBlock', { isStatic: true } )
	cy.openInspector( 'ugb/image-box', 'Advanced' )

	assertAdvancedTab( '.ugb-image-box', {
		viewport,
		disableColumnHeight: true,
		customCssSelectors: [
			'.ugb-image-box__item',
			'.ugb-image-box__title',
			'.ugb-image-box__subtitle',
		],
	} )

	// Add more block specific tests.
	cy.assertFrontendStyles( '@imageBoxBlock' )
}
