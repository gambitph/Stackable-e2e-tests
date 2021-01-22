/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest,
} from '~stackable-e2e/helpers'

describe( 'Spacer Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/spacer', '.ugb-spacer' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/spacer' ) )
} )
