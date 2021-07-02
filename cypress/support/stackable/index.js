Cypress.on( 'window:before:load', win => {
	// Allow the use of cypress experimental `fetch` polyfills.
	delete win.fetch
} )

Cypress.on( 'uncaught:exception', () => {
	// returning false here prevents Cypress from
	// failing the test
	return false
} )

import './commands'
