/**
 * External dependencies
 */
import {
	keys, first, omit, omitBy,
} from 'lodash'
import { containsRegExp, compareVersions } from '~common/util'

/**
 * register functions to cypress commands.
 */
Cypress.Commands.add( 'colorControlClear', colorControlClear )
Cypress.Commands.add( 'rangeControlReset', rangeControlReset )
Cypress.Commands.add( 'dateTimeControlReset', dateTimeControlReset )
Cypress.Commands.add( 'urlInputControlReset', urlInputControlReset )
Cypress.Commands.add( 'dropdownControlReset', dropdownControlReset )
Cypress.Commands.add( 'textControlReset', textControlReset )
Cypress.Commands.add( 'dropdownControl', dropdownControl )
Cypress.Commands.add( 'colorControl', colorControl )
Cypress.Commands.add( 'rangeControl', rangeControl )
Cypress.Commands.add( 'toolbarControl', toolbarControl )
Cypress.Commands.add( 'toggleControl', toggleControl )
Cypress.Commands.add( 'textControl', textControl )
Cypress.Commands.add( 'textAreaControl', textAreaControl )
Cypress.Commands.add( 'stylesControl', stylesControl )
Cypress.Commands.add( 'fontSizeControl', fontSizeControl )
Cypress.Commands.add( 'urlInputControl', urlInputControl )
Cypress.Commands.add( 'radioControl', radioControl )
Cypress.Commands.add( 'formTokenControl', formTokenControl )
Cypress.Commands.add( 'checkboxControl', checkboxControl )
Cypress.Commands.add( 'dateTimeControl', dateTimeControl )

// Adjust Styles
Cypress.Commands.add( 'adjust', adjust )
Cypress.Commands.add( 'resetStyle', resetStyle )
Cypress.Commands.add( 'adjustBlockStyle', adjustBlockStyle )

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
		parentSelector,
		mainComponentSelector,
		supportedDelimiter = [],
	} = options

	const selector = () => cy.getBaseControl( name, {
		isInPopover,
		parentSelector,
		supportedDelimiter,
		mainComponentSelector,
	} )

	beforeAdjust( name, null, options )
	selector()
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
		parentSelector,
		supportedDelimiter = [],
		mainComponentSelector,
	} = options

	const selector = () => cy.getBaseControl( name, {
		isInPopover,
		parentSelector,
		supportedDelimiter,
		mainComponentSelector,
	} )

	beforeAdjust( name, null, options )
	selector()
		.find( 'button[aria-label="Reset"], button:contains(Reset)' )
		.click( { force: true, multiple: true } )
}

/**
 * Command for resetting the date time control.
 *
 * @param {string} name
 * @param {Object} options
 */
function dateTimeControlReset( name, options = {} ) {
	const {
		beforeAdjust = () => {},
	} = options

	beforeAdjust( name, null, options )
	cy.get( '.components-datetime > .components-datetime__buttons' )
		.find( 'button.components-datetime__date-reset-button' )
		.click( { force: true } )
}

/**
 * Command for resetting the url input control.
 *
 * @param {string} name
 * @param {Object} options
 */
function urlInputControlReset( name, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
		parentSelector,
		supportedDelimiter = [],
		mainComponentSelector,
	} = options

	const selector = () => cy.getBaseControl( name, {
		isInPopover,
		parentSelector,
		supportedDelimiter,
		mainComponentSelector,
	} )

	beforeAdjust( name, null, options )
	selector()
		.find( 'button[aria-label="Reset"], button:contains(Reset)' )
		.click( { force: true, multiple: true } )
}

/**
 * Command for resetting the dropdown control.
 *
 * @param {string} name
 * @param {Object} options
 */
function dropdownControlReset( name, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
		parentSelector,
		supportedDelimiter = [],
		mainComponentSelector,
	} = options

	const selector = () => cy.getBaseControl( name, {
		isInPopover,
		parentSelector,
		supportedDelimiter,
		mainComponentSelector,
	} )

	beforeAdjust( name, null, options )
	selector()
		.find( 'button[aria-label="Reset"], button:contains(Reset)' )
		.click( { force: true, multiple: true } )
}

/**
 * Command for resetting the text control.
 *
 * @param {string} name
 * @param {Object} options
 */
function textControlReset( name, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
		parentSelector,
		supportedDelimiter = [],
		mainComponentSelector,
	} = options

	const selector = () => cy.getBaseControl( name, {
		isInPopover,
		parentSelector,
		supportedDelimiter,
		mainComponentSelector,
	} )

	beforeAdjust( name, null, options )
	selector()
		.find( 'button[aria-label="Reset"], button:contains(Reset)' )
		.click( { force: true, multiple: true } )
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
		parentSelector,
		supportedDelimiter = [],
		mainComponentSelector,
	} = options

	const selector = () => cy.getBaseControl( name, {
		isInPopover,
		parentSelector,
		supportedDelimiter,
		mainComponentSelector,
	} )

	beforeAdjust( name, value, options )
	selector()
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
		parentSelector,
		supportedDelimiter = [],
		mainComponentSelector,
	} = options

	const selector = () => cy.getBaseControl( name, {
		isInPopover,
		parentSelector,
		supportedDelimiter,
		mainComponentSelector,
	} )

	if ( typeof value === 'string' ) {
		beforeAdjust( name, value, options )
		if ( value.match( /^#/ ) ) {
			// Use custom color.

			if ( compareVersions( Cypress.env( 'WORDPRESS_VERSION' ), '5.9.0', '<' ) ) {
				// For versions < 5.9.0
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

				return
			}

			selector()
				.find( 'button[aria-label="Custom color picker"]' )
				.click( { force: true } )

			cy
				.get( '.components-popover__content .components-color-picker' )
				// Expand the custom color field if it's not expanded.
				.then( $el => {
					if ( $el.find( 'button[aria-label="Show detailed inputs"]' ).length > 0 ) {
						cy.get( 'button[aria-label="Show detailed inputs"]' ).click( { force: true } )
					}
					return cy.wrap( $el )
				} )
				.find( 'input.components-input-control__input' )
				.type( `{selectall}${ value.replace( '#', '' ) }{enter}`, { force: true } )

			selector()
				.find( 'button[aria-label="Custom color picker"]' )
				.click( { force: true } )
		} else {
			// Select based on color name.
			selector()
				.find( `button[aria-label="Color: ${ value }"]` )
				.click( { force: true } )
		}
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
		parentSelector,
		supportedDelimiter = [],
		mainComponentSelector,
	} = options

	const selector = () => cy.getBaseControl( name, {
		isInPopover,
		parentSelector,
		supportedDelimiter,
		mainComponentSelector,
	} )

	beforeAdjust( name, value, options )
	selector()
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
		parentSelector,
		supportedDelimiter = [],
		mainComponentSelector,
	} = options

	const selector = () => cy.getBaseControl( name, {
		isInPopover,
		parentSelector,
		supportedDelimiter,
		mainComponentSelector,
	} )

	// Compatibility for default values
	const defaultValues = [
		'single', // Default value for column background type.
	]

	if ( defaultValues.includes( value ) ) {
		value = ''
	}

	beforeAdjust( name, value, options )
	selector()
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
		parentSelector,
		supportedDelimiter = [],
		mainComponentSelector,
	} = options

	const selector = () => cy.getBaseControl( name, {
		isInPopover,
		parentSelector,
		supportedDelimiter,
		mainComponentSelector,
	} )

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
 * Command for adjusting the text control.
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 */
function textControl( name, value, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
		parentSelector,
		supportedDelimiter = [],
		mainComponentSelector,
	} = options

	const selector = () => cy.getBaseControl( name, {
		isInPopover,
		parentSelector,
		supportedDelimiter,
		mainComponentSelector,
	} )

	beforeAdjust( name, value, options )
	selector()
		.find( 'input.components-text-control__input' )
		.type( `{selectall}${ value }`, { force: true } )
}

/**
 * Command for typing into a text area control.
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 */
function textAreaControl( name, value, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
		parentSelector,
		supportedDelimiter = [],
		mainComponentSelector,
	} = options

	const selector = () => cy.getBaseControl( name, {
		isInPopover,
		parentSelector,
		supportedDelimiter,
		mainComponentSelector,
	} )

	beforeAdjust( name, value, options )
	selector()
		.find( 'textarea.components-textarea-control__input' )
		.type( `{selectall}${ value }`, { force: true } )
}

/**
 * Command for changing the block style control in native blocks.
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 */
function stylesControl( name, value, options = {} ) {
	const {
		beforeAdjust = () => {},
	} = options

	beforeAdjust( name, value, options )
	cy.get( '.block-editor-block-styles' )
		.find( `div.block-editor-block-styles__item[aria-label=${ value }]` )
		.click( { force: true } )
}

/**
 * Command for changing the font size in native blocks.
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 */
function fontSizeControl( name, value, options = {} ) {
	const {
		beforeAdjust = () => {},
	} = options

	beforeAdjust( name, value, options )
	if ( typeof value === 'string' ) {
		cy.get( '.components-font-size-picker__select' )
			.find( '.components-custom-select-control__button' )
			.click( { force: true } )

		cy.get( '.components-font-size-picker__select' )
			.find( '.components-custom-select-control__item' )
			.contains( value )
			.click( { force: true } )
	} else if ( typeof value === 'number' ) {
		cy.get( '.components-font-size-picker__number-container' )
			.find( 'input.components-font-size-picker__number' )
			.type( `{selectall}${ value }`, { force: true } )
	}
}

/**
 * Command for adjusting the URL input control.
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 */
function urlInputControl( name, value, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
		parentSelector,
		supportedDelimiter = [],
		mainComponentSelector,
	} = options

	const selector = () => cy.getBaseControl( name, {
		isInPopover,
		parentSelector,
		supportedDelimiter,
		mainComponentSelector,
	} )

	beforeAdjust( name, value, options )
	selector()
		.find( 'input.block-editor-url-input__input' )
		.type( `{selectall}${ value }{enter}`, { force: true } )
}

/**
 * Command for adjusting the radio control.
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 */
function radioControl( name, value, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
		parentSelector,
		supportedDelimiter = [],
		mainComponentSelector,
	} = options

	if ( value ) {
		beforeAdjust( name, value, options )
		cy.getBaseControl( name, {
			isInPopover,
			parentSelector,
			supportedDelimiter,
			mainComponentSelector,
		} )
			.find( `.components-radio-control__option:contains(${ name }) input` )
			.click( { force: true } )
	}
}

/**
 * Command for adjusting the form token input.
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 */
function formTokenControl( name, value, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
		parentSelector,
		supportedDelimiter = [],
		mainComponentSelector,
	} = options

	const selector = () => cy.getBaseControl( name, {
		isInPopover,
		parentSelector,
		supportedDelimiter,
		mainComponentSelector,
	} )

	beforeAdjust( name, value, options )
	value.forEach( val => {
		if ( val.endsWith( ',' ) ) {
			// Just type the string if the last character is a comma
			selector()
				.find( '.components-form-token-field__input' )
				.click( { force: true } )
				.type( val, { force: true } )
			return
		}
		// Type the string and then choose this from the suggestions.
		selector()
			.find( '.components-form-token-field__input' )
			.click( { force: true } )
			.type( val, { force: true } )

		selector()
			.find( `ul.components-form-token-field__suggestions-list li:contains(${ val })` )
			.click( { force: true } )
	} )
}

/**
 * Command for changing the style of the block.
 *
 * @param {string} value
 */
export function adjustBlockStyle( value = '' ) {
	cy.get( '.block-editor-block-styles' )
		.find( `div[aria-label="${ value }"]` )
		.click( { force: true } )
}

/**
 * Command for adjusting the checkbox control
 *
 * @param {string} name
 * @param {boolean} value
 * @param {Object} options
 */
function checkboxControl( name, value = true, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
		parentSelector,
		supportedDelimiter = [],
		mainComponentSelector,
	} = options

	const selector = name => cy
		.getBaseControl( name, {
			isInPopover, parentSelector, supportedDelimiter, mainComponentSelector,
		} )
		.find( `.components-base-control__field:contains(${ name })` )

	beforeAdjust( name, value, options )

	selector( name )
		.then( $selector => {
			if ( ( !! $selector.find( 'svg.components-checkbox-control__checked' ).length ) !== value ) {
				selector( name )
					.find( 'input.components-checkbox-control__input' )
					.click( { force: true } )
			}
		} )
}

/**
 * Command for adjusting the date time control.
 *
 * @param {string} name
 * @param {Object} value
 * @param {Object} options
 */
function dateTimeControl( name, value, options = {} ) {
	const {
		beforeAdjust = () => {},
	} = options

	const {
		day,
		month,
		year,
		hours = '12',
		minutes = '00',
		period = 'AM',
	} = value

	beforeAdjust( name, value, options )
	const selector = () => cy
		.get( '.components-datetime > .components-datetime__time' )

	// Adjust the day
	selector()
		.find( 'input[aria-label="Day"]' )
		.type( `{selectall}${ day }`, { force: true } )

	// Adjust the month
	selector()
		.find( 'select[aria-label="Month"]' )
		.select( month, { force: true } )

	// Adjust the year
	selector()
		.find( 'input[aria-label="Year"]' )
		.type( `{selectall}${ year }`, { force: true } )

	// Adjust the hours
	selector()
		.find( 'input[aria-label="Hours"]' )
		.type( `{selectall}${ hours }`, { force: true } )

	// Adjust the minutes
	selector()
		.find( 'input[aria-label="Minutes"]' )
		.type( `{selectall}${ minutes }`, { force: true } )

	// Adjust the period
	selector()
		.find( '.components-datetime__time-field-am-pm button' )
		.contains( containsRegExp( period ) )
		.click( { force: true } )
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
		parentSelector = '.components-panel__body',
		// overwrite the main component selector of the control we're adjusting
		mainComponentSelector = '.components-base-control',
		// if the option has no label, pass custom regex to find the control
		supportedDelimiter = [],
		afterAdjust = () => {},
	} = options

	// Handle options with no label
	if ( name === 'Block Design' ) {
		cy.stylesControl( name, value, options )
		return cy.get( '.block-editor-block-list__block.is-selected' )
	}

	// Handle deprecated controls.
	if ( name === 'Font size' ) {
		// Handle gutenberg core heading font size.
		if ( Cypress.$( '.components-custom-select-control:contains(Font size)' ) ) {
			cy.fontSizeControl( name, value, options )
			return cy.get( '.block-editor-block-list__block.is-selected' )
		}
	}

	const baseControlSelector = () => cy
		.getBaseControl( name, {
			parentSelector, supportedDelimiter, mainComponentSelector,
		} )

	/**
	 * Specific selector to trigger one
	 * of the control options available.
	 */
	const baseControlHandler = {
		// Populate default selectors.
		'.components-circular-option-picker__dropdown-link-action': 'colorControl',
		'.block-editor-color-gradient-control': 'colorControl',
		'.components-select-control__input': 'dropdownControl',
		'.components-input-control__input': 'rangeControl',
		'.components-button-group': 'toolbarControl',
		'.components-form-toggle__input': 'toggleControl',
		'.components-text-control__input': 'textControl',
		'.components-textarea-control__input': 'textAreaControl',
		'.block-editor-url-input': 'urlInputControl',
		'.components-radio-control__input': 'radioControl',
		'.components-form-token-field__input': 'formTokenControl',
		'.components-checkbox-control__input': 'checkboxControl',
		'.components-datetime': 'dateTimeControl',
	}

	baseControlSelector()
		.then( $baseControl => {
			const combinedControlHandlers = Object.assign( customOptions, baseControlHandler )
			const commandClassKey = first( keys( omitBy(
				combinedControlHandlers,
				( value, key ) => ! ( $baseControl.find( key ).length || Array.from( first( $baseControl ).classList ).includes( key.replace( '.', '' ) ) )
			) ) )

			if ( ! commandClassKey ) {
				throw new Error(
					'The `cy.adjust` function could not handle this option or the label provided is not found inside `.components-base-control element`. You may overwrite `cy.adjust` by passing customOptions, parentSelector, and mainComponentSelector to find the right control.'
				)
			}

			cy[ combinedControlHandlers[ commandClassKey ] ]( name, value, omit( options, 'customOptions' ) )
		} )

	afterAdjust( name, value, options )

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
		parentSelector = '.components-panel__body',
		// overwrite the main component selector of the control we're adjusting
		mainComponentSelector = '.components-base-control',
		// if the option has no label, pass custom regex to find the control
		supportedDelimiter = [],
	} = options

	const baseControlSelector = () => cy
		.getBaseControl( name, {
			parentSelector, supportedDelimiter, mainComponentSelector,
		} )

	/**
	 * Specific selector to trigger one
	 * of the control options available.
	 */
	const baseControlHandler = {
		// Populate default selectors.
		'.components-input-control__input': 'rangeControlReset',
		'.components-circular-option-picker__dropdown-link-action': 'colorControlClear',
		'.block-editor-color-gradient-control': 'colorControlClear',
		'.components-datetime': 'dateTimeControlReset',
		'.block-editor-link-control': 'urlInputControlReset',
		'.components-select-control__input': 'dropdownControlReset',
		'.components-text-control__input': 'textControlReset',
	}

	baseControlSelector()
		.then( $baseControl => {
			const combinedControlHandlers = Object.assign( customOptions, baseControlHandler )
			const commandClassKey = first( keys( omitBy(
				combinedControlHandlers,
				( value, key ) => ! ( $baseControl.find( key ).length || Array.from( first( $baseControl ).classList ).includes( key.replace( '.', '' ) ) )
			) ) )

			if ( ! commandClassKey ) {
				throw new Error(
					'The `cy.reset` function could not handle this option or the label provided is not found inside `.components-base-control element`. You may overwrite `cy.reset` by passing customOptions and parentSelector to find the right control.'
				)
			}

			cy[ combinedControlHandlers[ commandClassKey ] ]( name, omit( options, 'customOptions' ) )
		} )

	// Always return the selected block which will be used in functions that require chained wp-block elements.
	return cy.get( '.block-editor-block-list__block.is-selected' )
}
