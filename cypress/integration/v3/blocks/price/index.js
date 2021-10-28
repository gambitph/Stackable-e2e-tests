
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, responsiveAssertHelper, Block,
} from '~stackable-e2e/helpers'

const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	typeContent,
	desktopBlock,
	tabletBlock,
	mobileBlock,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/price', '.stk-block-price' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/price' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/price' ).asBlock( 'priceBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/text', '.stk-block-text__text', '£', 0 )
			.assertBlockContent( '.stk-block-text__text', '£' )
		cy.typeBlock( 'stackable/text', '.stk-block-text__text', '21', 1 )
			.assertBlockContent( '.stk-block-text__text', '21' )
		cy.typeBlock( 'stackable/text', '.stk-block-text__text', '.59', 2 )
			.assertBlockContent( '.stk-block-text__text', '.59' )
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
		cy.addBlock( 'stackable/price' ).asBlock( 'priceBlock', { isStatic: true } )
		cy.openInspector( 'stackable/price', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-price',
		alignmentSelector: '.stk-block-price',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@priceBlock' )
	} )
}
