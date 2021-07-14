
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'
describe( 'Dynamic Content - Site', registerTests( [
	  adjustSiteData, matchSiteData,
] ) )

const fields = {
	 'Site Title': 'title',
	 'Site Tagline': 'tagline',
	 'Site URL': 'url',
}

function adjustSiteData() {
	 it( 'should adjust the site data', () => {
		 cy.loginAdmin()
		 //find and click customize
		 cy
			 .contains( 'Customize Your Site' )
			 .click( { force: true } )
		 //find 'site identity' and edit fields for site title, tagline
		 cy
			 .contains( 'Site Identity' )
			 .click( { force: true } )

		 cy
			 .get( '[id$=-input-blogname]' ).clear( { force: true } )
			 .type( 'Test Site Title', { force: true } )
			 .get( '[id$=-input-blogdescription]' ).clear( { force: true } )
			 .type( 'Test Site Tagline', { force: true } )

		 cy
			 .contains( 'Publish' )
			 .click( { force: true } )

		 cy.get( 'a[href*="e2etest"]' ).first().click() //exit out of customize site

		 cy.wait( 5000 )
	 } )
}

function matchSiteData() {
	 it( 'should match the site data', () => {
		 cy.setupWP()

		 Object.keys( fields ).forEach( fieldName => {
			 //cy.wait( 5000 )
			 cy.newPost()
			 cy.typePostTitle( `${ fieldName } test` )
			 cy.addBlock( 'ugb/cta' )

			 cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
				 source: 'Site',
				 fieldName,
			 } )
			 cy.savePost()
		 } )
	 } )
}

/*
	 errors:
		 - does not update values after site data is adjusted
	 to do:
		 - assert dynamic content matches corresponding site data
		 - assert that DC changes in frontend once site data also changes
		 - assert that if the field is empty, placeholder is present in backend while also empty in frontend
		 - define test stringsand assert on those variables
 */

