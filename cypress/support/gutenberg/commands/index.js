/**
 * Internal Dependencies
 */
import { removeGlobalCssTransitions } from '../util'
import { containsRegExp } from '~common/util'

/**
 * Overwrite Cypress Commands
 */
Cypress.Commands.overwrite( 'visit', ( originalFn, url, options ) => {
	// Check if the url matches the editor, and new page URL
	if ( url.match( containsRegExp( 'action=edit' ) ) ||
        url === '/wp-admin/post-new.php?post_type=page' ) {
		// Remove the transitions
		if ( ! options ) {
			options = {}
		}
		options.onLoad = () => {
			removeGlobalCssTransitions()
		}
	}

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
