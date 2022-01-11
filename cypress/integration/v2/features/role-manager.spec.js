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
			cy.get( 'body' ).should( 'not.have.descendants', '.ugb-editor-mode-notice' )
		} )
		coreblocks.forEach( blockName => {
			// Test this for core blocks as well.
			cy.addBlock( blockName )
			cy.get( 'body' ).should( 'not.have.descendants', '.ugb-editor-mode-notice' )
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
					cy.get( 'body' ).should( 'not.have.descendants', '.ugb-editor-mode-notice' )
				} )
				coreblocks.forEach( blockName => {
					cy.selectBlock( blockName )
					cy.get( 'body' ).should( 'not.have.descendants', '.ugb-editor-mode-notice' )
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
					.get( 'button[aria-label="Options"]' )
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
					cy.get( 'body' ).should( 'not.have.descendants', 'button[tooltip="Copy & Paste Styles"]' )
					cy.get( 'body' ).should( 'not.have.descendants', 'button[aria-label="Dynamic Fields"]' )
				} )
				coreblocks.forEach( blockName => {
					cy.selectBlock( blockName )
					cy.get( '.ugb-editor-mode-notice' ).should( 'exist' )
					cy.get( 'body' ).should( 'not.have.descendants', 'button[tooltip="Copy & Paste Styles"]' )
					cy.get( 'body' ).should( 'not.have.descendants', 'button[aria-label="Dynamic Fields"]' )
				} )

				cy.get( 'body' ).should( 'not.have.descendants', 'button[aria-label="Stackable Settings"]' )
				cy.get( 'body' ).should( 'not.have.descendants', 'button[aria-label="Open Design Library"]' )

				// The blocklist should only contain 4 text blocks.
				// 2 of which are Stackable blocks.
				cy
					.get( 'button.edit-post-header-toolbar__inserter-toggle' )
					.click( { force: true } )
					.then( () => {
						cy.document().then( doc => {
							const allowedTextBlocks = doc.querySelectorAll( '.block-editor-block-types-list[aria-label="Text"] .block-editor-block-types-list__list-item' )
							const allowedStackableBlocks = doc.querySelectorAll( '.block-editor-block-types-list[aria-label="Stackable (v2)"] .block-editor-block-types-list__list-item' )

							assert.isTrue(
								Array.from( allowedTextBlocks ).length === 2,
								`Allowed text blocks for editor mode expected to be '2' in Editor. Found '${ Array.from( allowedTextBlocks ).length }'`
							)
							assert.isTrue(
								Array.from( allowedStackableBlocks ).length === 2,
								`Allowed stackable blocks for editor mode expected to be '2' in Editor. Found '${ Array.from( allowedStackableBlocks ).length }'`
							)
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
