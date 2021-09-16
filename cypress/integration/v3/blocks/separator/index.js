/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest,
} from '~stackable-e2e/helpers'

export {
	blockExist,
	blockError,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/separator', '.stk-block-separator' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/separator' ) )
}
