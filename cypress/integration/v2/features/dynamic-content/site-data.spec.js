
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'
import { containsRegExp } from '~common/util'
import { range } from 'lodash'
describe( 'Dynamic Content - Site', registerTests( [
	  assertSiteData,
] ) )

const selector = () => cy.get( '.ugb-cta__title' )
const fields = [ 'Site Title, Site Tagline, Site URL' ]
const assertValue = value => selector().contains( containsRegExp( value ) ).should( 'exist' )

const testString = [ 'Test Site Title', 'Test Site Tagline' ]
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

		 range( 1, 3 ).forEach( idx => {
			 cy.newPost()
			 cy.addBlock( 'ugb/cta' )
			 cy.typePostTitle( fields[ idx - 1 ] )

			 if ( fields[ idx - 1 ] === 'Site Title' ) {
				 adjustSiteField( fields[ idx - 1 ] )
				 assertValue( testString[ 0 ] )
			 }
			 if ( fields[ idx - 1 ] === 'Site Tagline' ) {
				 adjustSiteField( fields[ idx - 1 ] )
				 assertValue( testString[ 1 ] )
			 }
			 if ( fields[ idx - 1 ] === 'Site URL' ) {
				 adjustSiteField( fields[ idx - 1 ], { 'Show as link': true } )
			 }
		 } )
	 } )
}

/*
	 to do:
	 - edit Site fields
	 - adjust Dynamic Content; assert data matches edited Site fields
		 - assert that DC changes in frontend once site data also changes
	 - assert that if the field is empty, placeholder is present in backend while also empty in frontend

	 steps:
	 [x]declare stringObj = (Title: This is a site title, Tagline: This is a site tagline)
	 [x]const adjustSiteField = call adjustDynamicContent passing CTA block

	 function assertSiteData
		 [x]edit fieldName (if Site Title or Tagline)
		 [x] adjustSiteField
		 [x]assert Data matches
		 - assert Data is seen (access previewURL)

 */

