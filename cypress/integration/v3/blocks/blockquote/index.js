
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, assertInnerBlocks, responsiveAssertHelper, Block,
} from '~stackable-e2e/helpers'

const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	innerBlocksExist,
	desktopBlock,
	tabletBlock,
	mobileBlock,
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

// TODO: Assert quote icon

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
		alignmentSelector: '.stk-block-blockquote > .stk-inner-blocks',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@blockquoteBlock' )
	} )
}
