
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, responsiveAssertHelper, assertAligns, assertTypography, assertBlockTitleDescription, assertBlockBackground, assertSeparators, assertContainer,
} from '~stackable-e2e/helpers'
import { startCase } from 'lodash'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )

describe( 'Number Box Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/number-box', '.ugb-number-box' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/number-box' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/number-box', [
		'Basic',
		{ value: 'Plain', selector: '.ugb-number-box--design-plain' },
		{ value: 'Background', selector: '.ugb-number-box--design-background' },
		{ value: 'Heading', selector: '.ugb-number-box--design-heading' },
		{ value: 'heading2', selector: '.ugb-number-box--design-heading2' },
		{ value: 'Faded', selector: '.ugb-number-box--design-faded' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/number-box', [
		'Angled Number Box',
		'Aurora Number Box',
		'Capital Number Box',
		'Cary Number Box',
		'Elevate Number Box',
		'Flex Number Box',
		'Hue Number Box',
		'Lounge Number Box',
		'Lume Number Box',
		'Lush Number Box',
		'Propel Number Box',
		'Speck Number Box',
	] ) )
}

function styleTab( viewport, desktopOnly, registerBlockSnapshots ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/number-box' ).as( 'numberBoxBlock' )
	const numberBoxBlock = registerBlockSnapshots( 'numberBoxBlock' )
	cy.openInspector( 'ugb/number-box', 'Style' )

	// General Tab
	cy.collapse( 'General' )

	desktopOnly( () => {
		cy.adjust( 'Columns', 3 )
		cy.get( '.ugb-number-box__item3' ).should( 'exist' )
	} )
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	// Container Tab
	cy.collapse( 'Container' )

	assertContainer( '.ugb-number-box__item', { viewport }, 'column%sBackgroundMediaUrl' )

	// Spacing Tab
	cy.collapse( 'Spacing' )

	cy.adjust( 'Paddings', 30, { viewport } ).assertComputedStyle( {
		'.ugb-number-box__item': {
			'padding-top': '30px',
			'padding-bottom': '30px',
			'padding-right': '30px',
			'padding-left': '30px',
		},
	} )
	cy.resetStyle( 'Paddings' )
	cy.adjust( 'Paddings', 5, { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-number-box__item': {
			'padding-top': '5em',
			'padding-bottom': '5em',
			'padding-right': '5em',
			'padding-left': '5em',
		},
	} )
	cy.resetStyle( 'Paddings' )
	cy.adjust( 'Paddings', 25, { viewport, unit: '%' } ).assertComputedStyle( {
		'.ugb-number-box__item': {
			'padding-top': '25%',
			'padding-bottom': '25%',
			'padding-right': '25%',
			'padding-left': '25%',
		},
	} )

	cy.adjust( 'Number', 33 )
	cy.adjust( 'Title', 43 )
	cy.adjust( 'Description', 53 )
		.assertComputedStyle( {
			'.ugb-number-box__number': {
				'margin-bottom': '33px',
			},
			'.ugb-number-box__title': {
				'margin-bottom': '43px',
			},
			'.ugb-number-box__description': {
				'margin-bottom': '53px',
			},
		} )

	// Number
	cy.collapse( 'Number' )

	// TO DO: Add test for Number Input

	assertTypography( '.ugb-number-box__number', { viewport } )
	cy.adjust( 'Size', 47, { viewport, unit: 'px' } ).assertComputedStyle( {
		'.ugb-number-box__number': {
			'font-size': '47px',
		},
	} )
	cy.adjust( 'Size', 4, { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-number-box__number': {
			'font-size': '4em',
		},
	} )
	cy.adjust( 'Shape Size', 2, { viewport } ).assertComputedStyle( {
		'.ugb-number-box__number': {
			'height': '2em',
			'width': '2em',
		},
	} )

	desktopOnly( () => {
		cy.adjust( 'Number Shape', 'none' ).assertClassName( '.ugb-number-box', 'ugb-number-box--number-style-none' )
		cy.adjust( 'Number Shape', 'square' ).assertClassName( '.ugb-number-box', 'ugb-number-box--number-style-square' )

		cy.adjust( 'Number Background Color', '#d1dfe4' )
		cy.adjust( 'Number Color', '#000000' )
		cy.adjust( 'Opacity', 0.5 ).assertComputedStyle( {
			'.ugb-number-box__number': {
				'background-color': '#d1dfe4',
				'color': '#000000',
				'opacity': '0.5',
			},
		} )
	} )

	cy.adjust( 'Align', 'left', { viewport } ).assertComputedStyle( {
		'.ugb-number-box__number': {
			'margin-left': '0px',
			'margin-right': 'auto',
		},
	} )
	cy.adjust( 'Align', 'center', { viewport } ).assertComputedStyle( {
		'.ugb-number-box__number': {
			'margin-right': 'auto',
			'margin-left': 'auto',
		},
	} )
	cy.adjust( 'Align', 'right', { viewport } ).assertComputedStyle( {
		'.ugb-number-box__number': {
			'margin-right': '0px',
			'margin-left': 'auto',
		},
	} )

	// Title Tab and Description Tab

	const typographyAssertions = [ 'title', 'description' ]
	typographyAssertions.forEach( typographyAssertion => {
		const label = startCase( typographyAssertion )
		cy.collapse( label )
		if ( typographyAssertion === 'title' ) {
			desktopOnly( () => {
				cy.adjust( 'Title HTML Tag', 'h4' ).assertHtmlTag( '.ugb-number-box__title', 'h4' )
			} )
		}

		desktopOnly( () => {
			cy.adjust( `${ label } Color`, '#742f2f' ).assertComputedStyle( {
				[ `.ugb-number-box__${ typographyAssertion }` ]: {
					'color': '#742f2f',
				},
			} )
		} )

		cy.adjust( 'Size', 55, { viewport, unit: 'px' } ).assertComputedStyle( {
			[ `.ugb-number-box__${ typographyAssertion }` ]: {
				'font-size': '55px',
			},
		} )
		cy.adjust( 'Size', 2, { viewport, unit: 'em' } ).assertComputedStyle( {

			[ `.ugb-number-box__${ typographyAssertion }` ]: {
				'font-size': '2em',
			},
		} )

		assertTypography( `.ugb-number-box__${ typographyAssertion }`, { viewport } )
		assertAligns( 'Align', `.ugb-number-box__${ typographyAssertion }`, { viewport } )
	} )

	assertBlockTitleDescription( { viewport } )
	assertBlockBackground( '.ugb-number-box', { viewport } )
	assertSeparators( { viewport } )
	numberBoxBlock.assertFrontendStyles()
}
