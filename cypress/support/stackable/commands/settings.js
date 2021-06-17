/**
 * Register functions to Cypress Commands.
 */
Cypress.Commands.add( 'forceTypographyStyles', forceTypographyStyles )
Cypress.Commands.add( 'loadFrontendJsCssFiles', loadFrontendJsCssFiles )

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
 * Settings page.
 *
 */
function loadFrontendJsCssFiles() {
	cy.visit( '/wp-admin/options-general.php?page=stackable' )
	const selector = () => cy
		.get( 'article[id="optimization-settings"]' )
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
