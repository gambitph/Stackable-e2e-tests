
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'
import { containsRegExp } from '~common/util'
import { range } from 'lodash'
describe( 'Dynamic Content - Site', registerTests( [
	  assertSiteData,
] ) )

const fields = [ 'Site Title', 'Site Tagline', 'Site URL' ]
const testString = [ 'Test Site Title', 'Test Site Tagline' ]

const selector = () => cy.get( '.ugb-cta__title' )
const assertValue = value => selector().contains( containsRegExp( value ) ).should( 'exist' )
const adjustSiteField = ( fieldName, fieldOptions = {} ) => {
	 cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
		 source: 'Site',
		 fieldName,
		 fieldOptions,
	 } )
}

function assertSiteData() {
	 it( 'should match and assert adjusted Site Data', () => {
		 cy.setupWP()
		 cy.editSiteTitle( testString[ 0 ] )
		 cy.editSiteTagline( testString[ 1 ] )

		 range( 1, 4 ).forEach( idx => {
			 cy.newPost()
			 cy.addBlock( 'ugb/cta' )
			 cy.typePostTitle( fields[ idx - 1 ] )

			 if ( fields[ idx - 1 ] === 'Site Title' ) {
				 adjustSiteField( fields[ idx - 1 ] )
				 cy
					.get( '.edit-post-header__settings' )
					.contains( 'Save draft' )
					.click( { force: true } )

				 cy.getPostUrls().then( ( { previewUrl } ) => {
					cy.visit( previewUrl )
					assertValue( testString[ 0 ] )
				} )
			 }
			 if ( fields[ idx - 1 ] === 'Site Tagline' ) {
				 adjustSiteField( fields[ idx - 1 ] )
				 cy
					.get( '.edit-post-header__settings' )
					.contains( 'Save draft' )
					.click( { force: true } )

				 cy.getPostUrls().then( ( { previewUrl } ) => {
					cy.visit( previewUrl )
					assertValue( testString[ 1 ] )
				} )
			 }
			 if ( fields[ idx - 1 ] === 'Site URL' ) {
				 adjustSiteField( fields[ idx - 1 ], { 'Show as link': true } )
				cy
					.get( '.edit-post-header__settings' )
					.contains( 'Save draft' )
					.click( { force: true } )

				 cy.getPostUrls().then( ( { previewUrl } ) => {
					cy.visit( previewUrl )
				} )
			 }
		 } )
	 } )
}

