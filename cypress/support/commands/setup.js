/**
 * Register functions to Cypress Commands.
 */
Cypress.Commands.add( 'setupWP', setupWP )
Cypress.Commands.add( 'loginAdmin', loginAdmin )
Cypress.Commands.add( 'hideAnyGutenbergTip', hideAnyGutenbergTip )
Cypress.Commands.add( 'newPage', newPage )
Cypress.Commands.add( 'deactivatePlugin', deactivatePlugin )
Cypress.Commands.add( 'activatePlugin', activatePlugin )

/**
 * Command for running the initial setup for the test.
 *
 * @param {Object} args
 */
export function setupWP( args = {} ) {
	const params = new URLSearchParams( {
		plugins: args.plugins || [],
		setup: true,
	} )
	cy.visit( '/?' + params.toString() )
}

/**
 * Command used to enter the login credentials of the admin.
 */
export function loginAdmin() {
	cy.visit( '/wp-login.php' )
	cy.get( '#user_login' ).clear().type( 'admin' )
	cy.get( '#user_pass' ).clear().type( 'admin' )
	cy.get( '#loginform' ).submit()
}

/**
 * Command for closing the gutenberg tip popup.
 */
export function hideAnyGutenbergTip() {
	cy.get( 'body' ).then( $body => {
		if ( $body.find( '.edit-post-welcome-guide' ).length ) {
			cy.get( '.edit-post-welcome-guide button:eq(0)' ).click()
		}
	} )
}

/**
 * Command for opening a new page in gutenberg editor.
 */
export function newPage() {
	cy.visit( '/wp-admin/post-new.php?post_type=page' )
	hideAnyGutenbergTip()
}

/**
 * Command for deactivating a plugin.
 *
 * @param {string} slug
 */
export function deactivatePlugin( slug ) {
	cy.get( 'body' ).then( $body => {
		if ( $body.find( 'form[name="loginform"]' ).length ) {
			// Login user if still not logged in.
			loginAdmin()
		}
	} )
	cy.visit( `/?deactivate-plugin=${ slug }` )
	cy.visit( `/wp-admin/` )
}

/**
 * Command for activating a plugin.
 *
 * @param {string} slug
 */
export function activatePlugin( slug ) {
	cy.get( 'body' ).then( $body => {
		if ( $body.find( 'form[name="loginform"]' ).length ) {
			// Login user if still not logged in.
			loginAdmin()
		}
	} )
	cy.visit( `/?activate-plugin=${ slug }` )
	cy.visit( `/wp-admin/` )
}
