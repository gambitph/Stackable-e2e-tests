/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'
import { ForcePseudoClass } from '~common/style'

describe( 'TEST', registerTests( [ test ] ) )

function test() {
	it( 'should run test', () => {
		cy.setupWP()
		cy.newPage()
		cy.typePostTitle( 'This is my post' )
		cy.addFeaturedImage()
		cy.addBlock( 'stackable/card-group' )
		cy.selectBlock( 'stackable/card-group' ).asBlock( 'stackable/card-group', { isStatic: true } )
		cy.addInnerBlock( 'stackable/card-group', 'stackable/card' )
		cy.selectBlock( 'stackable/card' ).asBlock( 'stackable/card-1', { isStatic: true } )
		cy.openInspector( 'stackable/card', 'Style' )
		cy.collapse( 'Container Background' )
		cy.adjust( 'Background Color', '#ff0000', { state: 'Hover' } ).assertComputedStyle( {
			'.stk-container:hover': {
				'background-color': '#ff0000',
			},
		} )
		cy.adjust( 'Background Color', '#ffa3a3' ).assertComputedStyle( {
			'.stk-container': {
				'background-color': '#ffa3a3',
			},
		} )

		cy.document().then( doc => {
			const styler = new ForcePseudoClass()
			styler.loadDocumentStyles()
			doc.querySelector( '.stk-card' ).addEventListener( 'click', () => {
				const element = document.querySelector( '.stk-card' )
				styler.toggleStyle( element, ':hover' )
			} )
		} )

		cy.get( '.stk-card' ).click()

		// cy.adjust( 'Background Image or Video', {
		// 	source: 'Current Post',
		// 	fieldName: 'Featured Image URL',
		// 	fieldOptions: {
		// 		'Image Size': 'large',
		// 	},
		// } )

		// cy.selectBlock( 'stackable/text' )
		// cy.openInspector( 'stackable/text', 'Style' )
		// cy.collapse( 'Typography' )
		// cy.adjust( 'Content', {
		// 	source: 'Current Post',
		// 	fieldName: 'Post Title',
		// } ).assertBlockContent( '.stk-block-text__text', 'This is my post' )
		// cy.adjust( 'Content', 'My text goes here!' ).assertBlockContent( '.stk-block-text__text', 'My text goes here!' )

		// cy.assertFrontendStyles( '@stackable/card-group' )
		// cy.assertFrontendStyles( '@stackable/card-1' )
	} )
}
