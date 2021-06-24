
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'

describe( 'Dynamic Content Current Post', registerTests( [
	currentPostSource,
] ) )

function currentPostSource() {
	it( 'should assert current post fields of the dynamic content feature', () => {
		cy.setupWP()
		cy.newPage()
		cy.typePostTitle( 'Dynamic Content Test' )
		cy.addBlock( 'ugb/cta' )
		cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
			source: 'Current Post',
			fieldName: 'Post Title',
		} )
		cy.savePost()
		cy.getPostData().then( data => {
			cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
				cy.visit( previewUrl )
				cy.get( `.ugb-cta__title:contains(${ data.title })` ).should( 'exist' )
				cy.visit( editorUrl )
				cy.typePostTitle( 'New Title' )
				cy.visit( previewUrl )
				cy.get( `.ugb-cta__title:contains(${ data.title })` ).should( 'exist' )
			} )
		} )
	} )
}
