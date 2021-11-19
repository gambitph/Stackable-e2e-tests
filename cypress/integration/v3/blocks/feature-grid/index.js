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
	it( 'should show the block', assertBlockExist( 'stackable/feature-grid', '.stk-block-feature-grid', { variation: 'Default Layout' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/feature-grid', { variation: 'Default Layout' } ) )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/feature-grid', [
		'.stk-block-image',
		'.stk-block-heading',
		'.stk-block-text',
		'.stk-block-button',
	], { variation: 'Default Layout' } ) )
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
		cy.addBlock( 'stackable/feature-grid', { variation: 'Default Layout' } ).asBlock( 'featureGridBlock', { isStatic: true } )
		cy.openInspector( 'stackable/feature-grid', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-feature-grid',
		alignmentSelector: '.stk-block-feature-grid > .stk-inner-blocks',
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@featureGridBlock' )
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
		cy.addBlock( 'stackable/feature-grid', { variation: 'Default Layout' } ).asBlock( 'featureGridBlock', { isStatic: true } )
		cy.openInspector( 'stackable/feature-grid', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-feature-grid',
		blockName: 'stackable/feature-grid',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@featureGridBlock' )
	} )
}
