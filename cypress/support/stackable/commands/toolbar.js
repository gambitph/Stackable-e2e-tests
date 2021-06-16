/**
 * Register functions to cypress commands.
 */
// Toolbar Controls
Cypress.Commands.add( 'copyStyle', copyStyle )
Cypress.Commands.add( 'pasteStyle', pasteStyle )

/**
 * Stackable Command for copying the styles of a block.
 *
 * @param {string} subject
 * @param {string | number | Object} blockToCopy
 */
export function copyStyle( subject, blockToCopy ) {
	cy.adjustToolbar( 'Copy & Paste Styles', () => {
		cy.selectBlock( subject, blockToCopy )
		cy
			.contains( 'Copy Styles' )
			.click( { force: true } )
	} )
}

/**
 * Stackable Command for pasting the styles of a block.
 *
 * @param {string} subject
 * @param {string | number | Object} blockToPaste
 */
export function pasteStyle( subject, blockToPaste ) {
	cy.adjustToolbar( 'Copy & Paste Styles', () => {
		cy.selectBlock( subject, blockToPaste )
		cy
			.contains( 'Paste Styles' )
			.click( { force: true } )
	} )
}
