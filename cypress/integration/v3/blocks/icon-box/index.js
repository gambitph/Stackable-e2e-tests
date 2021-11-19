
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, assertInnerBlocks, responsiveAssertHelper, Block, Advanced,
} from '~stackable-e2e/helpers'

const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	innerBlocksExist,
	desktopBlock,
	tabletBlock,
	mobileBlock,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/icon-box', '.stk-block-icon-box' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/icon-box' ) )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/icon-box', [
		'.stk-block-heading',
		'.stk-block-text',
		'.stk-block-icon',
	] ) )
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
		cy.addBlock( 'stackable/icon-box' ).asBlock( 'iconBoxBlock', { isStatic: true } )
		cy.openInspector( 'stackable/icon-box', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-icon-box',
		alignmentSelector: '.stk-block-icon-box > .stk-inner-blocks',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@iconBoxBlock' )
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
		cy.addBlock( 'stackable/icon-box' ).asBlock( 'iconBoxBlock', { isStatic: true } )
		cy.openInspector( 'stackable/icon-box', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-icon-box',
		blockName: 'stackable/icon-box',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@iconBoxBlock' )
	} )
}
