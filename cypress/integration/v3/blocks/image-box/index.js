
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
	it( 'should show the block', assertBlockExist( 'stackable/image-box', '.stk-block-image-box', { variation: 'Basic' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/image-box', { variation: 'Basic' } ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/image-box', { variation: 'Basic' } )

		cy.typeBlock( 'stackable/subtitle', '.stk-block-subtitle__text', 'My subtitle', 0 )
			.assertBlockContent( '.stk-block-subtitle__text', 'My subtitle' )
		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Image box', 0 )
			.assertBlockContent( '.stk-block-heading__text', 'Image box' )
		cy.typeBlock( 'stackable/text', '.stk-block-text__text', 'Lorem ipsum dolor sit amet.', 0 )
			.assertBlockContent( '.stk-block-text__text', 'Lorem ipsum dolor sit amet.' )
	} )
}
