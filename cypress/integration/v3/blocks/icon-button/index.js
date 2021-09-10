/**
 * External dependencies
 */
export {
	blockExist,
	blockError,
	selectIcon,
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

function selectIcon() {
	it( 'should assert selected icon', () => {
		cy.setupWP()
		cy.newPage()
		// add asBlock isStatic
		cy.addBlock( 'stackable/button-group' )
		cy.deleteBlock( 'stackable/button' )
		cy.selectBlock( 'stackable/button-group' ).addNewColumn( { blockToAdd: 'Icon Button' } )
		cy.selectBlock( 'stackable/icon-button' )
		cy.changeIcon( 1, 'facebook', 'ugb-icon--facebook' )
		cy.selectBlock( 'stackable/icon-button' )
			.find( 'svg[data-icon="facebook"]' )
			.should( 'exist' )
		// use assertHtmlAttribute
		cy.savePost()
		cy.getPostUrls().then( ( { previewUrl } ) => {
			cy.visit( previewUrl )
			cy.get( '.stk-block-icon-button' )
				.find( 'svg[data-icon="facebook"]' )
				.should( 'exist' )
		} )
	} )
}
