
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, checkJsFiles,
} from '~stackable-e2e/helpers'
import { stkBlocks } from '~stackable-e2e/config'

export {
	blockExist,
	blockError,
	typeContent,
	innerBlocks,
	loadedFiles,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/accordion', '.stk-block-accordion' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/accordion' ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/accordion' )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/accordion' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/column', blockName, 1 ) )

		cy.savePost()
	} )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/accordion' )

		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Accordion 1', 0 )
			.assertBlockContent( '.stk-block-heading__text', 'Accordion 1' )

		cy.typeBlock( 'stackable/text', '.stk-block-text__text', 'My sample description here 12343', 0 )
			.assertBlockContent( '.stk-block-text__text', 'My sample description here 12343' )
	} )
}

function loadedFiles() {
	it( 'should assert the loaded files in the frontend', checkJsFiles( 'stackable/accordion', '#stk-frontend-accordion-js' ) )
}
