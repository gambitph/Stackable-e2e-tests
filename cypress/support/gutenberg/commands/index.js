/**
 * Overwrite Cypress Commands
 */
Cypress.Commands.overwrite( 'visit', ( originalFn, url, options ) => {
	cy.log( 'remove transitions !!' )
	cy.getPostUrls().then( ( { editorUrl } ) => {
		// Check if the url matches the editor, and new page URL
		if ( url === editorUrl ||
            url === '/wp-admin/post-new.php?post_type=page' ) {
			// Remove the transitions
			options.onLoad = () => {
				cy.removeGlobalCssTransitions()
			}
		}
	} )

	return originalFn( url, options )
} )

/**
 * Custom commands for Gutenberg.
 */
import './assertions'
import './attributes'
import './blocks'
import './controls'
import './editor'
import './inspector'
