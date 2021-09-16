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
	it( 'should show the block', assertBlockExist( 'stackable/video-popup', '.stk-block-video-popup' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/video-popup' ) )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/video-popup', [
		'.stk-block-image',
		'.stk-block-icon',
	] ) )
}

function loadedFiles() {
	it( 'should assert the loaded files in the frontend', checkJsFiles( 'stackable/video-popup', '#stk-frontend-video-popup-js' ) )
}
// TODO: Assert play icon
