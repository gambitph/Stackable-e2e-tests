/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest,
} from '~stackable-e2e/helpers'

export {
	blockExist,
	blockError,
	typeContent,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/posts', '.stk-block-posts' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/posts' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.registerPosts( { numOfPosts: 1 } )
		cy.newPage()
		cy.addBlock( 'stackable/posts' )

		cy.typeBlock( 'stackable/posts', '.stk-block-posts__readmore', 'Click to read more', 0 )
			.assertBlockContent( '.stk-block-posts__readmore', 'Click to read more' )
	} )
}

// TODO: Add tests for adding the Load more button & Pagination
