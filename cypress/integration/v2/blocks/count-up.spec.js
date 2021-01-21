/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts,
} from '~stackable-e2e/helpers'

describe( 'Count Up Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/count-up', '.ugb-count-up' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/count-up' ) )

	it( 'should switch layout', switchLayouts( 'ugb/count-up', [
		'Plain',
		'Plain 2',
		'Side',
		'Abstract',
		'Boxed',
	] ) )

	it( 'should switch design', switchDesigns( 'ugb/count-up', [
		'Bean Count Up',
		'Capital Count Up',
		'Chic Count Up',
		'Elevate Count Up',
		'Glow Count Up',
		'Heights Count Up',
		'Lounge Count Up',
		'Lume Count Up',
		'Lush Count Up',
		'Propel Count Up 1',
		'Propel Count Up 2',
		'Speck Count Up',
		'Upland Count Up',
	] ) )
} )
