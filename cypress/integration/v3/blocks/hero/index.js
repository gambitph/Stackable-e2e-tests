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
	it( 'should show the block', assertBlockExist( 'stackable/hero', '.stk-block-hero' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/hero' ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/hero' )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/hero' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/hero', blockName ) )

		cy.savePost()
	} )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/hero', [
		'.stk-block-heading',
		'.stk-block-text',
		'.stk-block-button',
	] ) )
}
