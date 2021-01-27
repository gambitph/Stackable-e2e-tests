/**
 * Register functions to Cypress Commands.
 */
Cypress.Commands.add( 'setBlockAttribute', setBlockAttributes )

/**
 * Command for setting attributes.
 *
 * @param {Object} attributes
 */
export function setBlockAttributes( attributes = {} ) {
	cy.window().then( win => {
		const { clientId = '' } = win.wp.data.select( 'core/block-editor' ).getSelectedBlock() || {}
		if ( clientId ) {
			win.wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, attributes )
		}
	} )
}
