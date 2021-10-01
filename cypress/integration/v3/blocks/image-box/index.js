
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
	it( 'should show the block', assertBlockExist( 'stackable/image-box', '.stk-block-image-box', { variation: 'Basic' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/image-box', { variation: 'Basic' } ) )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/image-box', [
		'.stk-block-subtitle',
		'.stk-block-heading',
		'.stk-block-text',
		'.stk-block-icon',
		'.stk-block-image',
	], { variation: 'Basic' } ) )
}
