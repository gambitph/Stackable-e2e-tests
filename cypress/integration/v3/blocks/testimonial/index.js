
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
	it( 'should show the block', assertBlockExist( 'stackable/testimonial', '.stk-block-testimonial' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/testimonial' ) )
}
function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/testimonial' )

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
		cy.addBlock( 'stackable/testimonial' ).asBlock( 'testimonialBlock', { isStatic: true } )
		cy.openInspector( 'stackable/testimonial', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-testimonial',
		alignmentSelector: '.stk-block-testimonial > .stk-inner-blocks',
		enableColumnAlignment: false,
		enableInnerBlockVerticalAlignment: false,
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@testimonialBlock' )
	} )
}
