/**
 * External dependencies
 */
import { isEmpty, keys } from 'lodash'
import { containsRegExp } from '~common/util'

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
 * @param {string} selector
 * @param {Object} options
 */
export function adjustDynamicContent( blockName, blockSelector, selector, options = {} ) {
	const {
		source = '',
		post = '',
		fieldName = '',
		fieldOptions = {},
	} = options

	cy
		.selectBlock( blockName, blockSelector )
		.find( selector )
		.type( '{selectall}', { force: true } )

	cy.adjustToolbar( 'Dynamic Fields', () => {
		const selectFromSuggestions = option => cy
			.get( '.stackable-dynamic-content__popover-content' )
			.contains( containsRegExp( option ) )
			.parentsUntil( '.components-base-control' )
			.find( '.stackable-dynamic-content__input-container>input' )
			.click( { force: true } )

		const selectOption = option => cy
			.get( '.react-autosuggest__suggestions-container--open' )
			.contains( option )
			.click( { force: true } )

		if ( source.length ) {
			selectFromSuggestions( 'Dynamic Source' )
			selectOption( source )
		}

		if ( Array( 'Other Posts', 'Latest Post' ).includes( source ) && post.length ) {
			// Select a post if source is Other Posts / Latest Post
			selectFromSuggestions( `${ source === 'Other Posts' ? 'Posts/Pages' : 'Nth Latest Post' }` )
			selectOption( post )
		}

		selectFromSuggestions( 'Field' )
		selectOption( fieldName )

		if ( ! isEmpty( fieldOptions ) ) {
			keys( fieldOptions ).forEach( fieldOption => {
				cy.adjust( fieldOption, fieldOptions[ fieldOption ], {
					parentSelector: '.stackable-dynamic-content__popover-content',
					supportedDelimiter: [ ' ' ],
				} )
			} )
		}

		// Apply the changes
		cy
			.get( '.stackable-dynamic-content__popover-content' )
			.find( 'button.apply-changes-button' )
			.click( { force: true } )
	} )
	cy.savePost()

	cy.savePost()
}
