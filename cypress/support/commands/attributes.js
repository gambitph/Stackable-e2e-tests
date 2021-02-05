/**
 * Register functions to Cypress Commands.
 */
Cypress.Commands.add( 'setBlockAttribute', setBlockAttribute )

/**
 * Command for setting attributes.
 *
 * @param {Object} attributes
 */
export function setBlockAttribute( attributes = {} ) {
	cy.window().then( win => {
		const { clientId = '' } = win.wp.data.select( 'core/block-editor' ).getSelectedBlock() || {}
		if ( clientId ) {
			win.wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, attributes )
		}
	} )
}
