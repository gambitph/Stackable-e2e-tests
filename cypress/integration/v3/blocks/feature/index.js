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
	it( 'should show the block', assertBlockExist( 'stackable/feature', '.stk-block-feature' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/feature' ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/feature' )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/feature' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/feature', blockName ) )

		cy.savePost()
	} )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/feature' ).asBlock( 'featureBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/feature', '.stk-block-heading__text', 'Feature block', 0 )
			.assertBlockContent( '.stk-block-heading__text', 'Feature block' )
		cy.typeBlock( 'stackable/feature', '.stk-block-text__text', 'Lorem ipsum dolor sit amet.', 0 )
			.assertBlockContent( '.stk-block-text__text', 'Lorem ipsum dolor sit amet.' )
		cy.typeBlock( 'stackable/feature', '.stk-block-button__inner-text', 'Click here', 0 )
			.assertBlockContent( '.stk-block-button__inner-text', 'Click here' )
	} )
}

function assertWidth() {
	it( 'should test the adjustment of width using the tooltip', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/feature' )
		cy.selectBlock( 'stackable/column', 0 ).resizeWidth( 25 )
		cy.selectBlock( 'stackable/column', 0 ).assertComputedStyle( {
			'': { // Assert the `.is-selected` element
				'flex-basis': '25%',
			},
		}, { assertFrontend: false } )
		cy.selectBlock( 'stackable/column', 0 ).assertComputedStyle( {
			'.stk-block-column': {
				'max-width': '25%',
			},
		}, { assertBackend: false } )
	} )
}
// TODO: Add test for adding image content
