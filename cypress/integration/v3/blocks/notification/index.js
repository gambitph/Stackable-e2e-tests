
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
	loadedFiles,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/notification', '.stk-block-notification' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/notification' ) )
}
function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/notification' )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/notification' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/notification', blockName ) )

		cy.savePost()
	} )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/notification' ).asBlock( 'notificationBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Test block', 0 )
			.assertBlockContent( '.stk-block-heading__text', 'Test block' )
		cy.typeBlock( 'stackable/text', '.stk-block-text__text', 'Lorem ipsum dolor sit amet.', 0 )
			.assertBlockContent( '.stk-block-text__text', 'Lorem ipsum dolor sit amet.' )
		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Click here', 0 )
			.assertBlockContent( '.stk-button__inner-text', 'Click here' )
	} )
}

function loadedFiles() {
	it( 'should assert the loaded files in the frontend', () => {
		cy.setupWP()
		cy.newPage()
		cy.typePostTitle( 'Check frontend files' )
		cy.addBlock( 'stackable/notification' )
		cy.savePost()

		cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
			cy.visit( previewUrl )
			cy.document().then( doc => {
				assert.isTrue(
					doc.querySelector( '#stk-frontend-notification-js' ) !== null,
					'Expected notification block js files are loaded in the frontend'
				)
			} )
			// Remove the block and assert that files does not exist in frontend
			cy.visit( editorUrl )
			cy.deleteBlock( 'stackable/notification' )
			cy.savePost()
			cy.visit( previewUrl )
			cy.document().then( doc => {
				assert.isTrue(
					doc.querySelector( '#stk-frontend-notification-js' ) === null,
					'Expected notification block js files are not loaded in the frontend'
				)
			} )
		} )
	} )
}
