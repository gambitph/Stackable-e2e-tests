
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
//const to add post, blocks
//const to adjust site DC fields

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
			//type tagline test
		cy
			//.get( 'button' )
			.contains( 'Publish' )
			.click( { force: true } )
		//click 'publish'
	} )
}

function matchSiteData() {
	it( 'should match the site data', () => {
		cy.setupWP()

		Object.keys( fields ).forEach( fieldName => {
			cy.wait( 5000 )
			cy.newPost()
			cy.typePostTitle( `${ fieldName } test` )
			cy.addBlock( 'ugb/cta' )
			//add code for adjusting site settings
			cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
				source: 'Site',
				fieldName,
			} )
			//assert
			cy.savePost()
		} )
	} )
}

/*function for adjusting siteData, could also be added to DC-commands
> need additional commands?? could write them on my own as well
> get site data -> adjust DC toolbars and output site data -> adjust site data -> assert changes
*/
