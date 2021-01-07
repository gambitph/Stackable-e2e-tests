/**
 * Internal dependencies
 */
import {
	assertBlockExist, blockErrorTest,
} from '../support/helpers'

describe( 'Expand Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/expand', '.ugb-expand' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/expand' ) )
} )
