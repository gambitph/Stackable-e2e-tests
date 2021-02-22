/**
 * Internal dependencies
 */
import { dispatchResolver } from '../util'

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
	cy.wp().then( wp => {
		return new Cypress.Promise( ( resolve, reject ) => {
			const { clientId = '' } = wp.data.select( 'core/block-editor' ).getSelectedBlock() || {}
			if ( clientId ) {
				wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, attributes )
					.then( dispatchResolver( resolve ) )
					.catch( reject )
			} else {
				reject( null )
			}
		} )
	} )
}
