/**
 * Internal dependencies
 */
import { containsRegExp } from '~common/util'

/**
 * Register functions to cypress commands.
 */
// Toolbar Controls
Cypress.Commands.add( 'copyPasteStyles', copyPasteStyles )

/**
 * Stackable Command for copying & pasting the styles of a block.
 *
 * @param {string} subject
 * @param {string | number | Object} blockToCopy
 * @param {string | number | Object} blockToPaste
 */
export function copyPasteStyles( subject, blockToCopy, blockToPaste ) {
	cy.topToolbar()
	cy.selectBlock( subject, blockToCopy )
	cy
		.get( 'button[tooltip="Copy & Paste Styles"]' )
		.click( { force: true } )
	cy
		.contains( containsRegExp( 'Copy Styles' ) )
		.click( { force: true } )

	cy.selectBlock( subject, blockToPaste )
	if ( ! cy.contains( containsRegExp( 'Paste Styles' ) ) ) {
		cy
			.get( 'button[tooltip="Copy & Paste Styles"]' )
			.click( { force: true } )
	}
	cy
		.contains( containsRegExp( 'Paste Styles' ) )
		.click( { force: true } )
}
