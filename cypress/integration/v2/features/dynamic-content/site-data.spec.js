
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'
import { containsRegExp } from '~common/util'
describe( 'Dynamic Content - Site', registerTests( [
	  assertSiteData,
] ) )

const selector = () => cy.get( '.ugb-cta__title' )
const fields = {
	 'Site Title': 'title',
	 'Site Tagline': 'tagline',
	 'Site URL': 'url',
}
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

		 Object.keys( fields ).forEach( fieldName => {
			 cy.newPost()
			 cy.addBlock( 'ugb/cta' )
			 cy.typePostTitle( `${ fieldName } test` )

			 if ( fieldName === 'Site Title' ) {
				 adjustSiteField( fieldName )
				 assertValue( testString[ 0 ] )
			 }
			 if ( fieldName === 'Site Tagline' ) {
				 adjustSiteField( fieldName )
				 assertValue( testString[ 1 ] )
			 }
			 if ( fieldName === 'Site URL' ) {
				 adjustSiteField( fieldName, { 'Show as link': true } )
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

