/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest,
} from '~stackable-e2e/helpers'

export {
	blockExist,
	blockError,
	typeContent,
	assertWidth,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/pricing-box', '.stk-block-pricing-box' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/pricing-box' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/pricing-box' )

		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Pricing box block', 0 )
			.assertBlockContent( '.stk-block-heading__text', 'Pricing box block' )
		cy.typeBlock( 'stackable/text', '.stk-block-text__text', '£', 0 )
			.assertBlockContent( '.stk-block-text__text', '£' )
		cy.typeBlock( 'stackable/text', '.stk-block-text__text', '21', 1 )
			.assertBlockContent( '.stk-block-text__text', '21' )
		cy.typeBlock( 'stackable/text', '.stk-block-text__text', '.59', 2 )
			.assertBlockContent( '.stk-block-text__text', '.59' )
		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Buy', 0 )
			.assertBlockContent( '.stk-button__inner-text', 'Buy' )
	} )
}

function assertWidth() {
	it( 'should test the adjustment of width using the tooltip', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/pricing-box' )
		cy.selectBlock( 'stackable/column', 0 ).resizeWidth( 30 )
		cy.selectBlock( 'stackable/column', 0 ).assertComputedStyle( {
			'': { // Assert the `.is-selected` element
				'flex-basis': '30%',
			},
		}, { assertFrontend: false } )
		cy.selectBlock( 'stackable/column', 0 ).assertComputedStyle( {
			'.stk-block-column': {
				'max-width': '30%',
			},
		}, { assertBackend: false } )
	} )
}
