/**
 * External dependencies
 */
import { containsRegExp } from '~common/util'

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
