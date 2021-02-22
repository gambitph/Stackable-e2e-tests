/**
 * External dependencies
 */
import { range } from 'lodash'
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, responsiveAssertHelper, assertAligns, assertTypography, assertBlockTitleDescription, assertBlockBackground, assertSeparators, assertContainer,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )

describe( 'Testimonial Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

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

function styleTab( viewport, desktopOnly, registerBlockSnapshots ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/testimonial' ).as( 'testimonialBlock' )
	const testimonialBlock = registerBlockSnapshots( 'testimonialBlock' )
	cy.openInspector( 'ugb/testimonial', 'Style' )

	cy.collapse( 'General' )
	desktopOnly( () => {
		range( 1, 4 ).forEach( idx => {
			cy.adjust( 'Columns', idx )
				.assertClassName( '.ugb-testimonial', `ugb-testimonial--columns-${ idx }` )
		} )
		cy.adjust( 'Columns', 2 )
	} )
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	cy.collapse( 'Container' )
	cy.setBlockAttribute( {
		'image1Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
		'image2Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
	} )

	assertContainer( '.ugb-testimonial__item', { viewport }, 'column%sBackgroundMediaUrl' )

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

	assertBlockTitleDescription( { viewport } )

	cy.collapse( 'Spacing' )
	cy.adjust( 'Block Title', 26, { viewport } )
	cy.adjust( 'Block Description', 96, { viewport } ).assertComputedStyle( {
		'.ugb-block-title': {
			'margin-bottom': '26px',
		},
		'.ugb-block-description': {
			'margin-bottom': '96px',
		},
	} )
	cy.adjust( 'Paddings', 29, { viewport, unit: 'px' } ).assertComputedStyle( {
		'.ugb-testimonial__item': {
			'padding-top': '29px',
			'padding-bottom': '29px',
			'padding-right': '29px',
			'padding-left': '29px',
		},
	} )
	cy.adjust( 'Paddings', 5, { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-testimonial__item': {
			'padding-top': '5em',
			'padding-bottom': '5em',
			'padding-right': '5em',
			'padding-left': '5em',
		},
	} )
	cy.adjust( 'Paddings', 21, { viewport, unit: '%' } ).assertComputedStyle( {
		'.ugb-testimonial__item': {
			'padding-top': '21%',
			'padding-bottom': '21%',
			'padding-right': '21%',
			'padding-left': '21%',
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

	assertBlockBackground( '.ugb-testimonial', { viewport } )

	assertSeparators( { viewport } )

	testimonialBlock.assertFrontendStyles()
}
