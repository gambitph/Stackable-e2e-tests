import compareVersions from 'compare-versions'

Cypress.on( 'window:before:load', win => {
	if ( compareVersions.compare( Cypress.env( 'WORDPRESS_VERSION' ), '5.8.0', '<' ) ) {
		// Allow the use of cypress experimental `fetch` polyfills.
		delete win.fetch
	}
} )

Cypress.on( 'uncaught:exception', () => {
	// returning false here prevents Cypress from
	// failing the test
	return false
} )

import './commands'
