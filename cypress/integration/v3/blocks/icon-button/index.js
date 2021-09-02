
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest,
} from '~stackable-e2e/helpers'

export {
	blockExist,
	blockError,
	selectIcon,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/icon-button', '.stk-block-icon-button' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/icon-button' ) )
}

function selectIcon() {
	it( 'should assert selected icon', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/button-group' )
		cy.selectBlock( 'stackable/button-group' ).addNewColumn( { blockToAdd: 'Icon Button' } )
		cy.selectBlock( 'stackable/icon-button' )
		cy.changeIcon( 1, 'facebook', 'ugb-icon--facebook' )
		cy.selectBlock( 'stackable/icon-button' )
			.find( 'svg[data-icon="facebook"]' )
			.should( 'exist' )
		cy.savePost()
		cy.getPostUrls().then( ( { previewUrl } ) => {
			cy.visit( previewUrl )
			cy.get( '.stk-block-icon-button' )
				.find( 'svg[data-icon="facebook"]' )
				.should( 'exist' )
		} )
	} )
}
