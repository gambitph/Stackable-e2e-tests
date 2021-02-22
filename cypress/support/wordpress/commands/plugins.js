/**
 * Register functions to Cypress Commands.
 */
Cypress.Commands.add( 'deactivatePlugin', deactivatePlugin )
Cypress.Commands.add( 'activatePlugin', activatePlugin )
Cypress.Commands.add( 'assertPluginError', assertPluginError )

/**
 * Command for deactivating a plugin.
 *
 * @param {string} slug
 */
export function deactivatePlugin( slug ) {
	cy.setupWP()
	cy.get( 'body' ).then( $body => {
		if ( $body.find( 'form[name="loginform"]' ).length ) {
			// Login user if still not logged in.
			cy.loginAdmin()
		}
	} )
	cy.visit( `/?deactivate-plugin=${ slug }` )
	cy.visit( '/wp-admin/' )
}

/**
 * Command for activating a plugin.
 *
 * @param {string} slug
 */
export function activatePlugin( slug ) {
	cy.setupWP()
	cy.get( 'body' ).then( $body => {
		if ( $body.find( 'form[name="loginform"]' ).length ) {
			// Login user if still not logged in.
			cy.loginAdmin()
		}
	} )
	cy.visit( `/?activate-plugin=${ slug }` )
	cy.visit( '/wp-admin/' )
}

/**
 * Command for asserting an error due to
 * plugin activation.
 */
export function assertPluginError() {
	cy.get( '.xdebug-error' ).should( 'not.exist' )
}
