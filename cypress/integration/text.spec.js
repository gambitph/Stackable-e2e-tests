/**
 * Internal dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchLayouts, switchDesigns,
} from '../support/helpers'
describe( 'Advanced Text Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/text', '.ugb-text' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/text' ) )

	it( 'should switch layout', switchLayouts( 'ugb/text', [
		'Plain',
		'Side Title 1',
		'Side Title 2',
	] ) )

	it( 'should switch design', switchDesigns( 'ugb/text', [
		'Angled Advanced Text',
		'Aspire Advanced Text',
		'Aurora Advanced Text',
		'Dare Advanced Text',
		'Decora Advanced Text',
		'Detour Advanced Text',
		'Dim Advanced Text',
		'Elevate Advanced Text',
		'Flex Advanced Text',
		'Glow Advanced Text',
		'Lounge Advanced Text',
		'Lume Advanced Text',
		'Lush Advanced Text',
		'Peplum Advanced Text',
		'Proact Advanced Text 1',
		'Proact Advanced Text 2',
		'Seren Advanced Text',
	] ) )
} )
