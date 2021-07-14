/**
 * External dependencies
 */
import { lowerCase } from 'lodash'
import {
	assertBlockExist, blockErrorTest, assertAligns, responsiveAssertHelper, assertTypography, assertAdvancedTab,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

export {
	blockExist,
	blockError,
	typeContent,
	desktopStyle,
	tabletStyle,
	mobileStyle,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/expand', '.ugb-expand' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/expand' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/expand' ).asBlock( 'expandBlock', { isStatic: true } )

		cy.typeBlock( 'ugb/expand', '.ugb-expand__title', 'Hello World! 1' )
			.assertBlockContent( '.ugb-expand__title', 'Hello World! 1' )
		cy.typeBlock( 'ugb/expand', '.ugb-expand__less-text', 'Helloo World!! 12' )
			.assertBlockContent( '.ugb-expand__less-text', 'Helloo World!! 12' )
		cy.typeBlock( 'ugb/expand', '.ugb-expand__more-toggle-text', 'Hellooo World!!! 123' )
			.assertBlockContent( '.ugb-expand__more-toggle-text', 'Hellooo World!!! 123' )
		cy.typeBlock( 'ugb/expand', '.ugb-expand__more-text', 'Helloooo World!!!! 1234' )
			.assertBlockContent( '.ugb-expand__more-text', 'Helloooo World!!!! 1234' )
		cy.typeBlock( 'ugb/expand', '.ugb-expand__less-toggle-text', 'Hellooooo World!!!!! 12345' )
			.assertBlockContent( '.ugb-expand__less-toggle-text', 'Hellooooo World!!!!! 12345' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/expand' ).asBlock( 'expandBlock', { isStatic: true } )
		cy.openInspector( 'ugb/expand', 'Style' )
		cy.typeBlock( 'ugb/expand', '.ugb-expand__title', 'Title' )
		cy.typeBlock( 'ugb/expand', '.ugb-expand__less-text', 'Less text' )
		cy.typeBlock( 'ugb/expand', '.ugb-expand__more-toggle-text', 'Show more link' )
		cy.typeBlock( 'ugb/expand', '.ugb-expand__more-text', 'More text here. Lorem Ipsum.' )
		cy.typeBlock( 'ugb/expand', '.ugb-expand__less-toggle-text', 'Show less link' )
	} )

	afterEach( () => cy.assertFrontendStyles( '@expandBlock' ) )

	it( `should assert General options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'General' )
		assertAligns( 'Align', '.ugb-inner-block', { viewport } )
	} )

	it( `should assert Title options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Title' )
		desktopOnly( () => {
			cy.adjust( 'Title HTML Tag', 'h6' )
				.assertHtmlTag( '.ugb-expand__title', 'h6' )
			cy.adjust( 'Title Color', '#742f2f' ).assertComputedStyle( {
				'.ugb-expand__title': {
					'color': '#742f2f',
				},
			} )
		} )
		assertTypography( '.ugb-expand__title', { viewport } )
		assertAligns( 'Align', '.ugb-expand__title', { viewport } )
	} )

	it( `should assert Text options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Text' )
		desktopOnly( () => {
			cy.adjust( 'Text Color', '#742f2f' ).assertComputedStyle( {
				'.ugb-expand__less-text p, .ugb-expand__more-text p': {
					'color': '#742f2f',
				},
			} )
		} )
		assertTypography( '.ugb-expand__less-text p, .ugb-expand__more-text p', { viewport } )
		assertAligns( 'Align', '.ugb-expand__less-text p, .ugb-expand__more-text p', { viewport } )
	} )

	it( `should assert Link options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Link' )
		desktopOnly( () => {
			cy.adjust( 'Link Color', '#742f2f' ).assertComputedStyle( {
				'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
					'color': '#742f2f',
				},
			} )
		} )
		assertTypography( '.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text', { viewport } )
		assertAligns( 'Align', '.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text', { viewport } )
	} )

	it( `should assert Spacing options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Spacing' )
		cy.adjust( 'Title', 44, { viewport } ).assertComputedStyle( {
			'.ugb-expand__title': {
				'margin-bottom': '44px',
			},
		} )
		cy.adjust( 'Text', 12, { viewport } ).assertComputedStyle( {
			'.ugb-expand__less-text, .ugb-expand__more-text': {
				'margin-bottom': '12px',
			},
		} )
		cy.adjust( 'Link', 39, { viewport } ).assertComputedStyle( {
			'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
				'margin-bottom': '39px',
			},
		} )
	} )
}

function advancedTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/expand' ).asBlock( 'expandBlock', { isStatic: true } )

	cy.typeBlock( 'ugb/expand', '.ugb-expand__title', 'Title here' )
	cy.typeBlock( 'ugb/expand', '.ugb-expand__less-text', 'Less Text here' )
	cy.typeBlock( 'ugb/expand', '.ugb-expand__more-toggle-text', 'More Toggle Text here' )
	cy.typeBlock( 'ugb/expand', '.ugb-expand__more-text', 'More text here' )
	cy.typeBlock( 'ugb/expand', '.ugb-expand__less-toggle-text', 'Less Toggle Text here' )
	cy.openInspector( 'ugb/expand', 'Advanced' )

	assertAdvancedTab( '.ugb-expand', {
		viewport,
		customCssSelectors: [
			'.ugb-expand__less-text p',
			'.ugb-expand__more-text p',
			'.ugb-expand__more-toggle-text',
			'.ugb-expand__less-toggle-text',
		],
	} )

	// Add more block specific tests.
	cy.assertFrontendStyles( '@expandBlock' )
}

