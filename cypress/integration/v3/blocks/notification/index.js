
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, checkJsFiles, assertInnerBlocks, responsiveAssertHelper, Block, Advanced,
} from '~stackable-e2e/helpers'
import { stkBlocks } from '~stackable-e2e/config'

const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	innerBlocks,
	innerBlocksExist,
	loadedFiles,
	desktopBlock,
	tabletBlock,
	mobileBlock,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/notification', '.stk-block-notification', { variation: 'Default Layout' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/notification', { variation: 'Default Layout' } ) )
}
function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/notification', { variation: 'Default Layout' } )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/notification' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/notification', blockName ) )

		cy.savePost()
	} )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/notification', [
		'.stk-block-heading',
		'.stk-block-text',
		'.stk-block-button',
	], { variation: 'Default Layout' } ) )
}

function loadedFiles() {
	it( 'should assert the loaded files in the frontend', checkJsFiles( 'stackable/notification', '#stk-frontend-notification-js', { variation: 'Default Layout' } ) )
}

const assertBlockTab = Block
	.includes( [
		'Alignment',
		'Background',
		'Size & Spacing',
		'Borders & Shadows',
		'Link',
	] )
	.run

function blockTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/notification', { variation: 'Default Layout' } ).asBlock( 'notificationBlock', { isStatic: true } )
		cy.openInspector( 'stackable/notification', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-notification',
		alignmentSelector: '.stk-block-notification .stk-inner-blocks',
		enableColumnAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@notificationBlock' )
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
		cy.addBlock( 'stackable/notification', { variation: 'Default Layout' } ).asBlock( 'notificationBlock', { isStatic: true } )
		cy.openInspector( 'stackable/notification', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-notification',
		blockName: 'stackable/notification',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@notificationBlock' )
	} )
}
