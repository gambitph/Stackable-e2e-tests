
/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import {
	assertBlockExist, blockErrorTest,
} from '../support/helpers'

describe( 'Advanced Heading Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/heading', '.ugb-heading' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/heading' ) )
} )
