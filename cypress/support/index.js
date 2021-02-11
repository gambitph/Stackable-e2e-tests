Cypress.on( 'window:before:load', win => {
	// Allow the use of cypress experimental `fetch` polyfills.
	delete win.fetch
} )

import './commands/index'

// Use Jest assertions
import 'cypress-jest-adapter'
