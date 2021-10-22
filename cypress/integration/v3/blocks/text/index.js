
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
	addBlocks,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/text', '.stk-block-text' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/text' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/text' ).asBlock( 'textBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/text', '.stk-block-text__text', 'Lorem ipsum dolor sit amet.', 0 )
			.assertBlockContent( '.stk-block-text__text', 'Lorem ipsum dolor sit amet.' )
	} )
}

function pressEnterKey() {
	it( 'should test pressing the enter key in text block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/text' )

		cy.typeBlock( 'stackable/text', '.stk-block-text__text', 'Test text block', 0 )
		cy.get( '.stk-block-text__text' ).type( '{enter}', { force: true } )

		cy.get( '.block-editor-block-list__block.is-selected' ).invoke( 'attr', 'data-type' ).then( blockName => {
			assert.isTrue(
				blockName === 'stackable/text',
				'Expected text block to be added upon pressing enter key in Text.'
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
		cy.addBlock( 'stackable/text' )

		cy.typeBlock( 'stackable/text', '.stk-block-text__text', 'Hello World!', 1 )
		cy.get( '.stk-block-text__text' ).eq( 1 ).type( '{selectall}{backspace}{backspace}', { force: true } )

		cy.get( '.block-editor-block-list__block.is-selected' ).invoke( 'attr', 'data-type' ).then( block => {
			assert.isTrue(
				block === 'stackable/card',
				`Expected that the block is deleted and focus is on 'stackable/card'. Found: '${ block }'`
			)
		} )
	} )
}

function addBlocks() {
	it( 'should test adding stackable blocks using the / command', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/text' )
		cy.typeBlock( 'stackable/text', '.stk-block-text__text', '/accordion', 0 )
		cy.get( '.components-popover__content' )
			.contains( 'Accordion' )
			.first()
			.click( { force: true } )
		cy.get( '.stk-block-accordion' ).should( 'exist' )

		cy.addBlock( 'stackable/text' )
		cy.typeBlock( 'stackable/text', '.stk-block-text__text', '/feature-grid', 0 )
		cy.get( '.components-popover__content' )
			.contains( 'Feature Grid' )
			.first()
			.click( { force: true } )
		cy.get( '.stk-block-feature-grid' ).should( 'exist' )
	} )
}
