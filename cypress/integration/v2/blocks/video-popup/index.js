
/**
 * External dependencies
 */
import { lowerCase } from 'lodash'
import {
	assertBlockExist, blockErrorTest, switchDesigns, assertBlockTitleDescriptionContent, responsiveAssertHelper, assertAdvancedTab, assertContainer, assertBlockTitleDescription, assertBlockBackground, assertSeparators,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

export {
	blockExist,
	blockError,
	switchDesign,
	typeContent,
	desktopStyle,
	tabletStyle,
	mobileStyle,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
}

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

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/video-popup' ).asBlock( 'videoPopupBlock', { isStatic: true } )
		cy.openInspector( 'ugb/video-popup', 'Style' )

		assertBlockTitleDescriptionContent( 'ugb/video-popup' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/video-popup' ).asBlock( 'videoPopupBlock', { isStatic: true } )
		cy.openInspector( 'ugb/video-popup', 'Style' )
	} )

	// eslint-disable-next-line no-undef
	afterEach( () => cy.assertFrontendStyles( '@videoPopupBlock' ) )

	it( `should assert General options in ${ lowerCase( viewport ) }`, () => {
		cy.setBlockAttribute( {
			videoLink: Cypress.env( 'DUMMY_VIDEO_URL' ),
		} )
		cy.collapse( 'General' )
		cy.adjust( 'Popup Option #2: Video URL', Cypress.env( 'DUMMY_VIDEO_URL' ) )
	} )

	it( `should assert Container options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Container' )
		assertContainer( '.ugb-video-popup__wrapper', { viewport }, 'preview%sBackgroundMediaUrl' )
		cy.adjust( 'Width', 632, { viewport } )
		cy.adjust( 'Height', 567, { viewport } ).assertComputedStyle( {
			'.ugb-video-popup__wrapper': {
				'max-width': '632px',
				'height': '567px',
			},
		} )
	} )

	it( `should assert Play Button options in ${ lowerCase( viewport ) }`, () => {
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
	} )

	it( `should assert Effects options in ${ lowerCase( viewport ) }`, () => {
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
	} )

	it( `should assert Block Title & Description options in ${ lowerCase( viewport ) }`, () => {
		assertBlockTitleDescription( { viewport } )
	} )

	it( `should assert Block Background options in ${ lowerCase( viewport ) }`, () => {
		assertBlockBackground( '.ugb-video-popup', { viewport } )
	} )

	it( `should assert Top & Bottom Separator options in ${ lowerCase( viewport ) }`, () => {
		assertSeparators( { viewport } )
	} )
}

function advancedTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/video-popup' ).asBlock( 'videoPopupBlock', { isStatic: true } )
	cy.openInspector( 'ugb/video-popup', 'Advanced' )

	assertAdvancedTab( '.ugb-video-popup', {
		viewport,
		customCssSelectors: [
			'.ugb-video-popup__wrapper',
			'.ugb-video-popup__wrapper:before',
			'.ugb-video-popup__play-button',
			'.ugb-video-popup__play-button svg',
		],
	} )

	// Add more block specific tests.
	cy.assertFrontendStyles( '@videoPopupBlock' )
}

