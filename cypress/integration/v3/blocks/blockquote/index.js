
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, assertInnerBlocks,
} from '~stackable-e2e/helpers'

export {
	blockExist,
	blockError,
	innerBlocksExist,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/blockquote', '.stk-block-blockquote' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/blockquote' ) )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/blockquote', [
		'.stk-block-icon',
		'.stk-block-text',
	] ) )
}
// TODO: Assert quote icon
