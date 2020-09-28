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
Cypress.Commands.add( 'collapse', ( subject, name = 'General', selector ) => {
	cy.openInspector( subject, 'Style', selector )
	cy
		.get( '.ugb-toggle-panel-body' )
		.contains( new RegExp( `^${ name.replace( /[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, '\\$&' ) }$` ) )
		.parentsUntil( '.ugb-toggle-panel-body' )
		.parent()
		.find( 'button.components-panel__body-toggle' )
		.invoke( 'attr', 'aria-expanded' )
		.then( ariaExpanded => {
			if ( ariaExpanded === 'false' ) {
				cy
					.get( '.ugb-toggle-panel-body' )
					.contains( new RegExp( `^${ name.replace( /[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, '\\$&' ) }$` ) )
					.parentsUntil( '.ugb-toggle-panel-body' )
					.parent()
					.find( 'button.components-panel__body-toggle' )
					.click( { force: true } )
			}
		} )
} )

/**
 * Command for enabling/disabling an
 * accordion.
 */
Cypress.Commands.add( 'toggleStyle', ( subject, name = 'Block Title', enabled = true, selector ) => {
	cy.openInspector( subject, 'Style', selector )
	cy.document().then( doc => {
		const kebabCaseName = kebabCase( name )
		const el = doc.querySelector( `.ugb-panel--${ kebabCaseName }>h2>button>span>.ugb-toggle-panel-form-toggle` )
		if ( el ) {
			if ( ( enabled && ! Array.from( el.classList ).includes( 'is-checked' ) ) || ( ! enabled && Array.from( el.classList ).includes( 'is-checked' ) ) ) {
				cy.log( 'here' )
				cy.scrollSidebarToView( `.ugb-panel--${ kebabCaseName }>h2>button>span>.ugb-toggle-panel-form-toggle>input` )
				cy.get( `.ugb-panel--${ kebabCaseName }>h2>button>span>.ugb-toggle-panel-form-toggle>input` ).click( { force: true } )
			}
		}
	} )
} )

/**
 * Command for enabling/disabling a toggle control.
 */
Cypress.Commands.add( 'toggleControl', ( name, value, isInPopover = false ) => {
	let baseControlEl = ! isInPopover ? cy.get( '.components-panel__body>.components-base-control' ) : cy.get( '.components-popover__content' ).find( '.components-base-control' )

	baseControlEl
		.contains( new RegExp( `^${ name.replace( /[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, '\\$&' ) }$` ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()
		.find( 'span.components-form-toggle' )
		.invoke( 'attr', 'class' )
		.then( classNames => {
			const parsedClassNames = classNames.split( ' ' )
			if ( ( value && ! parsedClassNames.includes( 'is-checked' ) ) || ( ! value && parsedClassNames.includes( 'is-checked' ) ) ) {
				baseControlEl = ! isInPopover ? cy.get( '.components-panel__body>.components-base-control' ) : cy.get( '.components-popover__content' ).find( '.components-base-control' )
				baseControlEl
					.contains( new RegExp( `^${ name.replace( /[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, '\\$&' ) }$` ) )
					.parentsUntil( '.components-panel__body>.components-base-control' )
					.parent()
					.find( 'input' )
					.click( { force: true } )
			}
		} )
} )

/**
 * Command for adjusting the advanced range control.
 */
Cypress.Commands.add( 'rangeControl', ( name, value, isInPopover = false ) => {
	const baseControlEl = ! isInPopover ? cy.get( '.components-panel__body>.components-base-control' ) : cy.get( '.components-popover__content' ).find( '.components-base-control' )

	baseControlEl
		.contains( new RegExp( `^${ name.replace( /[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, '\\$&' ) }$` ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()
		.find( 'input.components-input-control__input' )
		.type( `{selectall}${ value }` )
} )

/**
 * Command for adjusting the toolbar control
 */
Cypress.Commands.add( 'toolbarControl', ( name, value, isInPopover = false ) => {
	// Compatibility for default values
	const defaultValues = [
		'single',
	]

	if ( defaultValues.includes( value ) ) {
		value = ''
	}

	const baseControlEl = ! isInPopover ? cy.get( '.components-panel__body>.components-base-control' ) : cy.get( '.components-popover__content' ).find( '.components-base-control' )

	baseControlEl
		.contains( new RegExp( `^${ name.replace( /[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, '\\$&' ) }$` ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()
		.find( `button[value="${ value }"]` )
		.click( { force: true } )
} )

/**
 * Command for adjusting the color picker
 */
Cypress.Commands.add( 'colorControl', ( name, value, isInPopover = false ) => {
	let baseControlEl = ! isInPopover ? cy.get( '.components-panel__body>.components-base-control' ) : cy.get( '.components-popover__content' ).find( '.components-base-control' )

	if ( typeof value === 'string' && value.match( /^#/ ) ) {
		// Use custom color.
		baseControlEl
			.contains( new RegExp( `^${ name.replace( /[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, '\\$&' ) }$` ) )
			.parentsUntil( '.components-panel__body>.components-base-control' )
			.parent()
			.find( 'button' )
			.contains( 'Custom color' )
			.click( { force: true } )

		cy
			.get( '.components-popover__content' )
			.find( 'input[type="text"]' )
			.type( `{selectall}${ value }{enter}` )

		// Declare the variable again
		baseControlEl = ! isInPopover ? cy.get( '.components-panel__body>.components-base-control' ) : cy.get( '.components-popover__content' ).find( '.components-base-control' )

		baseControlEl
			.contains( new RegExp( `^${ name.replace( /[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, '\\$&' ) }$` ) )
			.parentsUntil( '.components-panel__body>.components-base-control' )
			.parent()
			.find( 'button' )
			.contains( 'Custom color' )
			.click( { force: true } )
	} else if ( typeof value === 'number' ) {
		// Get the nth color in the color picker.
		baseControlEl
			.contains( new RegExp( `^${ name.replace( /[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, '\\$&' ) }$` ) )
			.parentsUntil( '.components-panel__body>.components-base-control' )
			.parent()
			.find( 'button.components-circular-option-picker__option' )
			.eq( value - 1 )
			.click( { force: true } )
	}
} )

/**
 * Command for adjusting the popover control.
 */
Cypress.Commands.add( 'popoverControl', ( name, value ) => {
	cy
		.get( '.components-panel__body>.components-base-control' )
		.contains( new RegExp( `^${ name.replace( /[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, '\\$&' ) }$` ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()
		.find( 'button[aria-label="Edit"]' )
		.click( { force: true } )

	keys( value ).forEach( key => {
		cy.adjustStyle( key, value[ key ], true )
	} )

	cy
		.get( '.components-panel__body>.components-base-control' )
		.contains( new RegExp( `^${ name.replace( /[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, '\\$&' ) }$` ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()
		.find( 'button[aria-label="Edit"]' )
		.click( { force: true } )
} )

/**
 * Command for adjusting the dropdown control.
 */
Cypress.Commands.add( 'dropdownControl', ( name, value, isInPopover = false ) => {
	// Compatibility for default values
	const defaultValues = [
		'none',
	]

	if ( defaultValues.includes( value ) ) {
		value = ''
	}

	const baseControlEl = ! isInPopover ? cy.get( '.components-panel__body>.components-base-control' ) : cy.get( '.components-popover__content' ).find( '.components-base-control' )

	baseControlEl
		.contains( new RegExp( `^${ name.replace( /[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, '\\$&' ) }$` ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()
		.find( 'select' )
		.select( value, { force: true } )
} )

/**
 * Command for adjusting the auto suggestion control.
 */
Cypress.Commands.add( 'suggestionControl', ( name, value, isInPopover = false ) => {
	const baseControlEl = ! isInPopover ? cy.get( '.components-panel__body>.components-base-control' ) : cy.get( '.components-popover__content' ).find( '.components-base-control' )

	baseControlEl
		.contains( new RegExp( `^${ name.replace( /[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, '\\$&' ) }$` ) )
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()
		.find( 'input' )
		.type( `{selectall}${ value }{enter}` )
} )

/**
 * Command for adjusting settings in styles tab
 */
Cypress.Commands.add( 'adjustStyle', ( name, value, isInPopover = false ) => {
	cy
		.get( '.components-panel__body>.components-base-control' )
		.contains( new RegExp( `^${ name.replace( /[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, '\\$&' ) }$` ) )
		.last()
		.parentsUntil( '.components-panel__body>.components-base-control' )
		.parent()
		.invoke( 'attr', 'class' )
		.then( classNames => {
			cy.log( classNames )
			const parsedClassNames = classNames.split( ' ' )

			const commandsBasedOnClassName = {
				 'components-toggle-control': 'toggleControl',
				 'ugb-advanced-range-control': 'rangeControl',
				 'ugb-advanced-toolbar-control': 'toolbarControl',
				 'editor-color-palette-control': 'colorControl',
				 'ugb-button-icon-control': 'popoverControl',
				 'ugb-advanced-autosuggest-control': 'suggestionControl',

				 // Custom selectors.
				 'ugb--help-tip-background-color-type': 'toolbarControl',
				 'ugb--help-tip-background-blend-mode': 'dropdownControl',
				 'ugb--help-tip-typography-weight': 'dropdownControl',
				 'ugb--help-tip-typography-transform': 'dropdownControl',
			}

			keys( commandsBasedOnClassName ).forEach( key => {
				if ( parsedClassNames.includes( key ) ) {
					cy[ commandsBasedOnClassName[ key ] ]( name, value, isInPopover )
				}
			} )
		} )
} )

// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
