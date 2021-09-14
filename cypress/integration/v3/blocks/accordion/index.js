
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, checkJsFiles, assertInnerBlocks,
} from '~stackable-e2e/helpers'
import { stkBlocks } from '~stackable-e2e/config'

export {
	blockExist,
	blockError,
	innerBlocks,
	innerBlocksExist,
	loadedFiles,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/accordion', '.stk-block-accordion' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/accordion' ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/accordion' )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/accordion' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/column', blockName, 1 ) )

		cy.savePost()
	} )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/accordion', [
		'.stk-block-icon-label',
		'.stk-block-text',
	] ) )
}

function loadedFiles() {
	it( 'should assert the loaded files in the frontend', checkJsFiles( 'stackable/accordion', '#stk-frontend-accordion-js' ) )
}
// TODO: Assert down arrow icon
