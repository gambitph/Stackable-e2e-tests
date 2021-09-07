
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

		cy.typeBlock( 'stackable/text', '.stk-block-expand__short-text .stk-block-text__text', 'Short text here', 0 )
			.assertBlockContent( '.stk-block-expand__short-text .stk-block-text__text', 'Short text here' )
		cy.typeBlock( 'stackable/button', '.stk-block-expand__show-button .stk-button__inner-text', 'Click to load', 0 )
			.assertBlockContent( '.stk-block-expand__show-button .stk-button__inner-text', 'Click to load' )
		cy.typeBlock( 'stackable/text', '.stk-block-expand__more-text .stk-block-text__text', 'Long text that can be shown', 1 )
			.assertBlockContent( '.stk-block-expand__more-text .stk-block-text__text', 'Long text that can be shown' )
		cy.typeBlock( 'stackable/button', '.stk-block-expand__hide-button .stk-button__inner-text', 'Click to hide', 1 )
			.assertBlockContent( '.stk-block-expand__hide-button .stk-button__inner-text', 'Click to hide' )
	} )
}

function loadedFiles() {
	it( 'should assert the loaded files in the frontend', checkJsFiles( 'stackable/expand', '#stk-frontend-expand-js' ) )
}
