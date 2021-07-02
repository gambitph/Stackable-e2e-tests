
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'
describe( 'Dynamic Content - Site', registerTests( [
	matchPostData, changePostData,
] ) )

const fields = {
	'Site Title': 'title',
	'Site Tagline': 'tagline',
	'Site URL': 'url',
}

function matchPostData() {
	it( 'should match the corresponding post data', () => {
		cy.setupWP()

		Object.keys( fields ).forEach( fieldName => {
			cy.wait( 5000 )
			cy.newPost()
			cy.typePostTitle( `${ fieldName } test` )
			cy.addBlock( 'ugb/cta' )

			cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
				source: 'Site',
				fieldName,
			} )
			//assert
			cy.savePost()
		} )
	} )
}

function changePostData() {
	it( 'change and assert data settings', () => {
		cy.setupWP()
	} )
}
