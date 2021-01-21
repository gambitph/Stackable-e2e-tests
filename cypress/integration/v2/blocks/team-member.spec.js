/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts,
} from '~stackable-e2e/helpers'

describe( 'Team Member Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/team-member', '.ugb-team-member' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/team-member' ) )
	it( 'should switch layout', switchLayouts( 'ugb/team-member', [
		'Basic',
		'Plain',
		'Horizontal',
		'Overlay',
		'Overlay Simple',
		'Half',
	] ) )

	it( 'should switch design', switchDesigns( 'ugb/team-member', [
		'Capital Team Member',
		'Cary Team Member 1',
		'Cary Team Member 2',
		'Decora Team Member',
		'Detour Team Member',
		'Dim Team Member',
		'Elevate Team Member',
		'Glow Team Member',
		'Heights Team Member',
		'Hue Team Member',
		'Lume Team Member',
		'Lush Team Member',
		'Prime Team Member',
		'Seren Team Member 1',
		'Seren Team Member 2',
		'Upland Team Member',
	] ) )
} )
