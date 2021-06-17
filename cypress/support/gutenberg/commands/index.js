/**
 * Internal Dependencies
 */
import { removeGlobalCssTransitions } from '../util'

/**
 * Overwrite Cypress Commands
 */
Cypress.Commands.overwrite( 'visit', ( originalFn, url, options ) => {
	const yieldWin = originalFn( url, options )

	// Check if the url matches the editor, and new page URL
	if ( url.match( /(post|post-new)\.php/g ) && url.match( /wp-admin/g ) ) {
		removeGlobalCssTransitions()
	}

	return cy.wrap( yieldWin )
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
