/**
 * External dependencies
 */
import { containsRegExp } from '~common/util'

/**
 * Register functions to Cypress Commands
 */
Cypress.Commands.add( 'activateLicense', activateLicense )

/**
 * Overwrite Cypress Commands
 */
let isStackableActivated = false

Cypress.Commands.overwrite( 'setupWP', ( originalFn, ...args ) => {
	originalFn( ...args )

	// If the Stackable Premium Code is specified, let's activate Stackable Premium first.
	// This is mainly used when setting up github action wordpresss environment.
	if ( Cypress.env( 'STACKABLE_PREMIUM_CODE' ) && ! isStackableActivated ) {
		cy.activateLicense()
	}

	// TODO: Remove this when running the version 3 tests in actions. And if v2 tests are completely removed.
	// Turn on Load Version 2 blocks in the editor for testing v2 blocks
	const selectCheckbox = () => cy
		.get( 'article[id="other-settings"]' )
		.contains( containsRegExp( 'Load version 2 blocks in the editor' ) )
		.parent()

	const isRunningV2Test = Cypress.spec.absolute.includes( 'integration/v2' )

	cy.visit( '/wp-admin/options-general.php?page=stackable' )
	selectCheckbox().then( $parentEl => {
		// Enable v2 blocks in the editor if running v2 specs.
		if ( isRunningV2Test && ! $parentEl.find( 'svg.components-checkbox-control__checked' ).length ) {
			selectCheckbox().find( 'input.components-checkbox-control__input' ).click( { force: true } )
		}
		// Ensure that v2 blocks are disabled if not running v2 specs.
		if ( ! isRunningV2Test && $parentEl.find( 'svg.components-checkbox-control__checked' ).length ) {
			selectCheckbox().find( 'input.components-checkbox-control__input' ).click( { force: true } )
		}
	} )

	// Activate optimization setting for version 2
	cy.loadFrontendJsCssFiles( isRunningV2Test )

	// Upload media to the server
	cy.uploadMedia()
} )

function _activateLicense() {
	cy.get( '#fs_license_key' ).type( Cypress.env( 'STACKABLE_PREMIUM_CODE' ) )
	cy.get( 'button[type="submit"]' ).click( { force: true } )
	cy.waitUntil( done => {
		cy.document().then( doc => {
			done( ! doc.querySelector( 'button[type="submit"][disabled="disabled"]' ) )
		} )
	} )
	cy.get( 'button' ).contains( 'Agree & Activate License' ).click( { force: true } )
	cy.wait( 10000 )
}

function activateLicense() {
	cy.waitUntil( done => {
		cy.visit( '/wp-admin/options-general.php?page=stackable' )
		cy.document().then( doc => {
			if ( doc.querySelector( '#fs_license_key' ) ) {
				_activateLicense()
			} else {
				isStackableActivated = true
			}

			done( isStackableActivated )
		} )
	} )
}
