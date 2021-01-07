
/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns,
} from '../support/helpers'

describe( 'Video Popup Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/video-popup', '.ugb-video-popup' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/video-popup' ) )

	it( 'should switch design', switchDesigns( 'ugb/video-popup', [
		'Angled Video Popup',
		'Arch Video Popup',
		'Bean Video Popup',
		'Capital Video Popup',
		'Chic Video Popup',
		'Detour Video Popup',
		'Devour Video Popup',
		'Dim Video Popup',
		'Elevate Video Popup',
		'Hue Video Popup',
		'Peplum Video Popup',
		'Speck Video Popup',
	] ) )
} )
