/*
* Interal dependencies
*/
import { select, dispatch } from '../util'

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
	select( _select => {
		dispatch( _dispatch => {
			const { clientId = '' } = _select( 'core/block-editor' ).getSelectedBlock() || {}
			if ( clientId ) {
				_dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, attributes )
			}
		} )
	} )
}
