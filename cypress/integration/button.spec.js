/**
 * Internal dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts,
} from '../support/helpers'

describe( 'Button Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/button', '.ugb-button' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/button' ) )

	it( 'should switch layout', switchLayouts( 'ugb/button', [
		'Basic',
		'Spread',
		{
			value: 'fullwidth',
		},
		'Grouped 1',
		'Grouped 2',
	] ) )

	it( 'should switch design', switchDesigns( 'ugb/button', [
		'Chic Button',
		'Decora Button',
		'Elevate Button',
		'Glow Button',
		'Heights Button',
		'Lume Button',
	] ) )
} )
