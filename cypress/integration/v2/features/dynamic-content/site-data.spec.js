
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

//tests are passing
function matchSiteData() {
	 it( 'should match dynamic content in site fields', () => {
		 cy.setupWP()
		 Object.keys( fields ).forEach( fieldName => {
			 cy.newPost()
			 cy.addBlock( 'ugb/cta' )
			 cy.typePostTitle( `${ fields[ fieldName ] } Test` )

			const fieldOptions = {}
			adjustSiteField( fields[ fieldName ], fieldOptions )

			cy.getPostUrls().then( ( { previewUrl } ) => {
				//assert dynamic content exists
				cy.get( '.stk-dynamic-content' ).should( 'exist' )
				cy.visit( previewUrl )
				//assert dynamic content in frontend
				if ( `${ fields[ fieldName ] }` === 'Site Title' ) {
					selector().contains( 'e2etest' ).should( 'exist' )
				} else if ( `${ fields[ fieldName ] }` === 'Site Tagline' ) {
					selector().contains( 'Just another WordPress site' ).should( 'exist' )
				} else if ( `${ fields[ fieldName ] }` === 'Site URL' ) {
					selector().contains( 'http://e2etest.local' ).should( 'exist' )
				}
			} )
		 } )
	 } )
}

//tests are passing
function adjustFieldOptions() {
	it( 'should adjust all fields with options', () => {
		cy.setupWP()

		//adjusting Site Title
		cy.newPost()
		cy.addBlock( 'ugb/cta' )
		adjustSiteField( 'Site Title', {
			'Show as link': true,
			'Open in new tab': true,
		} )

		//asserting in backend
		selector().find( 'a[href="http://e2etest.local"]' ).should( 'exist' )
		selector().find( 'a[rel="noreferrer noopener"]' ).should( 'exist' )

		//asserting in frontend
		cy.getPostUrls().then( ( { previewUrl } ) => {
			cy.visit( previewUrl )
			selector().find( 'a[href="http://e2etest.local"]' ).should( 'exist' )
			selector().find( 'a[rel="noreferrer noopener"]' ).should( 'exist' )
		} )

		//adjusting Site URL
		cy.newPost()
		cy.addBlock( 'ugb/cta' )
		adjustSiteField( 'Site URL', {
			'Show as link': true,
			'Custom Text': testString[ 2 ],
			'Open in new tab': true,
		} )
		//asserting in backend
		selector().contains( containsRegExp( testString[ 2 ] ) ).should( 'exist' )
		selector().find( 'a[href="http://e2etest.local"]' ).should( 'exist' )
		selector().find( 'a[rel="noreferrer noopener"]' ).should( 'exist' )

		//asserting in frontend
		cy.getPostUrls().then( ( { previewUrl } ) => {
			cy.visit( previewUrl )
			selector().contains( containsRegExp( testString[ 2 ] ) ).should( 'exist' )
			selector().find( 'a[href="http://e2etest.local"]' ).should( 'exist' )
			selector().find( 'a[rel="noreferrer noopener"]' ).should( 'exist' )
		} )
	} )
}
//tests are passing
function adjustFieldValues() {
	it( 'should assert changes to the field values', () => {
		cy.setupWP()

		//changing site title and site tagline
		cy.editSiteTitle( testString[ 0 ] )
		cy.editSiteTagline( testString[ 1 ] )

		//adjusting site title
		cy.newPost()
		cy.addBlock( 'ugb/cta' )
		adjustSiteField( 'Site Title' )

		//asserting	in backend
		assertValue( `${ testString[ 0 ] }` )
		//asserting in frontend
		cy.getPostUrls().then( ( { previewUrl } ) => {
			cy.visit( previewUrl )
			assertValue( `${ testString[ 0 ] }` )
		} )

		//adjusting site Tagline
		cy.newPost()
		cy.addBlock( 'ugb/cta' )
		adjustSiteField( 'Site Tagline' )

		//asserting	in backend
		selector().contains( `${ testString[ 1 ] }` ).should( 'exist' )

		//asserting in frontend
		cy.getPostUrls().then( ( { previewUrl } ) => {
			cy.visit( previewUrl )
			selector().contains( `${ testString[ 1 ] }` ).should( 'exist' )
		} )
	} )
}

