
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
	it( 'should show the block', assertBlockExist( 'stackable/price', '.stk-block-price' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/price' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/price' ).asBlock( 'priceBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/text', '.stk-block-text__text', '£', 0 )
			.assertBlockContent( '.stk-block-text__text', '£' )
		cy.typeBlock( 'stackable/text', '.stk-block-text__text', '21', 1 )
			.assertBlockContent( '.stk-block-text__text', '21' )
		cy.typeBlock( 'stackable/text', '.stk-block-text__text', '.59', 2 )
			.assertBlockContent( '.stk-block-text__text', '.59' )
	} )
}
