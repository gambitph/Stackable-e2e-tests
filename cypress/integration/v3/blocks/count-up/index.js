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
	loadedFiles,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/count-up', '.stk-block-count-up' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/count-up' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/count-up' ).asBlock( 'countUpBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/count-up', '.stk-block-count-up__text', '145,234.99', 0 )
			.assertBlockContent( '.stk-block-count-up__text', '145,234.99' )
	} )
}

function loadedFiles() {
	it( 'should assert the loaded files in the frontend', () => {
		cy.setupWP()
		cy.newPage()
		cy.typePostTitle( 'Check frontend files' )
		cy.addBlock( 'stackable/count-up' )
		cy.typeBlock( 'stackable/count-up', '.stk-block-count-up__text', '145,234.99', 0 )
		cy.savePost()

		cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
			cy.visit( previewUrl )
			cy.document().then( doc => {
				assert.isTrue(
					doc.querySelector( '#stk-frontend-count-up-js' ) !== null,
					'Expected count up block js files are loaded in the frontend'
				)
			} )
			// Remove the count up block and assert that files does not exist in frontend
			cy.visit( editorUrl )
			cy.deleteBlock( 'stackable/count-up' )
			cy.savePost()
			cy.visit( previewUrl )
			cy.document().then( doc => {
				assert.isTrue(
					doc.querySelector( '#stk-frontend-count-up-js' ) === null,
					'Expected count up block js files are not loaded in the frontend'
				)
			} )
		} )
	} )
}
