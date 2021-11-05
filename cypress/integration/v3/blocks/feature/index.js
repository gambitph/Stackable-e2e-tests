/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, assertInnerBlocks, responsiveAssertHelper, Block, Advanced,
} from '~stackable-e2e/helpers'
import { stkBlocks } from '~stackable-e2e/config'

const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	innerBlocks,
	innerBlocksExist,
	assertWidth,
	desktopBlock,
	tabletBlock,
	mobileBlock,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/feature', '.stk-block-feature', { variation: 'Default Layout' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/feature', { variation: 'Default Layout' } ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/feature', { variation: 'Default Layout' } )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/feature' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/feature', blockName ) )

		cy.savePost()
	} )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/feature', [
		'.stk-block-image',
		'.stk-block-heading',
		'.stk-block-text',
		'.stk-block-button',
	], { variation: 'Default Layout' } ) )
}

function assertWidth() {
	it( 'should test the adjustment of width using the tooltip', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/feature', { variation: 'Default Layout' } )
		cy.selectBlock( 'stackable/column', 0 ).resizeWidth( 25 )
		cy.selectBlock( 'stackable/column', 0 ).assertComputedStyle( {
			'': { // Assert the `.is-selected` element
				'flex-basis': '25%',
			},
		}, { assertFrontend: false } )
		cy.selectBlock( 'stackable/column', 0 ).assertComputedStyle( {
			'.stk-block-column': {
				'max-width': '25%',
			},
		}, { assertBackend: false } )
	} )
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
		cy.addBlock( 'stackable/feature', { variation: 'Default Layout' } ).asBlock( 'featureBlock', { isStatic: true } )
		cy.openInspector( 'stackable/feature', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-feature',
		alignmentSelector: '.stk-block-feature .stk-inner-blocks',
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@featureBlock' )
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
		cy.addBlock( 'stackable/feature', { variation: 'Default Layout' } ).asBlock( 'featureBlock', { isStatic: true } )
		cy.openInspector( 'stackable/feature', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-feature',
		blockName: 'stackable/feature',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@featureBlock' )
	} )
}
