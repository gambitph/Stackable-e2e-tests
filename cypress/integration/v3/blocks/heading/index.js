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
	pressEnterKey,
	pressBackspace,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/heading', '.stk-block-heading' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/heading' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/heading' ).asBlock( 'headingBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Heading block', 0 )
			.assertBlockContent( '.stk-block-heading__text', 'Heading block' )
	} )
}

function pressEnterKey() {
	it( 'should test pressing the enter key in heading block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/heading' )

		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Heading', 0 )
		cy.get( '.stk-block-heading__text' ).type( '{enter}', { force: true } )

		cy.get( '.block-editor-block-list__block.is-selected' ).invoke( 'attr', 'data-type' ).then( blockName => {
			assert.isTrue(
				blockName === 'stackable/text',
				'Expected text block to be added upon pressing enter key in Heading.'
			)
		} )
		cy.savePost()
		// Reloading should not cause a block error
		cy.reload()
	} )
}

function pressBackspace() {
	it( 'should test pressing the backspace in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/card' )
		cy.addBlock( 'stackable/heading' )

		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Hello World!', 1 )
		cy.get( '.stk-block-heading__text' ).eq( 1 ).type( '{selectall}{backspace}{backspace}', { force: true } )

		cy.get( '.block-editor-block-list__block.is-selected' ).invoke( 'attr', 'data-type' ).then( block => {
			assert.isTrue(
				block === 'stackable/card',
				`Expected that the text block is deleted and focus is on 'stackable/card'. Found: '${ block }'`
			)
		} )
	} )
}
