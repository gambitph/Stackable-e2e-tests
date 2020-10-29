describe( 'Utility Functio Test', () => {
	it( 'should do the right thing', () => {
		cy.newPage()
		cy.assertPluginError()
	} )
} )
