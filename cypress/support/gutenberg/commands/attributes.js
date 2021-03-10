/**
 * External dependencies
 */
import { dispatchResolver } from '~common/util'

/**
 * Register functions to Cypress Commands.
 */
Cypress.Commands.add( 'setBlockAttribute', setBlockAttribute )

/**
 * Command for setting attributes.
 *
 * @param {Object} attributes
 * @param {string} clientId
 */
export function setBlockAttribute( attributes = {}, clientId = '' ) {
	cy.wp().then( wp => {
		return new Cypress.Promise( ( resolve, reject ) => {
			if ( ! clientId ) {
				clientId = ( wp.data.select( 'core/block-editor' ).getSelectedBlock() || {} ).clientId
			}
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
