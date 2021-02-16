/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, assertAligns, registerTests, responsiveAssertHelper, assertTypography,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )

describe( 'Expand Block', registerTests( [
	blockExist,
	blockError,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/expand', '.ugb-expand' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/expand' ) )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/expand' )
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
				[ `color` ]: '#742f2f',
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
				[ `color` ]: '#742f2f',
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
				[ `color` ]: '#742f2f',
			},
		} )
	} )
	assertTypography( '.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text', { viewport } )
	assertAligns( 'Align', '.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text', { viewport } )

	// Test Spacing options
	cy.collapse( 'Spacing' )
	cy.adjust( 'Title', 44, { viewport } ).assertComputedStyle( {
		'.ugb-expand__title': {
			[ `margin-bottom` ]: '44px',
		},
	} )
	cy.adjust( 'Text', 12, { viewport } ).assertComputedStyle( {
		'.ugb-expand__less-text, .ugb-expand__more-text': {
			[ `margin-bottom` ]: '12px',
		},
	} )
	cy.adjust( 'Link', 39, { viewport } ).assertComputedStyle( {
		'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
			[ `margin-bottom` ]: '39px',
		},
	} )
}

