/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, responsiveAssertHelper, assertAligns, assertButton, assertBlockBackground, assertSeparators,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )

describe( 'Button Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/button', '.ugb-button' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/button' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/button', [
		'Basic',
		{ value: 'Spread', selector: '.ugb-button--design-spread' },
		{ value: 'fullwidth', selector: '.ugb-button--design-fullwidth' },
		{ value: 'Grouped 1', selector: '.ugb-button--design-grouped-1' },
		{ value: 'Grouped 2', selector: '.ugb-button--design-grouped-2' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/button', [
		'Chic Button',
		'Decora Button',
		'Elevate Button',
		'Glow Button',
		'Heights Button',
		'Lume Button',
	] ) )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/button' )
	cy.openInspector( 'ugb/button', 'Style' )

	cy.collapse( 'General' )

	desktopOnly( () => {
		cy.adjust( 'Border Radius', 20 ).assertComputedStyle( {
			'.ugb-block-content .ugb-button': {
				[ `border-radius` ]: '20px',
			},
		}, { wait: 300 } )
		cy.adjust( 'Collapse Buttons On', 'tablet' )
			.assertClassName( '.ugb-button-wrapper', 'ugb-button--collapse-tablet' )
	} )

	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	cy.collapse( 'Button #1' )
	assertButton( '.ugb-button1', { viewport } )

	cy.collapse( 'Button #2' )
	cy.toggleStyle( 'Button #2' )
	assertButton( '.ugb-button2', { viewport } )

	cy.collapse( 'Button #3' )
	cy.toggleStyle( 'Button #3' )
	assertButton( '.ugb-button3', { viewport } )

	assertBlockBackground( '.ugb-button-wrapper', { viewport } )
	assertSeparators( { viewport } )
}
