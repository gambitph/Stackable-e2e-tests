/**
 * External dependencies
 */
import {
	keys, first, omit,
} from 'lodash'
import { containsRegExp } from '~common/util'

/**
 * register functions to cypress commands.
 */
Cypress.Commands.add( 'colorControlClear', colorControlClear )
Cypress.Commands.add( 'rangeControlReset', rangeControlReset )
Cypress.Commands.add( 'dropdownControl', dropdownControl )
Cypress.Commands.add( 'colorControl', colorControl )
Cypress.Commands.add( 'rangeControl', rangeControl )
Cypress.Commands.add( 'toolbarControl', toolbarControl )
Cypress.Commands.add( 'toggleControl', toggleControl )

// Adjust Styles
Cypress.Commands.add( 'adjust', adjust )
Cypress.Commands.add( 'resetStyle', resetStyle )

/**
 * Command for resetting the color picker.
 *
 * @param {string} name
 * @param {Object} options
 */
function colorControlClear( name, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
	} = options

	beforeAdjust( name, null, options )
	cy.getBaseControl( name, { isInPopover } )
		.find( 'button' )
		.contains( containsRegExp( 'Clear' ) )
		.click( { force: true } )
	// We are adding an additional click as sometimes click does not register.
		.click( { force: true, log: false } )
}

/**
 * Command for resetting the advanced range control.
 *
 * @param {string} name
 * @param {Object} options
 */
function rangeControlReset( name, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
	} = options

	beforeAdjust( name, null, options )
	cy.getBaseControl( name, { isInPopover } )
		.find( 'button' )
		.contains( containsRegExp( 'Reset' ) )
		.click( { force: true } )
}

/**
 * Command for adjusting the dropdown control.
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 */
function dropdownControl( name, value, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
	} = options

	beforeAdjust( name, value, options )
	cy.getBaseControl( name, { isInPopover } )
		.find( 'select' )
		.select( value, { force: true } )
}

/**
 * Command for adjusting the color picker
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 */
function colorControl( name, value, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
	} = options

	const selector = () => cy.getBaseControl( name, { isInPopover } )

	if ( typeof value === 'string' && value.match( /^#/ ) ) {
		// Use custom color.
		beforeAdjust( name, value, options )
		selector()
			.find( 'button' )
			.contains( 'Custom color' )
			.click( { force: true } )

		cy
			.get( '.components-popover__content .components-color-picker' )
			.find( 'input[type="text"]' )
			.type( `{selectall}${ value }{enter}`, { force: true } )

		// Declare the variable again
		selector()
			.find( 'button' )
			.contains( containsRegExp( 'Custom color' ) )
			.click( { force: true } )
	} else if ( typeof value === 'number' ) {
		// Get the nth color in the color picker.
		beforeAdjust( name, value, options )
		selector()
			.find( 'button.components-circular-option-picker__option' )
			.eq( value - 1 )
			.click( { force: true } )
	}
}

/**
 * Command for adjusting the advanced range control.
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 */
function rangeControl( name, value, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
	} = options

	beforeAdjust( name, value, options )
	cy.getBaseControl( name, { isInPopover } )
		.find( 'input.components-input-control__input' )
		.type( `{selectall}${ value }`, { force: true } )
}

/**
 * Command for adjusting the toolbar control
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 */
function toolbarControl( name, value, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
	} = options

	// Compatibility for default values
	const defaultValues = [
		'single', // Default value for column background type.
	]

	if ( defaultValues.includes( value ) ) {
		value = ''
	}

	beforeAdjust( name, value, options )
	cy.getBaseControl( name, { isInPopover } )
		.find( `button[value="${ value }"]` )
		.click( { force: true } )
}

/**
 * Command for enabling/disabling a toggle control.
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 */
function toggleControl( name, value, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
	} = options

	const selector = () => cy.getBaseControl( name, { isInPopover } )

	selector()
		.find( 'span.components-form-toggle' )
		.invoke( 'attr', 'class' )
		.then( classNames => {
			const parsedClassNames = classNames.split( ' ' )
			if ( ( value && ! parsedClassNames.includes( 'is-checked' ) ) || ( ! value && parsedClassNames.includes( 'is-checked' ) ) ) {
				beforeAdjust( name, value, options )
				selector()
					.find( 'input' )
					.click( { force: true } )
			}
		} )
}

/**
 * Command for adjusting settings.
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 */
export function adjust( name, value, options ) {
	const {
		// overwrite selector options.
		customOptions = {},
		// overwrite parent element selector used to locate option labels.
		parentElement = '.components-base-control',
		// if the option has no label, pass custom regex to find the control
	} = options
	const baseControlSelector = () => cy
		.get( parentElement )
		.contains( containsRegExp( name ) )
		.closest( parentElement )

	/**
	 * Specific selector to trigger one
	 * of the control options available.
	 */
	const baseControlHandler = {
		// Populate default selectors.
		'.components-circular-option-picker__dropdown-link-action': 'colorControl',
		'.components-select-control__input': 'dropdownControl',
		'.components-input-control__input': 'rangeControl',
		'.components-button-group': 'toolbarControl',
		'.components-form-toggle__input': 'toggleControl',

		/**
		 * TODO: Support native blocks.
		 * .block-editor-block-styles -> stylesConrol
		 * .components-text-control__input[type=number] -> rangeControl
		 * .components-text-control__input[type=text] -> rangeControl
		 * .components-font-size-picker__number
		 */
	}

	baseControlSelector()
		.then( $baseControl => {
			const combinedControlHandlers = Object.assign( baseControlHandler, customOptions )
			const executeCommand = key => {
				if ( $baseControl.find( key ).length || Array.from( first( $baseControl ).classList ).includes( key.replace( '.', '' ) ) ) {
					cy[ combinedControlHandlers[ key ] ]( name, value, omit( options, 'customOptions' ) )
					return true
				}
				return false
			}

			if (
				! keys( customOptions ).map( executeCommand ).some( value => value ) &&
				! keys( baseControlHandler ).map( executeCommand ).some( value => value )
			) {
				// Selector not found.
				throw new Error(
					'The `cy.adjust` function could not handle this option or the label provided is not found inside `.components-base-control element`. You may overwrite `cy.adjust` by passing customOptions and parentElement to find the right control.'
				)
			}
		} )

	// Always return the selected block which will be used in functions that require chained wp-block elements.
	return cy.get( '.block-editor-block-list__block.is-selected' )
}

/**
 * Command for resetting the style.
 *
 * @param {string} name
 * @param {Object} options
 */
export function resetStyle( name, options = {} ) {
	const {
		// overwrite selector options.
		customOptions = {},
		// overwrite parent element selector used to locate option labels.
		parentElement = '.components-base-control',
		// if the option has no label, pass custom regex to find the control
	} = options
	const baseControlSelector = () => cy
		.get( parentElement )
		.contains( containsRegExp( name ) )
		.closest( parentElement )

	/**
	 * Specific selector to trigger one
	 * of the control options available.
	 */
	const baseControlHandler = {
		// Populate default selectors.
		'.components-input-control__input': 'rangeControlReset',
		'.components-circular-option-picker__dropdown-link-action': 'colorControlClear',
	}

	baseControlSelector()
		.then( $baseControl => {
			const combinedControlHandlers = Object.assign( baseControlHandler, customOptions )
			const executeCommand = key => {
				if ( $baseControl.find( key ).length || Array.from( first( $baseControl ).classList ).includes( key.replace( '.', '' ) ) ) {
					cy[ combinedControlHandlers[ key ] ]( name, options )
					return true
				}
				return false
			}

			if (
				! keys( customOptions ).map( executeCommand ).some( value => value ) &&
				! keys( baseControlHandler ).map( executeCommand ).some( value => value )
			) {
				// Selector not found.
				throw new Error(
					'The `cy.reset` function could not handle this option or the label provided is not found inside `.components-base-control element`. You may overwrite `cy.reset` by passing customOptions and parentElement to find the right control.'
				)
			}
		} )

	// Always return the selected block which will be used in functions that require chained wp-block elements.
	return cy.get( '.block-editor-block-list__block.is-selected' )
}
