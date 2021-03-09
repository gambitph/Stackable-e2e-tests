/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, assertAligns, registerTests, responsiveAssertHelper, assertTypography, assertAdvancedTab,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Expand Block', registerTests( [
	blockExist,
	blockError,
	typeContent,
	desktopStyle,
	tabletStyle,
	mobileStyle,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/expand', '.ugb-expand' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/expand' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/expand' )
		cy.typeBlock( 'ugb/expand', '.ugb-expand__title', 'Hello World! 1234' )
		cy.typeBlock( 'ugb/expand', '.ugb-expand__less-text', 'Hello World! 1234' )
		cy.typeBlock( 'ugb/expand', '.ugb-expand__more-toggle-text', 'Hello World! 1234' )
		cy.typeBlock( 'ugb/expand', '.ugb-expand__more-text', 'Hello World! 1234' )
		cy.typeBlock( 'ugb/expand', '.ugb-expand__less-toggle-text', 'Hello World! 1234' )

		cy.publish()
		cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
			cy.visit( previewUrl )
			cy.get( '.ugb-expand' )
				.find( '.ugb-expand__title' )
				.contains( 'Hello World! 1234' )
				.should( 'exist' )
			cy.get( '.ugb-expand' )
				.find( '.ugb-expand__less-text' )
				.contains( 'Hello World! 1234' )
				.should( 'exist' )
			cy.get( '.ugb-expand' )
				.find( '.ugb-expand__more-toggle-text' )
				.contains( 'Hello World! 1234' )
				.should( 'exist' )
			cy.get( '.ugb-expand' )
				.find( '.ugb-expand__more-text' )
				.contains( 'Hello World! 1234' )
				.should( 'exist' )
			cy.get( '.ugb-expand' )
				.find( '.ugb-expand__less-toggle-text' )
				.contains( 'Hello World! 1234' )
				.should( 'exist' )
			cy.visit( editorUrl )
		} )
	} )
}

function styleTab( viewport, desktopOnly, registerBlockSnapshots ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/expand' ).as( 'expandBlock' )
	const expandBlock = registerBlockSnapshots( 'expandBlock' )
	cy.openInspector( 'ugb/expand', 'Style' )

	// Test General options
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	// Test Title options
	cy.collapse( 'Title' )
	desktopOnly( () => {
		cy.adjust( 'Title HTML Tag', 'h6' )
			.assertHtmlTag( '.ugb-expand__title', 'h6' )
		cy.adjust( 'Title Color', '#742f2f' ).assertComputedStyle( {
			'.ugb-expand__title': {
				'color': '#742f2f',
			},
		} )
	} )
	assertTypography( '.ugb-expand__title', { viewport } )
	assertAligns( 'Align', '.ugb-expand__title', { viewport } )

	// Test Text options
	cy.collapse( 'Text' )
	desktopOnly( () => {
		cy.adjust( 'Text Color', '#742f2f' ).assertComputedStyle( {
			'.ugb-expand__less-text p, .ugb-expand__more-text p': {
				'color': '#742f2f',
			},
		} )
	} )
	assertTypography( '.ugb-expand__less-text p, .ugb-expand__more-text p', { viewport } )
	assertAligns( 'Align', '.ugb-expand__less-text p, .ugb-expand__more-text p', { viewport } )

	// Test Link options
	cy.collapse( 'Link' )
	desktopOnly( () => {
		cy.adjust( 'Link Color', '#742f2f' ).assertComputedStyle( {
			'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
				'color': '#742f2f',
			},
		} )
	} )
	assertTypography( '.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text', { viewport } )
	assertAligns( 'Align', '.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text', { viewport } )

	// Test Spacing options
	cy.collapse( 'Spacing' )
	cy.adjust( 'Title', 44, { viewport } ).assertComputedStyle( {
		'.ugb-expand__title': {
			'margin-bottom': '44px',
		},
	} )
	cy.adjust( 'Text', 12, { viewport } ).assertComputedStyle( {
		'.ugb-expand__less-text, .ugb-expand__more-text': {
			'margin-bottom': '12px',
		},
	} )
	cy.adjust( 'Link', 39, { viewport } ).assertComputedStyle( {
		'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
			'margin-bottom': '39px',
		},
	} )
	expandBlock.assertFrontendStyles()
}

function advancedTab( viewport, desktopOnly, registerBlockSnapshots ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/expand' ).as( 'expandBlock' )
	const expandBlock = registerBlockSnapshots( 'expandBlock' )

	cy.openInspector( 'ugb/expand', 'Advanced' )

	assertAdvancedTab( '.ugb-expand', { viewport } )

	// Add more block specific tests.
	expandBlock.assertFrontendStyles()
}

