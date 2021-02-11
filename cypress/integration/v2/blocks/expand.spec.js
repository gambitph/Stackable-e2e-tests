/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, assertAligns, registerTests, responsiveAssertHelper,
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
		cy.adjust( 'Typography', {
			[ `Size` ]: 50,
			[ `Weight` ]: '700',
			[ `Transform` ]: 'lowercase',
			[ `Line-Height` ]: 4,
			[ `Letter Spacing` ]: 2.9,
		} ).assertComputedStyle( {
			'.ugb-expand__title': {
				[ `font-weight` ]: '700',
				[ `text-transform` ]: 'lowercase',
				[ `letter-spacing` ]: '2.9px',
			},
		} )
	} )

	cy.adjust( 'Typography', {
		[ `Size` ]: {
			viewport,
			value: 50,
		},
		[ `Line-Height` ]: {
			viewport,
			value: 4,
		},
	} ).assertComputedStyle( {
		'.ugb-expand__title': {
			[ `font-size` ]: '50px',
			[ `line-height` ]: '4em',
		},
	} )

	cy.adjust( 'Typography', {
		[ `Size` ]: {
			viewport,
			unit: 'em',
			value: 7,
		},
		[ `Line-Height` ]: {
			viewport,
			unit: 'px',
			value: 24,
		},
	} )

	cy.adjust( 'Title Color', '#742f2f' ).assertComputedStyle( {
		'.ugb-expand__title': {
			[ `font-size` ]: '7em',
			[ `line-height` ]: '24px',
			[ `color` ]: '#742f2f',
		},
	} )

	assertAligns( 'Align', '.ugb-expand__title', { viewport } )

	// Test Text options
	cy.collapse( 'Text' )
	desktopOnly( () => {
		cy.adjust( 'Typography', {
			[ `Size` ]: 50,
			[ `Weight` ]: '700',
			[ `Transform` ]: 'lowercase',
			[ `Line-Height` ]: 4,
			[ `Letter Spacing` ]: 2.9,
		} ).assertComputedStyle( {
			'.ugb-expand__less-text p, .ugb-expand__more-text p': {
				[ `font-weight` ]: '700',
				[ `text-transform` ]: 'lowercase',
				[ `letter-spacing` ]: '2.9px',
			},
		} )
	} )

	cy.adjust( 'Typography', {
		[ `Size` ]: {
			viewport,
			value: 50,
		},
		[ `Line-Height` ]: {
			viewport,
			value: 4,
		},
	} ).assertComputedStyle( {
		'.ugb-expand__less-text p, .ugb-expand__more-text p': {
			[ `font-size` ]: '50px',
			[ `line-height` ]: '4em',
		},
	} )

	cy.adjust( 'Typography', {
		[ `Size` ]: {
			viewport,
			unit: 'em',
			value: 7,
		},
		[ `Line-Height` ]: {
			viewport,
			unit: 'px',
			value: 24,
		},
	} )

	cy.adjust( 'Text Color', '#742f2f' ).assertComputedStyle( {
		'.ugb-expand__less-text p, .ugb-expand__more-text p': {
			[ `font-size` ]: '7em',
			[ `line-height` ]: '24px',
			[ `color` ]: '#742f2f',
		},
	} )

	assertAligns( 'Align', '.ugb-expand__less-text p, .ugb-expand__more-text p', { viewport } )

	// Test Link options
	cy.collapse( 'Link' )
	desktopOnly( () => {
		cy.adjust( 'Typography', {
			[ `Size` ]: 50,
			[ `Weight` ]: '700',
			[ `Transform` ]: 'lowercase',
			[ `Line-Height` ]: 4,
			[ `Letter Spacing` ]: 2.9,
		} ).assertComputedStyle( {
			'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
				[ `font-weight` ]: '700',
				[ `text-transform` ]: 'lowercase',
				[ `letter-spacing` ]: '2.9px',
			},
		} )
	} )

	cy.adjust( 'Typography', {
		[ `Size` ]: {
			viewport,
			value: 50,
		},
		[ `Line-Height` ]: {
			viewport,
			value: 4,
		},
	} ).assertComputedStyle( {
		'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
			[ `font-size` ]: '50px',
			[ `line-height` ]: '4em',
		},
	} )

	cy.adjust( 'Typography', {
		[ `Size` ]: {
			viewport,
			unit: 'em',
			value: 7,
		},
		[ `Line-Height` ]: {
			viewport,
			unit: 'px',
			value: 24,
		},
	} )

	cy.adjust( 'Link Color', '#742f2f' ).assertComputedStyle( {
		'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
			[ `font-size` ]: '7em',
			[ `line-height` ]: '24px',
			[ `color` ]: '#742f2f',
		},
	} )

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

