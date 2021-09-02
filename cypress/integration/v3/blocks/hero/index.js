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
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/hero', '.stk-block-hero' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/hero' ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/hero' )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/hero' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/hero', blockName ) )

		cy.savePost()
	} )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/hero' )

		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Hero section', 0 )
			.assertBlockContent( '.stk-block-heading__text', 'Hero section' )
		cy.typeBlock( 'stackable/text', '.stk-block-text__text', 'Lorem ipsum dolor sit amet.', 0 )
			.assertBlockContent( '.stk-block-text__text', 'Lorem ipsum dolor sit amet.' )
		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Click here', 0 )
			.assertBlockContent( '.stk-button__inner-text', 'Click here' )
	} )
}
