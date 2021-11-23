
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
	it( 'should show the block', assertBlockExist( 'stackable/call-to-action', '.stk-block-call-to-action', { variation: 'Default Layout' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/call-to-action', { variation: 'Default Layout' } ) )
}
function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/call-to-action', { variation: 'Default Layout' } )
		cy.selectBlock( 'stackable/call-to-action' )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/call-to-action' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/call-to-action', blockName ) )

		cy.savePost()
	} )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/call-to-action', [
		'.stk-block-heading',
		'.stk-block-text',
		'.stk-block-button',
	], { variation: 'Default Layout' } ) )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/call-to-action', { variation: 'Default Layout' } ).asBlock( 'callToActionBlock', { isStatic: true } )
		cy.openInspector( 'stackable/call-to-action', 'Style' )
	} )

	afterEach( () => cy.assertFrontendStyles( '@callToActionBlock' ) )

	it( 'should assert General panel in Style tab', () => {
		desktopOnly( () => {
			cy.collapse( 'General' )
			cy.changeAlignment( 'stackable/call-to-action', 0, 'Full width' )
			const aligns = [ 'alignwide', 'alignfull' ]
			aligns.forEach( align => {
				cy.adjust( 'Content Width', align ).assertClassName( '.stk-block-call-to-action__content', align )
			} )
		} )
	} )

	it( 'should assert Container Background panel in Style tab', () => {
		assertContainerBackground( { viewport } )
	} )

	it( 'should assert Container Size & Spacing panel in Style tab', () => {
		assertContainerSizeSpacing( { viewport, selector: '.stk-block-call-to-action__content' } )
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
		'Link',
	] )
	.run

function blockTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/call-to-action', { variation: 'Default Layout' } ).asBlock( 'callToActionBlock', { isStatic: true } )
		cy.openInspector( 'stackable/call-to-action', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-call-to-action',
		alignmentSelector: '.stk-block-call-to-action .stk-inner-blocks',
		enableColumnAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@callToActionBlock' )
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
		cy.addBlock( 'stackable/call-to-action', { variation: 'Default Layout' } ).asBlock( 'callToActionBlock', { isStatic: true } )
		cy.openInspector( 'stackable/call-to-action', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-call-to-action',
		blockName: 'stackable/call-to-action',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@callToActionBlock' )
	} )
}
