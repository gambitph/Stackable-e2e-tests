/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchLayouts, assertAligns,
} from '~stackable-e2e/helpers'

describe( 'Divider Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/divider', '.ugb-divider' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/divider' ) )

	it( 'should switch layout', switchLayouts( 'ugb/divider', [
		'Basic',
		'Bar',
		'Dots',
		'Asterisks',
	] ) )

	it( 'should adjust desktop options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/divider' )
		cy.openInspector( 'ugb/divider', 'Style' )

		// Test General options
		cy.collapse( 'General' )
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

		// Test General Alignment
		assertAligns( 'Align', '.ugb-inner-block' )
	} )

	it( 'should adjust tablet options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/divider' )
		cy.openInspector( 'ugb/divider', 'Style' )

		cy.collapse( 'General' )
		assertAligns( 'Align', '.ugb-inner-block', { viewport: 'Tablet' } )
	} )

	it( 'should adjust mobile options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/divider' )
		cy.openInspector( 'ugb/divider', 'Style' )

		cy.collapse( 'General' )
		assertAligns( 'Align', '.ugb-inner-block', { viewport: 'Mobile' } )
	} )
} )
