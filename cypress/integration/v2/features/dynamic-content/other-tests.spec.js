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
				.get( '.wp-block-paragraph' )
				.setSelection( 'Lorem' )
		}, {
			source: 'Current Post',
			fieldName: 'Post Title',
		} )

		// Add a dynamic content: Post URL
		cy.adjustDynamicContent( 'core/paragraph', 0, () => {
			cy
				.get( '.wp-block-paragraph' )
				.setSelection( 'paragraph' )
		}, {
			source: 'Current Post',
			fieldName: 'Post URL',
		} )

		cy.document().then( doc => {
			const text = doc.querySelector( '.wp-block-paragraph' ).innerHTML

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
				.get( '.wp-block-paragraph' )
				.setSelection( 'paragraph' )
		}, {
			source: 'Current Post',
			fieldName: 'Post Title',
		} )

		// Add a dynamic content: Post URL
		cy.adjustDynamicContent( 'core/paragraph', 0, () => {
			cy
				.get( '.wp-block-paragraph' )
				.setSelection( 'Sample' )
		}, {
			source: 'Current Post',
			fieldName: 'Post URL',
		} )

		cy.document().then( doc => {
			const text = doc.querySelector( '.wp-block-paragraph' ).innerHTML

			assert.isTrue(
				text.includes( 'current-page/post-title' ) && text.includes( 'current-page/post-url' ),
				'Expected the entire line to not be a dynamic content and have two fields.'
			)
		} )
	} )
}
