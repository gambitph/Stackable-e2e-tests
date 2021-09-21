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
	pressBackspace,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/subtitle', '.stk-block-subtitle' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/subtitle' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/subtitle' ).asBlock( 'subtitleBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/subtitle', '.stk-block-subtitle__text', 'Subtitle block', 0 )
			.assertBlockContent( '.stk-block-subtitle__text', 'Subtitle block' )
	} )
}

function pressBackspace() {
	it( 'should test pressing the backspace in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/card' )
		cy.addBlock( 'stackable/subtitle' )

		cy.typeBlock( 'stackable/subtitle', '.stk-block-subtitle__text', 'Hello World!', 1 )
		cy.get( '.stk-block-subtitle__text' ).eq( 1 ).type( '{selectall}{backspace}{backspace}', { force: true } )

		cy.get( '.block-editor-block-list__block.is-selected' ).invoke( 'attr', 'data-type' ).then( block => {
			assert.isTrue(
				block === 'stackable/card',
				`Expected that the block is deleted and focus is on 'stackable/card'. Found: '${ block }'`
			)
		} )
	} )
}
