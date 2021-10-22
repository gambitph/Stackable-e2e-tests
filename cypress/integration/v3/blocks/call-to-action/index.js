
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, assertInnerBlocks, responsiveAssertHelper, Block,
} from '~stackable-e2e/helpers'
import { stkBlocks } from '~stackable-e2e/config'

const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	innerBlocks,
	innerBlocksExist,
	desktopBlock,
	tabletBlock,
	mobileBlock,
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
		alignmentSelector: '.stk-block-call-to-action > .stk-inner-blocks',
		enableColumnAlignment: false,
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@callToActionBlock' )
	} )
}
