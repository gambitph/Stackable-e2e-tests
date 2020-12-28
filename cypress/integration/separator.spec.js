/**
 * Internal dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchLayouts,
} from '../support/helpers'

describe( 'Separator', () => {
	it( 'should show the block', assertBlockExist( 'ugb/separator', '.ugb-separator' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/separator' ) )

	it( 'should switch layout', switchLayouts( 'ugb/separator', [
		'Wave 1',
		'Wave 2',
		'Wave 3',
		'Wave 4',
		'Slant 1',
		'Slant 2',
		'Curve 1',
		'Curve 2',
		'Curve 3',
		'Rounded 1',
		'Rounded 2',
		'Rounded 3',
	] ) )
} )
