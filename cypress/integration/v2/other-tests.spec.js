/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'

describe( 'Other Tests', registerTests( [
	testCssFilesPrecedence,
	checkEditorFilesInFrontend,
] ) )

function testCssFilesPrecedence() {
	it( 'should check the order of loading of CSS files in backend & frontend', () => {
		cy.setupWP()
		cy.newPage()

		cy.addBlock( 'ugb/cta' )
		cy.openInspector( 'ugb/cta', 'Layout' )
		cy.adjustLayout( 'split-centered' )

		cy.addBlock( 'ugb/team-member' )
		cy.openInspector( 'ugb/team-member', 'Layout' )
		cy.adjustLayout( 'overlay' )

		cy.savePost()
		cy.document().then( doc => {
			// Gets the id of the element next to the free editor css file.
			let nextElementId = doc.getElementById( 'ugb-block-editor-css-css' ).nextElementSibling.id

			// Handle the next element as well.
			if ( nextElementId !== 'ugb-block-editor-css-premium-css' ) {
				nextElementId = doc.getElementById( 'ugb-block-editor-css-css' ).nextElementSibling.nextElementSibling.id
			}

			// Check the next element if it is the premium file using the premium selector
			assert.isTrue(
				nextElementId === 'ugb-block-editor-css-premium-css',
				`Expected the free css file is loaded first in the Editor. Found: ${ nextElementId }`
			)
		} )
		cy.getPostUrls().then( ( { previewUrl } ) => {
			cy.visit( previewUrl )
			cy.document().then( doc => {
				// Gets the id of the element next to the free frontend css file.
				let nextElementId = doc.getElementById( 'ugb-style-css-css' ).nextElementSibling.id

				// Handle the next element as well.
				if ( nextElementId !== 'ugb-style-css-premium-css' ) {
					nextElementId = doc.getElementById( 'ugb-style-css-css' ).nextElementSibling.nextElementSibling.id
				}

				// Check the next element if it is the premium file using the premium selector
				assert.isTrue(
					nextElementId === 'ugb-style-css-premium-css',
					`Expected the free css file is loaded first in the Frontend. Found: ${ nextElementId }`
				)
			} )
		} )
	} )
}

function checkEditorFilesInFrontend() {
	it( 'should check if the editor CSS files are loaded in frontend', () => {
		// Shoudld not be loaded in frontend
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/cta' )
		cy.savePost()
		cy.getPostUrls().then( ( { previewUrl } ) => {
			cy.visit( previewUrl )
			cy.document().then( doc => {
				const freeCssFile = doc.getElementById( 'ugb-block-editor-css-css' )
				const premiumCssFile = doc.getElementById( 'ugb-block-editor-css-premium-css' )

				// The editor files should not be in frontend.
				assert.isTrue(
					freeCssFile === null,
					'Expected the free css editor file is not loaded in the Frontend.'
				)
				assert.isTrue(
					premiumCssFile === null,
					'Expected the premium css editor file is not loaded in the Frontend.'
				)
			} )
		} )
	} )
}
