/**
 * External dependencies
 */
import {
	kebabCase, keys, first,
} from 'lodash'
import { containsRegExp } from '~common/util'

/**
 * Internal dependencies
 */
import { changeControlViewport, changeUnit } from '../util'

/**
 * register functions to cypress commands.
 */
// Controls
Cypress.Commands.add( 'changeIcon', changeIcon )
Cypress.Commands.add( 'designControl', designControl )
Cypress.Commands.add( 'columnControl', columnControl )
Cypress.Commands.add( 'fourRangeControl', fourRangeControl )
Cypress.Commands.add( 'iconControl', iconControl )
Cypress.Commands.add( 'popoverControl', popoverControl )
Cypress.Commands.add( 'suggestionControl', suggestionControl )

// Reset
Cypress.Commands.add( 'iconControlReset', iconControlReset )
Cypress.Commands.add( 'fourRangeControlReset', fourRangeControlReset )
Cypress.Commands.add( 'suggestionControlClear', suggestionControlClear )
Cypress.Commands.add( 'popoverControlReset', popoverControlReset )

// Adjust styles
Cypress.Commands.add( 'adjustLayout', adjustLayout )
Cypress.Commands.add( 'adjustDesign', adjustDesign )

/**
 * Overwrite Gutenberg Commands
 */
Cypress.Commands.overwrite( 'adjust', ( originalFn, ...args ) => {
	const optionsToPass = args.length === 3 ? args.pop() : {}
	const label = first( args )

	// Function to call before adjusting options
	optionsToPass.beforeAdjust = ( name, value, options ) => {
		const {
			viewport = 'Desktop',
			isInPopover = false,
			unit = '',
		} = options

		changeControlViewport( viewport, name, isInPopover )
		changeUnit( unit, name, isInPopover )
	}

	// Handle options with no label
	if ( label === 'Color Type' ) {
		args.shift()
		cy.toolbarControl( /^Single|Gradient$/, ...args, optionsToPass )
		return cy.get( '.block-editor-block-list__block.is-selected' )
	}

	const customOptions = {
		// Pass our own adjust controls.
		'.ugb-icon-control__wrapper': 'iconControl',
		'.ugb-four-range-control': 'fourRangeControl',
		'.react-autosuggest__input': 'suggestionControl',
		'.ugb-button-icon-control__wrapper': 'popoverControl',
		'.ugb-columns-width-control': 'columnControl',
		'.ugb-design-control': 'designControl',
		'.ugb-icon-control': 'iconControl',
	}

	if ( optionsToPass.customOptions ) {
		optionsToPass.customOptions = Object.assign(
			optionsToPass.customOptions,
			customOptions
		)
	} else {
		optionsToPass.customOptions = customOptions
	}

	return originalFn( ...[ ...args, optionsToPass ] )
} )

Cypress.Commands.overwrite( 'resetStyle', ( originalFn, ...args ) => {
	const optionsToPass = args.length === 2 ? args.pop() : {}

	// Function to call before adjusting options
	optionsToPass.beforeAdjust = ( name, value, options ) => {
		const {
			viewport = 'Desktop',
			isInPopover = false,
			unit = '',
		} = options

		changeControlViewport( viewport, name, isInPopover )
		changeUnit( unit, name, isInPopover )
	}

	const customOptions = {
		// Pass our own reset controls.
		 'ugb-button-icon-control': 'popoverControlReset',
		 'ugb-advanced-autosuggest-control': 'suggestionControlClear',
		 'ugb-four-range-control': 'fourRangeControlReset',
		 'ugb-icon-control': 'iconControlReset',
	}

	if ( optionsToPass.customOptions ) {
		optionsToPass.customOptions = Object.assign(
			optionsToPass.customOptions,
			customOptions
		)
	} else {
		optionsToPass.customOptions = customOptions
	}

	return originalFn( ...[ ...args, optionsToPass ] )
} )

/**
 * Stackable Command for changing the icon in icon block.
 *
 * @param {number} index
 * @param {string} keyword
 * @param {string} icon
 */
export function changeIcon( index = 1, keyword = '', icon ) {
	cy
		.get( '.block-editor-block-list__block.is-selected' )
		.find( '.ugb-svg-icon-placeholder__button' )
		.eq( index - 1 )
		.click( { force: true } )

	cy
		.get( 'input[placeholder="Type to search icon"]' )
		.click( { force: true } )
		.type( keyword )

	// Wait until the loader disappears.
	cy.waitLoader( '.ugb-icon-popover__iconlist>span.components-spinner', { initialDelay: 500 } )

	cy
		.get( `.ugb-icon-popover__iconlist>button${ icon ? `.${ icon }` : '' }` )
		.first()
		.click( { force: true } )
}

/**
 * Command for adjusting the design control.
 * Mainly used for top and bottom separator modules.
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 */
function designControl( name, value, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
	} = options

	beforeAdjust( name, value, options )
	cy.getBaseControl( typeof value === 'object' ? value.label : name, { isInPopover } )
		.find( `input[value="${ typeof value === 'object' ? value.value : kebabCase( value ) }"]` )
		.click( { force: true } )
}

/**
 * Command for adjusting the popover control.
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 */
function popoverControl( name, value = {}, options = {} ) {
	const {
		isInPopover = false,
	} = options

	const clickPopoverButton = () => {
		cy.getBaseControl( name, { isInPopover } )
			.find( 'button[aria-label="Edit"]' )
			.click( { force: true } )
	}

	if ( typeof value === 'object' ) {
		// Open the popover button.
		clickPopoverButton()

		/**
		 * If the value is an object, open the popover and adjust the settings
		 */
		keys( value ).forEach( key => {
			// If an option entry is an object, get the value, unit, and vieport property to be passed
			// in adjust function.
			if ( typeof value[ key ] === 'object' && ! Array.isArray( value[ key ] ) ) {
				const {
					viewport = 'Desktop',
					unit = '',
					value: childValue = '',
					beforeAdjust = () => {},
				} = value[ key ]

				cy.adjust( key, childValue === '' ? value[ key ] : childValue, {
					viewport, unit, isInPopover: true, beforeAdjust,
				} )
			} else {
				cy.adjust( key, value[ key ], { isInPopover: true } )
			}
		} )

		// Close the popover button.
		clickPopoverButton()
	} else if ( typeof value === 'boolean' ) {
		// In some cases, a popover control has an input checkbox.
		cy.getBaseControl( name, { isInPopover } )
			.find( 'span.components-form-toggle' )
			.invoke( 'attr', 'class' )
			.then( $classNames => {
				const parsedClassNames = $classNames.split( ' ' )

				if ( ( value && ! parsedClassNames.includes( 'is-checked' ) ) || ( ! value === parsedClassNames.includes( 'is-checked' ) ) ) {
					cy
						.get( '.components-panel__body>.components-base-control' )
						.contains( containsRegExp( name ) )
						.closest( '.components-panel__body>.components-base-control' )
						.find( 'input[type="checkbox"]' )
						.click( { force: true } )
				}
			} )
	}
}

/**
 * Command for resetting the popover control.
 *
 * @param {string} name
 */
function popoverControlReset( name ) {
	const selector = () => cy
		.get( '.components-panel__body>.components-base-control' )
		.contains( containsRegExp( name ) )
		.closest( '.components-panel__body>.components-base-control' )

	selector()
		.then( $parent => {
			if ( $parent.find( 'button[aria-label="Reset"]' ).length ) {
				selector()
					.find( 'button[aria-label="Reset"]' )
					.click( { force: true } )
			}
		} )
}

/**
 * Command for adjusting the auto suggestion control.
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 */
function suggestionControl( name, value, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
	} = options

	beforeAdjust( name, value, options )
	cy.getBaseControl( name, { isInPopover } )
		.contains( containsRegExp( name ) )
		.closest( '.components-panel__body>.components-base-control' )
		.find( 'input' )
		.type( `{selectall}${ value }{enter}`, { force: true } )
}

/**
 * Command for resetting the auto suggestion control.
 *
 * @param {string} name
 * @param {Object} options
 */
function suggestionControlClear( name, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
	} = options

	beforeAdjust( name, null, options )
	cy.getBaseControl( name, { isInPopover } )
		.find( 'input' )
		.type( '{selectall}{backspace}{enter}', { force: true } )
}

/**
 * Command for adjusting the four range control.
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 */
function fourRangeControl( name, value, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
	} = options

	const selector = () => cy.getBaseControl( name, { isInPopover } )

	const clickLockButton = () => selector()
		.find( 'button.ugb-four-range-control__lock' )
		.click( { force: true } )

	if ( typeof value === 'number' ) {
		// Adjust the single control field.
		beforeAdjust( name, value, options )
		selector()
			.find( 'input.components-input-control__input' )
			.type( `{selectall}${ value }`, { force: true } )
	} else if ( Array.isArray( value ) ) {
		// Adjust the four control field.
		beforeAdjust( name, value, options )
		selector()
			.find( 'button.ugb-four-range-control__lock' )
			.invoke( 'attr', 'class' )
			.then( className => {
				const parsedClassName = className.split( ' ' )
				if ( parsedClassName.includes( 'ugb--is-locked' ) ) {
					clickLockButton()
				}
			} )

		value.forEach( ( entry, index ) => {
			if ( entry !== undefined ) {
				selector()
					.find( 'input.components-input-control__input' )
					.eq( index )
					.type( `{selectall}${ entry }`, { force: true } )
			}
		} )
	}
}

/**
 * Command for resetting the four range control.
 *
 * @param {string} name
 * @param {Object} options
 */
function fourRangeControlReset( name, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
	} = options

	const selector = isInPopover => cy.getBaseControl( name, { isInPopover } )

	const clickLockButton = () => selector( isInPopover )
		.find( 'button.ugb-four-range-control__lock' )
		.click( { force: true } )

	beforeAdjust( name, null, options )
	selector( isInPopover )
		.find( 'button.ugb-four-range-control__lock' )
		.invoke( 'attr', 'class' )
		.then( className => {
			const parsedClassName = className.split( ' ' )
			if ( ! parsedClassName.includes( 'ugb--is-locked' ) ) {
				clickLockButton()
			}

			selector( isInPopover )
				.find( 'button' )
				.contains( containsRegExp( 'Reset' ) )
				.click( { force: true } )
		} )
}

/**
 * Command for adjusting the column control
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 */
function columnControl( name, value, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
	} = options

	beforeAdjust( name, value, options )
	value.forEach( ( val, index ) => {
		cy.getBaseControl( name, { isInPopover } )
			.find( 'input.components-column-widths-control__number' )
			.eq( index )
			.type( `{selectall}${ val }{enter}`, { force: true } )
	} )
}

/**
 * Command for adjusting the icon control.
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 */
function iconControl( name, value, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
	} = options

	const clickIconButton = () => cy.getBaseControl( name, { isInPopover } )
		.find( '.ugb-icon-control__button-wrapper>.ugb-icon-control__icon-button' )
		.click( { force: true } )

	beforeAdjust( name, value, options )
	clickIconButton()
	if ( typeof value === 'string' ) {
		// Select the first icon based on keyword
		cy
			.get( 'input[placeholder="Type to search icon"]' )
			.click( { force: true } )
			.type( value, { force: true } )

		// Wait until the loader disappears.
		cy.waitLoader( '.ugb-icon-popover__iconlist>span.components-spinner' )

		cy
			.get( '.ugb-icon-popover__iconlist>button' )
			.first()
			.click( { force: true } )
	} else if ( typeof value === 'object' ) {
		const {
			keyword = '',
			icon = '',
		} = value

		cy
			.get( 'input[placeholder="Type to search icon"]' )
			.click( { force: true } )
			.type( keyword, { force: true } )

		// Wait until the loader disappears.
		cy.waitLoader( '.ugb-icon-popover__iconlist>span.components-spinner' )

		if ( icon ) {
			cy
				.get( `.ugb-icon-popover__iconlist>button.${ icon }` )
				.first()
				.click( { force: true } )
		} else {
			cy
				.get( '.ugb-icon-popover__iconlist>button' )
				.first()
				.click( { force: true } )
		}
	}
}

/**
 * Command for resetting the icon control.
 *
 * @param {string} name
 * @param {Object} options
 */
function iconControlReset( name, options = {} ) {
	const {
		isInPopover = false,
		beforeAdjust = () => {},
	} = options

	beforeAdjust( name, null, options )
	cy.getBaseControl( name, { isInPopover } )
		.contains( containsRegExp( name ) )
		.closest( '.components-panel__body>.components-base-control' )
		.find( 'button' )
		.contains( 'Reset' )
		.click( { force: true } )
}

/**
 * Stackable Command for changing the layout of the block.
 *
 * @param {string} value
 */
export function adjustLayout( value = '' ) {
	const _char = ( value || '' ).charAt( 0 )
	// If string value starts with a lowercase character, assign its value. Otherwise, force kebab casing.
	if ( _char ) {
		cy
			.get( '.ugb-design-control-wrapper' )
			.find( `input[value="${ _char === _char.toLowerCase() ? value : kebabCase( value ) }"]` )
			.click( { force: true } )
	}
}

/**
 * Stackable Command for changing the design of the block.
 *
 * @param {string} option
 */
export function adjustDesign( option = '' ) {
	cy
		.get( '.ugb-design-library-items' )
	cy.waitLoader( '.ugb-design-library-search__spinner>span.components-spinner' )

	cy
		.get( '.ugb-design-library-item' )
		.contains( containsRegExp( option ) )
		.closest( '.ugb-design-library-item' )
		.find( 'button' )
		.click( { force: true } )
	cy.waitLoader( '.ugb-design-library-item span.components-spinner' )
}
