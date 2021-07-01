/**
 * Internal Dependencies
 */
import { removeGlobalCssTransitions } from '../util'

/**
 * Overwrite Cypress Commands
 */
Cypress.Commands.overwrite( 'visit', ( originalFn, url, options ) => {
	return originalFn( url, Object.assign( options || {}, {
		onLoad: () => {
		// Check if the url matches the editor, and new page URL
			if ( url.match( /(post|post-new)\.php/g ) && url.match( /wp-admin/g ) ) {
				removeGlobalCssTransitions()
			}
		},
	} ) )
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
import './toolbar'
