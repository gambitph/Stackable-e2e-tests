
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
	assertIcon,
	desktopBlock,
	tabletBlock,
	mobileBlock,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/image-box', '.stk-block-image-box', { variation: 'Default Layout' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/image-box', { variation: 'Default Layout' } ) )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/image-box', [
		'.stk-block-subtitle',
		'.stk-block-heading',
		'.stk-block-text',
		'.stk-block-icon',
		'.stk-block-image',
	], { variation: 'Default Layout' } ) )
}

function assertIcon() {
	it( 'should assert the correct icon is added for the image box', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/image-box', { variation: 'Default Layout' } )
		cy.get( '.stk-block-image-box .fa-arrow-right' ).should( 'exist' )
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
		cy.addBlock( 'stackable/image-box', { variation: 'Default Layout' } ).asBlock( 'imageBoxBlock', { isStatic: true } )
		cy.openInspector( 'stackable/image-box', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-image-box',
		alignmentSelector: '.stk-block-image-box > .stk-inner-blocks',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@imageBoxBlock' )
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
		cy.addBlock( 'stackable/image-box', { variation: 'Default Layout' } ).asBlock( 'imageBoxBlock', { isStatic: true } )
		cy.openInspector( 'stackable/image-box', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-image-box',
		blockName: 'stackable/image-box',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@imageBoxBlock' )
	} )
}
