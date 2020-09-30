// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })

/**
 * External dependencies
 */
import {
	kebabCase, keys,
} from 'lodash'

/**
 * Internal dependencies
 */
import {
	getBaseControl, containsRegExp, getActiveTab, changeResponsiveMode, changeUnit,
} from './util'

Cypress.Commands.add( 'setupWP', () => {
	cy.visit( '/?setup' )
} )

Cypress.Commands.add( 'loginAdmin', () => {
	cy.visit( '/wp-login.php' )
	cy.get( '#user_login' ).clear().type( 'admin' )
	cy.get( '#user_pass' ).clear().type( 'admin' )
	cy.get( '#loginform' ).submit()
} )

Cypress.Commands.add( 'hideAnyGutenbergTip', () => {
	cy.get( 'body' ).then( $body => {
		if ( $body.find( '.edit-post-welcome-guide' ).length ) {
			cy.get( '.edit-post-welcome-guide button:eq(0)' ).click()
		}
	} )
} )

Cypress.Commands.add( 'newPage', () => {
	cy.setupWP()
	cy.visit( '/wp-admin/post-new.php?post_type=page' )
	cy.hideAnyGutenbergTip()
} )

Cypress.Commands.add( 'deactivatePlugin', slug => {
	cy.get( 'body' ).then( $body => {
		if ( $body.find( 'form[name="loginform"]' ) ) {
			cy.loginAdmin()
		}
	} )
	cy.visit( `/?deactivate-plugin=${ slug }` )
	cy.visit( `/wp-admin/` )
} )

Cypress.Commands.add( 'activatePlugin', slug => {
	cy.get( 'body' ).then( $body => {
		if ( $body.find( 'form[name="loginform"]' ) ) {
			cy.loginAdmin()
		}
	} )
	cy.visit( `/?activate-plugin=${ slug }` )
	cy.visit( `/wp-admin/` )
} )

/**
 * Command for clicking the block inserter button
 */
Cypress.Commands.add( 'toggleBlockInserterButton', () => {
	cy.get( '.edit-post-header-toolbar__inserter-toggle' ).click( { force: true } )
} )

/**
 * Command for adding a specific block in the inserter button.
 */
Cypress.Commands.add( 'addBlock', ( blockname = 'ugb/accordion' ) => {
	cy.toggleBlockInserterButton()
	const [ plugin, block ] = blockname.split( '/' )
	if ( plugin === 'core' ) {
		cy.get( `.block-editor-block-types-list>.block-editor-block-types-list__list-item>.editor-block-list-item-${ block }:first` ).click( { force: true } )
	} else {
		cy.get( `.block-editor-block-types-list>.block-editor-block-types-list__list-item>.editor-block-list-item-${ plugin }-${ block }:first` ).click( { force: true } )
	}
	return cy.get( `[data-type="${ blockname }"]` ).last()
} )

/**
 * Command for selecting a specific block.
 */
Cypress.Commands.add( 'selectBlock', ( subject, selector ) => {
	if ( selector && typeof selector === 'number' ) {
		cy.get( `.block-editor-block-list__layout>[data-type="${ subject }"]` ).eq( selector ).click( { force: true } )
	} else if ( selector && typeof selector === 'string' ) {
		cy.get( `.block-editor-block-list__layout>[data-type="${ subject }"]` ).contains( selector ).click( { force: true } )
	} else {
		cy.get( `.block-editor-block-list__layout>[data-type="${ subject }"]` ).last().click( { force: true } )
	}
} )

/**
 * Command for deleting a specific block.
 */
Cypress.Commands.add( 'deleteBlock', ( subject, selector ) => {
	cy.selectBlock( subject, selector )
	cy.get( 'button[aria-label="More options"]' ).first().click( { force: true } )
	cy.get( 'button' ).contains( 'Remove Block' ).click( { force: true } )
} )

/**
 * Command for opening the block inspectore of a block.
 */
Cypress.Commands.add( 'openInspector', ( subject, tab, selector ) => {
	cy.selectBlock( subject, selector )
	cy
		.get( 'button[aria-label="Settings"]' )
		.invoke( 'attr', 'aria-expanded' )
		.then( ariaExpanded => {
			if ( ariaExpanded === 'false' ) {
				cy
					.get( 'button[aria-label="Settings"]' )
					.click( { force: true } )
			}
		} )

	cy
		.get( `button[aria-label="${ tab } Tab"]` )
		.click( { force: true } )
} )

/**
 * Command for scrolling the sidebar panel to
 * a specific selector.
 */
Cypress.Commands.add( 'scrollSidebarToView', selector => {
	cy.document().then( doc => {
		const selectedEl = doc.querySelector( selector )
		if ( selectedEl ) {
			const { y } = selectedEl.getBoundingClientRect()
			if ( y ) {
				cy.get( '.interface-complementary-area' ).scrollTo( 0, y )
			}
		}
	} )
} )

/**
 * Command for scrolling the editor panel to
 * a specific selector.
 */
Cypress.Commands.add( 'scrollSidebarToView', selector => {
	cy.document().then( doc => {
		const selectedEl = doc.querySelector( selector )
		if ( selectedEl ) {
			const { y } = selectedEl.getBoundingClientRect()
			if ( y ) {
				cy.get( '.interface-interface-skeleton__content' ).scrollTo( 0, y )
			}
		}
	} )
} )

/**
 * Command for collapsing an accordion.
 */
Cypress.Commands.add( 'collapse', ( name = 'General' ) => {
	getActiveTab( tab => {
		cy
			.get( `.ugb-panel-${ tab }>.components-panel__body` )
			.contains( containsRegExp( name ) )
			.parentsUntil( `.ugb-panel-${ tab }>.components-panel__body` )
			.parent()
			.find( 'button.components-panel__body-toggle' )
			.invoke( 'attr', 'aria-expanded' )
			.then( ariaExpanded => {
				if ( ariaExpanded === 'false' ) {
					cy
						.get( `.ugb-panel-${ tab }>.components-panel__body` )
						.contains( containsRegExp( name ) )
						.parentsUntil( `.ugb-panel-${ tab }>.components-panel__body` )
						.parent()
						.find( 'button.components-panel__body-toggle' )
						.click( { force: true } )
				}
			} )
	} )
} )

/**
 * Command for enabling/disabling an
 * accordion.
 */
Cypress.Commands.add( 'toggleStyle', ( subject, name = 'Block Title', enabled = true ) => {
	cy.document().then( doc => {
		const kebabCaseName = kebabCase( name )
		const el = doc.querySelector( `.ugb-panel--${ kebabCaseName }>h2>button>span>.ugb-toggle-panel-form-toggle` )
		if ( el ) {
			if ( ( enabled && ! Array.from( el.classList ).includes( 'is-checked' ) ) || ( ! enabled && Array.from( el.classList ).includes( 'is-checked' ) ) ) {
				cy.scrollSidebarToView( `.ugb-panel--${ kebabCaseName }>h2>button>span>.ugb-toggle-panel-form-toggle>input` )
				cy.get( `.ugb-panel--${ kebabCaseName }>h2>button>span>.ugb-toggle-panel-form-toggle>input` ).click( { force: true } )
			}
		}
	} )
} )

/**
 * Command for enabling/disabling a toggle control.
 */
Cypress.Commands.add( 'toggleControl', ( name, value, options = {} ) => {
	const {
		isInPopover = false,
	} = options

	getActiveTab( tab => {
		getBaseControl( tab, isInPopover )
			.contains( containsRegExp( name ) )
			.parentsUntil( `.components-panel__body>.components-base-control` )
			.parent()
			.find( 'span.components-form-toggle' )
			.invoke( 'attr', 'class' )
			.then( classNames => {
				const parsedClassNames = classNames.split( ' ' )
				if ( ( value && ! parsedClassNames.includes( 'is-checked' ) ) || ( ! value && parsedClassNames.includes( 'is-checked' ) ) ) {
					getBaseControl( tab, isInPopover )
						.contains( containsRegExp( name ) )
						.parentsUntil( `.components-panel__body>.components-base-control` )
						.parent()
						.find( 'input' )
						.click( { force: true } )
				}
			} )
	} )
} )

/**
 * Command for adjusting the advanced range control.
 */
Cypress.Commands.add( 'rangeControl', ( name, value, options = {} ) => {
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
} )

/**
 * Command for resetting the advanced range control.
 */
Cypress.Commands.add( 'rangeControlReset', ( name, options = {} ) => {
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
} )

/**
 * Command for adjusting the toolbar control
 */
Cypress.Commands.add( 'toolbarControl', ( name, value, options = {} ) => {
	const {
		isInPopover = false,
		viewport = 'Desktop',
	} = options

	// Compatibility for default values
	const defaultValues = [
		'single',
	]

	if ( defaultValues.includes( value ) ) {
		value = ''
	}

	getActiveTab( tab => {
		changeResponsiveMode( viewport, name, tab, isInPopover )
		getBaseControl( tab, isInPopover )
			.contains( containsRegExp( name ) )
			.parentsUntil( `.components-panel__body>.components-base-control` )
			.parent()
			.find( `button[value="${ value }"]` )
			.click( { force: true } )
	} )
} )

/**
 * Command for adjusting the color picker
 */
Cypress.Commands.add( 'colorControl', ( name, value, options = {} ) => {
	const {
		isInPopover = false,
	} = options

	if ( typeof value === 'string' && value.match( /^#/ ) ) {
		// Use custom color.
		getActiveTab( tab => {
			getBaseControl( tab, isInPopover )
				.contains( containsRegExp( name ) )
				.parentsUntil( `.components-panel__body>.components-base-control` )
				.parent()
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
			getBaseControl( tab, isInPopover )
				.contains( containsRegExp( name ) )
				.parentsUntil( `.components-panel__body>.components-base-control` )
				.parent()
				.find( 'button' )
				.contains( containsRegExp( 'Custom color' ) )
				.click( { force: true } )
		} )
	} else if ( typeof value === 'number' ) {
		// Get the nth color in the color picker.
		getActiveTab( tab => {
			getBaseControl( tab, isInPopover )
				.contains( containsRegExp( name ) )
				.parentsUntil( `.components-panel__body>.components-base-control` )
				.parent()
				.find( 'button.components-circular-option-picker__option' )
				.eq( value - 1 )
				.click( { force: true } )
		} )
	}
} )

/**
 * Command for resetting the color picker.
 */
Cypress.Commands.add( 'colorControlClear', ( name, options = {} ) => {
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
			// We are adding an additional as sometimes click does not register.
			.click( { force: true, log: false } )
	} )
} )

/**
 * Command for adjusting the popover control.
 */
Cypress.Commands.add( 'popoverControl', ( name, value, options = {} ) => {
	options.isInPopover = true
	const clickPopoverButton = () => {
		getActiveTab( tab => {
			cy
				.get( `.ugb-panel-${ tab }>.components-panel__body>.components-base-control` )
				.contains( containsRegExp( name ) )
				.parentsUntil( '.components-panel__body>.components-base-control' )
				.parent()
				.find( 'button[aria-label="Edit"]' )
				.click( { force: true } )
		} )
	}

	// Open the popover button.
	clickPopoverButton()

	keys( value ).forEach( key => {
		cy.adjust( key, value[ key ], options )
	} )

	// Close the popover button.
	clickPopoverButton()
} )

/**
 * Command for resetting the popover control.
 */
Cypress.Commands.add( 'popoverControlReset', name => {
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
} )

/**
 * Command for adjusting the dropdown control.
 */
Cypress.Commands.add( 'dropdownControl', ( name, value, options = {} ) => {
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
} )

/**
 * Command for adjusting the auto suggestion control.
 */
Cypress.Commands.add( 'suggestionControl', ( name, value, options = {} ) => {
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
} )

/**
 * Command for resetting the auto suggestion control.
 */
Cypress.Commands.add( 'suggestionControlClear', ( name, options = {} ) => {
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
} )

/**
 * Command for adjusting the four range control.
 */
Cypress.Commands.add( 'fourRangeControl', ( name, value, options = {} ) => {
	const {
		isInPopover = false,
		viewport = 'Desktop',
		unit = '',
	} = options

	const clickLockButton = () => getActiveTab( tab => {
		getBaseControl( tab, isInPopover )
			.contains( containsRegExp( name ) )
			.parentsUntil( `.components-panel__body>.components-base-control` )
			.parent()
			.find( 'button.ugb-four-range-control__lock' )
			.click( { force: true } )
	} )

	if ( typeof value === 'number' ) {
		getActiveTab( tab => {
			changeResponsiveMode( viewport, name, tab, isInPopover )
			changeUnit( unit, name, tab, isInPopover )
			getBaseControl( tab, isInPopover )
				.contains( containsRegExp( name ) )
				.parentsUntil( `.components-panel__body>.components-base-control` )
				.parent()
				.find( 'input.components-input-control__input' )
				.type( `{selectall}${ value }` )
		} )
	} else if ( Array.isArray( value ) ) {
		getActiveTab( tab => {
			changeResponsiveMode( viewport, name, tab, isInPopover )
			changeUnit( unit, name, tab, isInPopover )
			getBaseControl( tab, isInPopover )
				.contains( containsRegExp( name ) )
				.parentsUntil( `.components-panel__body>.components-base-control` )
				.parent()
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
				getBaseControl( tab, isInPopover )
					.contains( containsRegExp( name ) )
					.parentsUntil( `.components-panel__body>.components-base-control` )
					.parent()
					.find( 'input.components-input-control__input' )
					.eq( index )
					.type( `{selectall}${ entry }`, { force: true } )
			} )
		} )
	}
} )

/**
 * Command for resetting the four range control.
 */
Cypress.Commands.add( 'fourRangeControlReset', ( name, options = {} ) => {
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
} )

/**
 * Command for adjusting settings.
 */
Cypress.Commands.add( 'adjust', ( name, value, options = {} ) => {
	const selector = () => cy
		.get( '.components-panel__body.is-opened>.components-base-control' )
		.contains( containsRegExp( name ) )
		.last()
		.parentsUntil( '.components-panel__body.is-opened>.components-base-control' )
		.parent()

	return selector()
		.invoke( 'attr', 'class' )
		.then( classNames => {
			const parsedClassNames = classNames.split( ' ' )

			const commandsBasedOnClassName = {
				 'components-toggle-control': 'toggleControl',
				 'ugb-advanced-range-control': 'rangeControl',
				 'ugb-advanced-toolbar-control': 'toolbarControl',
				 'editor-color-palette-control': 'colorControl',
				 'ugb-button-icon-control': 'popoverControl',
				 'ugb-advanced-autosuggest-control': 'suggestionControl',
				 'ugb-four-range-control': 'fourRangeControl',

				 // Custom selectors.
				 'ugb--help-tip-background-color-type': 'toolbarControl',
			}

			const executeCommand = key => {
				if ( parsedClassNames.includes( key ) ) {
					cy[ commandsBasedOnClassName[ key ] ]( name, value, options )
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
		} )
} )

/**
 * Command for resetting the style.
 */
Cypress.Commands.add( 'resetStyle', ( name, options = {} ) => {
	const selector = () => cy
		.get( '.components-panel__body.is-opened>.components-base-control' )
		.contains( containsRegExp( name ) )
		.last()
		.parentsUntil( '.components-panel__body.is-opened>.components-base-control' )
		.parent()

	return selector()
		.invoke( 'attr', 'class' )
		.then( classNames => {
			const parsedClassNames = classNames.split( ' ' )

			const commandsBasedOnClassName = {
				 'ugb-advanced-range-control': 'rangeControlReset',
				 'editor-color-palette-control': 'colorControlClear',
				 'ugb-button-icon-control': 'popoverControlReset',
				 'ugb-advanced-autosuggest-control': 'suggestionControlClear',
				 'ugb-four-range-control': 'fourRangeControlReset',
			}

			const executeCommand = key => {
				if ( parsedClassNames.includes( key ) ) {
					cy[ commandsBasedOnClassName[ key ] ]( name, options )
				}
			}

			keys( commandsBasedOnClassName ).forEach( executeCommand )
		} )
} )
