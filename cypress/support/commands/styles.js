/**
 * External dependencies
 */
import {
	kebabCase, keys, camelCase, isEmpty, first, cloneDeep,
} from 'lodash'

/**
 * Internal dependencies
 */
import {
	getBaseControl,
	containsRegExp,
	getActiveTab,
	changeUnit,
	waitLoader,
} from '../util'
import { assertFunction } from '../helpers'

export const AdjustCommands = {
	toggleControl,
	rangeControl,
	toolbarControl,
	designControl,
	colorControl,
	popoverControl,
	dropdownControl,
	suggestionControl,
	fourRangeControl,
	iconControl,
	columnControl,
}

export const ResetCommands = {
	rangeControlReset,
	colorControlClear,
	popoverControlReset,
	suggestionControlClear,
	fourRangeControlReset,
	iconControlReset,
}

/**
 * Register functions to Cypress Commands.
 */
Cypress.Commands.add( 'adjust', adjust )
Cypress.Commands.add( 'resetStyle', resetStyle )
Cypress.Commands.add( 'adjustLayout', adjustLayout )
Cypress.Commands.add( 'adjustDesign', adjustDesign )
Cypress.Commands.add( 'assertComputedStyle', { prevSubject: 'element' }, assertComputedStyle )
Cypress.Commands.add( 'assertClassName', { prevSubject: 'element' }, assertClassName )
Cypress.Commands.add( 'assertHtmlTag', { prevSubject: 'element' }, assertHtmlTag )
Cypress.Commands.add( 'assertHtmlAttribute', { prevSubject: 'element' }, assertHtmlAttribute )

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
	} = options

	const selector = tab => getBaseControl( tab, isInPopover )
		.contains( containsRegExp( name ) )
		.parentsUntil( `.components-panel__body>.components-base-control` )
		.parent()

	getActiveTab( tab => {
		selector( tab )
			.find( 'span.components-form-toggle' )
			.invoke( 'attr', 'class' )
			.then( classNames => {
				const parsedClassNames = classNames.split( ' ' )
				if ( ( value && ! parsedClassNames.includes( 'is-checked' ) ) || ( ! value && parsedClassNames.includes( 'is-checked' ) ) ) {
					selector( tab )
						.find( 'input' )
						.click( { force: true } )
				}
			} )
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
		viewport = 'Desktop',
		unit = '',
	} = options

	getActiveTab( tab => {
		cy.changePreviewMode( viewport )
		changeUnit( unit, name, tab, isInPopover )
		getBaseControl( tab, isInPopover )
			.contains( containsRegExp( name ) )
			.parentsUntil( `.components-panel__body>.components-base-control` )
			.parent()
			.find( 'input.components-input-control__input' )
			.type( `{selectall}${ value }`, { force: true } )
	} )
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
		viewport = 'Desktop',
		unit = '',
	} = options

	getActiveTab( tab => {
		cy.changePreviewMode( viewport )
		changeUnit( unit, name, tab, isInPopover )
		getBaseControl( tab, isInPopover )
			.contains( containsRegExp( name ) )
			.parentsUntil( `.components-panel__body>.components-base-control` )
			.parent()
			.find( 'button' )
			.contains( containsRegExp( 'Reset' ) )
			.click( { force: true } )
	} )
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
		viewport = 'Desktop',
	} = options

	// Compatibility for default values
	const defaultValues = [
		'single', // Default value for column background type.
	]

	if ( defaultValues.includes( value ) ) {
		value = ''
	}

	getActiveTab( tab => {
		cy.changePreviewMode( viewport )
		getBaseControl( tab, isInPopover )
			.contains( customRegExp ? new RegExp( customRegExp ) : containsRegExp( name ) )
			.parentsUntil( `.components-panel__body>.components-base-control` )
			.parent()
			.find( `button[value="${ value }"]` )
			.click( { force: true } )
	} )
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
	} = options

	getActiveTab( tab => {
		getBaseControl( tab, isInPopover )
			.contains( containsRegExp( name ) )
			.parentsUntil( `.components-panel__body>.components-base-control` )
			.parent()
			.find( `input[value="${ typeof value === 'object' ? value.value : kebabCase( value ) }"]` )
			.click( { force: true } )
	} )
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
	} = options

	const selector = tab => getBaseControl( tab, isInPopover )
		.contains( containsRegExp( name ) )
		.parentsUntil( `.components-panel__body>.components-base-control` )
		.parent()

	if ( typeof value === 'string' && value.match( /^#/ ) ) {
		// Use custom color.
		getActiveTab( tab => {
			selector( tab )
				.find( 'button' )
				.contains( 'Custom color' )
				.click( { force: true } )
		} )

		cy
			.get( '.components-popover__content' )
			.find( 'input[type="text"]' )
			.type( `{selectall}${ value }{enter}`, { force: true } )

		// Declare the variable again
		getActiveTab( tab => {
			selector( tab )
				.find( 'button' )
				.contains( containsRegExp( 'Custom color' ) )
				.click( { force: true } )
		} )
	} else if ( typeof value === 'number' ) {
		// Get the nth color in the color picker.
		getActiveTab( tab => {
			selector( tab )
				.find( 'button.components-circular-option-picker__option' )
				.eq( value - 1 )
				.click( { force: true } )
		} )
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
	} = options

	getActiveTab( tab => {
		getBaseControl( tab, isInPopover )
			.contains( containsRegExp( name ) )
			.parentsUntil( `.components-panel__body>.components-base-control` )
			.parent()
			.find( 'button' )
			.contains( containsRegExp( 'Clear' ) )
			.click( { force: true } )
			// We are adding an additional click as sometimes click does not register.
			.click( { force: true, log: false } )
	} )
}

/**
 * Command for adjusting the popover control.
 *
 * @param {string} name
 * @param {*} value
 * @param {Object} options
 * @param {string} customRegex
 */
function popoverControl( name, value = {}, options = {}, customRegex = '' ) {
	const {
		isInPopover = false,
	} = options

	const clickPopoverButton = () => {
		getActiveTab( tab => {
			getBaseControl( tab, isInPopover )
				.contains( containsRegExp( name ) )
				.parentsUntil( '.components-panel__body>.components-base-control' )
				.parent()
				.find( 'button[aria-label="Edit"]' )
				.click( { force: true } )
		} )
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
				} = value[ key ]

				cy.adjust( key, childValue === '' ? value[ key ] : childValue, {
					viewport, unit, isInPopover: true,
				}, customRegex )
			} else {
				cy.adjust( key, value[ key ], { isInPopover: true }, customRegex )
			}
		} )

		// Close the popover button.
		clickPopoverButton()
	} else if ( typeof value === 'boolean' ) {
		// In some cases, a popover control has an input checkbox.
		getActiveTab( tab => {
			getBaseControl( tab, isInPopover )
				.contains( containsRegExp( name ) )
				.parentsUntil( '.components-panel__body>.components-base-control' )
				.parent()
				.find( 'span.components-form-toggle' )
				.invoke( 'attr', 'class' )
				.then( $classNames => {
					const parsedClassNames = $classNames.split( ' ' )

					if ( ( value && ! parsedClassNames.includes( 'is-checked' ) ) || ( ! value === parsedClassNames.includes( 'is-checked' ) ) ) {
						cy
							.get( `.ugb-panel-${ tab }>.components-panel__body>.components-base-control` )
							.contains( containsRegExp( name ) )
							.parentsUntil( '.components-panel__body>.components-base-control' )
							.parent()
							.find( 'input[type="checkbox"]' )
							.click( { force: true } )
					}
				} )
		} )
	}
}

/**
 * Command for resetting the popover control.
 *
 * @param {string} name
 */
function popoverControlReset( name ) {
	const selector = tab => cy
		.get( `.ugb-panel-${ tab }>.components-panel__body>.components-base-control` )
		.contains( containsRegExp( name ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()

	getActiveTab( tab => {
		selector( tab )
			.then( $parent => {
				if ( $parent.find( 'button[aria-label="Reset"]' ).length ) {
					selector( tab )
						.find( 'button[aria-label="Reset"]' )
						.click( { force: true } )
				}
			} )
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
		viewport = 'Desktop',
		unit = '',
	} = options

	// Compatibility for default values
	const defaultValues = [
		'none',
	]

	if ( defaultValues.includes( value ) ) {
		value = ''
	}

	getActiveTab( tab => {
		cy.changePreviewMode( viewport )
		changeUnit( unit, name, tab, isInPopover )
		getBaseControl( tab, isInPopover )
			.contains( containsRegExp( name ) )
			.parentsUntil( `.components-panel__body>.components-base-control` )
			.parent()
			.find( 'select' )
			.select( value, { force: true } )
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
	} = options

	getActiveTab( tab => {
		getBaseControl( tab, isInPopover )
			.contains( containsRegExp( name ) )
			.parentsUntil( `.components-panel__body>.components-base-control` )
			.parent()
			.find( 'input' )
			.type( `{selectall}${ value }{enter}`, { force: true } )
	} )
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
	} = options

	getActiveTab( tab => {
		getBaseControl( tab, isInPopover )
			.contains( containsRegExp( name ) )
			.parentsUntil( `.components-panel__body>.components-base-control` )
			.parent()
			.find( 'input' )
			.type( `{selectall}{backspace}{enter}`, { force: true } )
	} )
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
		viewport = 'Desktop',
		unit = '',
	} = options

	const selector = tab => getBaseControl( tab, isInPopover )
		.contains( containsRegExp( name ) )
		.parentsUntil( `.components-panel__body>.components-base-control` )
		.parent()

	const clickLockButton = () => getActiveTab( tab => {
		selector( tab )
			.find( 'button.ugb-four-range-control__lock' )
			.click( { force: true } )
	} )

	if ( typeof value === 'number' ) {
		// Adjust the single control field.
		getActiveTab( tab => {
			cy.changePreviewMode( viewport )
			changeUnit( unit, name, tab, isInPopover )
			selector( tab )
				.find( 'input.components-input-control__input' )
				.type( `{selectall}${ value }`, { force: true } )
		} )
	} else if ( Array.isArray( value ) ) {
		// Adjust the four control field.
		getActiveTab( tab => {
			cy.changePreviewMode( viewport )
			changeUnit( unit, name, tab, isInPopover )
			selector( tab )
				.find( 'button.ugb-four-range-control__lock' )
				.invoke( 'attr', 'class' )
				.then( className => {
					const parsedClassName = className.split( ' ' )
					if ( parsedClassName.includes( 'ugb--is-locked' ) ) {
						clickLockButton()
					}
				} )
		} )

		value.forEach( ( entry, index ) => {
			if ( entry !== undefined ) {
				getActiveTab( tab => {
					selector( tab )
						.find( 'input.components-input-control__input' )
						.eq( index )
						.type( `{selectall}${ entry }`, { force: true } )
				} )
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
		viewport = 'Desktop',
	} = options

	const selector = ( tab, isInPopover ) => getBaseControl( tab, isInPopover )
		.contains( containsRegExp( name ) )
		.parentsUntil( `.components-panel__body>.components-base-control` )
		.parent()

	const clickLockButton = () => getActiveTab( tab => {
		selector( tab, isInPopover )
			.find( 'button.ugb-four-range-control__lock' )
			.click( { force: true } )
	} )

	getActiveTab( tab => {
		cy.changePreviewMode( viewport )
		selector( tab, isInPopover )
			.find( 'button.ugb-four-range-control__lock' )
			.invoke( 'attr', 'class' )
			.then( className => {
				const parsedClassName = className.split( ' ' )
				if ( ! parsedClassName.includes( 'ugb--is-locked' ) ) {
					clickLockButton()
				}

				selector( tab, isInPopover )
					.find( 'button' )
					.contains( containsRegExp( 'Reset' ) )
					.click( { force: true } )
			} )
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
	} = options

	value.forEach( ( val, index ) => {
		getActiveTab( tab => {
			getBaseControl( tab, isInPopover )
				.contains( containsRegExp( name ) )
				.parentsUntil( `.components-panel__body>.components-base-control` )
				.parent()
				.find( 'input.components-column-widths-control__number' )
				.eq( index )
				.type( `{selectall}${ val }{enter}`, { force: true } )
		} )
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
	} = options

	const clickIconButton = () => getActiveTab( tab => {
		getBaseControl( tab, isInPopover )
			.contains( containsRegExp( name ) )
			.parentsUntil( `.components-panel__body>.components-base-control` )
			.parent()
			.find( '.ugb-icon-control__button-wrapper>.ugb-icon-control__icon-button' )
			.click( { force: true } )
	} )

	clickIconButton()
	if ( typeof value === 'string' ) {
		// Select the first icon based on keyword
		cy
			.get( 'input[placeholder="Type to search icon"]' )
			.click( { force: true } )
			.type( value, { force: true } )

		// Wait until the loader disappears.
		waitLoader( '.ugb-icon-popover__iconlist>span.components-spinner' )

		cy
			.get( `.ugb-icon-popover__iconlist>button` )
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
		waitLoader( '.ugb-icon-popover__iconlist>span.components-spinner' )

		if ( icon ) {
			cy
				.get( `.ugb-icon-popover__iconlist>button.${ icon }` )
				.first()
				.click( { force: true } )
		} else {
			cy
				.get( `.ugb-icon-popover__iconlist>button` )
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
	} = options

	getActiveTab( tab => {
		getBaseControl( tab, isInPopover )
			.contains( containsRegExp( name ) )
			.parentsUntil( `.components-panel__body>.components-base-control` )
			.parent()
			.find( 'button' )
			.contains( 'Reset' )
			.click( { force: true } )
	} )
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
		[ `Color Type` ]: 'Single|Gradient',
		[ `Icon Color Type` ]: 'Single|Gradient|Multicolor',
		[ `Button Color Type` ]: 'Single|Gradient',
		[ `Shape` ]: typeof value === 'object' ? value.label : value,
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
				AdjustCommands[ commandsBasedOnClassName[ key ] ]( customLabels[ name ] || name, value, options, customLabels[ name ] )
				return true
			}
			return false
		}

		if ( ! keys( commandsBasedOnClassName ).map( executeCommand ).some( value => value ) ) {
			// Handle event for dropdowns since they don't have selectors.
			return selector()
				.find( 'select' )
				.then( () => {
					return AdjustCommands.dropdownControl( name, value, options )
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
					nestedBaseControl = block.find( `.components-base-control.${ className }` ).length ? block.find( `.components-base-control.${ className }` ) : false
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
					ResetCommands[ commandsBasedOnClassName[ key ] ]( name, options )
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
	waitLoader( '.ugb-design-library-search__spinner>span.components-spinner' )

	cy
		.get( '.ugb-design-library-item' )
		.contains( containsRegExp( option ) )
		.parentsUntil( '.ugb-design-library-item' )
		.parent()
		.find( 'button' )
		.click( { force: true } )
	waitLoader( '.ugb-design-library-item span.components-spinner' )
}

function _assertComputedStyle( win, doc, element, _cssObject, pseudoEl, parentEl, assertType, viewport = 'Desktop' ) {
	const removeAnimationStyles = [
		'-webkit-transition: none !important',
		'-moz-transition: none !important',
		'-o-transition: none !important',
		'transition: none !important',
		'transition-duration: 0s !important',
	]

	const convertExpectedValueForEnqueue = expectedValue => {
		// Handle conversion of vw to px.
		if ( expectedValue.match( /vw$/ ) ) {
			const visualEl = doc.querySelector( '.edit-post-visual-editor' )
			if ( visualEl && assertType === 'Backend' && viewport !== 'Desktop' ) {
				const currEditorWidth = win.getComputedStyle( visualEl ).width
				return `${ parseFloat( ( parseInt( expectedValue ) ) / 100 * currEditorWidth ) }px`
			}
		}
		return expectedValue
	}

	// Remove animations.
	element.setAttribute( 'style', removeAnimationStyles.join( '; ' ) )
	element.parentElement.setAttribute( 'style', removeAnimationStyles.join( '; ' ) )
	parentEl.parentElement.setAttribute( 'style', removeAnimationStyles.join( '; ' ) )

	const computedStyles = cloneDeep( win.getComputedStyle( element, pseudoEl ? `:${ pseudoEl }` : undefined ) )
	const expectedStylesToEnqueue = keys( _cssObject ).map( key => `${ key }: ${ convertExpectedValueForEnqueue( _cssObject[ key ] ) } !important` )
	element.setAttribute( 'style', `${ [ ...removeAnimationStyles, ...expectedStylesToEnqueue ].join( '; ' ) }` )
	const expectedStyles = cloneDeep( win.getComputedStyle( element, pseudoEl ? `:${ pseudoEl }` : undefined ) )

	keys( _cssObject ).forEach( key => {
		const computedStyle = computedStyles[ camelCase( key ) ]
		const expectedStyle = expectedStyles[ camelCase( key ) ]
		assert.equal( computedStyle, expectedStyle, `'${ camelCase( key ) }' expected to be ${ expectedStyle }. Found '${ computedStyle }'.` )
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
	assertFunction(
		subject,
		// Assertion in the editor.
		( { viewport } ) => {
			keys( cssObject ).forEach( _selector => {
				const selector = _selector.split( ':' )

				cy.window().then( win => {
					cy.document().then( doc => {
						cy
							.get( `.is-selected${ ` ${ first( selector ) }` }` )
							.then( $block => {
								_assertComputedStyle( win, doc, first( $block ), cssObject[ _selector ], selector.length === 2 && selector[ 1 ], doc.querySelector( '.edit-post-visual-editor' ), 'Backend', viewport )
							} )
					} )
				} )
			} )
		},
		// Assertion in the frontend.
		( {
			parsedClassList, viewport,
		} ) => {
			keys( cssObject ).forEach( _selector => {
				const selector = _selector.split( ':' )
				const selectorWithSpace = first( selector ).split( ' ' )
				const [ , ...restOfTheSelectors ] = [ ...selectorWithSpace ]

				const documentSelector = `${ parsedClassList }${ first( selectorWithSpace ).match( /\./ )
					?	( parsedClassList.match( first( selectorWithSpace ) ) ? ` ${ restOfTheSelectors.join( ' ' ) }` : ` ${ first( selector ) }` )
					: ` ${ first( selector ) }` }`.trim()

				cy.window().then( win => {
					cy.document().then( doc => {
						const willAssertElement = doc.querySelector( documentSelector )
						if ( willAssertElement ) {
							_assertComputedStyle( win, doc, willAssertElement, cssObject[ _selector ], selector.length === 2 && selector[ 1 ], doc.querySelector( 'body' ), 'Frontend', viewport )
						}
					} )
				} )
			} )
		},
		options )
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
	assertFunction(
		subject,
		// Assertion in the editor.
		() => {
			cy
				.get( subject )
				.invoke( 'attr', 'id' )
				.then( id => {
					const block = cy.get( `#${ id }${ ` ${ customSelector }` || `` }` )
					block
						.invoke( 'attr', 'class' )
						.then( $classNames => {
							const parsedClassNames = $classNames.split( ' ' )
							assert.isTrue( parsedClassNames.includes( expectedValue ), `${ expectedValue } must be present in block #${ id }` )
						} )
				} )
		},
		// Assertion in the frontend.
		( {
			parsedClassList,
		} ) => {
			cy.document().then( doc => {
				const willAssertElement = doc.querySelector( `${ parsedClassList }${ parsedClassList.match( customSelector ) ? '' : ` ${ customSelector }` }` )
				if ( willAssertElement ) {
					( parsedClassList.includes( customSelector )
						? 					cy.get( parsedClassList ).invoke( 'attr', 'class' )
						: 					cy.get( parsedClassList ).find( customSelector ).invoke( 'attr', 'class' )
					).then( $classNames => {
						const parsedClassNames = $classNames.split( ' ' )
						assert.isTrue( parsedClassNames.includes( expectedValue ), `${ expectedValue } must be present in block` )
					} )
				}
			} )
		},
		options
	)
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
	assertFunction(
		subject,
		() => {
			cy
				.get( subject )
				.then( $block => {
					assert.isTrue( ! isEmpty( $block.find( `${ expectedValue }${ customSelector }` ) ), `${ customSelector } must have HTML tag '${ expectedValue }'` )
				} )
		},
		( { parsedClassList } ) => {
			cy
				.get( parsedClassList )
				.then( $block => {
					assert.isTrue( ! isEmpty( parsedClassList.match( customSelector ) ? Cypress.$( `${ expectedValue }${ parsedClassList }` ) : $block.find( `${ expectedValue }${ customSelector }` ) ), `${ customSelector } must have HTML tag '${ expectedValue }'` )
				} )
		},
		options
	)
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
	assertFunction(
		subject,
		() => {
			cy
				.get( subject )
				.find( customSelector )
				.invoke( 'attr', attribute )
				.then( $attribute => {
					if ( typeof expectedValue === 'string' ) {
						assert.isTrue( $attribute === expectedValue, `${ customSelector } must have a ${ attribute } = "${ expectedValue }"` )
					}
					if ( expectedValue instanceof RegExp ) {
						assert.isTrue( ( $attribute || '' ).match( expectedValue ), `${ customSelector } must have a ${ attribute } = "${ expectedValue }"` )
					}
				} )
		},
		( { parsedClassList } ) => {
			cy
				.get( parsedClassList )
				.then( $block => {
					if ( typeof expectedValue === 'string' ) {
						assert.isTrue( ( parsedClassList.match( customSelector )
							?	 Cypress.$( parsedClassList ).attr( attribute )
							: $block.find( customSelector ).attr( attribute ) || '' ) === expectedValue
						, `${ customSelector } must have a ${ attribute } = "${ expectedValue }"` )
					}
					if ( expectedValue instanceof RegExp ) {
						assert.isTrue( ( parsedClassList.match( customSelector )
							?	 Cypress.$( parsedClassList ).attr( attribute )
							: $block.find( customSelector ).attr( attribute ) || '' ).match( expectedValue )
						, `${ customSelector } must have a ${ attribute } = "${ expectedValue }"` )
					}
				} )
		},
		options
	)
}
