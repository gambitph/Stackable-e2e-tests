/**
 * Internal dependencies
 */
import { containsRegExp } from '~common/util'

/**
 * Register functions to cypress commands.
 */
Cypress.Commands.add( 'selectTopToolbar', selectTopToolbar )
Cypress.Commands.add( 'adjustToolbar', adjustToolbar )

/**
 * Command for setting the toolbar to the top.
 */
export function selectTopToolbar() {
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

/**
 * Helper command for adjusting the settings in the toolbar
 *
 * @param {string} name
 * @param {Function} callback
 * @param {Object} options
 */
export function adjustToolbar( name, callback = () => {}, options = {} ) {
	const {
		parentSelector = '',
	} = options

	cy.selectTopToolbar()
	cy
		.get( `.block-editor-block-toolbar ${ parentSelector ? parentSelector : '' }` )
		.find( `button[aria-label="${ name }"], button[tooltip="${ name }"]` )
		.click( { force: true } )

	callback()
}
