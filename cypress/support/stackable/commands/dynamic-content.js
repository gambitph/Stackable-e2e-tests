/**
 * External dependencies
 */
import {
	keys, isEmpty,
} from 'lodash'
import { containsRegExp } from '~common/util'

/**
 * Register functions to Cypress commands
 */
Cypress.Commands.add( 'adjustDynamicContentPopover', adjustDynamicContentPopover )

/**
 * Function that adjusts the dynamic content popover.
 *
 * @param {Object} options
 */
export function adjustDynamicContentPopover( options = {} ) {
	const {
		source = '',
		post = '',
		fieldName = '',
		fieldOptions = {},
	} = options

	// Wait for resolvers to finish.
	cy.waitLoader( '.components-spinner' )

	const selectFromSuggestions = ( option, value = '' ) => {
		cy
			.get( '.stackable-dynamic-content__popover-content' )
			.contains( containsRegExp( option ) )
			.parentsUntil( '.components-base-control' )
			.find( '.stackable-dynamic-content__input-container>input' )
			.click( { force: true } )
			.type( `{selectall}${ value }` )

		cy.waitLoader( '.components-spinner' )
	}

	const selectOption = option => cy
		.get( '.react-autosuggest__suggestions-container--open' )
		.contains( containsRegExp( option ) )
		.click( { force: true } )

	if ( source.length ) {
		selectFromSuggestions( 'Dynamic Source', source )
		selectOption( source )
	}

	if ( Array( 'Other Posts', 'Latest Post' ).includes( source ) && post.length ) {
		// Select a post if source is Other Posts / Latest Post
		selectFromSuggestions( `${ source === 'Other Posts' ? 'Posts/Pages' : 'Nth Latest Post' }`, post )
		cy
			.get( '.react-autosuggest__suggestions-container--open' )
			.contains( post )
			.click( { force: true } )
	}

	selectFromSuggestions( 'Field', fieldName )
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

	cy.waitLoader( '.components-spinner' )
}
