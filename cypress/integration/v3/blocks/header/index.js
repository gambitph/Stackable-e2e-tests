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
	it( 'should show the block', assertBlockExist( 'stackable/header', '.stk-block-header' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/header' ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/header' )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/header' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/header', blockName ) )

		cy.savePost()
	} )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/header' )

		cy.typeBlock( 'stackable/header', '.stk-block-heading__text', 'Header block', 0 )
			.assertBlockContent( '.stk-block-heading__text', 'Header block' )
		cy.typeBlock( 'stackable/header', '.stk-block-text__text', 'Lorem ipsum dolor sit amet.', 0 )
			.assertBlockContent( '.stk-block-text__text', 'Lorem ipsum dolor sit amet.' )
		cy.typeBlock( 'stackable/header', '.stk-block-button__inner-text', 'Click here', 0 )
			.assertBlockContent( '.stk-block-button__inner-text', 'Click here' )
	} )
}
