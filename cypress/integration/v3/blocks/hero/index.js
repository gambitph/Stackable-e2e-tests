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
	it( 'should show the block', assertBlockExist( 'stackable/hero', '.stk-block-hero', { variation: 'Default Layout' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/hero', { variation: 'Default Layout' } ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/hero', { variation: 'Default Layout' } )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/hero' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/hero', blockName ) )

		cy.savePost()
	} )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/hero', [
		'.stk-block-heading',
		'.stk-block-text',
		'.stk-block-button',
	], { variation: 'Default Layout' } ) )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/hero', { variation: 'Default Layout' } ).asBlock( 'heroBlock', { isStatic: true } )
		cy.openInspector( 'stackable/hero', 'Style' )
		cy.savePost()
	} )

	afterEach( () => cy.assertFrontendStyles( '@heroBlock' ) )

	it( 'should assert General panel in Style tab', () => {
		desktopOnly( () => {
			cy.collapse( 'General' )
			cy.adjust( 'Content Width', 'alignwide' ).assertClassName( '.stk-block-hero > .stk-container', 'alignwide' )
			cy.adjust( 'Content Width', 'alignfull' ).assertClassName( '.stk-block-hero > .stk-container', 'alignfull' )
		} )
	} )

	it( 'should assert Container Background panel in Style tab', () => {
		assertContainerBackground( { viewport } )
	} )

	it( 'should assert Container Size & Spacing panel in Style tab', () => {
		assertContainerSizeSpacing( {
			viewport,
			selector: '.stk-block-hero > .stk-container',
		} )
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
		'Top Separator',
		'Bottom Separator',
	] )
	.run

function blockTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/hero', { variation: 'Default Layout' } ).asBlock( 'heroBlock', { isStatic: true } )
		cy.openInspector( 'stackable/hero', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-hero',
		alignmentSelector: '.stk-block-hero .stk-inner-blocks',
		enableColumnAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@heroBlock' )
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
		cy.addBlock( 'stackable/hero', { variation: 'Default Layout' } ).asBlock( 'heroBlock', { isStatic: true } )
		cy.openInspector( 'stackable/hero', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-hero',
		blockName: 'stackable/hero',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@heroBlock' )
	} )
}
