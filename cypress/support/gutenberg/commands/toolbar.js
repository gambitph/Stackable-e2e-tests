/**
 * Register functions to cypress commands.
 */
// Toolbar Controls
Cypress.Commands.add( 'topToolbar', topToolbar )

/**
 * Command for setting the toolbar to the top.
 */
export function topToolbar() {
	const toolbar = () => cy
		.contains( 'Top toolbar' )
		.closest( 'button.components-menu-item__button' )

	cy
		.get( '.edit-post-more-menu' )
		.find( 'button[aria-label="Options"]' )
		.click( { force: true } )
	toolbar()
		.invoke( 'attr', 'aria-checked' )
		.then( val => {
			if ( val === 'false' ) {
				toolbar()
					.click( { force: true } )
			}
		} )
}
