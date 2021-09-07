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
	it( 'should show the block', assertBlockExist( 'stackable/feature-grid', '.stk-block-feature-grid' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/feature-grid' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/feature-grid' )

		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Feature grid block', 0 )
			.assertBlockContent( '.stk-block-heading__text', 'Feature grid block' )
		cy.typeBlock( 'stackable/text', '.stk-block-text__text', 'Lorem ipsum dolor sit amet.', 0 )
			.assertBlockContent( '.stk-block-text__text', 'Lorem ipsum dolor sit amet.' )
		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Click here', 0 )
			.assertBlockContent( '.stk-button__inner-text', 'Click here' )
	} )
}

function assertWidth() {
	it( 'should test the adjustment of width using the tooltip', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/feature-grid' )
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
