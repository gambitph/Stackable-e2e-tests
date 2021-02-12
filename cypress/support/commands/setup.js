/**
 * Register functions to Cypress Commands.
 */
Cypress.Commands.add( 'setupWP', setupWP )
Cypress.Commands.add( 'loginAdmin', loginAdmin )
Cypress.Commands.add( 'hideAnyGutenbergTip', hideAnyGutenbergTip )
Cypress.Commands.add( 'newPage', newPage )
Cypress.Commands.add( 'deactivatePlugin', deactivatePlugin )
Cypress.Commands.add( 'activatePlugin', activatePlugin )
Cypress.Commands.add( 'waitUntil', waitUntil )
Cypress.Commands.add( 'waitFA', waitFA )
Cypress.Commands.add( 'waitLoader', waitLoader )

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
	cy.setupWP()
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
	cy.setupWP()
	cy.get( 'body' ).then( $body => {
		if ( $body.find( 'form[name="loginform"]' ).length ) {
			// Login user if still not logged in.
			loginAdmin()
		}
	} )
	cy.visit( `/?activate-plugin=${ slug }` )
	cy.visit( `/wp-admin/` )
}

/*
* Command for waiting to resolve anything in cy.window or cy.document.
*/
export function waitUntil( callback = () => true, options = {} ) {
	const {
		initialDelay = 20,
		interval = 300,
	} = options
	let done = false
	cy.wait( initialDelay, { log: false } )

	const check = () => {
		if ( done ) {
			return done
		}

		cy.wait( interval, { log: false } ).then( () => {
			callback( toggle => done = toggle )
			check()
		} )
	}

	return check()
}

/**
 * Stackable Command for waiting FontAwesome to register inside window.
 */
export function waitFA() {
	return waitUntil( done => {
		cy.window().then( win => {
			done( win.FontAwesome )
		} )
	} )
}

/**
 * Stackable Command for waiting a spinner button to disappear.
 *
 * @param {string} selector
 * @param {number} interval
 */

export function waitLoader( selector = '', interval = 100 ) {
	return waitUntil( done => cy.document().then( doc => {
		done( ! doc.querySelector( selector ) )
	} ), { interval } )
}

