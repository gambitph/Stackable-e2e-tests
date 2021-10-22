
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
		cy.savePost()
		cy.selectBlock( 'stackable/icon-list' )
			.assertBlockContent( '.stk-block-icon-list ul', 'Icon listIcon list 2Icon list 3' )
	} )
}

// TODO: Temporarily commenting this out as we're experiencing issues.
// Uncomment when feature is readded to v3 Icon List block
//
// function indentList() {
// 	it( 'should allow indenting and outdenting the list item', () => {
// 		cy.setupWP()
// 		cy.newPage()
// 		cy.addBlock( 'stackable/icon-list' )
// 		cy.typeBlock( 'stackable/icon-list', '.stk-block-icon-list ul', 'August', 0 )
// 		cy.get( '.stk-block-icon-list' ).find( 'ul[role="textbox"]' ).type( '{enter}', { force: true } )
// 			.type( 'September', { force: true } )
// 		cy.adjustToolbar( 'Indent' )
// 		cy.get( '.stk-block-icon-list' ).contains( 'August' ).find( 'ul li' ).invoke( 'text' ).then( item => {
// 			assert.isTrue(
// 				item === 'September',
// 				'Expected list item 2 to be indented'
// 			)
// 		} )
// 		cy.adjustToolbar( 'Outdent' )
// 		cy.get( '.stk-block-icon-list ul > li' ).eq( 1 ).invoke( 'text' ).then( item => {
// 			assert.isTrue(
// 				item === 'September',
// 				'Expected list item 2 to be outdented'
// 			)
// 		} )
// 	} )
// }
