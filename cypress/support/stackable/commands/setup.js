/**
 * Overwrite WordPress Commands
 */
Cypress.Commands.overwrite( 'setupWP', ( originalFn, ...args ) => {
	const optionsToPass = args.length === 2 ? args.pop() : {}

	optionsToPass.pluginSetupCallback = () => {
		// Enable optimization setting when calling setupWP.
		cy.enableOptimization()
	}

	return originalFn( args, optionsToPass )
} )
