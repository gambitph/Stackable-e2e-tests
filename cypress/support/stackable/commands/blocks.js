/**
 * External dependencies
 */
import { containsRegExp } from '~common/util'

/**
 * Overwrite Cypress Commands
 */
Cypress.Commands.overwrite( 'typeBlock', ( originalFn, ...args ) => {
	const options = args.length === 5 ? args.pop() : {}
	// Set a delay of 300 after typing the text.
	options.delay = 300
	return originalFn( ...args, options )
} )

Cypress.Commands.overwrite( 'addNewColumn', ( originalFn, ...args ) => {
	args[ 1 ].label = 'Add block' // For button group
	originalFn( ...args )
	const options = args.length === 2 ? args.pop() : {}

	cy.get( 'body' ).then( $body => {
		if ( $body.find( '.components-popover__content .block-editor-inserter__quick-inserter' ).length ) {
			cy.get( '.components-popover__content .block-editor-inserter__quick-inserter' )
				.contains( containsRegExp( options.blockToAdd ) )
				.click( { force: true } )
		}
	} )
} )
