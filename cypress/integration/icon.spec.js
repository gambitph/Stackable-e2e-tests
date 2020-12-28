
/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns,
} from '../support/helpers'

describe( 'Icon Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/icon', '.ugb-icon' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/icon' ) )

	it( 'should switch design', switchDesigns( 'ugb/icon', [
		'Cary Icon',
		'Elevate Icon',
		'Hue Icon',
		'Lume Icon',
	] ) )
} )
