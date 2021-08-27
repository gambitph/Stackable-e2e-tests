
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest,
} from '~stackable-e2e/helpers'
import { stkBlocks } from '~stackable-e2e/config'

export {
	blockExist,
	blockError,
	innerBlocks,
	typeContent,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/card', '.stk-block-card' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/card' ) )
}
function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/card' )
		cy.selectBlock( 'stackable/card' )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/card' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/card', blockName ) )

		cy.savePost()
	} )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/card' ).asBlock( 'cardBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/card', '.stk-block-heading__text', 'Test Card block', 0 )
			.assertBlockContent( '.stk-block-heading__text', 'Test Card block' )
		cy.typeBlock( 'stackable/card', '.stk-block-text__text', 'Lorem ipsum dolor sit amet.', 0 )
			.assertBlockContent( '.stk-block-text__text', 'Lorem ipsum dolor sit amet.' )
		cy.typeBlock( 'stackable/card', '.stk-block-button__inner-text', 'Click here', 0 )
			.assertBlockContent( '.stk-block-button__inner-text', 'Click here' )
	} )
}
// TODO: Add test for adding image content to Card's image
