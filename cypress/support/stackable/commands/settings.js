/**
 * Register functions to Cypress Commands.
 */
Cypress.Commands.add( 'forceTypographyStyles', forceTypographyStyles )
Cypress.Commands.add( 'enableOptimization', enableOptimization )
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
 * Command for enabling optimization setting in Stackable settings.
 */
export function enableOptimization() {
	const params = new URLSearchParams( { 'enable-optimization': 'true' } )
	cy.visit( '/?' + params.toString() )
}

/**
 * Command for disabling optimization setting in Stackable settings.
 */
export function disableOptimization() {
	const params = new URLSearchParams( { 'disable-optimization': 'true' } )
	cy.visit( '/?' + params.toString() )
}
