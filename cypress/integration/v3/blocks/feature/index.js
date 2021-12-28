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

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/feature', { variation: 'Default Layout' } ).asBlock( 'featureBlock', { isStatic: true } )
		cy.openInspector( 'stackable/feature', 'Style' )
		cy.savePost()
	} )

	afterEach( () => cy.assertFrontendStyles( '@featureBlock' ) )

	it( 'should assert General panel in Style tab', () => {
		desktopOnly( () => {
			cy.collapse( 'General' )
			cy.adjust( 'Content Width', 'alignwide' ).assertClassName( '.stk-block-feature > .stk-container', 'alignwide' )
			cy.adjust( 'Content Width', 'alignfull' ).assertClassName( '.stk-block-feature > .stk-container', 'alignfull' )
		} )
	} )

	it( 'should assert Container Background panel in Style tab', () => {
		cy.toggleStyle( 'Container Background' )
		assertContainerBackground( { viewport } )
	} )

	it( 'should assert Container Size & Spacing panel in Style tab', () => {
		assertContainerSizeSpacing( {
			viewport,
			selector: '.stk-block-feature > .stk-container',
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
