/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, assertAligns, registerTests, responsiveAssertHelper, assertBlockBackground, assertSeparators, assertTypography,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )

describe( 'Blockquote Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/blockquote', '.ugb-blockquote' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/blockquote' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/blockquote', [
		{ value: 'Basic', selector: '.ugb-blockquote--design-basic' },
		{ value: 'Plain', selector: '.ugb-blockquote--design-plain' },
		{ value: 'Centered Quote', selector: '.ugb-blockquote--design-centered-quote' },
		{ value: 'Huge', selector: '.ugb-blockquote--design-huge' },
		{ value: 'Highlight', selector: '.ugb-blockquote--design-highlight' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/blockquote', [
		'Cary Blockquote',
		'Chic Blockquote',
		'Dare Blockquote',
		'Detour Blockquote',
		'Dim Blockquote',
		'Dustin Blockquote',
		'Elevate Blockquote',
		'Hue Blockquote',
		'Lounge Blockquote',
		'Lume Blockquote',
		'Lush Blockquote',
		'Propel Blockquote',
		'Seren Blockquote',
		'Yule Blockquote',
	] ) )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/blockquote' )
	cy.openInspector( 'ugb/blockquote', 'Style' )

	// Test General Alignment
	cy.collapse( 'General' )
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	// Test Spacing options
	cy.collapse( 'Spacing' )
	cy.adjust( 'Paddings', 25, { viewport, unit: 'px' } ).assertComputedStyle( {
		'.ugb-blockquote__item': {
			'padding-top': '25px',
			'padding-bottom': '25px',
			'padding-right': '25px',
			'padding-left': '25px',
		},
	} )
	cy.resetStyle( 'Paddings' )
	cy.adjust( 'Paddings', 3, { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-blockquote__item': {
			'padding-top': '3em',
			'padding-bottom': '3em',
			'padding-right': '3em',
			'padding-left': '3em',
		},
	} )
	cy.resetStyle( 'Paddings' )
	cy.adjust( 'Paddings', 17, { viewport, unit: '%' } ).assertComputedStyle( {
		'.ugb-blockquote__item': {
			'padding-top': '17%',
			'padding-bottom': '17%',
			'padding-right': '17%',
			'padding-left': '17%',
		},
	} )

	// Test Quotation Mark options
	cy.collapse( 'Quotation Mark' )

	desktopOnly( () => {
		cy.adjust( 'Icon', 'square' )
		cy.adjust( 'Color', '#f00069' )
		cy.adjust( 'Opacity', 0.7 ).assertComputedStyle( {
			'.ugb-blockquote__quote': {
				'fill': '#f00069',
				'opacity': '0.7',
			},
		} )
	} )

	cy.adjust( 'Size', 93, { viewport } )
	cy.adjust( 'Horizontal Position', 76, { viewport } )
	cy.adjust( 'Vertical Position', 59, { viewport } ).assertComputedStyle( {
		'.ugb-blockquote__quote': {
			'width': '93px',
			'height': '93px',
			'left': '76px',
			'top': '59px',
		},
	} )

	// Test Text options
	cy.collapse( 'Text' )

	desktopOnly( () => {
		cy.adjust( 'Text Color', '#ffffff' ).assertComputedStyle( {
			'.ugb-blockquote__text': {
				'color': '#ffffff',
			},
		} )
	} )
	assertTypography( '.ugb-blockquote__text', { viewport } )
	assertAligns( 'Align', '.ugb-blockquote__item', { viewport } )

	assertBlockBackground( '.ugb-blockquote', { viewport } )

	assertSeparators( { viewport } )
}

