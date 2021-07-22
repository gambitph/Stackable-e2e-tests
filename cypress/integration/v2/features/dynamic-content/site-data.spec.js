
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'
import { containsRegExp } from '~common/util'
//import { range } from 'lodash'
describe( 'Dynamic Content - Site', registerTests( [
	matchSiteData,
	adjustFieldOptions,
	adjustFieldValues,
	assertEmptyValues,
] ) )

const fields = [ 'Site Title', 'Site Tagline', 'Site URL' ]
const testString = [ 'Test Site Title', 'Test Site Tagline', 'Test Site URL' ]

const selector = () => cy.get( '.ugb-cta__title' )
const assertValue = value => selector().contains( containsRegExp( value ) ).should( 'exist' )

const adjustSiteField = ( fieldName, fieldOptions = {} ) => {
	 cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
		 source: 'Site',
		 fieldName,
		 fieldOptions,
	 } )
}

const assertInBackendAndFrontend = ( callback = () => {} ) => {
	cy.getPostUrls().then( ( { previewUrl } ) => {
		callback()
		cy.visit( previewUrl )
		callback()
	} )
}

function matchSiteData() {
	 it( 'should match dynamic content in site fields', () => {
		 Object.keys( fields ).forEach( fieldName => {
			 cy.newPost()
			 cy.addBlock( 'ugb/cta' )
			 cy.typePostTitle( `${ fieldName } test` )

			const fieldOptions = {}
			adjustSiteField( fieldName, fieldOptions )

			cy.savePost() //adjust savepost, try manual clicking
			cy.getPostUrls().then( ( { previewUrl } ) => {
				cy.visit( previewUrl )
				assertValue( `${ fieldName }` )
			} )
		 } )
	 } )
}

/*
	to-do:
	- have additional functions (matchPostDataValues, adjustFieldOptions, adjustFieldValues, assertEmptyValues)
	- work on comments
*/

function adjustFieldOptions() {
	it( 'should adjust all field options for each Site field', () => {
		cy.setupWP()
		cy.editSiteTitle( testString[ 0 ] )
		cy.editSiteTagline( testString[ 1 ] )
		//need to edit site url?

		//adjusting Site Title
		cy.newPost()
		cy.addBlock( 'ugb/cta' )
		adjustSiteField( 'Site Title', {
			'Show as link': true,
			'Open in new tab': true,
		} )
		cy.savePost()
		//asserting in frontend; asserting the field options, change this
		cy.getPostUrls().then( ( { previewUrl } ) => {
			cy.visit( previewUrl )
			assertValue( testString[ 0 ] )
		} )
		assertInBackendAndFrontend( () => {
			cy.document().then( doc => {
				const url = doc.URL
				// Check if the url matches the editor, and new page URL
				if ( url.match( /(post|post-new)\.php/g ) && url.match( /wp-admin/g ) ) {
					cy.getPostData().then( data => {
						selector().contains( containsRegExp( 'Dynamic Content test' ) ).should( 'exist' )
						selector().find( `a[href="${ data.link }"]` ).should( 'exist' )
						selector().find( 'a[rel="noreferrer noopener"]' ).should( 'exist' )
					} )
				} else {
					selector().contains( containsRegExp( 'Dynamic Content test' ) ).should( 'exist' )
					selector().find( `a[href="${ url.replace( '&preview=true', '' ) }"]` ).should( 'exist' )
					selector().find( 'a[rel="noreferrer noopener"]' ).should( 'exist' )
				}
			} )
		} )

		//adjusting Site URL
		cy.newPost()
		cy.addBlock( 'ugb/cta' )
		adjustSiteField( 'Site URL', {
			'Show as link': true,
			'Custom Text': testString[ 2 ],
			'Open in new tab': true,
		} )
		cy.savePost()
		//asserting in frontend
		cy.getPostUrls().then( ( { previewUrl } ) => {
			cy.visit( previewUrl )
			assertValue( testString[ 2 ] )
		} )

		 /*

			 if ( fields[ fieldName ] === 'Site Title' ) {
				 adjustSiteField( fields[ fieldName ] )
				 cy.savePost()

				 cy.getPostUrls().then( ( { previewUrl } ) => {
					cy.visit( previewUrl )
					assertValue( testString[ 0 ] )
				} )
			 }
			 if ( fields[ fieldName ] === 'Site Tagline' ) {
				 adjustSiteField( fields[ idx - 1 ] )
				 cy.savePost()

				 cy.getPostUrls().then( ( { previewUrl } ) => {
					cy.visit( previewUrl )
					assertValue( testString[ 1 ] )
				} )
			 }
			 if ( fields[ idx - 1 ] === 'Site URL' ) {
				 adjustSiteField( fields[ idx - 1 ], { 'Show as link': true } )
				 cy.savePost()

				 cy.getPostUrls().then( ( { previewUrl } ) => {
					cy.visit( previewUrl )
				} )
			 }
		 */
	} )
}

function adjustFieldValues() {
	it( 'should do x', () => {
		cy.setupWP()
		cy.editSiteTitle( testString[ 0 ] )
		cy.editSiteTagline( testString[ 1 ] )
	} )
}

function assertEmptyValues() {
	it( 'should do x', () => {

	} )
}

/*
site field options:
site title:
	- show as link
	- open in new tab

site url:
	- show as link, custom text
	- open in new tab
*/
