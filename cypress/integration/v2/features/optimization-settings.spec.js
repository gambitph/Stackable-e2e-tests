
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'

describe( 'Optimization Settings', registerTests( [
	optimizationSettings,
	indirectlyAddedBlocks,
] ) )

const cssJsSelectors = [
	'#ugb-style-css-inline-css',
	'#ugb-style-css-css',
	'#ugb-style-css-premium-css',
	'#ugb-block-frontend-js-js-extra',
	'#ugb-block-frontend-js-js',
	'#ugb-block-frontend-js-premium-js',
]

function optimizationSettings() {
	it( 'should test the optimization setting', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'core/buttons' )
		cy.savePost()
		cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
			cy.visit( previewUrl )
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

function indirectlyAddedBlocks() {
	it( 'should assert css and js files for indirectly added stackable blocks', () => {
		cy.setupWP()
		cy.loadFrontendJsCssFiles()

		// Publish a post with a ugb/card inside it
		cy.newPost()
		cy.addBlock( 'ugb/card' )
		cy.publish()

		cy.newPage()
		// Stackable block inside the core latest posts block
		cy.addBlock( 'core/latest-posts' )
		cy.openSidebar( 'Settings' )
		cy.collapse( 'Post content settings' )
		cy.adjust( 'Post content', true )
		cy.adjust( 'Show:', 'Full post' )
		cy.savePost()
		const assertFilesExistInFrontend = () => {
			cy.getPostUrls().then( ( { previewUrl } ) => {
				cy.visit( previewUrl )
				cssJsSelectors.forEach( selector => {
					// CSS & JS files should be present in frontend
					cy.get( selector ).should( 'exist' )
				} )
			} )
		}
		assertFilesExistInFrontend()

		// Stackable block inside a reusable block
		cy.newPage()
		cy.addBlock( 'ugb/cta' )
		cy.addToReusableBlocks( 'ugb/cta', 0 )
		cy.publish()
		assertFilesExistInFrontend()
	} )
}
