/**
 * Register functions to Cypress Commands.
 */
Cypress.Commands.add( 'waitFA', waitFA )

/**
 * Stackable Command for waiting FontAwesome to register inside window.
 */
export function waitFA() {
	return cy.waitUntil( done => {
		cy.window().then( win => {
			done( win.FontAwesome )
		} )
	} )
}
