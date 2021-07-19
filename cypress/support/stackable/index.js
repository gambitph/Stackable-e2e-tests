/**
 * External dependencies
 */
import { compareVersions } from '~common/util'

Cypress.on( 'window:before:load', win => {
	const url = win.location.href
	// Check if the url matches the editor, and new page URL
	if ( url.match( /(post|post-new)\.php/g ) && url.match( /wp-admin/g ) ) {
		if ( compareVersions( Cypress.env( 'WORDPRESS_VERSION' ), '5.8.0', '<' ) ) {
			// Allow the use of cypress experimental `fetch` polyfills.
			delete win.fetch
		}
	}
} )

Cypress.on( 'uncaught:exception', () => {
	// returning false here prevents Cypress from
	// failing the test
	return false
} )

import './commands'
