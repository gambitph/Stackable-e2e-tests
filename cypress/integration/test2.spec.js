describe( 'Utility Functio Test', () => {
	it( 'should do the right thing', () => {
		cy.setupWP()
		cy.loginAdmin()
		cy.newPage()
		cy.assertPluginError()
		cy.addBlock( 'ugb/accordion' )
	} )
} )
