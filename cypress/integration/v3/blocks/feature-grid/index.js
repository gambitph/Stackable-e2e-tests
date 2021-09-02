/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest,
} from '~stackable-e2e/helpers'
import { stkBlocks } from '~stackable-e2e/config'

export {
	blockExist,
	blockError,
	innerBlocks,
	typeContent,
	assertWidth,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/feature-grid', '.stk-block-feature-grid' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/feature-grid' ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/feature-grid' )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/feature-grid' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/container', blockName, 0 ) )

		cy.savePost()
	} )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/feature-grid' )

		cy.typeBlock( 'stackable/feature-grid', '.stk-block-heading__text', 'Feature grid block', 0 )
			.assertBlockContent( '.stk-block-heading__text', 'Feature grid block' )
		cy.typeBlock( 'stackable/feature-grid', '.stk-block-text__text', 'Lorem ipsum dolor sit amet.', 0 )
			.assertBlockContent( '.stk-block-text__text', 'Lorem ipsum dolor sit amet.' )
		cy.typeBlock( 'stackable/feature-grid', '.stk-button__inner-text', 'Click here', 0 )
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
// TODO: Add test for adding image content
