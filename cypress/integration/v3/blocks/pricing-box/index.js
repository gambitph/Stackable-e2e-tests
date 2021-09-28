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
	it( 'should show the block', assertBlockExist( 'stackable/pricing-box', '.stk-block-pricing-box' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/pricing-box' ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/pricing-box' )

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
	] ) )
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
		cy.addBlock( 'stackable/pricing-box' )
		cy.selectBlock( 'stackable/pricing-box' ).asBlock( 'pricingBoxBlock', { isStatic: true } )
		cy.openInspector( 'stackable/pricing-box', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-pricing-box',
		alignmentSelector: '.stk-block-pricing-box > .stk-inner-blocks',
		enableColumnAlignment: false,
		enableInnerBlockVerticalAlignment: false,
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@pricingBoxBlock' )
	} )
}
