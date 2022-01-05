/**
 * Register functions to Cypress Commands.
 */
Cypress.Commands.add( 'forceTypographyStyles', forceTypographyStyles )
Cypress.Commands.add( 'loadFrontendJsCssFiles', loadFrontendJsCssFiles )
Cypress.Commands.add( 'disableOptimization', disableOptimization )

/**
 * Command for forcing typography styles in Stackable Settings page.
 *
 */
function forceTypographyStyles() {
	cy.visit( '/wp-admin/options-general.php?page=stackable' )
	const selector = () => cy
		.get( 'article[id="global-settings"]' )
		.find( 'button[class="ugb-admin-toggle-setting__button"], button[role="switch"]' )

	selector()
		.invoke( 'attr', 'aria-checked' )
		.then( checked => {
			if ( checked === 'false' ) {
				selector()
					.click( { force: true } )
				cy.wait( 500 )
			}
		} )
}

/**
 * Command for loading JS and CSS files across entire site in Stackable
 * Settings page. Only applicable for V2 tests.
 *
 * @param {boolean} enable Enable or disable frontend JS and CSS files.
 */
function loadFrontendJsCssFiles( enable = true ) {
	cy.visit( '/wp-admin/options-general.php?page=stackable' )

	cy.get( 'body' ).then( $body => {
		// Only do this if the setting is available.
		if ( $body.find( 'article[id="optimization-settings"]' ).length > 0 ) {
			const setting = () => cy
				.get( 'article[id="optimization-settings"]' )
				.find( 'button[class="ugb-admin-toggle-setting__button"], button[role="switch"]' )

			setting()
				.invoke( 'attr', 'aria-checked' )
				.then( checked => {
					if ( checked === ( enable ? 'false' : 'true' ) ) {
						setting().click( { force: true } )
						cy.wait( 500 )
					}
				} )
		}
	} )
}

/**
 * Command for disabling optimization setting in Stackable settings.
 */
export function disableOptimization() {
	const params = new URLSearchParams( { 'disable-optimization': 'true' } )
	cy.visit( '/?' + params.toString() )
}
