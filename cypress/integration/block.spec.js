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
		cy.publish()
		cy.reload()

		cy.addBlock( 'core/heading' )

		cy.addBlock( 'ugb/card' )

		cy.typeBlock( 'ugb/card', '.ugb-card__item1>.ugb-card__content>.ugb-card__title', 'Card Title 1' )
		cy.typeBlock( 'ugb/card', '.ugb-card__item2>.ugb-card__content>.ugb-card__title', 'Card Title 2' )

		cy.openInspector( 'ugb/card', 'Style' )

		cy.collapse( 'General' )

		cy.adjust( 'Columns', 3 )
		cy.adjust( 'Border Radius', 15 )
		cy.adjust( 'Shadow / Outline', 5 )

		// Test the catching of errors
		cy.window().then( win => {
			win.console.error( 'It should throw an error in Cypress.' )
		} )

		cy.openSidebar( 'Stackable Settings' )
	} )
} )
