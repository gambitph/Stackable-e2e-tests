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
	it( 'should assert the loaded files in the frontend', checkJsFiles( 'stackable/count-up', '#stk-frontend-count-up-js' ) )
}
