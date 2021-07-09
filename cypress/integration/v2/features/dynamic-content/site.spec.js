
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'
describe( 'Dynamic Content - Site', registerTests( [
	/*matchSiteData,*/ adjustSiteData,
] ) )

/*
const fields = {
	'Site Title': 'title',
	'Site Tagline': 'tagline',
	'Site URL': 'url',
}
//const to add post, blocks
//const to adjust site DC fields

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
*/
function adjustSiteData() {
	it( 'should adjust the site data', () => {
		cy.visit( 'http://e2etest.local/wp-admin/' )
		//find and click customize
		//find 'site identity' and edit fields for site title, tagline
		//click 'publish'
	} )
}

/*function for adjusting siteData, could also be added to DC-commands
> need additional commands?? could write them on my own as well
> get site data -> adjust DC toolbars and output site data -> adjust site data -> assert changes
*/
