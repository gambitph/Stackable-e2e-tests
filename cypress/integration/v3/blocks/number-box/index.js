
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
	it( 'should show the block', assertBlockExist( 'stackable/number-box', '.stk-block-number-box' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/number-box' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/number-box' ).asBlock( 'numberBoxBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/number-box', '.stk-block-number-box__text', '21', 0 )
			.assertBlockContent( '.stk-block-number-box__text', '21' )
	} )
}
