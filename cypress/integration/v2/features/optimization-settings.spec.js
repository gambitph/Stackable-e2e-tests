
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'

describe( 'Optimization Settings', registerTests( [
	optimizationSettings,
] ) )

function optimizationSettings() {
	it( 'should test the optimization setting', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'core/buttons' )
		cy.savePost()
		cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
			cy.visit( previewUrl )

			const cssJsSelectors = [
				'#ugb-style-css-css',
				'#ugb-style-css-premium-css',
				'#ugb-block-frontend-js-js-extra',
				'#ugb-block-frontend-js-js',
				'#ugb-block-frontend-js-premium-js',
			]

			// Check that the JS and CSS files are loaded in frontend
			// Even if there are no Stackable blocks added
			cssJsSelectors.forEach( selector => {
				cy.get( selector ).should( 'exist' )
			} )

			// Turn on optimization setting in Stackable settings page
			cy.loadFrontendJsCssFiles()
			cy.visit( previewUrl )
			// CSS & JS files should not be present because there are no Stackable blocks.
			cssJsSelectors.forEach( selector => {
				cy.get( selector ).should( 'not.exist' )
			} )

			cy.visit( editorUrl )
			cy.addBlock( 'ugb/card' )
			cy.savePost()
			cy.visit( previewUrl )
			// CSS & JS files should be present because there is a ugb/card block added.
			cssJsSelectors.forEach( selector => {
				cy.get( selector ).should( 'exist' )
			} )
		} )
	} )
}
