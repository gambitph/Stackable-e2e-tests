/**
 * Register functions to cypress commands.
 */
// Toolbar Controls
Cypress.Commands.add( 'copyStyle', copyStyle )
Cypress.Commands.add( 'pasteStyle', pasteStyle )
Cypress.Commands.add( 'adjustDynamicContent', adjustDynamicContent )

/**
 * Stackable Command for copying the styles of a block.
 *
 * @param {string} subject
 * @param {string | number | Object} blockToCopy
 */
export function copyStyle( subject, blockToCopy ) {
	cy.selectBlock( subject, blockToCopy )
	cy.adjustToolbar( 'Copy & Paste Styles', () => {
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
	cy.selectBlock( subject, blockToPaste )
	cy.adjustToolbar( 'Copy & Paste Styles', () => {
		cy
			.contains( 'Paste Styles' )
			.click( { force: true } )
	} )
}

/**
 * Stackable Command for adjusting the dynamic content options in the toolbar.
 *
 * @param {string} blockName
 * @param {string | number | Object} blockSelector
 * @param {string | Function} selector
 * @param {Object} options
 */
export function adjustDynamicContent( blockName, blockSelector, selector, options = {} ) {
	if ( typeof selector === 'string' ) {
		cy.selectBlock( blockName, blockSelector )
			.find( selector )
			.type( '{selectall}', { force: true } )
	} else if ( typeof selector === 'function' ) {
		selector()
	}

	cy.adjustToolbar( 'Dynamic Fields', () => {
		cy.adjustDynamicContentPopover( options )
	} )
	cy.savePost()
}
