
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, assertInnerBlocks,
} from '~stackable-e2e/helpers'
import { stkBlocks } from '~stackable-e2e/config'

export {
	blockExist,
	blockError,
	innerBlocks,
	innerBlocksExist,
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

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/call-to-action', [
		'.stk-block-heading',
		'.stk-block-text',
		'.stk-block-button',
	] ) )
}
