
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, assertInnerBlocks,
} from '~stackable-e2e/helpers'

export {
	blockExist,
	blockError,
	selectIcon,
	innerBlocksExist,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/icon-label', '.stk-block-icon-label' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/icon-label' ) )
}

function selectIcon() {
	it( 'should assert selected icon', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/icon-label' )
		cy.selectBlock( 'stackable/icon-label' )
		cy.changeIcon( 1, 'facebook', 'ugb-icon--facebook' )
		cy.selectBlock( 'stackable/icon-label' )
			.find( 'svg[data-icon="facebook"]' )
			.should( 'exist' )
		cy.savePost()
		cy.getPostUrls().then( ( { previewUrl } ) => {
			cy.visit( previewUrl )
			cy.get( '.stk-block-icon-label' )
				.find( 'svg[data-icon="facebook"]' )
				.should( 'exist' )
		} )
	} )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/icon-label', [
		'.stk-block-heading',
		'.stk-block-icon',
	] ) )
}
