describe( 'Block Test', () => {
	it( 'should manipulate block contents and attributes', () => {
		cy.newPage()
		cy.addBlock( 'ugb/header' )
		cy.typeBlock( 'ugb/header', '.ugb-header__title', 'This is a header1' )
		cy.typeBlock( 'ugb/header', '.ugb-header__subtitle', 'This is a subtitle for header1' )
		cy.typeBlock( 'ugb/header', '.ugb-button--inner', 'Button text1' )

		cy.addBlock( 'ugb/header' )

		cy.typeBlock( 'ugb/header', '.ugb-header__title', 'This is a header2' )
		cy.typeBlock( 'ugb/header', '.ugb-header__subtitle', 'This is a subtitle for header2' )
		cy.typeBlock( 'ugb/header', '.ugb-button--inner', 'Button text2' )

		cy.deleteBlock( 'ugb/header', 'This is a header1' )

		cy.openSidebar( 'Stackable Settings' )
	} )
} )
