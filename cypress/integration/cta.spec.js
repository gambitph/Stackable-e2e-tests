
/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts,
} from '../support/helpers'

describe( 'Call To Action Block', () => {
	// it( 'should show the block', assertBlockExist( 'ugb/cta', '.ugb-cta' ) )

	// it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/cta' ) )

	// it( 'should switch layout', switchLayouts( 'ugb/cta', [
	// 	'Basic',
	// 	'Plain',
	// 	'Horizontal',
	// 	'Horizontal 2',
	// 	'Horizontal 3',
	// 	'Split Centered',
	// ] ) )
	it( 'should switch design', switchDesigns( 'ugb/cta', [
		'Angled Call to Action 1',
		'Angled Call to Action 2',
		'Arch Call to Action',
		'Arch Call to Action 2',
		'Aspire Call to Action',
		'Aurora Call to Action 1',
		'Aurora Call to Action 2',
		'Bean Call to Action',
		'Capital Call to Action 1',
		'Capital Call to Action 2',
		'Cary Call to Action',
		'Chic Call to Action',
		'Dare Call to Action',
		'Decora Call to Action',
		'Devour Call to Action 1',
		'Devour Call to Action 2',
		'Dim Call to Action 1',
		'Dim Call to Action 2',
		'Dim Call to Action 3',
		'Dustin Call to Action 1',
		'Dustin Call to Action 2',
		'Elevate Call to Action',
		'Flex Call to Action',
		'Glow Call to Action',
		'Heights Call to Action 1',
		'Heights Call to Action 2',
		'Hue Call to Action 1',
		'Hue Call to Action 2',
		'Lounge Call to Action',
		'Lume Call to Action',
		'Lush Call to Action',
		'Peplum Call to Action',
		'Prime Call to Action',
		'Proact Call to Action 1',
		'Proact Call to Action 2',
		'Propel Call to Action',
		'Seren Call to Action',
		'Speck Call to Action',
		'Upland Call to Action',
		'Yule Call to Action',
	] ) )
} )
