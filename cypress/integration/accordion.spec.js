/**
 * Internal dependencies
 */
import { blocks } from '../config'
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts,
} from '../support/helpers'

describe( 'Accordion Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/accordion', '.ugb-accordion' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/accordion' ) )

	it( 'should allow adding inner blocks inside accordion', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/accordion' )
		cy.selectBlock( 'ugb/accordion' )
		cy.get( '.ugb-accordion__heading' ).click( { force: true } )
		cy.deleteBlock( 'core/paragraph' )
		cy.wait( 1000 )

		blocks
			.filter( blockName => blockName !== 'ugb/accordion' )
			.forEach( blockName => cy.appendBlock( blockName ) )
	} )
	it( 'should switch layout', switchLayouts( 'ugb/accordion', [
		'Basic',
		'Plain',
		'Line Colored',
		'Colored',
	] ) )
	it( 'should switch design', switchDesigns( 'ugb/accordion', [
		'Dim Accordion',
		'Elevate Accordion',
		'Lounge Accordion',
	] ) )
} )
