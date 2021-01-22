/**
 * External dependencies
 */
import {
	kebabCase, keys, camelCase, isEmpty,
} from 'lodash'

/**
 * Internal dependencies
 */
import {
	getBaseControl,
	containsRegExp,
	getActiveTab,
	changeResponsiveMode,
	changeUnit,
	waitLoader,
	rgbToHex,
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
		changeResponsiveMode( viewport, name, tab, isInPopover )
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
		changeResponsiveMode( viewport, name, tab, isInPopover )
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
		changeResponsiveMode( viewport, name, tab, isInPopover, customRegExp )
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
			.find( `input[value="${ kebabCase( value ) }"]` )
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
			.type( `{selectall}${ value }{enter}` )

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
	} = options

	// Compatibility for default values
	const defaultValues = [
		'none',
	]

	if ( defaultValues.includes( value ) ) {
		value = ''
	}

	getActiveTab( tab => {
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
			.type( `{selectall}${ value }{enter}` )
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
			.type( `{selectall}{backspace}{enter}` )
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
			changeResponsiveMode( viewport, name, tab, isInPopover )
			changeUnit( unit, name, tab, isInPopover )
			selector( tab )
				.find( 'input.components-input-control__input' )
				.type( `{selectall}${ value }` )
		} )
	} else if ( Array.isArray( value ) ) {
		// Adjust the four control field.
		getActiveTab( tab => {
			changeResponsiveMode( viewport, name, tab, isInPopover )
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
			getActiveTab( tab => {
				selector( tab )
					.find( 'input.components-input-control__input' )
					.eq( index )
					.type( `{selectall}${ entry }`, { force: true } )
			} )
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
		changeResponsiveMode( viewport, name, tab, isInPopover )
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
			.type( value )

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
			.type( keyword )

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
		.invoke( 'attr', 'class' )
		.then( classNames => {
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

				 // Custom selectors.
				 'ugb--help-tip-background-color-type': 'toolbarControl',
			}

			const executeCommand = key => {
				if ( parsedClassNames.includes( key ) ) {
					AdjustCommands[ commandsBasedOnClassName[ key ] ]( name, value, options, customLabels[ name ] )
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
 * @param {string} option
 */
export function adjustLayout( option = '' ) {
	cy
		.get( '.ugb-design-control-wrapper' )
		.find( `input[value="${ typeof option === 'object' ? option.value : kebabCase( option ) }"]` )
		.click( { force: true } )
}

/**
 * Command for changing the design of the block.
 *
 * @param {string} option
 */
export function adjustDesign( option = '' ) {
	cy
		.get( '.ugb-design-library-items' )
		.find( '.ugb-design-library-item' )
		.contains( containsRegExp( option ) )
		.parentsUntil( '.ugb-design-library-item' )
		.parent()
		.find( 'button' )
		.click( { force: true } )

	waitLoader( '.ugb-design-library-item>span.components-spinner' )
}

/**
 * Command for asserting the computed style of a block.
 *
 * @param {*} subject
 * @param {Object} cssObject
 * @param {Object} options
 */
export function assertComputedStyle( subject, cssObject = {}, options = {} ) {
	const _assertComputedStyle = ( win, doc, element, cssRule, expectedValue, pseudoEl, parentEl, selector ) => {
		let computedStyle = win.getComputedStyle( element, pseudoEl ? `:${ pseudoEl }` : undefined )[ camelCase( cssRule ) ]

		/**
		 * Section for overriding computed styles.
		 */
		if ( typeof computedStyle === 'string' && computedStyle.match( /rgb\(/ ) ) {
			// Force rgb computed style to be hex.
			computedStyle = computedStyle.replace( /rgb\(([0-9]*), ([0-9]*), ([0-9]*)\)/g, val => rgbToHex( val ) )
		}

		if ( typeof expectedValue === 'string' && expectedValue.match( /%/ ) ) {
			// Convert % to px
			const elWidth = parseInt( win.getComputedStyle( element.parentElement ).width )
			expectedValue = `${ parseInt( ( elWidth / 100 ) * parseInt( expectedValue ) ) }px`
			computedStyle = `${ parseInt( computedStyle ) }px`
		}

		if ( typeof expectedValue === 'string' && expectedValue.match( /em/ ) ) {
			// Conditional `em` unit handling.
			switch ( cssRule ) {
				case 'line-height': {
					const selectorEl = doc.querySelector( selector )
					if ( selectorEl ) {
						const fontSize = win.getComputedStyle( selectorEl ).fontSize
						const oneEm = parseInt( fontSize )

						cy.log( `${ computedStyle }` )
						expectedValue = `${ parseFloat( oneEm * parseFloat( expectedValue ) ).toString().substring( 0, `${ computedStyle }`.length - 2 ) }px`
					}
					break
				}
				default: {
					// Determine the theme's default font size.
					const fontSize = win.getComputedStyle( parentEl ).fontSize
					const oneEm = parseInt( fontSize )

					expectedValue = `${ parseFloat( oneEm * parseFloat( expectedValue ) ) }px`
				}
			}
		}

		assert.equal( computedStyle, expectedValue, `'${ camelCase( cssRule ) }' expected to be ${ expectedValue }. Found '${ computedStyle }'.` )
	}

	assertFunction(
		subject,
		// Assertion in the editor.
		( {
			win, doc,
		} ) => {
			keys( cssObject ).forEach( _selector => {
				const selector = _selector.split( ':' )
				cy
					.get( `.is-selected${ ` ${ selector[ 0 ] }` }` )
					.then( $block => {
						keys( cssObject[ _selector ] ).forEach( cssRule => {
							_assertComputedStyle( win, doc, $block[ 0 ], cssRule, cssObject[ _selector ][ cssRule ], selector.length === 2 && selector[ 1 ], doc.querySelector( '.edit-post-visual-editor' ), _selector )
						} )
					} )
			} )
		},
		// Assertion in the frontend.
		( {
			parsedClassList, win, doc,
		} ) => {
			keys( cssObject ).forEach( _selector => {
				const selector = _selector.split( ':' )
				const willAssertElement = doc.querySelector( `${ parsedClassList }${ parsedClassList.match( selector[ 0 ] ) ? '' : ` ${ selector[ 0 ] }` }` )
				if ( willAssertElement ) {
					keys( cssObject[ _selector ] ).forEach( cssRule => {
						_assertComputedStyle( win, doc, willAssertElement, cssRule, cssObject[ _selector ][ cssRule ], selector.length === 2 && selector[ 1 ], doc.querySelector( 'body' ), _selector )
					} )
				}
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
			parsedClassList, doc,
		} ) => {
			const willAssertElement = doc.querySelector( `${ parsedClassList }${ parsedClassList.match( customSelector ) ? '' : ` ${ customSelector }` }` )
			if ( willAssertElement ) {
				cy
					.get( parsedClassList )
					.find( customSelector )
					.invoke( 'attr', 'class' )
					.then( $classNames => {
						const parsedClassNames = $classNames.split( ' ' )
						assert.isTrue( parsedClassNames.includes( expectedValue ), `${ expectedValue } must be present in block` )
					} )
			}
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
					if ( parsedClassList.match( customSelector ) ) {
						assert.isTrue( ! isEmpty( Cypress.$( `${ expectedValue }${ parsedClassList }` ) ), `${ customSelector } must have HTML tag '${ expectedValue }'` )
					} else {
						assert.isTrue( ! isEmpty( $block.find( `${ expectedValue }${ customSelector }` ) ), `${ customSelector } must have HTML tag '${ expectedValue }'` )
					}
				} )
		},
		options
	)
}
