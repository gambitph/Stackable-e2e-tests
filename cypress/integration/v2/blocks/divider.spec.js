/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchLayouts, assertAligns, registerTests, responsiveAssertHelper,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )

describe( 'Divider Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/divider', '.ugb-divider' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/divider' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/divider', [
		{ value: 'Basic', selector: '.ugb-divider--design-basic' },
		{ value: 'Bar', selector: '.ugb-divider--design-bar' },
		{ value: 'Dots', selector: '.ugb-divider--design-dots' },
		{ value: 'Asterisks', selector: '.ugb-divider--design-asterisks' },
	] ) )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/divider' )
	cy.openInspector( 'ugb/divider', 'Style' )

	// Test General options
	cy.collapse( 'General' )

	desktopOnly( () => {
		cy.adjust( 'Color', '#000000' )
		cy.adjust( 'Height / Size', 9 )
		cy.adjust( 'Width (%)', 68 ).assertComputedStyle( {
			'.ugb-divider__hr': {
				[ `background-color` ]: '#000000',
				[ `height` ]: '9px',
				[ `width` ]: '68%',
			},
		} )
		cy.adjust( 'Vertical Margin', 32 ).assertComputedStyle( {
			'.ugb-block-content': {
				[ `margin-top` ]: '32px',
				[ `margin-bottom` ]: '32px',
			},
		} )
	} )

	assertAligns( 'Align', '.ugb-inner-block', { viewport } )
}
