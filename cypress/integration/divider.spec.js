/**
 * Internal dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchLayouts,
} from '../support/helpers'

describe( 'Divider Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/divider', '.ugb-divider' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/divider' ) )

	it( 'should switch layout', switchLayouts( 'ugb/divider', [
		'Basic',
		'Bar',
		'Dots',
		'Asterisks',
	] ) )
} )
