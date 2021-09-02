
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
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/icon-list', '.stk-block-icon-list' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/icon-list' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/icon-list' )
		cy.typeBlock( 'stackable/icon-list', '.stk-block-icon-list ul', 'Icon list', 0 )
		cy.get( '.stk-block-icon-list' ).find( 'ul[role="textbox"]' ).type( '{enter}', { force: true } )
			.type( 'Icon list 2', { force: true } )
		cy.get( '.stk-block-icon-list' ).find( 'ul[role="textbox"]' ).type( '{enter}', { force: true } )
			.type( 'Icon list 3', { force: true } )
		cy.selectBlock( 'stackable/icon-list' )
			.assertBlockContent( '.stk-block-icon-list ul', 'Icon listIcon list 2Icon list 3' )
	} )
}
