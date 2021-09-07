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
	it( 'should show the block', assertBlockExist( 'stackable/team-member', '.stk-block-team-member' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/team-member' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/team-member' )

		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'John Doe', 0 )
			.assertBlockContent( '.stk-block-heading__text', 'John Doe' )
		cy.typeBlock( 'stackable/subtitle', '.stk-block-subtitle__text', 'CEO', 0 )
			.assertBlockContent( '.stk-block-subtitle__text', 'CEO' )
		cy.typeBlock( 'stackable/text', '.stk-block-text__text', 'Lorem ipsum dolor sit amet', 0 )
			.assertBlockContent( '.stk-block-text__text', 'Lorem ipsum dolor sit amet' )
	} )
}
