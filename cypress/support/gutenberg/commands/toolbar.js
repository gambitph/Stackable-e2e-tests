/**
 * Internal dependencies
 */
import { containsRegExp, compareVersions } from '~common/util'

/**
 * Register functions to cypress commands.
 */
Cypress.Commands.add( 'selectTopToolbar', selectTopToolbar )
Cypress.Commands.add( 'adjustToolbar', adjustToolbar )
Cypress.Commands.add( 'changeHeadingLevel', changeHeadingLevel )
Cypress.Commands.add( 'changeAlignment', changeAlignment )
Cypress.Commands.add( 'changeTextAlignment', changeTextAlignment )
Cypress.Commands.add( 'addToReusableBlocks', addToReusableBlocks )

/**
 * Command for setting the toolbar to the top.
 */
export function selectTopToolbar() {
	const options = () => cy
		.get( '.edit-post-more-menu' )
		.find( 'button[aria-label="Options"]' )
		.click( { force: true } )

	const toolbar = () => cy
		.contains( 'Top toolbar' )
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
	cy.savePost()
}

/**
 * Command for changing the heading level of core/heading
 *
 * @param {string} blockName
 * @param {string | number | Object} blockSelector
 * @param {string} level
 */
export function changeHeadingLevel( blockName, blockSelector, level ) {
	cy.selectBlock( blockName, blockSelector )
	cy.adjustToolbar( 'Change heading level', () => {
		cy
			.get( '.components-toolbar-group' )
			.find( `button[aria-label="${ level }"]` )
			.click( { force: true } )
	} )
}

/* *
 * Command for changing the block alignment in the toolbar
 *
 * @param {string} blockName
 * @param {string | number | Object} blockSelector
 * @param {string} alignment
 */
export function changeAlignment( blockName, blockSelector, alignment ) {
	cy.selectBlock( blockName, blockSelector )
	// For versions > 5.7.0
	if ( compareVersions( Cypress.env( 'WORDPRESS_VERSION' ), '5.7.0', '>' ) ) {
		cy.adjustToolbar( 'Align', () => {
			cy
				.get( '.components-popover__content' )
				.contains( containsRegExp( alignment ) )
				.click( { force: true } )
		}, {
			parentSelector: '.components-dropdown-menu:contains(Change alignment)',
		} )
	} else {
		// For WP version 5.6 backwards compatibility
		cy.selectTopToolbar()
		cy
			.get( '.block-editor-block-toolbar button[aria-label="Change alignment"]' )
			.click( { force: true } )
	}
}

/**
 * Command for changing the text alignment in the toolbar
 *
 * @param {string} blockName
 * @param {string | number | Object} blockSelector
 * @param {string} alignment
 */
export function changeTextAlignment( blockName, blockSelector, alignment ) {
	cy.selectBlock( blockName, blockSelector )
	// For versions > 5.7.0
	if ( compareVersions( Cypress.env( 'WORDPRESS_VERSION' ), '5.7.0', '>' ) ) {
		cy.adjustToolbar( 'Align', () => {
			cy
				.get( '.components-popover__content' )
				.contains( containsRegExp( alignment ) )
				.click( { force: true } )
		}, {
			parentSelector: '.components-dropdown-menu:contains(Change text alignment)',
		} )
	} else {
		// For WP version 5.6 backwards compatibility
		cy.selectTopToolbar()
		cy
			.get( '.block-editor-block-toolbar button[aria-label="Change text alignment"]' )
			.click( { force: true } )
	}
}

/**
 * Command for adding a block as a reusable block
 *
 * @param {string} blockName
 * @param {string | number | Object} blockSelector
 */
export function addToReusableBlocks( blockName, blockSelector ) {
	cy.selectBlock( blockName, blockSelector )

	cy.selectTopToolbar()
	cy.get( '.block-editor-block-toolbar' )
		.find( 'button[aria-label="Options"], button[aria-label="More options"]' ) // For backwards compatibility: WP 5.6
		.click( { force: true } )

	cy.get( '.components-dropdown-menu__menu' )
		.find( 'button.components-menu-item__button:contains(Add to Reusable blocks)' )
		.click( { force: true } )

	cy.wait( 1000 )
}
