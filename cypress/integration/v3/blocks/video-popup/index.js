/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, checkJsFiles, assertInnerBlocks, responsiveAssertHelper, Block,
} from '~stackable-e2e/helpers'

const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	innerBlocksExist,
	loadedFiles,
	desktopBlock,
	tabletBlock,
	mobileBlock,
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
// TODO: Assert play icon

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
		cy.addBlock( 'stackable/video-popup' )
		cy.selectBlock( 'stackable/video-popup' ).asBlock( 'videoPopupBlock', { isStatic: true } )
		cy.openInspector( 'stackable/video-popup', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-video-popup',
		alignmentSelector: '.stk-block-video-popup > .stk-inner-blocks',
		columnAlignmentEditorSelector: true,
		enableInnerBlockAlignment: false,
		enableInnerBlockVerticalAlignment: false,
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@videoPopupBlock' )
	} )
}
