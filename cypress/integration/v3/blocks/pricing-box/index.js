/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, assertInnerBlocks, responsiveAssertHelper, Block, Advanced, assertContainerBackground, assertContainerSizeSpacing, assertContainerBordersShadow,
} from '~stackable-e2e/helpers'
import { stkBlocks } from '~stackable-e2e/config'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	innerBlocks,
	innerBlocksExist,
	desktopStyle,
	tabletStyle,
	mobileStyle,
	desktopBlock,
	tabletBlock,
	mobileBlock,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/pricing-box', '.stk-block-pricing-box', { variation: 'Default Layout' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/pricing-box', { variation: 'Default Layout' } ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/pricing-box', { variation: 'Default Layout' } )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/pricing-box' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/pricing-box', blockName ) )

		cy.savePost()
	} )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/pricing-box', [
		'.stk-block-heading',
		'.stk-block-text',
		'.stk-block-icon-list',
		'.stk-block-button',
	], { variation: 'Default Layout' } ) )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/pricing-box', { variation: 'Default Layout' } ).asBlock( 'pricingBoxBlock', { isStatic: true } )
		cy.openInspector( 'stackable/pricing-box', 'Style' )
		cy.savePost()
	} )

	afterEach( () => cy.assertFrontendStyles( '@pricingBoxBlock' ) )

	it( 'should assert General panel in Style tab', () => {
		desktopOnly( () => {
			cy.collapse( 'General' )
			cy.adjust( 'Content Width', 'alignwide' ).assertClassName( '.stk-block-pricing-box > .stk-content-align', 'alignwide' )
			cy.adjust( 'Content Width', 'alignfull' ).assertClassName( '.stk-block-pricing-box > .stk-content-align', 'alignfull' )
		} )
	} )

	it( 'should assert Container Background panel in Style tab', () => {
		assertContainerBackground( { viewport } )
	} )

	it( 'should assert Container Size & Spacing panel in Style tab', () => {
		assertContainerSizeSpacing( { viewport, selector: '.stk-block-pricing-box > .stk-container' } )
	} )

	it( 'should assert Container Borders & Shadow panel in Style tab', () => {
		assertContainerBordersShadow( { viewport } )
	} )
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
		cy.addBlock( 'stackable/pricing-box', { variation: 'Default Layout' } ).asBlock( 'pricingBoxBlock', { isStatic: true } )
		cy.openInspector( 'stackable/pricing-box', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-pricing-box',
		alignmentSelector: '.stk-block-pricing-box .stk-inner-blocks',
		enableColumnAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@pricingBoxBlock' )
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
		cy.addBlock( 'stackable/pricing-box', { variation: 'Default Layout' } ).asBlock( 'pricingBoxBlock', { isStatic: true } )
		cy.openInspector( 'stackable/pricing-box', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-pricing-box',
		blockName: 'stackable/pricing-box',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@pricingBoxBlock' )
	} )
}
