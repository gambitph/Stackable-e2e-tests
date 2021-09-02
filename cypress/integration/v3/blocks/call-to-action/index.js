
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
	it( 'should show the block', assertBlockExist( 'stackable/call-to-action', '.stk-block-call-to-action' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/call-to-action' ) )
}
function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/call-to-action' )
		cy.selectBlock( 'stackable/call-to-action' )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/call-to-action' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/call-to-action', blockName ) )

		cy.savePost()
	} )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/call-to-action' ).asBlock( 'ctaBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/call-to-action', '.stk-block-heading__text', 'Test CTA block', 0 )
			.assertBlockContent( '.stk-block-heading__text', 'Test CTA block' )
		cy.typeBlock( 'stackable/call-to-action', '.stk-block-text__text', 'Lorem ipsum dolor sit amet.', 0 )
			.assertBlockContent( '.stk-block-call-to-action .stk-block-text__text', 'Lorem ipsum dolor sit amet.' )
		cy.typeBlock( 'stackable/call-to-action', '.stk-button__inner-text', 'Click here', 0 )
			.assertBlockContent( '.stk-block-call-to-action .stk-button__inner-text', 'Click here' )
	} )
}
