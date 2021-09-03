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
	it( 'should show the block', assertBlockExist( 'stackable/subtitle', '.stk-block-subtitle' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/subtitle' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/subtitle' )

		cy.typeBlock( 'stackable/subtitle', '.stk-block-subtitle__text', 'Subtitle block', 0 )
			.assertBlockContent( '.stk-block-subtitle__text', 'Subtitle block' )
	} )
}
