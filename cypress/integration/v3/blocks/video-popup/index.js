/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, checkJsFiles, assertInnerBlocks, responsiveAssertHelper, Block, Advanced,
} from '~stackable-e2e/helpers'

const [ desktopStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	innerBlocksExist,
	loadedFiles,
	assertIcon,
	desktopStyle,
	desktopBlock,
	tabletBlock,
	mobileBlock,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/video-popup', '.stk-block-video-popup' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/video-popup' ) )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/video-popup', [
		'.stk-block-image',
		'.stk-block-icon',
	] ) )
}

function loadedFiles() {
	it( 'should assert the loaded files in the frontend', checkJsFiles( 'stackable/video-popup', '#stk-frontend-video-popup-js' ) )
}

function assertIcon() {
	it( 'should assert the correct icon is added for the video popup', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/video-popup' )
		cy.get( '.stk-block-video-popup .fa-play' ).should( 'exist' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/video-popup' ).asBlock( 'videoPopupBlock', { isStatic: true } )
		cy.openInspector( 'stackable/video-popup', 'Style' )
		cy.savePost()
	} )

	afterEach( () => cy.assertFrontendStyles( '@videoPopupBlock' ) )

	it( 'should assert General panel in Style tab', () => {
		desktopOnly( () => {
			cy.collapse( 'General' )
			cy.setBlockAttribute( {
				videoLink: Cypress.env( 'DUMMY_VIDEO_URL' ),
			} )
			cy.collapse( 'General' )
			cy.adjust( 'Popup Option #2: Video URL', Cypress.env( 'DUMMY_VIDEO_URL' ) ).assertHtmlAttribute( '.stk-block-video-popup', 'data-video', Cypress.env( 'DUMMY_VIDEO_URL' ), { assertBackend: false } )
			// Dynamic Content button should be present
			cy.getBaseControl( '.components-base-control:contains(Popup Option #2: Video URL)' ).find( 'button[aria-label="Dynamic Fields"]' ).should( 'exist' )
		} )
	} )
}

const assertBlockTab = Block
	.includes( [
		'Alignment',
		'Background',
		'Size & Spacing',
		'Borders & Shadows',
	] )
	.run

function blockTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/video-popup' ).asBlock( 'videoPopupBlock', { isStatic: true } )
		cy.openInspector( 'stackable/video-popup', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-video-popup',
		alignmentSelector: '.stk-block-video-popup > .stk-inner-blocks',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
		contentHorizontalAlignAssertOptions: { assertBackend: false },
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@videoPopupBlock' )
	} )
}

const assertAdvancedTab = Advanced
	.includes( [
		'General',
		'Position',
		'Transform & Transition',
		'Motion Effects',
		'Custom Attributes',
		'Custom CSS',
		'Responsive',
		'Conditional Display',
		'Advanced',
	] )
	.run

function advancedTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/video-popup' ).asBlock( 'videoPopupBlock', { isStatic: true } )
		cy.openInspector( 'stackable/video-popup', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-video-popup',
		blockName: 'stackable/video-popup',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@videoPopupBlock' )
	} )
}
