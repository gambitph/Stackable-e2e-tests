/**
 * Internal dependencies
 */
import { getActiveTab } from '../util'

/**
 * Exernal dependencies
 */
import { last, startCase } from 'lodash'

/**
 * Overwrite Gutenberg commands
 */
Cypress.Commands.overwrite( 'assertComputedStyle', ( originalFn, ...args ) => {
	getActiveTab( tab => {
		originalFn( ...args )

		// This is for Stackable only.
		// After asserting the frontend, go back to the previous editor state.
		if ( ( args.length === 3 &&
				( last( args ).assertFrontend === undefined ||
				last( args ).assertFrontend ) ) ||
			args.length === 2 ) {
			cy.openSidebar( 'Settings' )
			cy.get( `button[aria-label="${ startCase( tab ) } Tab"]` ).click( { force: true } )
		}
	} )
} )

Cypress.Commands.overwrite( 'assertBlockContent', ( originalFn, ...args ) => {
	getActiveTab( tab => {
		originalFn( ...args )

		// This is for Stackable only.
		// After asserting the frontend, go back to the previous editor state.
		if ( ( args.length === 4 &&
				( last( args ).assertFrontend === undefined ||
				last( args ).assertFrontend ) ) ||
			args.length === 3 ) {
			cy.openSidebar( 'Settings' )
			cy.get( `button[aria-label="${ startCase( tab ) } Tab"]` ).click( { force: true } )
		}
	} )
} )
