/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'

describe( 'Accordion Block', registerTests( [ test ] ) )

function test() {
	it( 'should screenshot editor', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/accordion', { variation: 'Default Layout' } )
		cy.matchImageSnapshot()
	} )
}
