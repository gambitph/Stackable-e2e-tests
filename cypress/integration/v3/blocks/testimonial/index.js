
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
	it( 'should show the block', assertBlockExist( 'stackable/testimonial', '.stk-block-testimonial', { variation: 'Default Layout' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/testimonial', { variation: 'Default Layout' } ) )
}
function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/testimonial', { variation: 'Default Layout' } )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/testimonial' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/testimonial', blockName ) )

		cy.savePost()
	} )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/testimonial', [
		'.stk-block-image',
		'.stk-block-heading',
		'.stk-block-subtitle',
		'.stk-block-text',
	], { variation: 'Default Layout' } ) )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/testimonial', { variation: 'Default Layout' } ).asBlock( 'testimonialBlock', { isStatic: true } )
		cy.openInspector( 'stackable/testimonial', 'Style' )
		cy.savePost()
	} )

	afterEach( () => cy.assertFrontendStyles( '@testimonialBlock' ) )

	it( 'should assert General panel in Style tab', () => {
		desktopOnly( () => {
			cy.collapse( 'General' )
			cy.adjust( 'Content Width', 'alignwide' ).assertClassName( '.stk-block-testimonial > .stk-container', 'alignwide' )
			cy.adjust( 'Content Width', 'alignfull' ).assertClassName( '.stk-block-testimonial > .stk-container', 'alignfull' )
		} )
	} )

	it( 'should assert Container Background panel in Style tab', () => {
		assertContainerBackground( { viewport } )
	} )

	it( 'should assert Container Size & Spacing panel in Style tab', () => {
		assertContainerSizeSpacing( {
			viewport,
			selector: '.stk-block-testimonial__content',
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
		'Link',
	] )
	.run

function blockTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/testimonial', { variation: 'Default Layout' } ).asBlock( 'testimonialBlock', { isStatic: true } )
		cy.openInspector( 'stackable/testimonial', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-testimonial',
		alignmentSelector: '.stk-block-testimonial .stk-inner-blocks',
		enableColumnAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@testimonialBlock' )
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
		cy.addBlock( 'stackable/testimonial', { variation: 'Default Layout' } ).asBlock( 'testimonialBlock', { isStatic: true } )
		cy.openInspector( 'stackable/testimonial', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-testimonial',
		blockName: 'stackable/testimonial',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@testimonialBlock' )
	} )
}
