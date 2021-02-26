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
		cy.addBlock( 'core/heading' )
		cy.openInspector( 'core/heading', 'Block' )

		cy.collapse( 'Typography' )
		cy.adjust( 'Font size', 'Gigantic', { parentElement: '.components-custom-select-control' } )
	} )
}
