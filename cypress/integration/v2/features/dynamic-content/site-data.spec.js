
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
		defaultValue: Cypress.config().baseUrl,
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
			cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', field.defaultValue )
			cy.deleteBlock( 'ugb/cta' )
		 } )
	 } )
}
// 'Site Tagline' was excluded for this test, since it does not have field options
function adjustFieldOptions() {
	it( 'should adjust all fields with options', () => {
		cy.setupWP()
		cy.newPost()

		// adjusting Site Title
		cy.addBlock( 'ugb/cta' )
		adjustSiteField( 'Site Title', {
			'Show as link': true,
			'Open in new tab': true,
		} )

		cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', 'e2etest' )
		cy.selectBlock( 'ugb/cta' ).assertHtmlAttribute( '.ugb-cta__title a', 'rel', 'noreferrer noopener', { assertBackend: false } )
		cy.selectBlock( 'ugb/cta' ).assertHtmlAttribute( '.ugb-cta__title a', 'href', fields[ 2 ].defaultValue, { assertBackend: false } )
		cy.deleteBlock( 'ugb/cta' )

		// adjusting Site URL
		cy.addBlock( 'ugb/cta' )
		adjustSiteField( 'Site URL', {
			'Show as link': true,
			'Custom Text': fields[ 2 ].testValue,
			'Open in new tab': true,
		} )
		cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', fields[ 2 ].testValue )
		cy.selectBlock( 'ugb/cta' ).assertHtmlAttribute( '.ugb-cta__title a', 'rel', 'noreferrer noopener', { assertBackend: false } )
		cy.selectBlock( 'ugb/cta' ).assertHtmlAttribute( '.ugb-cta__title a', 'href', fields[ 2 ].defaultValue, { assertBackend: false } )
		cy.deleteBlock( 'ugb/cta' )
	} )
}
// 'Site URL' was excluded for this test, since it cannot be modified
function adjustFieldValues() {
	it( 'should assert changes to the field values', () => {
		cy.setupWP()

		// modifying 'Site Title' and 'Site Tagline'
		cy.editSiteTitle( fields[ 0 ].testValue )
		cy.editSiteTagline( fields[ 1 ].testValue )

		// adjusting Site title
		cy.newPost()
		cy.addBlock( 'ugb/cta' )
		adjustSiteField( 'Site Title' )
		// asserting changes to site title
		cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', fields[ 0 ].testValue )
		cy.deleteBlock( 'ugb/cta' )

		// adjusting site Tagline
		cy.addBlock( 'ugb/cta' )
		adjustSiteField( 'Site Tagline' )
		// asserting
		cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', fields[ 1 ].testValue )
		cy.deleteBlock( 'ugb/cta' )
	} )
}
