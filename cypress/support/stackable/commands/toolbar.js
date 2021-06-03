/**
 * Register functions to cypress commands.
 */
// Toolbar Controls
Cypress.Commands.add( 'copyStyles', copyStyles )
Cypress.Commands.add( 'pasteStyles', pasteStyles )

/**
 * Stackable Command for copying the styles of a block.
 *
 * @param {string} subject
 * @param {string | number | Object} selector
 */
export function copyStyles( subject, selector ) {
	const toolbar = () => cy
		.contains( 'Top toolbar' )
		.closest( 'button.components-menu-item__button' )

	// Set the toolbar to top
	cy
		.get( 'button[aria-label="Options"]' )
		.click( { force: true } )
	toolbar()
		.invoke( 'attr', 'aria-checked' )
		.then( val => {
			if ( val === 'false' ) {
				toolbar()
					.click( { force: true } )
			}
		} )

	cy.selectBlock( subject, selector )
	cy
		.get( 'button[tooltip="Copy & Paste Styles"]' )
		.click( { force: true } )
	cy
		.contains( 'Copy Styles' )
		.click( { force: true } )
}

/**
 * Stackable Command for pasting the styles of a block.
 *
 * @param {string} subject
 * @param {string | number | Object} selector
 */
export function pasteStyles( subject, selector ) {
	cy.selectBlock( subject, selector )
	if ( ! cy.contains( 'Paste Styles' ) ) {
		cy
			.get( 'button[tooltip="Copy & Paste Styles"]' )
			.click( { force: true } )
	}
	cy
		.contains( 'Paste Styles' )
		.click( { force: true } )
}
