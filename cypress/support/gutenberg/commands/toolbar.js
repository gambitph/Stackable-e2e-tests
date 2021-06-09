/**
 * Internal dependencies
 */
import { containsRegExp } from '~common/util'

/**
 * Register functions to cypress commands.
 */
Cypress.Commands.add( 'topToolbar', topToolbar )

/**
 * Command for setting the toolbar to the top.
 */
export function topToolbar() {
	const options = () => cy
		.get( '.edit-post-more-menu' )
		.find( 'button[aria-label="Options"]' )
		.click( { force: true } )

	const toolbar = () => cy
		.contains( containsRegExp( 'Top toolbar' ) )
		.closest( 'button.components-menu-item__button' )

	options()
	toolbar()
		.invoke( 'attr', 'aria-checked' )
		.then( val => {
			if ( val === 'false' ) {
				toolbar()
					.click( { force: true } )
			}
		} )
	options()
}
