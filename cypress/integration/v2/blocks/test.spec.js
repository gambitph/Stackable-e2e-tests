import {
	registerTests,
} from '~stackable-e2e/helpers'

describe( 'Spacer Block', registerTests( [
	blockTest,
] ) )

function blockTest() {
	it( 'should properly select control', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'core/image' )
		cy.openInspector( 'core/image', 'Block' )

		cy.setBlockAttribute( {
			'url': Cypress.env( 'DUMMY_IMAGE_URL' ),
		} )

		cy.collapse( 'Styles' )
		// cy.adjust( '' )
	} )
}
