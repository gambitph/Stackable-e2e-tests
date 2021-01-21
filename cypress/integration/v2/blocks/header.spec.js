/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts,
} from '~stackable-e2e/helpers'

describe( 'Header', () => {
	it( 'should show the block', assertBlockExist( 'ugb/header', '.ugb-header' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/header' ) )

	it( 'should switch layout', switchLayouts( 'ugb/header', [
		'Basic',
		'Plain',
		'Half Overlay',
		'Center Overlay',
		'Side Overlay',
		'Half',
		'Huge',
	] ) )

	it( 'should switch design', switchDesigns( 'ugb/header', [
		'Angled Header',
		'Arch Header 1',
		'Arch Header 2',
		'Aspire Header',
		'Aurora Header',
		'Bean Header',
		'Capital Header',
		'Cary Header',
		'Chic Header',
		'Dare Header',
		'Decora Header',
		'Detour Header',
		'Devour Header',
		'Dim Header',
		'Dustin Header',
		'Elevate Header',
		'Flex Header 1',
		'Flex Header 2',
		'Glow Header',
		'Heights Header',
		'Hue Header',
		'Lounge Header',
		'Lume Header',
		'Lush Header',
		'Peplum Header',
		'Prime Header',
		'Proact Header',
		'Propel Header 1',
		'Propel Header 2',
		'Seren Header',
		'Speck Header',
		'Upland Header',
		'Yule Header',
	] ) )
} )
