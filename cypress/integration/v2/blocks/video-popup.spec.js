
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, registerTests, responsiveAssertHelper, assertAdvancedTab, assertContainer, assertBlockTitleDescription, assertBlockBackground, assertSeparators,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Video Popup Block', registerTests( [
	blockExist,
	blockError,
	switchDesign,
	desktopStyle,
	tabletStyle,
	mobileStyle,
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

function styleTab( viewport, desktopOnly, registerBlockSnapshots ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/video-popup' ).as( 'videoPopupBlock' )
	const videoPopupBlock = registerBlockSnapshots( 'videoPopupBlock' )
	cy.openInspector( 'ugb/video-popup', 'Style' )

	cy.setBlockAttribute( {
		'videoLink': Cypress.env( 'DUMMY_VIDEO_URL' ),
	} )

	cy.collapse( 'Container' )
	assertContainer( '.ugb-video-popup__wrapper', { viewport }, 'preview%sBackgroundMediaUrl' )
	cy.adjust( 'Width', 632, { viewport } )
	cy.adjust( 'Height', 567, { viewport } ).assertComputedStyle( {
		'.ugb-video-popup__wrapper': {
			'max-width': '632px',
			'height': '567px',
		},
	} )

	cy.collapse( 'Play Button' )
	desktopOnly( () => {
		cy.adjust( 'Button Style', 'circle' )
		cy.get( 'svg.ugb-play-button-cirle' ).should( 'exist' )
		cy.adjust( 'Color', '#19ff00' )
		cy.adjust( 'Opacity', 0.8 ).assertComputedStyle( {
			'.ugb-video-popup__play-button svg': {
				'fill': '#19ff00',
				'opacity': '0.8',
			},
		} )
	} )
	cy.adjust( 'Size', 73, { viewport } ).assertComputedStyle( {
		'.ugb-video-popup__play-button svg': {
			'height': '73px',
			'width': '73px',
		},
	} )

	desktopOnly( () => {
		cy.collapse( 'Effects' )
		const hoverEffects = [
			'shadow',
			'lift',
			'lift-more',
			'lift-shadow',
			'lift-staggered',
			'lift-shadow-staggered',
			'scale',
			'scale-more',
			'scale-shadow',
			'lower',
			'lower-more',
		]
		hoverEffects.forEach( effect => {
			cy.adjust( 'Hover Effect', effect )
				.assertClassName( '.ugb-video-popup__wrapper', `ugb--hover-${ effect }` )
		} )
	} )

	assertBlockTitleDescription( { viewport } )
	assertBlockBackground( '.ugb-video-popup', { viewport } )
	assertSeparators( { viewport } )
	videoPopupBlock.assertFrontendStyles()
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

