/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchLayouts, switchDesigns, assertAligns, assertBlockBackground, assertSeparators, registerTests, responsiveAssertHelper, assertTypography, assertAdvancedTab,
} from '~stackable-e2e/helpers'
import { registerBlockSnapshots } from '~gutenberg-e2e/plugins'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Advanced Text Block', registerTests( [
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
	it( 'should show the block', assertBlockExist( 'ugb/text', '.ugb-text' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/text' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/text', [
		{ value: 'Plain', selector: '.ugb-text--design-plain' },
		{ value: 'Side Title 1', selector: '.ugb-text--design-side-title-1' },
		{ value: 'Side Title 2', selector: '.ugb-text--design-side-title-2' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/text', [
		'Angled Advanced Text',
		'Aspire Advanced Text',
		'Aurora Advanced Text',
		'Dare Advanced Text',
		'Decora Advanced Text',
		'Detour Advanced Text',
		'Dim Advanced Text',
		'Elevate Advanced Text',
		'Flex Advanced Text',
		'Glow Advanced Text',
		'Lounge Advanced Text',
		'Lume Advanced Text',
		'Lush Advanced Text',
		'Peplum Advanced Text',
		'Proact Advanced Text 1',
		'Proact Advanced Text 2',
		'Seren Advanced Text',
	] ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/text' ).as( 'textBlock' )
		registerBlockSnapshots( 'textBlock' )

		cy.typeBlock( 'ugb/text', '.ugb-text__text-1', 'Hello World! 1234' )
			.assertBlockContent( '.ugb-text__text-1', 'Hello World! 1234' )
	} )
}

function styleTab( viewport, desktopOnly, registerBlockSnapshots ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/text' ).as( 'textBlock' )
	const textBlock = registerBlockSnapshots( 'textBlock' )
	cy.openInspector( 'ugb/text', 'Style' )

	// Test General options
	cy.collapse( 'General' )

	desktopOnly( () => {
		cy.adjust( 'Columns', 2 )
			.assertClassName( '.ugb-text', 'ugb-text--columns-2' )
	} )
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	desktopOnly( () => {
		// Test Column Rule
		cy.collapse( 'Column Rule' )
		cy.toggleStyle( 'Column Rule' )
		cy.adjust( 'Color', '#000000' )
		cy.adjust( 'Width', 3 )
		cy.adjust( 'Height', 48 ).assertComputedStyle( {
			'.ugb-text__rule': {
				'background-color': '#000000',
				'width': '3px',
				'height': '48%',
			},
		} )
	} )

	// Test Text options
	cy.collapse( 'Text' )

	desktopOnly( () => {
		cy.adjust( 'Text Color', '#333333' ).assertComputedStyle( {
			'.ugb-text__text p': {
				'color': '#333333',
			},
		} )
	} )
	cy.adjust( 'Size', 1.3, { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-text__text p': {
			'font-size': '1.3em',
		},
	} )
	assertTypography( '.ugb-text__text p', { viewport } )
	assertAligns( 'Align', '.ugb-text__text p', { viewport } )

	// Test Title
	cy.collapse( 'Title' )
	cy.toggleStyle( 'Title' )
	cy.typeBlock( 'ugb/text', '.ugb-text__title', 'Title here' )

	desktopOnly( () => {
		cy.adjust( 'Title HTML Tag', 'h3' )
			.assertHtmlTag( '.ugb-text__title', 'h3' )
		cy.adjust( 'Title Color', '#333333' ).assertComputedStyle( {
			'.ugb-text__title': {
				'color': '#333333',
			},
		} )
		const aligns = [ 'flex-start', 'center', 'flex-end' ]
		aligns.forEach( align => {
			cy.adjust( 'Vertical Align', align ).assertComputedStyle( {
				'.ugb-text__title-wrapper': {
					'justify-content': align,
				},
			} )
		} )
	} )

	cy.adjust( 'Size', 1.6, { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-text__title': {
			'font-size': '1.6em',
		},
	} )
	assertTypography( '.ugb-text__title', { viewport } )
	assertAligns( 'Align', '.ugb-text__title', { viewport } )

	// Test Subtitle options
	cy.collapse( 'Subtitle' )
	cy.toggleStyle( 'Subtitle' )
	cy.typeBlock( 'ugb/text', '.ugb-text__subtitle', 'Subtitle here' )

	desktopOnly( () => {
		cy.adjust( 'Subtitle on Top', true )
		cy.adjust( 'Subtitle Color', '#333333' ).assertComputedStyle( {
			'.ugb-text__subtitle': {
				'color': '#333333',
			},
		} )
	} )

	cy.adjust( 'Size', 0.9, { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-text__subtitle': {
			'font-size': '0.9em',
		},
	} )
	assertTypography( '.ugb-text__subtitle', { viewport } )
	assertAligns( 'Align', '.ugb-text__subtitle', { viewport } )

	// Test Spacing options
	cy.collapse( 'Spacing' )
	cy.adjust( 'Paddings', 28, { viewport } ).assertComputedStyle( {
		'.ugb-text__text-wrapper': {
			'padding-top': '28px',
			'padding-bottom': '28px',
			'padding-right': '28px',
			'padding-left': '28px',
		},
	} )
	cy.resetStyle( 'Paddings' )
	cy.adjust( 'Paddings', 5, { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-text__text-wrapper': {
			'padding-top': '5em',
			'padding-bottom': '5em',
			'padding-right': '5em',
			'padding-left': '5em',
		},
	} )
	cy.resetStyle( 'Paddings' )
	cy.adjust( 'Paddings', 16, { viewport, unit: '%' } ).assertComputedStyle( {
		'.ugb-text__text-wrapper': {
			'padding-top': '16%',
			'padding-bottom': '16%',
			'padding-right': '16%',
			'padding-left': '16%',
		},
	} )
	cy.adjust( 'Title', 23, { viewport } ).assertComputedStyle( {
		'.ugb-text__title': {
			'margin-bottom': '23px',
		},
	} )
	cy.adjust( 'Subtitle', 8, { viewport } ).assertComputedStyle( {
		'.ugb-text__subtitle': {
			'margin-bottom': '8px',
		},
	} )
	cy.adjust( 'Text', 21, { viewport } ).assertComputedStyle( {
		'.ugb-text__text': {
			'margin-bottom': '21px',
		},
	} )

	// Test Block Background
	assertBlockBackground( '.ugb-text', { viewport } )

	// Test Top and Bottom Separator
	assertSeparators( { viewport } )
	textBlock.assertFrontendStyles()
}

function advancedTab( viewport, desktopOnly, registerBlockSnapshots ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/text' ).as( 'textBlock' )
	const textBlock = registerBlockSnapshots( 'textBlock' )

	cy.openInspector( 'ugb/text', 'Advanced' )

	assertAdvancedTab( '.ugb-text', { viewport } )

	// Add more block specific tests.
	textBlock.assertFrontendStyles()
}
