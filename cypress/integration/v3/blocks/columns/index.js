/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, responsiveAssertHelper, Block, Advanced,
} from '~stackable-e2e/helpers'

const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	desktopBlock,
	tabletBlock,
	mobileBlock,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/columns', '.stk-block-columns', { variation: 'Two columns; equal split' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/columns', { variation: 'Two columns; equal split' } ) )
}

const assertBlockTab = Block
	.includes( [
		'Alignment',
		'Background',
		'Size & Spacing',
		'Borders & Shadows',
		'Top Separator',
		'Bottom Separator',
	] )
	.run

function blockTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/columns', { variation: 'Two columns; equal split' } ).asBlock( 'columnsBlock', { isStatic: true } )
		cy.openInspector( 'stackable/columns', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-columns',
		alignmentSelector: '.stk-block-columns > .stk-inner-blocks',
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
		columnAlignmentEditorExtendedSelector: ' > .block-editor-inner-blocks > .block-editor-block-list__layout',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@columnsBlock' )
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
		cy.addBlock( 'stackable/columns', { variation: 'Two columns; equal split' } ).asBlock( 'columnsBlock', { isStatic: true } )
		cy.openInspector( 'stackable/columns', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-columns',
		blockName: 'stackable/columns',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@columnsBlock' )
	} )
}

// TODO: Add test for column collapsing in Desktop, Tablet, Mobile - Block snapshots
