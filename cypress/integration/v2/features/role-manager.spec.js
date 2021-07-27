/**
 * External dependencies
 */
import { range } from 'lodash'
import { coreblocks } from '~gutenberg-e2e/config'
import { blocks } from '~stackable-e2e/config'
import { registerTests } from '~stackable-e2e/helpers'

describe( 'Role Manager', registerTests( [
	roleManagerTest,
] ) )

function roleManagerTest() {
	it( 'should assert role manager settings for all roles', () => {
		cy.setupWP()
		cy.newPost()
		blocks.forEach( blockName => {
			cy.addBlock( blockName )
			// By default, full site editing mode is set for all roles
			// Content only mode notice should not be present
			// Test this for administrator
			cy.get( '.ugb-editor-mode-notice' ).should( 'not.exist' )
		} )
		coreblocks.forEach( blockName => {
			// Test this for core blocks as well.
			cy.addBlock( blockName )
			cy.get( '.ugb-editor-mode-notice' ).should( 'not.exist' )
		} )
		cy.savePost()

		const selector = () => cy
			.get( 'article[id="role-manager"]' )
			.find( '.ugb-admin-setting.ugb-admin-setting--small' )

		// Adjustment of Role manager in Stackable settings.
		const adjustRoleManager = idx => {
			selector()
				.eq( idx )
				.find( 'button[class="ugb-admin-toggle-setting__button"]' )
				.click( { force: true } )
			// Added wait here for the settings to take effect
			cy.wait( 500 )
		}

		// Adjust the Role manager settings for all roles.
		const adjustAllRoles = () => {
			cy.visit( '/wp-admin/options-general.php?page=stackable' )
			range( 0, 5 ).forEach( ( _, idx ) => {
				adjustRoleManager( idx )
			} )
		}

		cy.getPostUrls().then( ( { editorUrl } ) => {
			// Test full site editing for the other roles
			Array( 'editor', 'author', 'contributor' ).forEach( roleTo => {
				cy.changeRole( { roleTo } )
				cy.visit( editorUrl )
				blocks.forEach( blockName => {
					cy.selectBlock( blockName )
					cy.get( '.ugb-editor-mode-notice' ).should( 'not.exist' )
				} )
				coreblocks.forEach( blockName => {
					cy.selectBlock( blockName )
					cy.get( '.ugb-editor-mode-notice' ).should( 'not.exist' )
				} )
				cy.savePost()
			} )
			// Revert to administrator to adjust role manager settings
			cy.changeRole( { roleTo: 'administrator' } )
			// Adjusts the Role manager settings to Content ONLY mode for all roles.
			adjustAllRoles()

			const testContentOnly = roleTo => {
				if ( roleTo !== 'administrator' ) {
					cy.changeRole( { roleTo } )
				}

				cy.visit( editorUrl )

				const toolbar = () => cy
					.contains( 'Top toolbar' )
					.closest( 'button.components-menu-item__button' )

				// Set the toolbar to top
				cy
					.get( 'button[aria-label="Options"], button[aria-label="More tools & options"]' ) // To support WP 5.5
					.click( { force: true } )
				toolbar()
					.invoke( 'attr', 'aria-checked' )
					.then( val => {
						if ( val === 'false' ) {
							toolbar()
								.click( { force: true } )
						}
					} )

				blocks.forEach( blockName => {
					cy.openInspector( blockName, 'Style' )
					cy.selectBlock( blockName )
					cy.get( '.ugb-editor-mode-notice' ).should( 'exist' )
					cy.get( 'button[tooltip="Copy & Paste Styles"]' ).should( 'not.exist' )
					cy.get( 'button[aria-label="Dynamic Fields"]' ).should( 'not.exist' )
				} )
				coreblocks.forEach( blockName => {
					cy.selectBlock( blockName )
					cy.get( '.ugb-editor-mode-notice' ).should( 'exist' )
					cy.get( 'button[tooltip="Copy & Paste Styles"]' ).should( 'not.exist' )
					cy.get( 'button[aria-label="Dynamic Fields"]' ).should( 'not.exist' )
				} )

				cy.get( 'button[aria-label="Stackable Settings"]' ).should( 'not.exist' )
				cy.get( 'button[aria-label="Open Design Library"]' ).should( 'not.exist' )

				// The blocklist should only contain 4 text blocks.
				// 2 of which are Stackable blocks.
				cy
					.get( 'button.edit-post-header-toolbar__inserter-toggle' )
					.click( { force: true } )
					.then( () => {
						cy.document().then( doc => {
							const allowedTextBlocks = doc.querySelectorAll( '.block-editor-block-types-list[aria-label="Text"] .block-editor-block-types-list__list-item' )
							const allowedStackableBlocks = doc.querySelectorAll( '.block-editor-block-types-list[aria-label="Stackable"] .block-editor-block-types-list__list-item' )

							expect( Array.from( allowedTextBlocks ).length ).toBe( 4 )
							expect( Array.from( allowedStackableBlocks ).length ).toBe( 2 )
						} )
					} )

				cy.savePost()
			}

			testContentOnly( 'administrator' )
			testContentOnly( 'editor' )
			testContentOnly( 'author' )
			testContentOnly( 'contributor' )
		} )
	} )
}
