/**
 * register functions to cypress commands.
 */
// Toolbar Controls
Cypress.Commands.add( 'copyStyles', copyStyles )

/**
 * Stackable Command for changing the icon in icon block.
 *
 * @param {string} subject
 * @param {string | number | Object} selector
 */
export function copyStyles( subject, selector ) {
	if ( selector === '' ) {
		selector = undefined
	}
}
