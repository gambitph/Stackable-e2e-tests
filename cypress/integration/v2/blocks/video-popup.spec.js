
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, registerTests,
} from '~stackable-e2e/helpers'

describe( 'Video Popup Block', registerTests( [
	blockExist,
	blockError,
	switchDesign,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/video-popup', '.ugb-video-popup' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/video-popup' ) )
}

function switchDesign() {
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
}
