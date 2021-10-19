/**
 * External dependencies
 */
import { lowerCase } from 'lodash'
import {
	assertBlockExist, blockErrorTest, switchDesigns, assertBlockTitleDescriptionContent, responsiveAssertHelper, assertAligns, assertBlockTitleDescription, assertBlockBackground, assertSeparators, assertTypography, assertAdvancedTab,
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
	it( 'should show the block', assertBlockExist( 'ugb/icon-list', '.ugb-icon-list' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/icon-list' ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/icon-list', [
		'Angled Icon List',
		'Arch Icon List',
		'Aspire Icon List',
		'Aspire Icon List 2',
		'Aurora Icon List',
		'Capital Icon List',
		'Dare Icon List',
		'Devour Icon List',
		'Dustin Icon List',
		'Elevate Icon List',
		'Flex Icon List',
		'Glow Icon List',
		'Heights Icon List 1',
		'Heights Icon List 2',
		'Lume Icon List',
		'Lush Icon List',
		'Prime Icon List',
		'Proact Icon List 1',
		'Proact Icon List 2',
		'Propel Icon List',
		'Seren Icon List',
		'Speck Icon List',
		'Yule Icon List',
	] ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/icon-list' ).asBlock( 'iconListBlock', { isStatic: true } )

		cy.typeBlock( 'ugb/icon-list', '.block-editor-rich-text__editable', 'Helloo World!! 12', 0 )
			.assertBlockContent( '.ugb-block-content ul', 'Helloo World!! 12' )

		cy.openInspector( 'ugb/icon-list', 'Style' )
		assertBlockTitleDescriptionContent( 'ugb/icon-list' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/icon-list' ).asBlock( 'iconListBlock', { isStatic: true } )
		cy.openInspector( 'ugb/icon-list', 'Style' )
		cy.collapse( 'General' )
		cy.adjust( 'Columns', 4, { viewport } )
	} )

	afterEach( () => cy.assertFrontendStyles( '@iconListBlock' ) )

	it( `should assert General options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'General' )
		cy.adjust( 'Columns', 4, { viewport } ).assertComputedStyle( {
			'.ugb-icon-list ul': {
				'columns': 'auto 4',
			},
		} )
		desktopOnly( () => {
			cy.adjust( 'Display as a grid (left to right & evenly spaced)', true )
		} )
		assertAligns( 'Align', '.ugb-inner-block', { viewport } )
	} )

	it( `should assert Spacing options in ${ lowerCase( viewport ) }`, () => {
		desktopOnly( () => {
			cy.collapse( 'Spacing' )
			cy.adjust( 'List Gap', 25 ).assertComputedStyle( {
				'ul li': {
					'margin-bottom': '25px',
				},
			} )
		} )
	} )

	it( `should assert Icon options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Icon' )
		cy.waitFA()
		cy.adjust( 'Icon', 'info' )
		desktopOnly( () => {
			cy.adjust( 'Icon Color', '#538fa9' )
		} )
		cy.adjust( 'Icon Size', 23, { viewport } ).assertComputedStyle( {
			'li:before': {
				'width': '23px',
				'height': '23px',
			},
		} )
		desktopOnly( () => {
			cy.adjust( 'Icon Opacity', 0.6 )
			cy.adjust( 'Icon Rotation', 128 ).assertComputedStyle( {
				'li:before': {
					'opacity': '0.6',
					'transform': 'matrix(-0.615661, 0.788011, -0.788011, -0.615661, 0, 0)',
				},
			} )
		} )
	} )

	it( `should assert List Text options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'List Text' )
		desktopOnly( () => {
			cy.adjust( 'Color', '#742f2f' ).assertComputedStyle( {
				li: {
					'color': '#742f2f',
				},
			} )
		} )
		assertTypography( 'li', { viewport } )
	} )

	it( `should assert Block Title & Description options in ${ lowerCase( viewport ) }`, () => {
		assertBlockTitleDescription( { viewport } )
	} )

	it( `should assert Block Background options in ${ lowerCase( viewport ) }`, () => {
		assertBlockBackground( '.ugb-icon-list', { viewport } )
	} )

	it( `should assert Top & Bottom Separator options in ${ lowerCase( viewport ) }`, () => {
		assertSeparators( { viewport } )
	} )
}

function advancedTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/icon-list' ).asBlock( 'iconListBlock', { isStatic: true } )

	cy.openInspector( 'ugb/icon-list', 'Advanced' )

	assertAdvancedTab( '.ugb-icon-list', {
		viewport,
		customCssSelectors: [
			'ul',
			'li',
			'li:before',
		],
	} )

	// Add more block specific tests.
	cy.assertFrontendStyles( '@iconListBlock' )
}
