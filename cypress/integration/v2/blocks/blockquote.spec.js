/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, assertAligns, registerTests, responsiveAssertHelper, assertBlockBackground, assertSeparators, assertTypography, assertAdvancedTab, assertContainerLink,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Blockquote Block', registerTests( [
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

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/blockquote' ).asBlock( 'blockquoteBlock', { isStatic: true } )

		cy.typeBlock( 'ugb/blockquote', '.ugb-blockquote__text', 'Hello World! 1234' )
			.assertBlockContent( '.ugb-blockquote__text', 'Hello World! 1234' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/blockquote' ).asBlock( 'blockquoteBlock', { isStatic: true } )
	cy.openInspector( 'ugb/blockquote', 'Style' )

	// Test General Alignment
	cy.collapse( 'General' )
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	// Test Spacing options
	cy.collapse( 'Spacing' )
	cy.adjust( 'Paddings', [ 25, 26, 27, 28 ], { viewport, unit: 'px' } ).assertComputedStyle( {
		'.ugb-blockquote__item': {
			'padding-top': '25px',
			'padding-right': '26px',
			'padding-bottom': '27px',
			'padding-left': '28px',
		},
	} )
	cy.resetStyle( 'Paddings' )
	cy.adjust( 'Paddings', [ 3, 4, 5, 6 ], { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-blockquote__item': {
			'padding-top': '3em',
			'padding-right': '4em',
			'padding-bottom': '5em',
			'padding-left': '6em',
		},
	} )
	cy.resetStyle( 'Paddings' )
	cy.adjust( 'Paddings', [ 17, 18, 19, 20 ], { viewport, unit: '%' } ).assertComputedStyle( {
		'.ugb-blockquote__item': {
			'padding-top': '17%',
			'padding-right': '18%',
			'padding-bottom': '19%',
			'padding-left': '20%',
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
	assertContainerLink( '.ugb-blockquote__item', { viewport } )
	cy.assertFrontendStyles( '@blockquoteBlock' )
}

function advancedTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/blockquote' ).asBlock( 'blockquoteBlock', { isStatic: true } )
	cy.openInspector( 'ugb/blockquote', 'Advanced' )

	assertAdvancedTab( '.ugb-blockquote', {
		viewport,
		customCssSelectors: [
			'.ugb-blockquote__item',
			'.ugb-blockquote__quote',
			'.ugb-blockquote__text',
		],
	} )

	// Add more block specific tests.
	cy.assertFrontendStyles( '@blockquoteBlock' )
}

