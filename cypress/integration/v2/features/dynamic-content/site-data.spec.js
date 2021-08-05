
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'

describe( 'Dynamic Content - Site', registerTests( [
	matchSiteData,
	adjustFieldOptions,
	adjustFieldValues,
] ) )

const fields = [
	{
		name: 'Site Title',
		defaultValue: 'e2etest',
		testValue: 'Test Site Title',
	},
	{
		name: 'Site Tagline',
		defaultValue: 'Just another WordPress site',
		testValue: 'Test Site Tagline',
	},
	{
		name: 'Site URL',
		defaultValue: Cypress.config( 'baseURL' ),
		testValue: 'Test Site Url',
	},
]

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
		 cy.newPost()

		 fields.forEach( field => {
			cy.addBlock( 'ugb/cta' )
			adjustSiteField( field.name )

			// Asserting content value with assertBlockContent
			cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', fields.defaultValue )

			cy.deleteBlock( 'ugb/cta' )
		 } )
	 } )
}

function adjustFieldOptions() {
	it( 'should adjust all fields with options', () => {
		cy.setupWP()

		// adjusting Site Title
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
			.assertHtmlAttribute( '.ugb-cta__title a', 'href', fields[ 2 ].defaultValue )
		cy.deleteBlock( 'ugb/cta' )

		// adjusting Site URL
		cy.newPost()
		cy.addBlock( 'ugb/cta' )
		adjustSiteField( 'Site URL', {
			'Show as link': true,
			'Custom Text': fields[ 2 ].testValue,
			'Open in new tab': true,
		} )
		cy.openInspector( 'ugb/cta', 'Style' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', fields[ 2 ].testValue )
		cy
			.selectBlock( 'ugb/cta' )
			.assertHtmlAttribute( '.ugb-cta__title a', 'rel', 'noreferrer noopener' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertHtmlAttribute( '.ugb-cta__title a', 'href', fields[ 2 ].defaultValue )
		cy.deleteBlock( 'ugb/cta' )
	} )
}
// site URL was excluded for this test, since it cannot be changed
function adjustFieldValues() {
	it( 'should assert changes to the field values', () => {
		cy.setupWP()

		// changing site title and site tagline
		cy.editSiteTitle( fields[ 0 ].testValue )
		cy.editSiteTagline( fields[ 1 ].testValue )

		// adjusting site title
		cy.newPost()
		cy.addBlock( 'ugb/cta' )
		adjustSiteField( 'Site Title' )
		// asserting
		cy.openInspector( 'ugb/cta', 'Style' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', fields[ 0 ].testValue )
		cy.deleteBlock( 'ugb/cta' )

		// adjusting site Tagline
		cy.newPost()
		cy.addBlock( 'ugb/cta' )
		adjustSiteField( 'Site Tagline' )
		// asserting
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', fields[ 1 ].testValue )
		cy.deleteBlock( 'ugb/cta' )
	} )
}

