Cypress.on( `window:before:load`, win => {
	cy.stub( win.console, `error`, msg => {
		// log to Terminal
		cy.now( `task`, `error`, msg )
		// log to Command Log & fail the test
		throw new Error( msg )
	} )
} )

import './commands/index'

// Use Jest assertions
import 'cypress-jest-adapter'
