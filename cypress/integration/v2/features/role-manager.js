/**
 * External dependencies
 */
import { range } from 'lodash'
import { blocks } from '~stackable-e2e/config'

describe( 'Role Manager', () => {
	it( 'should assert content only editing mode', () => {
		cy.setupWP()
		cy.newPage()
		blocks.forEach( blockName => {
			cy.addBlock( blockName )
		} )
		cy.savePost()

		cy.getPostUrls().then( ( { editorUrl } ) => {
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
			}

			testContentOnly( 'administrator', 'administrator' )
			testContentOnly( 'administrator', 'editor' )
		} )

		// Always revert the role back to the administrator to have full access of the site
		cy.changeRole( { roleFrom: 'editor', roleTo: 'administrator' } )

		// TODO: Test content only mode for
		// Author & Contributor
		// These roles can only add & edit posts, not pages
	} )
} )
