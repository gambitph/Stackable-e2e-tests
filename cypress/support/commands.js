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
import SELECTORS from './selectors/index'

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
 * Command for adding a specific ugb block in the inserter button.
 */
Cypress.Commands.add( 'addStackableBlock', ( blockname = 'accordion' ) => {
	cy.toggleBlockInserterButton()
	cy.get( `.block-editor-block-types-list>.block-editor-block-types-list__list-item>.editor-block-list-item-ugb-${ blockname }:first` ).click( { force: true } )
	return cy.get( `[data-type="ugb/${ blockname }"]` ).last()
} )

/**
 * Command for deleting a specific block.
 */
Cypress.Commands.add( 'removeBlock', subject => {
	cy.log( subject )
	cy.get( subject ).click( { force: true } )
	cy.get( `.components-button.components-dropdown-menu__toggle[aria-label="More options"]` ).click( { force: true } )
	cy.get( `button` ).contains( `Remove Block` ).click( { force: true } )
} )

/**
 * Command for opening the block inspectore of a block.
 */
Cypress.Commands.add( 'openInspector', ( subject, tab ) => {
	// We are only allowing chain wp-block elements to enter this command.
	if ( cy.get( subject ).should( 'have.class', 'wp-block' ) ) {
		cy.get( subject ).click( { force: true } )
		cy.document().then( doc => {
			if ( ! doc.querySelector( '.interface-complementary-area' ) ) {
				cy.get( 'button[aria-label="Settings"]' ).click( { force: true } )
			}
			if ( tab ) {
				const TABS = {
					layout: 'Layout',
					style: 'Style',
					advanced: 'Advanced',
				}

				cy.document().then( doc => {
					if ( ! doc.querySelector( `[data-label="${ TABS[ tab.toLowerCase() ] } Tab"]` ) ) {
						cy.get( '[data-label="Block"]' ).click( { force: true } )
					}
					cy.get( `[data-label="${ TABS[ tab.toLowerCase() ] } Tab"]` ).click( { force: true } )
				} )
			}
		} )
	}
	return cy.get( subject )
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
Cypress.Commands.add( 'collapse', ( subject, name = 'General' ) => {
	// We are only allowing chain wp-block elements to enter this command.
	if ( cy.get( subject ).should( 'have.class', 'wp-block' ) ) {
		const kebabCaseName = kebabCase( name )
		cy.document().then( doc => {
			const el = doc.querySelector( `.ugb-panel--${ kebabCaseName }>h2>button` )
			if ( el ) {
				if ( el.getAttribute( 'aria-expanded' ) === 'false' ) {
					cy.scrollSidebarToView( `.ugb-panel--${ kebabCaseName }>h2>button` )
					cy.get( `.ugb-panel--${ kebabCaseName }>h2>button` ).click( { force: true } )
				}
			}
		} )
	}
	return cy.get( subject )
} )

/**
 * Command for enabling/disabling an
 * accordion.
 */
Cypress.Commands.add( 'toggleStyle', ( subject, name = 'Block Title', enabled = true ) => {
	// We are only allowing chain wp-block elements to enter this command.
	if ( cy.get( subject ).should( 'have.class', 'wp-block' ) ) {
		cy.document().then( doc => {
			const kebabCaseName = kebabCase( name )
			const el = doc.querySelector( `.ugb-panel--${ kebabCaseName }>h2>button>span>.ugb-toggle-panel-form-toggle` )
			if ( el ) {
				if ( enabled === ! Array.from( el.classList ).includes( 'is-checked' ) ) {
					cy.scrollSidebarToView( `.ugb-panel--${ kebabCaseName }>h2>button>span>.ugb-toggle-panel-form-toggle>input` )
					cy.get( `.ugb-panel--${ kebabCaseName }>h2>button>span>.ugb-toggle-panel-form-toggle>input` ).click( { force: true } )
				}
			}
		} )
	}
	return cy.get( subject )
} )

/**
 * Command for changing the value in a checkbox control.
 */
Cypress.Commands.add( 'checkboxControl', ( selector, value ) => {
	cy.document().then( doc => {
		const spanIsCheckedElementIndicator = doc.querySelector( `${ selector }>div>span` )
		if ( spanIsCheckedElementIndicator ) {
			if ( value === ! Array.from( spanIsCheckedElementIndicator.classList ).includes( 'is-checked' ) ) {
				cy.get( `${ selector }>div>span>input` ).click( { force: true } )
			}
		}
	} )
} )

/**
 * Command for changing the value in a four range control.
 */
Cypress.Commands.add( 'fourRangeControl', ( selector, value ) => {
	cy.document().then( doc => {
		if ( typeof value === 'number' ) {
			// If the value is a string asign the value for all controls.
			const inputContainerSelector = `${ selector }>div>.ugb-four-range-control__range>div>div>.components-range-control>div>span>.components-number-control>div>input`
			const fourRangeControlInputContainer = doc.querySelector( inputContainerSelector )
			if ( fourRangeControlInputContainer ) {
				cy.get( inputContainerSelector ).type( `{selectall}${ value }` )
			}
		} else if ( Array.isArray( value ) ) {
			cy.get( `${ selector }>div>.ugb-base-control-multi-label>.ugb-base-control-multi-label__units>button` ).click( { force: true } )

			value.forEach( ( valueEntry = '', index ) => {
				const inputContainerSelector = `${ selector }>div>div:nth-child(${ index + 2 })>div>div>.components-range-control>div>span>div>div>input`
				cy.get( inputContainerSelector ).type( `{selectall}${ valueEntry }` )
			} )
		}
	} )
} )

/**
 * Command for changing the value in a range input control.
 */
Cypress.Commands.add( 'rangeInputControl', ( selector, value ) => {
	cy.document().then( doc => {
		const inputContainerSelector = `${ selector }>div>.components-range-control>div>span>.components-number-control>div>input`
		const rangeControlInputContainer = doc.querySelector( inputContainerSelector )
		if ( rangeControlInputContainer ) {
			cy.get( inputContainerSelector ).type( `{selectall}${ value }` )
		}
	} )
} )

/**
 * Command for changing the value in font family control.
 */
Cypress.Commands.add( 'fontFamilyControl', ( selector, value ) => {
	cy.document().then( doc => {
		const fontFamilyInputSelector = `${ selector }>div>.ugb-advanced-autosuggest-control__select>div>input`
		const fontFamilyInput = doc.querySelector( fontFamilyInputSelector )
		if ( fontFamilyInput ) {
			cy.get( fontFamilyInputSelector ).type( `{selectall}${ value }{enter}` )
		}
	} )
} )

/**
 * Command for changing the value in a buttongroup control.
 */
Cypress.Commands.add( 'buttonGroupControl', ( selector, value ) => {
	const buttonOptionsContainerSelector = `${ selector }>div>.components-button-group`
	cy.get( `${ buttonOptionsContainerSelector }>button[value="${ value }"]` ).click( { force: true } )
} )

/**
 * Command for changing the value in a color picker control.
 */
Cypress.Commands.add( 'colorPickerControl', ( selector, value ) => {
	cy.document().then( doc => {
		const colorPickerOptionsSelector = `${ selector }>div>.editor-color-palette-control__color-palette`
		const colorPickerOptions = doc.querySelector( colorPickerOptionsSelector )
		if ( colorPickerOptions ) {
			if ( ! value.match( /^#/ ) ) {
				// Pick a color in the color picker.
				cy.get( `${ colorPickerOptionsSelector }>div:nth-child(${ value })>button` ).click( { force: true } )
			} else {
				// Pick a custom color.
				cy.get( `${ colorPickerOptionsSelector }>.components-circular-option-picker__custom-clear-wrapper>div>button` ).click( { force: true } )
				cy.get( '.components-color-picker__inputs-field>div>input' ).type( `{selectall}${ value }{enter}` )
				cy.get( `${ colorPickerOptionsSelector }>.components-circular-option-picker__custom-clear-wrapper>div>button` ).click( { force: true } )
			}
		}
	} )
} )

/**
 * Command for changing the value in a dropdown control.
 */
Cypress.Commands.add( 'dropdownControl', ( selector, value ) => {
	cy.document().then( doc => {
		const dropdownContainerSelector = `${ selector }>div>select`
		const dropdownContainer = doc.querySelector( dropdownContainerSelector )
		if ( dropdownContainer ) {
			cy.get( dropdownContainerSelector ).select( value )
		}
	} )
} )

/**
 * General Commands in style tab.
 */
Cypress.Commands.add( 'adjustStyles', ( subject, options = {} ) => {
	//
	/**
	 * List of commands based on control type.
	 */
	const execCommands = {
		[ `checkbox` ]( selector, value ) {
			cy.checkboxControl( selector, value )
		},

		[ `range-control` ]( selector, value ) {
			cy.rangeInputControl( selector, value )
		},

		[ `four-range-control` ]( selector, value ) {
			cy.fourRangeControl( selector, value )
		},

		[ `button-group` ]( selector, value, option, optionEntry ) {
			// Compatibility for default values.
			if ( option === 'columnBackground' && optionEntry === 'backgroundType' ) {
				// Transform the 'single' value to empty string
				value = value === 'single' ? '' : value
			}
			cy.buttonGroupControl( selector, value )
		},

		[ `color-picker` ]( selector, value ) {
			cy.colorPickerControl( selector, value )
		},

		[ `font-family` ]( selector, value ) {
			cy.fontFamilyControl( selector, value )
		},

		[ `popover-settings` ]( selector, value, option, optionEntry ) {
			const buttonPopoverSelector = `${ selector }>div>div>button[aria-label="Edit"]`
			cy.get( buttonPopoverSelector ).click( { force: true } )

			keys( options[ option ][ optionEntry ] || {} ).forEach( entry => {
				const {
					type: childType = '',
					selector: childSelector = '',
				} = SELECTORS[ option ][ optionEntry ].childOptions[ entry ]
				const childValue = value[ entry ]

				cy.scrollSidebarToView( childSelector )
				this[ childType ]( `.components-popover__content>div>.components-panel__body>${ childSelector }`, childValue, option, entry )
			} )

			cy.get( buttonPopoverSelector ).click( { force: true } )
		},

		[ `dropdown` ]( selector, value, option, optionEntry ) {
			// Compatibility for default values.
			if ( option === 'columnBackground' && optionEntry === 'backgroundBlendMode' ) {
				if ( value === 'none' ) {
					value = ''
				}
			}
			cy.dropdownControl( selector, value )
		},
	}

	// We are only allowing chain wp-block elements to enter this command.
	if ( cy.get( subject ).should( 'have.class', 'wp-block' ) ) {
		keys( options ).forEach( option => {
			keys( options[ option ] ).forEach( optionEntry => {
				cy.document().then( doc => {
					const {
						type = '',
						selector = '',
					} = SELECTORS[ option ][ optionEntry ]
					const el = doc.querySelector( selector )

					if ( ! el ) {
						cy.collapse( subject, option )
					}
					cy.scrollSidebarToView( selector )
					// Execute commands based on selector, option, and optionEntry.
					execCommands[ type ]( selector, options[ option ][ optionEntry ], option, optionEntry )
				} )
			} )
		} )
	}

	return cy.get( subject )
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
