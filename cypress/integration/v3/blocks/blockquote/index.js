
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
	pressEnterKey,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/blockquote', '.stk-block-blockquote' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/blockquote' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/blockquote' )
		cy.typeBlock( 'stackable/text', '.stk-block-text__text', 'Lorem ipsum dolor sit amet.', 0 )
			.assertBlockContent( '.stk-block-text__text', 'Lorem ipsum dolor sit amet.' )
	} )
}

function pressEnterKey() {
	it( 'should test clicking the enter key in text block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/blockquote' )

		cy.typeBlock( 'stackable/text', '.stk-block-text__text', 'Lorem ipsum dolor sit amet', 0 )
		cy.get( '.stk-block-text__text' ).type( '{enter}', { force: true } )

		cy.savePost()
		// Reloading should not cause a block error
		cy.reload()
	} )
}
