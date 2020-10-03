describe( 'Utility Functio Test', () => {
	it( 'should do the right thing', () => {
		cy.newPage()
		cy.addBlock( 'ugb/icon-list' )

		cy.openInspector( 'ugb/icon-list', 'Style' )

		cy.collapse( 'Icon' )
		cy.adjust( 'Icon', 'star' )
		cy.adjust( 'Icon', {
			keyword: 'rebel',
			icon: 'ugb-icon--rebel',
		} )

		cy.resetStyle( 'Icon' )
	} )
} )
