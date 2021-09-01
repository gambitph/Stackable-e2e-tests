
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, assertLinks,
} from '~stackable-e2e/helpers'

export {
	blockExist,
	blockError,
	typeContent,
	assertLink,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/button-group', '.stk-block-button' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/button-group' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/button-group' )
		cy.selectBlock( 'stackable/button-group' ).addNewColumn( { blockToAdd: 'Button' } )

		cy.selectBlock( 'stackable/button', 0 ).asBlock( 'buttonBlock1', { isStatic: true } )
		cy.selectBlock( 'stackable/button', 1 ).asBlock( 'buttonBlock2', { isStatic: true } )

		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Button 1', 0 )
			.assertBlockContent( '.stk-button__inner-text', 'Button 1' )
		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Click here', 1 )
			.assertBlockContent( '.stk-button__inner-text', 'Click here' )
	} )
}

function assertLink() {
	it( 'should assert the links in buttons', () => {
		cy.setupWP()
		cy.newPage()
		cy.typePostTitle( 'Test Button Link' )
		cy.addBlock( 'stackable/button-group' )
		cy.selectBlock( 'stackable/button-group' ).addNewColumn( { blockToAdd: 'Button' } )

		cy.selectBlock( 'stackable/button', 0 ).asBlock( 'buttonBlock1', { isStatic: true } )
		cy.selectBlock( 'stackable/button', 1 ).asBlock( 'buttonBlock2', { isStatic: true } )

		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Buy', 0 )
		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Learn More', 1 )
		assertLinks( 'stackable/button', {
			editorSelector: '.stk-button__inner-text',
			frontendSelector: '.stk-button',
		} )

		// Assert dynamic content in link / url value
		cy.selectBlock( 'stackable/button', 0 ).find( '.stk-button__inner-text' ).click( { force: true } )
		// Current Post - Post URL
		cy.adjust( 'Link / URL', {
			source: 'Current Post',
			fieldName: 'Post URL',
		}, {
			parentSelector: '.components-popover__content',
			supportedDelimiter: [ ' ' ],
			isDynamicContent: true,
			isInPopover: true,
		} ).assertHtmlAttribute( '.stk-button', 'href', `${ Cypress.config().baseUrl }/test-button-link/`, { assertBackend: false } )

		cy.selectBlock( 'stackable/button', 1 ).find( '.stk-button__inner-text' ).click( { force: true } )
		// Site - Site URL
		cy.adjust( 'Link / URL', {
			source: 'Site',
			fieldName: 'Site URL',
		}, {
			parentSelector: '.components-popover__content',
			supportedDelimiter: [ ' ' ],
			isDynamicContent: true,
			isInPopover: true,
		} ).assertHtmlAttribute( '.stk-button', 'href', Cypress.config().baseUrl, { assertBackend: false } )
	} )
}
