
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, checkJsFiles, assertInnerBlocks,
} from '~stackable-e2e/helpers'

export {
	blockExist,
	blockError,
	innerBlocksExist,
	loadedFiles,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/expand', '.stk-block-expand' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/expand' ) )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/expand', [
		'.stk-block-expand__short-text .stk-block-text__text',
		'.stk-block-expand__show-button .stk-button__inner-text',
		'.stk-block-expand__more-text .stk-block-text__text',
		'.stk-block-expand__hide-button .stk-button__inner-text',
	] ) )
}

function loadedFiles() {
	it( 'should assert the loaded files in the frontend', checkJsFiles( 'stackable/expand', '#stk-frontend-expand-js' ) )
}
