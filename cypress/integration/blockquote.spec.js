/**
 * Internal dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts,
} from '../support/helpers'

describe( 'Blockquote Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/blockquote', '.ugb-blockquote' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/blockquote' ) )

	it( 'should switch layout', switchLayouts( 'ugb/blockquote', [
		'Basic',
		'Plain',
		'Centered Quote',
		'Huge',
		'Highlight',
	] ) )
	it( 'should switch design', switchDesigns( 'ugb/blockquote', [
		'Cary Blockquote',
		'Chic Blockquote',
		'Dare Blockquote',
		'Detour Blockquote',
		'Dim Blockquote',
		'Dustin Blockquote',
		'Elevate Blockquote',
		'Hue Blockquote',
		'Lounge Blockquote',
		'Lume Blockquote',
		'Lush Blockquote',
		'Propel Blockquote',
		'Seren Blockquote',
		'Yule Blockquote',
	] ) )
} )
