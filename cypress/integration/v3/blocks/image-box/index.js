
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
	it( 'should show the block', assertBlockExist( 'stackable/image-box', '.stk-block-image-box', { variation: 'Basic' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/image-box', { variation: 'Basic' } ) )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/image-box', [
		'.stk-block-subtitle',
		'.stk-block-heading',
		'.stk-block-text',
		'.stk-block-icon',
		'.stk-block-image',
	], { variation: 'Basic' } ) )
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
		cy.addBlock( 'stackable/image-box', { variation: 'Basic' } )
		cy.selectBlock( 'stackable/image-box' ).asBlock( 'imageBoxBlock', { isStatic: true } )
		cy.openInspector( 'stackable/image-box', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-image-box',
		alignmentSelector: '.stk-block-image-box > .stk-inner-blocks',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@imageBoxBlock' )
	} )
}
