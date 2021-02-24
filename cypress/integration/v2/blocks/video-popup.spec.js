
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, registerTests, responsiveAssertHelper, assertAdvancedTab,
} from '~stackable-e2e/helpers'

const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Video Popup Block', registerTests( [
	blockExist,
	blockError,
	switchDesign,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
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

function advancedTab( viewport, desktopOnly, registerBlockSnapshots ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/video-popup' ).as( 'videoPopupBlock' )
	const videoPopupBlock = registerBlockSnapshots( 'videoPopupBlock' )

	cy.openInspector( 'ugb/video-popup', 'Advanced' )

	assertAdvancedTab( '.ugb-video-popup', { viewport } )

	// Add more block specific tests.
	videoPopupBlock.assertFrontendStyles()
}

