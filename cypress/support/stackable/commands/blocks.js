/**
 * Overwrite Cypress Commands
 */
Cypress.Commands.overwrite( 'typeBlock', ( originalFn, ...args ) => {
	const options = args.length === 5 ? args.pop() : {}
	// Set a delay of 300 after typing the text.
	options.delay = 300
	return originalFn( ...args, options )
} )
