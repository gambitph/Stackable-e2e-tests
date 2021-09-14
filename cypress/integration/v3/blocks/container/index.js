
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
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/container', '.stk-block-container' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/container' ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/container' )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/container' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/container', blockName, 0 ) )

		cy.savePost()
	} )
}
