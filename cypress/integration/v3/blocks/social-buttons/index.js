export {
	blockExist,
	blockError,
}

function blockExist() {
	it( 'should show the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'core/paragraph' )
		cy.typeBlock( 'core/paragraph', '', '/social buttons', 0 )
		cy.get( '.components-popover__content' )
			.contains( 'Social Buttons' )
			.click( { force: true } )
		cy.get( '.stk-block-button-group' ).should( 'exist' )
		cy.get( '.fa-facebook-square' ).should( 'exist' )
		cy.get( '.fa-twitter' ).should( 'exist' )
		cy.get( '.fa-instagram' ).should( 'exist' )
		cy.get( '.fa-youtube' ).should( 'exist' )
		cy.get( '.fa-linkedin-in' ).should( 'exist' )
		cy.savePost()
	} )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'core/paragraph' )
		cy.typeBlock( 'core/paragraph', '', '/social buttons', 0 )
		cy.get( '.components-popover__content' )
			.contains( 'Social Buttons' )
			.click( { force: true } )
		cy.savePost()
		cy.reload()
	} )
}
