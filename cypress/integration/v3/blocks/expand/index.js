
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, checkJsFiles,
} from '~stackable-e2e/helpers'

export {
	blockExist,
	blockError,
	typeContent,
	loadedFiles,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/expand', '.stk-block-expand' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/expand' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/expand' ).asBlock( 'expandBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/expand', '.stk-block-expand__short-text > .stk-block-text__text', 'Helloo World!! 12' )
			.assertBlockContent( '.stk-block-expand__short-text > .stk-block-text__text', 'Helloo World!! 12' )
		cy.typeBlock( 'stackable/expand', '.stk-block-expand__show-button .stk-button__inner-text', 'Hellooo World!!! 123' )
			.assertBlockContent( '.stk-block-expand__show-button .stk-button__inner-text', 'Hellooo World!!! 123' )
		cy.typeBlock( 'stackable/expand', '.stk-block-expand__more-text > .stk-block-text__text', 'Helloooo World!!!! 1234' )
			.assertBlockContent( '.stk-block-expand__more-text > .stk-block-text__text', 'Helloooo World!!!! 1234' )
		cy.typeBlock( 'stackable/expand', '.stk-block-expand__hide-button .stk-button__inner-text', 'Hellooooo World!!!!! 12345' )
			.assertBlockContent( '.stk-block-expand__hide-button .stk-button__inner-text', 'Hellooooo World!!!!! 12345' )
	} )
}

function loadedFiles() {
	it( 'should assert the loaded files in the frontend', checkJsFiles( 'stackable/expand', '#stk-frontend-expand-js' ) )
}
