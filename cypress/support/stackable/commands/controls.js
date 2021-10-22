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
import {
	changeControlViewport,
	changeUnit,
	changeControlState,
} from '../util'

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
Cypress.Commands.add( 'focalPointControl', focalPointControl )
Cypress.Commands.add( 'stkDateTimeControl', stkDateTimeControl )
Cypress.Commands.add( 'imageControl', imageControl )

// Reset
Cypress.Commands.add( 'iconControlReset', iconControlReset )
Cypress.Commands.add( 'fourRangeControlReset', fourRangeControlReset )
Cypress.Commands.add( 'suggestionControlClear', suggestionControlClear )
Cypress.Commands.add( 'popoverControlReset', popoverControlReset )
Cypress.Commands.add( 'focalPointControlReset', focalPointControlReset )
Cypress.Commands.add( 'stkDateTimeControlReset', stkDateTimeControlReset )
Cypress.Commands.add( 'imageControlReset', imageControlReset )

// Adjust styles
Cypress.Commands.add( 'adjustLayout', adjustLayout )
Cypress.Commands.add( 'adjustDesign', adjustDesign )

// Toggle linking
Cypress.Commands.add( 'toggleBlockLinking', { prevSubject: true }, toggleBlockLinking )

// Adjust resizable column width
Cypress.Commands.add( 'resizeWidth', { prevSubject: true }, resizeWidth )

/**
 * Overwrite Gutenberg Commands
 */
Cypress.Commands.overwrite( 'textControl', adjustDynamicContentControl )
Cypress.Commands.overwrite( 'urlInputControl', adjustDynamicContentControl )
Cypress.Commands.overwrite( 'imageControl', adjustDynamicContentControl )

function adjustDynamicContentControl( originalFn, ...args ) {
	const optionsToPass = args.length === 3 ? args.pop() : {}

	if ( optionsToPass.isDynamicContent && typeof args[ 1 ] === 'object' ) {
		if ( optionsToPass.isInPopover ) {
			cy.get( '.components-base-control button[aria-label="Dynamic Fields"]' )
				.click( { force: true } )
		} else {
			cy
				.getBaseControl( ...args, optionsToPass )
				.find( 'button[aria-label="Dynamic Fields"]' )
				.click( { force: true } )
		}

		// Adjust popover with the `value`
		cy.adjustDynamicContentPopover( args[ 1 ] )
	} else {
		return originalFn( ...args, optionsToPass )
	}
}

Cypress.Commands.overwrite( 'adjust', ( originalFn, ...args ) => {
	const optionsToPass = args.length === 3 ? args.pop() : {}
	const label = first( args )

	// Function to call before adjusting options
	optionsToPass.beforeAdjust = ( name, value, _options ) => {
		const options = Object.assign( _options, { name, value } )
		changeControlViewport( options )
		changeUnit( options )
		changeControlState( options )
	}

	// TODO: support null value in cy.adjust
	// if ( args[ 1 ] === null ) {
	// 	const options = Object.assign( args[ 2 ], { name: label, value: args[ 1 ] } )
	// 	changeControlViewport( options )
	// 	changeUnit( options )
	// 	changeControlState( options )
	// 	return cy.get( '.block-editor-block-list__block.is-selected' )
	// }

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
		'.ugb-four-range-control__lock': 'fourRangeControl', // TODO: Find a better selector
		'.react-autosuggest__input': 'suggestionControl',
		'.ugb-button-icon-control__wrapper': 'popoverControl',
		'.ugb-columns-width-control': 'columnControl',
		'.ugb-design-control': 'designControl',
		'.ugb-icon-control': 'iconControl',
		'.stk-advanced-focal-point-control': 'focalPointControl',
		'.stk-date-time-control__field': 'stkDateTimeControl',
		'.ugb-image-control': 'imageControl',
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
	optionsToPass.beforeAdjust = ( name, value, _options ) => {
		const options = Object.assign( _options, { name, value } )
		changeControlViewport( options )
		changeUnit( options )
		changeControlState( options )
	}

	const customOptions = {
		// Pass our own reset controls.
		 'ugb-button-icon-control': 'popoverControlReset',
		 'ugb-advanced-autosuggest-control': 'suggestionControlClear',
		 'ugb-four-range-control': 'fourRangeControlReset',
		 '.ugb-four-range-control__lock': 'fourRangeControl', // TODO: Find a better selector
		 'ugb-icon-control': 'iconControlReset',
		 '.stk-advanced-focal-point-control': 'focalPointControlReset',
		 '.stk-date-time-control__field': 'stkDateTimeControlReset',
		 '.ugb-image-control': 'imageControlReset',
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
		.find( '.ugb-svg-icon-placeholder__button, .stk--inner-svg' )
		.eq( index - 1 )
		.realClick()

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
		parentSelector,
		mainComponentSelector,
	} = options

	const clickPopoverButton = () => {
		cy.getBaseControl( name, {
			isInPopover, parentSelector, mainComponentSelector,
		} )
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
		cy.getBaseControl( name, { isInPopover, parentSelector } )
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
		parentSelector,
		supportedDelimiter = [],
		mainComponentSelector,
	} = options

	const selector = isInPopover => cy.getBaseControl( name, {
		isInPopover,
		parentSelector,
		supportedDelimiter,
		mainComponentSelector,
	} )

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
				.find( 'button[aria-label="Reset"], button:contains(Reset)' )
				.click( { force: true, multiple: true } )
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
	value.forEach( ( val, index ) => {
		selector()
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
		.find( 'button[aria-label="Reset"], button:contains(Reset)' )
		.click( { force: true } )
}

/**
 * Command for resetting the image focal point control.
 *
 * @param {string} name
 * @param {Object} options
 */
function focalPointControlReset( name, options = {} ) {
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
		.contains( containsRegExp( name ) )
		.closest( '.components-panel__body>.components-base-control' )
		.find( 'button[aria-label="Reset"], button:contains(Reset)' )
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

/**
 * Command for adjusting the focal point control.
 *
 * @param {string} name
 * @param {Object} value
 * @param {Object} options
 */
function focalPointControl( name, value, options = {} ) {
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
	value.forEach( ( val, index ) => {
		if ( val !== undefined ) {
			selector()
				.find( 'input.components-input-control__input' )
				.eq( index )
				.type( `{selectall}${ val }{enter}`, { force: true } )
		}
	} )
}

/**
 * Command for adjusting the date time control of stackable.
 *
 * @param {string} name
 * @param {Object} value
 * @param {Object} options
 */
function stkDateTimeControl( name, value, options = {} ) {
	const {
		isInPopover,
		parentSelector,
		supportedDelimiter,
		mainComponentSelector,
	} = options

	const selector = () => cy
		.getBaseControl( name, {
			isInPopover,
			parentSelector,
			supportedDelimiter,
			mainComponentSelector,
		} )

	selector()
		.find( `.stk-date-time-control__field button[title="${ name }"]` )
		.click( { force: true } )

	// After clicking the field, use the dateTimePopover in gutenberg commands
	cy.dateTimeControl( name, value, options )

	// Click again to close popover
	selector()
		.find( `.stk-date-time-control__field button[title="${ name }"]` )
		.click( { force: true } )
}

/**
 * Command for resetting the date time control of stackable.
 *
 * @param {string} name
 * @param {Object} options
 */
function stkDateTimeControlReset( name, options = {} ) {
	const {
		isInPopover,
		parentSelector,
		supportedDelimiter,
		mainComponentSelector,
	} = options

	cy.getBaseControl( name, {
		isInPopover,
		parentSelector,
		supportedDelimiter,
		mainComponentSelector,
	} )
		.find( 'button[title="Reset"]' )
		.click( { force: true } )
}

/**
 * Command for linking or unlinking a column block
 *
 * @param {*} subject - the previous subject yielded
 * @param {boolean} value
 */
function toggleBlockLinking( subject, value ) {
	cy.wrap( subject )
		.find( '.stk-linking-wrapper > .stk-linking-wrapper__tooltip' )
		.invoke( 'attr', 'class' )
		.then( $classNames => {
			const isLinked = ! $classNames.split( ' ' ).includes( 'stk--is-unlinked' )

			if ( isLinked !== value ) {
				cy.wrap( subject )
					.find( '.stk-linking-wrapper > .stk-linking-wrapper__tooltip' )
					.click( { force: true } )
			}
		} )
}

/**
 * Command for resizing the width of a column
 *
 * @param {*} subject - the previous subject yielded
 * @param {number} value
 */
function resizeWidth( subject, value ) {
	const selectTooltip = () => cy
		.wrap( subject )
		.find( '.stk-resizable-column__size-tooltip' )
		.click( { force: true } )

	selectTooltip()
	cy.get( '.components-popover__content:contains(Column)' )
		.then( $popover => {
			if ( $popover.length ) {
				cy.adjust( 'Column', value, {
					parentSelector: '.components-popover__content',
					supportedDelimiter: [ ' ' ],
				} )
			}
		} )

	// Click the tooltip to close the popover
	selectTooltip()
}

/**
 * Command for adjusting the image control
 *
 * @param {string} name
 * @param {number} value
 * @param {Object} options
 */
function imageControl( name, value, options = {} ) {
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
		.find( '.ugb-placeholder' ).click( { force: true } )
	cy.selectFromMediaLibrary( value )
}

/**
 * Command for resetting the image control.
 *
 * @param {string} name
 * @param {Object} options
 */
function imageControlReset( name, options = {} ) {
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
		.contains( containsRegExp( name ) )
		.closest( '.components-panel__body>.components-base-control' )
		.find( 'button[aria-label="Reset"], button:contains(Reset)' )
		.click( { force: true } )
}
