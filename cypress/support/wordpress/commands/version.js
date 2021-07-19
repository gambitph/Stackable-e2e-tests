/**
 * Command used to set the WP version as a Cypress env.
 * It can be accessed using `Cypress.env( 'WORDPRESS_VERSION' )`
 */
export function setWpVersionToEnv() {
	if ( ! Cypress.env( 'WORDPRESS_VERSION' ) ) {
		// Get the current WP version in the dashboard At a Glance section.
		cy.visit( '/wp-admin/' )
		cy.document().then( doc => {
			const text = doc.querySelector( '#wp-version-message #wp-version' ).innerText
			const wpVersion = text.split( ' ' ).slice( 0, 2 )[ 1 ]

			Cypress.env( 'WORDPRESS_VERSION', wpVersion )
		} )
	}
}
