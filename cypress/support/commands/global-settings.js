
/**
 * External dependencies
 */
import {
	keys, findIndex,
} from 'lodash'

/**
 * Internal dependencies
 */
import {
	containsRegExp,
} from '../util'

/**
 * Register functions to Cypress Commands.
 */
Cypress.Commands.add( 'addGlobalColor', addGlobalColor )
Cypress.Commands.add( 'resetGlobalColor', resetGlobalColor )
Cypress.Commands.add( 'deleteGlobalColor', deleteGlobalColor )
Cypress.Commands.add( 'adjustGlobalTypography', adjustGlobalTypography )
Cypress.Commands.add( 'resetGlobalTypography', resetGlobalTypography )

/**
 * Command for adding a global color in Stackable Settings.
 *
 * @param {Object} options
 */
function addGlobalColor( options = {} ) {
	const {
		name = '',
		color = '',
	} = options

	cy.openSidebar( 'Stackable Settings' )
	cy.collapse( 'Global Color Palette' )

	cy
		.get( '.components-panel__body-toggle' )
		.contains( containsRegExp( 'Global Color Palette' ) )
		.invoke( 'attr', 'aria-expanded' )
		.then( ariaExpanded => {
			if ( ariaExpanded === 'false' ) {
				cy
					.get( 'button' )
					.contains( containsRegExp( 'Global Color Palette' ) )
					.click( { force: true } )
			}

			cy
				.get( 'button[aria-label="Add New Color"]' )
				.click( { force: true } )
				.then( () => {
					// Type the color if defined.
					if ( color ) {
						cy
							.get( '.components-color-picker__inputs-field' )
							.contains( containsRegExp( 'Color value in hexadecimal' ) )
							.parentsUntil( '.components-color-picker__inputs-field' )
							.find( 'input' )
							.click( { force: true } )
							.type( `{selectall}${ color }{enter}` )
					}

					// Type the name if defined.
					if ( name ) {
						cy
							.get( '.components-color-picker__input-field' )
							.contains( containsRegExp( 'Style name' ) )
							.parentsUntil( '.components-color-picker__input-field' )
							.find( 'input' )
							.click( { force: true } )
							.type( `{selectall}${ name }{enter}` )
					}

					// Click outside the popover to close it.
					cy
						.get( '.ugb-global-settings-color-picker' )
						.click( { force: true } )
				} )
		} )
}

/**
 * Command for resetting the global color palette.
 */
function resetGlobalColor() {
	cy.openSidebar( 'Stackable Settings' )
	cy.collapse( 'Global Color Palette' )

	const selector = () => cy
		.get( '.ugb-global-settings-color-picker__reset-button' )
		.find( 'button' )

	selector()
		.invoke( 'attr', 'disabled' )
		.then( $disabled => {
			if ( typeof $disabled === 'undefined' ) {
				selector()
					.click( { force: true } )

				/**
				 * Click the cconfirmation reset button.
				 */
				cy
					.get( '.components-button-group' )
					.find( 'button' )
					.contains( 'Reset' )
					.click( { force: true } )
			}
		} )
}

/**
 * Command for deleting a global color in Stackable Settings.
 *
 * @param {number} selector
 */
function deleteGlobalColor( selector = 0 ) {
	cy.openSidebar( 'Stackable Settings' )
	cy.collapse( 'Global Color Palette' )

	if ( typeof selector === 'number' ) {
		// Delete a global color by index number.
		cy
			.get( '.components-circular-option-picker__option-wrapper' )
			.eq( selector )
			.find( 'button' )
			.click( { force: true } )
	} else if ( typeof selector === 'string' ) {
		// Delete a global color by name.
		cy
			.get( '.components-circular-option-picker__option-wrapper' )
			.find( `button[aria-label="${ selector }"]` )
			.click( { force: true } )
	}

	cy
		.get( 'button' )
		.contains( containsRegExp( 'Delete color' ) )
		.click( { force: true } )

	// Delete the confirm Delete button.
	cy
		.get( 'button' )
		.contains( containsRegExp( 'Delete' ) )
		.click( { force: true } )
}

/**
 * Command for adjusting the global typography in Stackable Settings.
 *
 * @param {string} selector
 * @param {Object} options
 */
function adjustGlobalTypography( selector = 'h1', options = {} ) {
	const globalTypographyOptions = [
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'p',
	]

	cy.openSidebar( 'Stackable Settings' )
	cy.collapse( 'Global Typography' )

	const clickEditButton = () => cy
		.get( '.ugb-global-settings-typography-control' )
		.eq( findIndex( globalTypographyOptions, value => value === selector ) )
		.find( 'button[aria-label="Edit"]' )
		.click( { force: true } )

	cy
		.get( '.components-panel__body-toggle' )
		.contains( containsRegExp( 'Global Typography' ) )
		.invoke( 'attr', 'aria-expanded' )
		.then( ariaExpanded => {
			if ( ariaExpanded === 'false' ) {
				cy
					.get( '.components-panel__body-toggle' )
					.contains( containsRegExp( 'Global Typography' ) )
					.click( { force: true } )
			}

			clickEditButton()

			keys( options ).forEach( key => {
				// If the an option entry is an object, get the value, viewport, and unit property to be passed
				// in adjust function.
				if ( typeof options[ key ] === 'object' && ! Array.isArray( options[ key ] ) ) {
					const {
						viewport = 'Desktop',
						unit = '',
						value = '',
					} = options[ key ]

					cy.adjust( key, value, {
						viewport, unit, isInPopover: true,
					} )
				} else {
					cy.adjust( key, options[ key ], { isInPopover: true } )
				}
			} )

			clickEditButton()
		} )
}

/**
 * Command for resetting the global typogragpy style.
 *
 * @param {string} selector
 */
function resetGlobalTypography( selector = 'h1' ) {
	const globalTypographyOptions = [
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'p',
	]

	cy.openSidebar( 'Stackable Settings' )
	cy.collapse( 'Global Typography' )

	// Click the reset button.
	cy
		.get( '.ugb-global-settings-typography-control' )
		.eq( findIndex( globalTypographyOptions, value => value === selector ) )
		.find( 'button[aria-label="Reset"]' )
		.click( { force: true } )

	// Click the confirmation reset button.
	cy
		.get( '.components-button-group' )
		.find( 'button' )
		.contains( 'Reset' )
		.click( { force: true } )
}
