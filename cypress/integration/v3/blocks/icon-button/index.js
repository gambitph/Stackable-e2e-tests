/**
 * External dependencies
 */
export {
	blockExist,
	blockError,
}

function blockExist() {
	it( 'should show the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/button-group' )
		cy.deleteBlock( 'stackable/button' )
		cy.selectBlock( 'stackable/button-group' ).addNewColumn( { blockToAdd: 'Icon Button' } )
		cy.get( '.stk-block-icon-button' ).should( 'exist' )
		cy.savePost()
	} )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/button-group' )
		cy.deleteBlock( 'stackable/button' )
		cy.selectBlock( 'stackable/button-group' ).addNewColumn( { blockToAdd: 'Icon Button' } )
		cy.savePost()
		cy.reload()
	} )
}
