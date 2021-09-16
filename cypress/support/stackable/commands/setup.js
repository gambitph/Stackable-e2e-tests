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

	// TODO: Remove this after V3 Release.
	// Enable optimization setting by default.
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
