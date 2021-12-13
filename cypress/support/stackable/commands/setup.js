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

	// TODO: Remove this when version is released.
	// Turn on Load Version 2 blocks in the editor
	const selectCheckbox = () => cy
		.get( 'article[id="other-settings"]' )
		.contains( containsRegExp( 'Load version 2 blocks in the editor' ) )
		.parent()

	cy.visit( '/wp-admin/options-general.php?page=stackable' )
	selectCheckbox().then( $parentEl => {
		if ( ! $parentEl.find( 'svg.components-checkbox-control__checked' ).length ) {
			selectCheckbox().find( 'input.components-checkbox-control__input' ).click( { force: true } )
		}
	} )

	// Temporarily turning off Auto-Collapse panels for WordPress 5.9 run
	// For more info, @see issue link https://github.com/gambitph/Stackable/issues/2041
	const selectAutoCollapse = () => cy
		.get( 'article[id="editor-settings"]' )
		.contains( containsRegExp( 'Auto-Collapse Panels' ) )
		.parent()

	selectAutoCollapse().find( 'button[role="switch"]' ).invoke( 'attr', 'aria-checked' ).then( isChecked => {
		if ( isChecked === true ) {
			selectAutoCollapse().find( 'button[role="switch"]' ).click( { force: true } )
		}
	} )

	// Activate optimization setting for version 2
	cy.loadFrontendJsCssFiles()

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
