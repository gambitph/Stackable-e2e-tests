/**
 * Internal dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts,
} from '../support/helpers'

describe( 'Image Box Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/image-box', '.ugb-image-box' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/image-box' ) )

	it( 'should switch layout', switchLayouts( 'ugb/image-box', [
		'Basic',
		'Plain',
		'Box',
		'Captioned',
		'Fade',
		'Line',
	] ) )

	it( 'should switch design', switchDesigns( 'ugb/image-box', [
		'Aspire Image Box',
		'Aurora Image Box',
		'Bean Image Box',
		'Cary Image Box',
		'Dare Image Box',
		'Detour Image Box',
		'Devour Image Box',
		'Dim Image Box',
		'Elevate Image Box',
		'Flex Image Box 1',
		'Flex Image Box 2',
		'Glow Image Box',
		'Lume Image Box 1',
		'Lume Image Box 2',
		'Lush Image Box 1',
		'Lush Image Box 2',
		'Peplum Image Box',
		'Proact Image Box',
		'Upland Image Box 1',
		'Upland Image Box 2',
	] ) )
} )
