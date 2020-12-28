
/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts,
} from '../support/helpers'

describe( 'Feature Grid Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/feature-grid', '.ugb-feature-grid' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/feature-grid' ) )

	it( 'should switch layout', switchLayouts( 'ugb/feature-grid', [
		'Basic',
		'Plain',
		'Horizontal',
		'Large Mid',
		'Zigzag',
	] ) )
	it( 'should switch design', switchDesigns( 'ugb/feature-grid', [
		'Angled Feature Grid',
		'Arch Feature Grid',
		'Aspire Feature Grid',
		'Aurora Feature Grid',
		'Bean Feature Grid',
		'Capital Feature Grid',
		'Chic Feature Grid',
		'Dare Feature Grid 1',
		'Dare Feature Grid 2',
		'Dare Feature Grid 3',
		'Decora Feature Grid',
		'Detour Feature Grid',
		'Devour Feature Grid',
		'Dim Feature Grid',
		'Dustin Feature Grid',
		'Elevate Feature Grid',
		'Flex Feature Grid',
		'Glow Feature Grid 1',
		'Glow Feature Grid 2',
		'Heights Feature Grid 1',
		'Heights Feature Grid 2',
		'Hue Feature Grid',
		'Lush Feature Grid 1',
		'Lush Feature Grid 2',
		'Peplum Feature Grid',
		'Prime Feature Grid',
		'Proact Feature Grid',
		'Propel Feature Grid',
		'Seren Feature Grid',
		'Speck Feature Grid',
		'Upland Feature Grid',
		'Yule Feature Grid',
	] ) )
} )
