/**
 * Register functions to Cypress Commands.
 */

Cypress.Commands.add( 'setupWP', setupWP )
Cypress.Commands.add( 'loginAdmin', loginAdmin )
Cypress.Commands.add( 'hideAnyGutenbergTip', hideAnyGutenbergTip )
Cypress.Commands.add( 'newPage', newPage )
Cypress.Commands.add( 'deactivatePlugin', deactivatePlugin )
Cypress.Commands.add( 'activatePlugin', activatePlugin )

export function setupWP( args = {} ) {
	const params = new URLSearchParams( {
		plugins: args.plugins || [],
		setup: true,
	} )
	cy.visit( '/?' + params.toString() )
	loginAdmin()
}

export function loginAdmin() {
	cy.visit( '/wp-login.php' )
	cy.get( '#user_login' ).clear().type( 'admin' )
	cy.get( '#user_pass' ).clear().type( 'admin' )
	cy.get( '#loginform' ).submit()
}

export function hideAnyGutenbergTip() {
	cy.get( 'body' ).then( $body => {
		if ( $body.find( '.edit-post-welcome-guide' ).length ) {
			cy.get( '.edit-post-welcome-guide button:eq(0)' ).click()
		}
	} )
}

export function newPage() {
	cy.visit( '/wp-admin/post-new.php?post_type=page' )
	hideAnyGutenbergTip()
}

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
