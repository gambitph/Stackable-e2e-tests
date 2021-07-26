
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'

describe( 'Dynamic Content - Site', registerTests( [
	matchSiteData,
	adjustFieldOptions,
	adjustFieldValues,
] ) )

const fields = [ 'Site Title', 'Site Tagline', 'Site URL' ]
const testString = [ 'Test Site Title', 'Test Site Tagline', 'Test Site URL' ]

const adjustSiteField = ( fieldName, fieldOptions = {} ) => {
	 cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
		 source: 'Site',
		 fieldName,
		 fieldOptions,
	 } )
}

function matchSiteData() {
	 it( 'should match dynamic content in site fields', () => {
		 cy.setupWP()
		 Object.keys( fields ).forEach( fieldName => {
			 cy.newPost()
			 cy.addBlock( 'ugb/cta' )
			 cy.typePostTitle( `${ fields[ fieldName ] } Test` )

			const fieldOptions = {}
			adjustSiteField( fields[ fieldName ], fieldOptions )

			//Asserting content value with assertBlockContent
			cy.openInspector( 'ugb/cta', 'Style' )
			if ( `${ fields[ fieldName ] }` === 'Site Title' ) {
				cy
					.selectBlock( 'ugb/cta' )
					.assertBlockContent( '.ugb-cta__title', 'e2etest' )
			} else if ( `${ fields[ fieldName ] }` === 'Site Tagline' ) {
				cy
					.selectBlock( 'ugb/cta' )
					.assertBlockContent( '.ugb-cta__title', 'Just another WordPress site' )
			} else if ( `${ fields[ fieldName ] }` === 'Site URL' ) {
				cy
					.selectBlock( 'ugb/cta' )
					.assertBlockContent( '.ugb-cta__title', 'http://e2etest.local' )
			}

			cy.deleteBlock( 'ugb/cta' )
		 } )
	 } )
}

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

		cy.openInspector( 'ugb/cta', 'Style' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'e2etest' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertHtmlAttribute( '.ugb-cta__title a', 'rel', 'noreferrer noopener' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertHtmlAttribute( '.ugb-cta__title a', 'href', 'http://e2etest.local' )
		cy.deleteBlock( 'ugb/cta' )

		//adjusting Site URL
		cy.newPost()
		cy.addBlock( 'ugb/cta' )
		adjustSiteField( 'Site URL', {
			'Show as link': true,
			'Custom Text': testString[ 2 ],
			'Open in new tab': true,
		} )
		cy.openInspector( 'ugb/cta', 'Style' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', testString[ 2 ] )
		cy
			.selectBlock( 'ugb/cta' )
			.assertHtmlAttribute( '.ugb-cta__title a', 'rel', 'noreferrer noopener' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertHtmlAttribute( '.ugb-cta__title a', 'href', 'http://e2etest.local' )
		cy.deleteBlock( 'ugb/cta' )
	} )
}
//site URL was excluded for this test, since it cannot be changed
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
		//asserting
		cy.openInspector( 'ugb/cta', 'Style' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', testString[ 0 ] )
		cy.deleteBlock( 'ugb/cta' )

		//adjusting site Tagline
		cy.newPost()
		cy.addBlock( 'ugb/cta' )
		adjustSiteField( 'Site Tagline' )
		//asserting
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', testString[ 1 ] )
		cy.deleteBlock( 'ugb/cta' )
	} )
}

