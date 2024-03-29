
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, assertInnerBlocks, responsiveAssertHelper, Block, Advanced, assertContainerBackground, assertContainerSizeSpacing, assertContainerBordersShadow,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
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
	it( 'should show the block', assertBlockExist( 'stackable/blockquote', '.stk-block-blockquote', { variation: 'Default Layout' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/blockquote', { variation: 'Default Layout' } ) )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/blockquote', [
		'.stk-block-icon',
		'.stk-block-text',
	], { variation: 'Default Layout' } ) )
}

function styleTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/blockquote', { variation: 'Default Layout' } ).asBlock( 'blockquoteBlock', { isStatic: true } )
		cy.openInspector( 'stackable/blockquote', 'Style' )
	} )

	it( 'should assert Container Background panel in Style tab', () => {
		assertContainerBackground( { viewport } )
	} )

	it( 'should assert Container Size & Spacing panel in Style tab', () => {
		assertContainerSizeSpacing( { viewport, selector: '.stk-block-blockquote__content' } )
	} )

	it( 'should assert Container Borders & Shadow panel in Style tab', () => {
		assertContainerBordersShadow( { viewport } )
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@blockquoteBlock' )
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
		cy.addBlock( 'stackable/blockquote', { variation: 'Default Layout' } ).asBlock( 'blockquoteBlock', { isStatic: true } )
		cy.openInspector( 'stackable/blockquote', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-blockquote',
		alignmentSelector: '.stk-block-blockquote .stk-inner-blocks',
		alignmentSelectorFrontend: '.stk-block-blockquote > .stk-block-blockquote__content',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@blockquoteBlock' )
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
		cy.addBlock( 'stackable/blockquote', { variation: 'Default Layout' } ).asBlock( 'blockquoteBlock', { isStatic: true } )
		cy.openInspector( 'stackable/blockquote', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-blockquote',
		blockName: 'stackable/blockquote',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@blockquoteBlock' )
	} )
}

// TODO: Assert quote icon

