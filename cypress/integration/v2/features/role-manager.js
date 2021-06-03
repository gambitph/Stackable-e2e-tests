/**
 * External dependencies
 */
import { range } from 'lodash'
import { blocks } from '~stackable-e2e/config'

const selector = () => cy.get( 'article[id="role-manager"]' ).find( '.ugb-admin-setting.ugb-admin-setting--small' )
const adjustRoleManager = idx => {
	selector()
		.eq( idx ) // Administrator
		.find( 'button[class="ugb-admin-toggle-setting__button"]' )
		.click( { force: true } )
	// Added a cy.wait here for the settings to
	// take effect before going back to the editor URL
	cy.wait( 500 )
}

describe( 'Role Manager', () => {
	it( 'should assert role manager settings for admin and editor', () => {
		cy.setupWP()
		cy.newPage()
		blocks.forEach( blockName => {
			cy.addBlock( blockName )
			// By default, full site editing mode is set for all roles
			// Test this for admin
			cy.get( '.ugb-editor-mode-notice' ).should( 'not.exist' )
		} )
		cy.savePost()

		cy.getPostUrls().then( ( { editorUrl } ) => {
			// Test full site editing for editor
			cy.changeRole( { roleFrom: 'administrator', roleTo: 'editor' } )
			cy.visit( editorUrl )
			blocks.forEach( blockName => {
				cy.selectBlock( blockName )
				cy.get( '.ugb-editor-mode-notice' ).should( 'not.exist' )
			} )
			cy.savePost()
			// Revert to administrator role to adjust role manager settings
			cy.changeRole( { roleFrom: 'editor', roleTo: 'administrator' } )

			cy.visit( '/wp-admin/options-general.php?page=stackable' )
			range( 0, 5 ).forEach( ( _, idx ) => {
				// Adjust all roles to CONTENT ONLY MODE
				adjustRoleManager( idx )
			} )

			const testContentOnly = ( roleFrom, roleTo ) => {
				if ( roleTo !== 'administrator' ) {
					cy.changeRole( { roleFrom, roleTo } )
				}

				cy.visit( editorUrl )
				blocks.forEach( blockName => {
					cy.selectBlock( blockName )
					cy.get( '.ugb-editor-mode-notice' ).should( 'exist' )
				} )
				// Allowed blocks
				cy.addBlock( 'ugb/heading' )
				cy.addBlock( 'ugb/text' )
				cy.addBlock( 'core/paragraph' )
				cy.addBlock( 'core/heading' )
				cy.savePost()
			}

			// Test content only for admin and editor
			testContentOnly( 'administrator', 'administrator' )
			testContentOnly( 'administrator', 'editor' )
		} )

		// Always revert the role back to the administrator to have full access of the site
		cy.changeRole( { roleFrom: 'editor', roleTo: 'administrator' } )
	} )

	it( 'should assert role manager settings for author and contributor', () => {
		cy.setupWP()
		cy.changeRole( { roleFrom: 'administrator', roleTo: 'author' } )
		cy.newPost()
		blocks.forEach( blockName => {
			cy.addBlock( blockName )
			// By default, full site editing mode is set for all roles
			// Test this for author
			cy.get( '.ugb-editor-mode-notice' ).should( 'not.exist' )
		} )
		cy.savePost()

		cy.getPostUrls().then( ( { editorUrl } ) => {
			// Test full site editing for contributor
			cy.changeRole( { roleFrom: 'author', roleTo: 'contributor' } )
			cy.visit( editorUrl )
			blocks.forEach( blockName => {
				cy.selectBlock( blockName )
				cy.get( '.ugb-editor-mode-notice' ).should( 'not.exist' )
			} )
			cy.savePost()
			// Revert to administrator to adjust role manager settings
			cy.changeRole( { roleFrom: 'contributor', roleTo: 'administrator' } )

			cy.visit( '/wp-admin/options-general.php?page=stackable' )
			range( 0, 5 ).forEach( ( _, idx ) => {
				// Adjust all roles to CONTENT ONLY MODE
				adjustRoleManager( idx )
			} )

			const testContentOnly = ( roleFrom, roleTo ) => {
				cy.changeRole( { roleFrom, roleTo } )

				cy.visit( editorUrl )
				blocks.forEach( blockName => {
					cy.selectBlock( blockName )
					cy.get( '.ugb-editor-mode-notice' ).should( 'exist' )
				} )
				// Allowed blocks
				cy.addBlock( 'ugb/heading' )
				cy.addBlock( 'ugb/text' )
				cy.addBlock( 'core/paragraph' )
				cy.addBlock( 'core/heading' )
				cy.savePost()
			}

			testContentOnly( 'administrator', 'author' )
			testContentOnly( 'author', 'contributor' )
		} )

		// Always revert the role back to the administrator to have full access of the site
		cy.changeRole( { roleFrom: 'contributor', roleTo: 'administrator' } )
	} )
} )