/**
 * External dependencies
 */
import { lowerCase, range } from 'lodash'
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, assertContainerLink, assertBlockTitleDescriptionContent, responsiveAssertHelper, assertAligns, assertTypography, assertBlockTitleDescription, assertBlockBackground, assertSeparators, assertContainer, assertAdvancedTab,
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
	it( 'should show the block', assertBlockExist( 'ugb/testimonial', '.ugb-testimonial' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/testimonial' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/testimonial', [
		{ value: 'Basic', selector: '.ugb-testimonial--design-basic' },
		{ value: 'Plain', selector: '.ugb-testimonial--design-plain' },
		{ value: 'basic2', selector: '.ugb-testimonial--design-basic2' },
		{ value: 'Bubble', selector: '.ugb-testimonial--design-bubble' },
		{ value: 'Background', selector: '.ugb-testimonial--design-background' },
		{ value: 'Vertical', selector: '.ugb-testimonial--design-vertical' },
		{ value: 'Vertical Inverse', selector: '.ugb-testimonial--design-vertical-inverse' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/testimonial', [
		'Arch Testimonial',
		'Chic Testimonial',
		'Devour Testimonial',
		'Dim Testimonial',
		'Elevate Testimonial',
		'Glow Testimonial',
		'Lounge Testimonial',
		'Lume Testimonial',
		'Lush Testimonial',
		'Peplum Testimonial',
		'Prime Testimonial 1',
		'Prime Testimonial 2',
		'Propel Testimonial',
		'Speck Testimonial',
		'Upland Testimonial',
		'Yule Testimonial',
	] ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/testimonial' ).asBlock( 'testimonialBlock', { isStatic: true } )

		cy.typeBlock( 'ugb/testimonial', '.ugb-testimonial__body', 'Hello World! 1', 0 )
			.assertBlockContent( '.ugb-testimonial__body', 'Hello World! 1' )
		cy.typeBlock( 'ugb/testimonial', '.ugb-testimonial__name', 'Helloo World!! 12', 0 )
			.assertBlockContent( '.ugb-testimonial__name', 'Helloo World!! 12' )
		cy.typeBlock( 'ugb/testimonial', '.ugb-testimonial__position', 'Hellooo World!!! 123', 0 )
			.assertBlockContent( '.ugb-testimonial__position', 'Hellooo World!!! 123' )

		cy.openInspector( 'ugb/testimonial', 'Style' )
		assertBlockTitleDescriptionContent( 'ugb/testimonial' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/testimonial' ).asBlock( 'testimonialBlock', { isStatic: true } )
		cy.openInspector( 'ugb/testimonial', 'Style' )
		cy.collapse( 'General' )
		cy.adjust( 'Columns', 2 )
		cy.setBlockAttribute( {
			'image1Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
			'image2Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
		} )
	} )

	afterEach( () => cy.assertFrontendStyles( '@testimonialBlock' ) )

	it( `should assert General options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'General' )
		desktopOnly( () => {
			range( 1, 4 ).forEach( idx => {
				cy.adjust( 'Columns', idx )
				cy.get( `.ugb-testimonial__item${ idx }` ).should( 'exist' )
			} )
			cy.adjust( 'Columns', 2 )
		} )
		assertAligns( 'Align', '.ugb-inner-block', { viewport } )
	} )

	it( `should assert Container options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Container' )
		assertContainer( '.ugb-testimonial__item', { viewport }, 'column%sBackgroundMediaUrl' )
	} )

	it( `should assert Testimonial options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Testimonial' )
		desktopOnly( () => {
			cy.adjust( 'Testimonial Color', '#ff7979' ).assertComputedStyle( {
				'.ugb-testimonial__body': {
					'color': '#ff7979',
				},
			} )
		} )

		assertTypography( '.ugb-testimonial__body', { viewport } )
		assertAligns( 'Align', '.ugb-testimonial__body', { viewport } )
	} )

	it( `should assert Image options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Image' )
		cy.adjust( 'Image Width', 53, { viewport } ).assertComputedStyle( {
			'.ugb-img': {
				'width': '53px',
			},
		} )
		desktopOnly( () => {
			cy.adjust( 'Shape', {
				label: 'Blob 1',
				value: 'blob1',
			} )
			cy.adjust( 'Flip Shape Horizontally', true )
			cy.adjust( 'Flip Shape Vertically', true )
			cy.adjust( 'Stretch Shape Mask', true )
				.assertClassName( 'img.ugb-img--shape', 'ugb-image--shape-stretch' )
			// TODO: Image Size assertion
			cy.adjust( 'Force square image', true ).assertComputedStyle( {
				'.ugb-img': {
					'height': '53px',
				},
			} )
		} )

		cy.adjust( 'Align', 'left', { viewport } ).assertComputedStyle( {
			'.ugb-testimonial__image': {
				'margin-left': '0',
				'margin-right': 'auto',
			},
		} )
		cy.adjust( 'Align', 'center', { viewport } ).assertComputedStyle( {
			'.ugb-testimonial__image': {
				'margin-left': 'auto',
				'margin-right': 'auto',
			},
		} )
		cy.adjust( 'Align', 'right', { viewport } ).assertComputedStyle( {
			'.ugb-testimonial__image': {
				'margin-left': 'auto',
				'margin-right': '0',
			},
		} )
	} )

	it( `should assert Name options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Name' )
		desktopOnly( () => {
			cy.adjust( 'Name HTML Tag', 'h6' )
				.assertHtmlTag( '.ugb-testimonial__name', 'h6' )
			cy.adjust( 'Name Color', '#ff7979' ).assertComputedStyle( {
				'.ugb-testimonial__name': {
					'color': '#ff7979',
				},
			} )
		} )

		assertTypography( '.ugb-testimonial__name', { viewport } )
		assertAligns( 'Align', '.ugb-testimonial__name', { viewport } )
	} )

	it( `should assert Position options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Position' )
		desktopOnly( () => {
			cy.adjust( 'Text Color', '#ff7979' ).assertComputedStyle( {
				'.ugb-testimonial__position': {
					'color': '#ff7979',
				},
			} )
		} )

		assertTypography( '.ugb-testimonial__position', { viewport } )
		assertAligns( 'Align', '.ugb-testimonial__position', { viewport } )
	} )

	it( `should assert Effects options in ${ lowerCase( viewport ) }`, () => {
		desktopOnly( () => {
			cy.collapse( 'Effects' )
			const hoverEffects = [
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
			hoverEffects.forEach( effect => {
				cy.adjust( 'Hover Effect', effect )
					.assertClassName( '.ugb-testimonial__item', `ugb--hover-${ effect }` )
			} )
		} )
	} )

	it( `should assert Spacing options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Spacing' )
		cy.adjust( 'Paddings', [ 25, 26, 27, 28 ], { viewport, unit: 'px' } ).assertComputedStyle( {
			'.ugb-testimonial__item': {
				'padding-top': '25px',
				'padding-right': '26px',
				'padding-bottom': '27px',
				'padding-left': '28px',
			},
		} )
		cy.adjust( 'Paddings', [ 3, 4, 5, 6 ], { viewport, unit: 'em' } ).assertComputedStyle( {
			'.ugb-testimonial__item': {
				'padding-top': '3em',
				'padding-right': '4em',
				'padding-bottom': '5em',
				'padding-left': '6em',
			},
		} )
		cy.adjust( 'Paddings', [ 17, 18, 19, 20 ], { viewport, unit: '%' } ).assertComputedStyle( {
			'.ugb-testimonial__item': {
				'padding-top': '17%',
				'padding-right': '18%',
				'padding-bottom': '19%',
				'padding-left': '20%',
			},
		} )
		cy.adjust( 'Testimonial', 34, { viewport } )
		cy.adjust( 'Image', 18, { viewport } )
		cy.adjust( 'Name', 7, { viewport } )
		cy.adjust( 'Position', 15, { viewport } ).assertComputedStyle( {
			'.ugb-testimonial__body': {
				'margin-bottom': '34px',
			},
			'.ugb-testimonial__image': {
				'margin-bottom': '18px',
			},
			'.ugb-testimonial__name': {
				'margin-bottom': '7px',
			},
			'.ugb-testimonial__position': {
				'margin-bottom': '15px',
			},
		} )
	} )

	it( `should assert Block Title & Description options in ${ lowerCase( viewport ) }`, () => {
		assertBlockTitleDescription( { viewport } )
	} )

	it( `should assert Block Background options in ${ lowerCase( viewport ) }`, () => {
		assertBlockBackground( '.ugb-testimonial', { viewport } )
	} )

	it( `should assert Top & Bottom Separator options in ${ lowerCase( viewport ) }`, () => {
		assertSeparators( { viewport } )
	} )

	it( `should assert Container Link options in ${ lowerCase( viewport ) }`, () => {
		assertContainerLink( '.ugb-testimonial__item', { viewport } )
	} )
}

function advancedTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/testimonial' ).asBlock( 'testimonialBlock', { isStatic: true } )
	cy.openInspector( 'ugb/testimonial', 'Advanced' )

	assertAdvancedTab( '.ugb-testimonial', {
		viewport,
		customCssSelectors: [
			'.ugb-testimonial__item',
			'.ugb-testimonial__body',
			'.ugb-testimonial__person',
			'.ugb-testimonial__name',
			'.ugb-testimonial__position',
		],
	} )

	desktopOnly( () => {
		cy.setBlockAttribute( {
			'image1Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
			'image2Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
		} )
		range( 1, 3 ).forEach( idx => {
			cy.collapse( `Column #${ idx }` )
			cy.adjust( 'Column Background', '#a03b3b' ).assertComputedStyle( {
				[ `.ugb-testimonial__item${ idx }` ]: {
					'background-color': '#a03b3b',
				},
			} )
			cy.collapse( `Image #${ idx }` )
			cy.adjust( 'Shape', {
				label: 'Blob 3',
				value: 'blob3',
			} )
			cy.adjust( 'Flip Shape Horizontally', true )
			cy.adjust( 'Flip Shape Vertically', true )
			cy.adjust( 'Stretch Shape Mask', true ).assertClassName( `.ugb-testimonial__item${ idx } img.ugb-img--shape`, 'ugb-image--shape-stretch' )
		} )
	} )
	cy.assertFrontendStyles( '@testimonialBlock' )
}
