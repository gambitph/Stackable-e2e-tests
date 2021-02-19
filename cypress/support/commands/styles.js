/**
 * External dependencies
 */
import {
	kebabCase, keys, camelCase, isEmpty, first, pick, toUpper, last, startCase, get,
} from 'lodash'

/**
 * Internal dependencies
 */
import {
	getBaseControl,
	containsRegExp,
	changeUnit,
	createElementFromHTMLString,
	getActiveTab,
	getBlockStringPath,
} from '../util'

/**
 * Register functions to Cypress Commands.
 */
// Controls
Cypress.Commands.add( 'iconControlReset', iconControlReset )
Cypress.Commands.add( 'fourRangeControlReset', fourRangeControlReset )
Cypress.Commands.add( 'suggestionControlClear', suggestionControlClear )
Cypress.Commands.add( 'popoverControlReset', popoverControlReset )
Cypress.Commands.add( 'colorControlClear', colorControlClear )
Cypress.Commands.add( 'rangeControlReset', rangeControlReset )
Cypress.Commands.add( 'columnControl', columnControl )
Cypress.Commands.add( 'iconControl', iconControl )
Cypress.Commands.add( 'fourRangeControl', fourRangeControl )
Cypress.Commands.add( 'suggestionControl', suggestionControl )
Cypress.Commands.add( 'dropdownControl', dropdownControl )
Cypress.Commands.add( 'popoverControl', popoverControl )
Cypress.Commands.add( 'colorControl', colorControl )
Cypress.Commands.add( 'designControl', designControl )
Cypress.Commands.add( 'rangeControl', rangeControl )
Cypress.Commands.add( 'toolbarControl', toolbarControl )
Cypress.Commands.add( 'toggleControl', toggleControl )

// Adjust Styles
Cypress.Commands.add( 'adjust', adjust )
Cypress.Commands.add( 'resetStyle', resetStyle )
Cypress.Commands.add( 'adjustLayout', adjustLayout )
Cypress.Commands.add( 'adjustDesign', adjustDesign )

// Assertions
Cypress.Commands.add( 'assertComputedStyle', { prevSubject: 'element' }, assertComputedStyle )
Cypress.Commands.add( 'assertClassName', { prevSubject: 'element' }, assertClassName )
Cypress.Commands.add( 'assertHtmlTag', { prevSubject: 'element' }, assertHtmlTag )
Cypress.Commands.add( 'assertHtmlAttribute', { prevSubject: 'element' }, assertHtmlAttribute )

/**
 * Overwrite Cypress Commands
 */
Cypress.Commands.overwrite( 'adjust', ( originalFn, ...args ) => {
	const optionsToPass = args.length === 3 ? args.pop() : {}
	optionsToPass.beforeAdjust = ( name, value, options ) => {
		const {
			isInPopover = false,
			viewport = 'Desktop',
			unit = '',
		} = options
		cy.changePreviewMode( viewport )
		changeUnit( unit, name, isInPopover )
	}

	return originalFn( ...[ ...args, optionsToPass ] )
} )

Cypress.Commands.overwrite( 'resetStyle', ( originalFn, ...args ) => {
	const optionsToPass = args.length === 2 ? args.pop() : {}
	optionsToPass.beforeAdjust = ( name, value, options ) => {
		const {
			isInPopover = false,
			viewport = 'Desktop',
			unit = '',
		} = options
		cy.changePreviewMode( viewport )
		changeUnit( unit, name, isInPopover )
	}

	return originalFn( ...[ ...args, optionsToPass ] )
} )

Cypress.Commands.overwrite( 'assertComputedStyle', ( originalFn, ...args ) => {
	getActiveTab( tab => {
		originalFn( ...args )

		// This is for Stackable only.
		// After asserting the frontend, go back to the previous editor state.
		if ( ( args.length === 3 &&
				( last( args ).assertFrontend === undefined ||
				last( args ).assertFrontend ) ) ||
			args.length === 2 ) {
			cy.openSidebar( 'Settings' )
			cy.get( `button[aria-label="${ startCase( tab ) } Tab"]` ).click( { force: true } )
		}
	} )
} )

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

	const selector = () => getBaseControl( isInPopover )
		.contains( containsRegExp( name ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()

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
	getBaseControl( isInPopover )
		.contains( containsRegExp( name ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()
		.find( 'input.components-input-control__input' )
		.type( `{selectall}${ value }`, { force: true } )
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
	getBaseControl( isInPopover )
		.contains( containsRegExp( name ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()
		.find( 'button' )
		.contains( containsRegExp( 'Reset' ) )
		.click( { force: true } )
}

/**
 * Command for adjusting the toolbar control
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 * @param {string} customRegExp
 */
function toolbarControl( name, value, options = {}, customRegExp = '' ) {
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
	getBaseControl( isInPopover )
		.contains( customRegExp ? new RegExp( customRegExp ) : containsRegExp( name ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()
		.find( `button[value="${ value }"]` )
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
	getBaseControl( isInPopover )
		.contains( containsRegExp( name ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()
		.find( `input[value="${ typeof value === 'object' ? value.value : kebabCase( value ) }"]` )
		.click( { force: true } )
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

	const selector = () => getBaseControl( isInPopover )
		.contains( containsRegExp( name ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()

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
	getBaseControl( isInPopover )
		.contains( containsRegExp( name ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()
		.find( 'button' )
		.contains( containsRegExp( 'Clear' ) )
		.click( { force: true } )
	// We are adding an additional click as sometimes click does not register.
		.click( { force: true, log: false } )
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
		getBaseControl( isInPopover )
			.contains( containsRegExp( name ) )
			.parentsUntil( '.components-panel__body>.components-base-control' )
			.parent()
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
		getBaseControl( isInPopover )
			.contains( containsRegExp( name ) )
			.parentsUntil( '.components-panel__body>.components-base-control' )
			.parent()
			.find( 'span.components-form-toggle' )
			.invoke( 'attr', 'class' )
			.then( $classNames => {
				const parsedClassNames = $classNames.split( ' ' )

				if ( ( value && ! parsedClassNames.includes( 'is-checked' ) ) || ( ! value === parsedClassNames.includes( 'is-checked' ) ) ) {
					cy
						.get( '.components-panel__body>.components-base-control' )
						.contains( containsRegExp( name ) )
						.parentsUntil( '.components-panel__body>.components-base-control' )
						.parent()
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
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()

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

	// Compatibility for default values
	const defaultValues = [
		'none',
	]

	if ( defaultValues.includes( value ) ) {
		value = ''
	}

	beforeAdjust( name, value, options )
	getBaseControl( isInPopover )
		.contains( containsRegExp( name ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()
		.find( 'select' )
		.select( value, { force: true } )
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
	getBaseControl( isInPopover )
		.contains( containsRegExp( name ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()
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
	getBaseControl( isInPopover )
		.contains( containsRegExp( name ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()
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

	const selector = () => getBaseControl( isInPopover )
		.contains( containsRegExp( name ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()

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

	const selector = isInPopover => getBaseControl( isInPopover )
		.contains( containsRegExp( name ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()

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
		getBaseControl( isInPopover )
			.contains( containsRegExp( name ) )
			.parentsUntil( '.components-panel__body>.components-base-control' )
			.parent()
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

	const clickIconButton = () => getBaseControl( isInPopover )
		.contains( containsRegExp( name ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()
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
	getBaseControl( isInPopover )
		.contains( containsRegExp( name ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()
		.find( 'button' )
		.contains( 'Reset' )
		.click( { force: true } )
}

/**
 * Command for adjusting settings.
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 */
export function adjust( name, value, options = {} ) {
	// Handle custom style options without label
	const customLabels = {
		'Color Type': 'Single|Gradient',
		'Icon Color Type': 'Single|Gradient|Multicolor',
		'Button Color Type': 'Single|Gradient',
		'Shape': typeof value === 'object' ? value.label : value,
		'Button Design': typeof value === 'object' ? value.label : value,
	}

	const _adjust = classNames => {
		const parsedClassNames = classNames.split( ' ' )

		/**
		 * These are the list of selectors
		 * and their corresponding commands.
		 */
		const commandsBasedOnClassName = {
			'components-toggle-control': 'toggleControl',
			'ugb-advanced-range-control': 'rangeControl',
			'ugb-advanced-toolbar-control': 'toolbarControl',
			'editor-color-palette-control': 'colorControl',
			'ugb-button-icon-control': 'popoverControl',
			'ugb-advanced-autosuggest-control': 'suggestionControl',
			'ugb-four-range-control': 'fourRangeControl',
			'ugb-design-separator-control': 'designControl',
			'ugb-icon-control': 'iconControl',
			'ugb-columns-width-control': 'columnControl',
			'ugb-design-control': 'designControl',

			// Custom selectors.
			'ugb--help-tip-background-color-type': 'toolbarControl',
		}

		const executeCommand = key => {
			if ( parsedClassNames.includes( key ) ) {
				cy[ commandsBasedOnClassName[ key ] ]( customLabels[ name ] || name, value, options, customLabels[ name ] )
				return true
			}
			return false
		}

		if ( ! keys( commandsBasedOnClassName ).map( executeCommand ).some( value => value ) ) {
			// Handle event for dropdowns since they don't have selectors.
			return selector()
				.find( 'select' )
				.then( () => {
					return cy.dropdownControl( name, value, options )
				} )
		}
	}

	const selector = () => {
		if ( customLabels[ name ] ) {
			return cy
				.get( '.components-panel__body.is-opened>.components-base-control' )
				.contains( new RegExp( customLabels[ name ] ) )
				.last()
				.parentsUntil( '.components-panel__body.is-opened>.components-base-control' )
				.parent()
		}

		return cy
			.get( '.components-panel__body.is-opened>.components-base-control' )
			.contains( containsRegExp( name ) )
			.last()
			.parentsUntil( '.components-panel__body.is-opened>.components-base-control' )
			.parent()
	}

	selector()
		.then( block => {
			const classNames = Array.from( block[ 0 ].classList ).join( ' ' )
			// Handle nested base controls.
			const withNestedBaseControl = [
				'ugb-advanced-toolbar-control',
				'ugb-design-control',
			]

			let nestedBaseControl = null

			withNestedBaseControl.forEach( className => {
				if ( ! nestedBaseControl ) {
					nestedBaseControl = block.find( `.components-base-control.${ className }` ).length
						? 						block.find( `.components-base-control.${ className }` ) : null
				}
			} )

			if ( nestedBaseControl ) {
				const classes = Array.from( nestedBaseControl[ 0 ].classList )
				return _adjust( classes.join( ' ' ) )
			}

			return _adjust( classNames )
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
	const selector = () => cy
		.get( '.components-panel__body.is-opened>.components-base-control' )
		.contains( containsRegExp( name ) )
		.last()
		.parentsUntil( '.components-panel__body.is-opened>.components-base-control' )
		.parent()

	 selector()
		.invoke( 'attr', 'class' )
		.then( classNames => {
			const parsedClassNames = classNames.split( ' ' )

			/**
			 * These are the list of selectors
			 * and their corresponding commands.
			 */
			const commandsBasedOnClassName = {
				 'ugb-advanced-range-control': 'rangeControlReset',
				 'editor-color-palette-control': 'colorControlClear',
				 'ugb-button-icon-control': 'popoverControlReset',
				 'ugb-advanced-autosuggest-control': 'suggestionControlClear',
				 'ugb-four-range-control': 'fourRangeControlReset',
				 'ugb-icon-control': 'iconControlReset',
			}

			const executeCommand = key => {
				if ( parsedClassNames.includes( key ) ) {
					cy[ commandsBasedOnClassName[ key ] ]( name, options )
				}
			}

			keys( commandsBasedOnClassName ).forEach( executeCommand )
		} )

	// Always return the selected block which will be used in functions that require chained wp-block elements.
	return cy.get( '.block-editor-block-list__block.is-selected' )
}

/**
 * Command for changing the layout of the block.
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
 * Command for changing the design of the block.
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
		.parentsUntil( '.ugb-design-library-item' )
		.parent()
		.find( 'button' )
		.click( { force: true } )
	cy.waitLoader( '.ugb-design-library-item span.components-spinner' )
}

export function _assertComputedStyle( selector, pseudoEl, _cssObject, assertType, viewport = 'Desktop' ) {
	const removeAnimationStyles = [
		'-webkit-transition: none !important',
		'-moz-transition: none !important',
		'-o-transition: none !important',
		'transition: none !important',
		'transition-duration: 0s !important',
	]

	cy.window().then( win => {
		cy.document().then( doc => {
			cy
				.get( selector )
				.then( $block => {
					const element = first( $block )

					const parentEl = assertType === 'Editor'
						? doc.querySelector( '.edit-post-visual-editor' )
						: doc.querySelector( 'body' )

					const convertExpectedValueForEnqueue = expectedValue => {
						// Handle conversion of vw to px.
						if ( expectedValue.match( /vw$/ ) ) {
							const visualEl = doc.querySelector( '.edit-post-visual-editor' )
							if ( visualEl && assertType === 'Backend' && viewport !== 'Desktop' ) {
								const currEditorWidth = pick( win.getComputedStyle( visualEl ), 'width' ).width
								return `${ parseFloat( ( parseInt( expectedValue ) ) / 100 * currEditorWidth ) }px`
							}
						}
						return expectedValue
					}

					// Remove animations.
					element.setAttribute( 'style', removeAnimationStyles.join( '; ' ) )
					element.parentElement.setAttribute( 'style', removeAnimationStyles.join( '; ' ) )
					parentEl.parentElement.setAttribute( 'style', removeAnimationStyles.join( '; ' ) )

					const computedStyles = pick( win.getComputedStyle( element, pseudoEl ? `:${ pseudoEl }` : undefined ), ...keys( _cssObject ).map( camelCase ) )
					const expectedStylesToEnqueue = keys( _cssObject ).map( key =>
						`${ key }: ${ convertExpectedValueForEnqueue( _cssObject[ key ] ) } !important` )

					element.setAttribute( 'style', `${ [ ...removeAnimationStyles, ...expectedStylesToEnqueue ].join( '; ' ) }` )
					const expectedStyles = pick( win.getComputedStyle( element, pseudoEl ? `:${ pseudoEl }` : undefined ), ...keys( _cssObject ).map( camelCase ) )

					keys( _cssObject ).forEach( key => {
						const computedStyle = computedStyles[ camelCase( key ) ]
						const expectedStyle = expectedStyles[ camelCase( key ) ]
						assert.equal(
							computedStyle,
							expectedStyle,
							`'${ camelCase( key ) }' expected to be ${ expectedStyle } in ${ assertType }. Found '${ computedStyle }'.`
						)
					} )
				} )
		} )
	} )
}

/**
 * Command for asserting the computed style of a block.
 *
 * @param {*} subject
 * @param {Object} cssObject
 * @param {Object} options
 */
export function assertComputedStyle( subject, cssObject = {}, options = {} ) {
	const {
		assertFrontend = true,
		assertBackend = true,
		delay = 0,
		viewportFrontend = false,
	} = options

	cy.wp().then( wp => {
		const block = wp.data.select( 'core/block-editor' ).getBlock( subject.data( 'block' ) )
		const saveElement = createElementFromHTMLString( wp.blocks.getBlockContent( block ) )
		const blockPath = getBlockStringPath( wp.data.select( 'core/block-editor' ).getBlocks(), subject.data( 'block' ) )

		cy.publish()

		cy.wait( delay )

		cy.getPreviewMode().then( previewMode => {
			if ( assertBackend ) {
				keys( cssObject ).forEach( _selector => {
					const selector = _selector.split( ':' )

					// Assert editor computed style.
					_assertComputedStyle(
						`.is-selected${ ` ${ first( selector ) }` }`,
						selector.length === 2 && last( selector ),
						cssObject[ _selector ],
						'Editor',
						previewMode
					)
				} )
			}
		} )

		if ( assertFrontend ) {
			const parsedClassList = Array.from( saveElement.classList ).map( _class => `.${ _class }` ).join( '' )
			cy.getPreviewMode().then( previewMode => {
				cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
					cy.visit( previewUrl )
					if ( viewportFrontend && viewportFrontend !== 'Desktop' ) {
						cy.viewport(
							Cypress.config( `viewport${ viewportFrontend }Width` ) || Cypress.config( 'viewportWidth' ),
							Cypress.config( 'viewportHeight' )
						)
					} else if ( previewMode !== 'Desktop' ) {
						cy.viewport(
							Cypress.config( `viewport${ previewMode }Width` ) || Cypress.config( 'viewportWidth' ),
							Cypress.config( 'viewportHeight' )
						)
					}

					// Assert frontend computed style.
					cy.wait( delay )
					keys( cssObject ).forEach( _selector => {
						const selector = _selector.split( ':' )
						const selectorWithSpace = first( selector ).split( ' ' )
						const [ , ...restOfTheSelectors ] = [ ...selectorWithSpace ]

						const documentSelector = `${ parsedClassList }${ first( selectorWithSpace ).match( /\./ )
							?	( parsedClassList.match( first( selectorWithSpace ) )
								? ` ${ restOfTheSelectors.join( ' ' ) }`
								: ` ${ first( selector ) }` )
							: ` ${ first( selector ) }` }`.trim()

						_assertComputedStyle(
							documentSelector,
							selector.length === 2 && last( selector ),
							cssObject[ _selector ],
							'Frontend'
						)
					} )

					cy.viewport( Cypress.config( 'viewportWidth' ), Cypress.config( 'viewportHeight' ) )
					cy.visit( editorUrl )
					cy.wp().then( _wp => {
						const { clientId, name } = get( _wp.data.select( 'core/block-editor' ).getBlocks(), blockPath ) || {}
						cy.selectBlock( name, { clientId } )
					} )
				} )
			} )
		}
	} )
}

/**
 * Command for asserting the included classNames.
 *
 * @param  {*} subject
 * @param {string} customSelector
 * @param {string} expectedValue
 * @param {Object} options
 */
export function assertClassName( subject, customSelector = '', expectedValue = '', options = {} ) {
	const {
		assertBackend = true,
		assertFrontend = true,
		delay = 0,
	} = options

	cy.wp().then( wp => {
		const block = wp.data.select( 'core/block-editor' ).getBlock( subject.data( 'block' ) )
		const saveElement = createElementFromHTMLString( wp.blocks.getBlockContent( block ) )
		const parsedClassList = Array.from( saveElement.classList ).map( _class => `.${ _class }` ).join( '' )

		cy.publish()

		cy.wait( delay )
		cy
			.get( subject )
			.then( $block => {
				// Assert editor classes.
				if ( assertBackend ) {
					assert.isTrue(
						!! $block.find( `${ customSelector }.${ expectedValue }` ).length,
						`${ expectedValue } class must be present in ${ customSelector } in Editor`
					)
				}

				// Assert frontend classes.
				// Check if we're asserting the parent element.
				if ( assertFrontend ) {
					if ( parsedClassList.match( customSelector ) ) {
						assert.isTrue(
							!! parsedClassList.match( expectedValue ),
							`${ expectedValue } class must be present in ${ customSelector } in Editor`
						)
					} else {
						// Otherwise, search the element
						cy.log( '2', Array.from( saveElement.querySelector( customSelector ).classList ).includes( expectedValue ) )
						assert.isTrue(
							!! Array.from( saveElement.querySelector( customSelector ).classList ).includes( expectedValue ),
							`${ expectedValue } class must be present in ${ customSelector } in Editor`
						)
					}
				}
			} )
	} )
}

/**
 * Command for asserting the html tag
 *
 * @param {*} subject
 * @param {string} customSelector
 * @param {string} expectedValue
 * @param {Object} options
 */
export function assertHtmlTag( subject, customSelector = '', expectedValue = '', options = {} ) {
	const {
		assertBackend = true,
		assertFrontend = true,
		delay = 0,
	} = options

	cy.wp().then( wp => {
		const block = wp.data.select( 'core/block-editor' ).getBlock( subject.data( 'block' ) )
		const saveElement = createElementFromHTMLString( wp.blocks.getBlockContent( block ) )
		const parsedClassList = Array.from( saveElement.classList ).map( _class => `.${ _class }` ).join( '' )

		cy.publish()

		cy.wait( delay )
		cy
			.get( subject )
			.then( $block => {
				// Assert editor HTML tag.
				if ( assertBackend ) {
					assert.isTrue(
						! isEmpty( $block.find( `${ expectedValue }${ customSelector }` ) ),
						`${ customSelector } must have HTML tag '${ expectedValue } in Editor'`
					)
				}

				// Check if we're asserting the parent element.
				if ( assertFrontend ) {
					if ( parsedClassList.match( customSelector ) ) {
						assert.isTrue(
							saveElement.tagName === toUpper( expectedValue ),
							`${ customSelector } must have HTML tag '${ expectedValue } in Frontend'`
						)
					} else {
						// Otherwise, search the element
						assert.isTrue(
							saveElement.querySelector( customSelector ).tagName === toUpper( expectedValue ),
							`${ customSelector } must have HTML tag '${ expectedValue } in Frontend'`
						)
					}
				}
			} )
	} )
}

/**
 * Command for asserting the html attribute
 *
 * @param {*} subject
 * @param {string} customSelector
 * @param {string} attribute
 * @param {*} expectedValue
 * @param {Object} options
 */
export function assertHtmlAttribute( subject, customSelector = '', attribute = '', expectedValue = '', options = {} ) {
	const {
		assertBackend = true,
		assertFrontend = true,
		delay = 0,
	} = options

	cy.wp().then( wp => {
		const block = wp.data.select( 'core/block-editor' ).getBlock( subject.data( 'block' ) )
		const saveElement = createElementFromHTMLString( wp.blocks.getBlockContent( block ) )
		const parsedClassList = Array.from( saveElement.classList ).map( _class => `.${ _class }` ).join( '' )

		cy.publish()

		cy.wait( delay )
		cy
			.get( subject )
			.find( customSelector )
			.invoke( 'attr', attribute )
			.then( $attribute => {
				// Assert editor HTML attributes.
				if ( assertBackend ) {
					if ( typeof expectedValue === 'string' ) {
						assert.isTrue(
							$attribute === expectedValue,
							`${ customSelector } must have a ${ attribute } = "${ expectedValue }" in Editor`
						)
					} else if ( expectedValue instanceof RegExp ) {
						assert.isTrue(
							( $attribute || '' ).match( expectedValue ),
							`${ customSelector } must have a ${ attribute } = "${ expectedValue }" in Editor` )
					}
				}

				// Check if we're asserting the parent element.
				if ( assertFrontend ) {
					if ( parsedClassList.match( customSelector ) ) {
						assert.isTrue(
							attribute instanceof RegExp
								? !! saveElement.getAttribute( attribute ).match( expectedValue )
								: saveElement.getAttribute( attribute ) === expectedValue,
							`${ customSelector } must have ${ attribute } = "${ expectedValue } in Frontend"`
						)
					} else {
						// Otherwise, search the element
						assert.isTrue(
							attribute instanceof RegExp
								? !! saveElement.querySelector( customSelector ).getAttribute( attribute ).match( expectedValue )
								: saveElement.querySelector( customSelector ).getAttribute( attribute ) === expectedValue,
							`${ customSelector } must have ${ attribute } = "${ expectedValue } in Frontend"`
						)
					}
				}
			} )
	} )
}
