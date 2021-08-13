/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'

describe( 'Dynamic Content - Other Tests', registerTests( [
	multipleDynamicContent,
] ) )

function multipleDynamicContent() {
	beforeEach( () => {
		cy.setupWP()
		cy.newPost()
		cy.typePostTitle( 'Foo' )
		cy.addBlock( 'core/paragraph' )
		cy.typeBlock( 'core/paragraph', '', 'Sample paragraph text here. Lorem ipsum dolor.' )
	} )

	it( 'should allow adding multiple dynamic content in one line', () => {
		// Add a dynamic content: Post Title
		cy.adjustDynamicContent( 'core/paragraph', 0, () => {
			cy
				.get( 'p[aria-label="Paragraph block"]' )
				.setSelection( 'Lorem' )
		}, {
			source: 'Current Post',
			fieldName: 'Post Title',
		} )

		// Flaky test. Click anywhere to remove focus in the paragraph.
		cy.get( '.editor-post-title__input' ).click( { force: true } )

		// Add a dynamic content: Post URL
		cy.adjustDynamicContent( 'core/paragraph', 0, () => {
			cy
				.get( 'p[aria-label="Paragraph block"]' )
				.setSelection( 'paragraph' )
		}, {
			source: 'Current Post',
			fieldName: 'Post URL',
		} )

		cy.document().then( doc => {
			const text = doc.querySelector( 'p[aria-label="Paragraph block"]' ).innerHTML

			assert.isTrue(
				text.includes( 'current-page/post-title' ) && text.includes( 'current-page/post-url' ),
				'Expected dynamic content post title & post URL to be added in one line.'
			)
		} )
	} )

	it( 'should not turn the entire line a dynamic content when adding more than one', () => {
		// Add a dynamic content: Post Title
		cy.adjustDynamicContent( 'core/paragraph', 0, () => {
			cy
				.get( 'p[aria-label="Paragraph block"]' )
				.setSelection( 'paragraph' )
		}, {
			source: 'Current Post',
			fieldName: 'Post Title',
		} )

		// Flaky test. Click anywhere to remove focus in the paragraph.
		cy.get( '.editor-post-title__input' ).click( { force: true } )

		// Add a dynamic content: Post URL
		cy.adjustDynamicContent( 'core/paragraph', 0, () => {
			cy
				.get( 'p[aria-label="Paragraph block"]' )
				.setSelection( 'Sample' )
		}, {
			source: 'Current Post',
			fieldName: 'Post URL',
		} )

		cy.document().then( doc => {
			const text = doc.querySelector( 'p[aria-label="Paragraph block"]' ).innerHTML

			assert.isTrue(
				text.includes( 'current-page/post-title' ) && text.includes( 'current-page/post-url' ),
				'Expected the entire line to not be a dynamic content and have two fields.'
			)
		} )
	} )
}
