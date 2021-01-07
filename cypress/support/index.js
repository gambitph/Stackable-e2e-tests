Cypress.on( `window:before:load`, win => {
	cy.stub( win.console, `error`, msg => {
		// log to Terminal
		cy.now( `task`, `error`, msg )
		// log to Command Log & fail the test
		throw new Error( msg )
	} )
} )

// Import commands.js using ES2015 syntax:
import './commands/index'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Use Jest assertions
import 'cypress-jest-adapter'
