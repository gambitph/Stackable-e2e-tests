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
import { kebabCase, keys } from 'lodash'

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
Cypress.Commands.add( 'addUgbBlockInInserterButton', ( blockname = 'accordion' ) => {
	cy.toggleBlockInserterButton()
	cy.get( `.block-editor-block-types-list>.block-editor-block-types-list__list-item>.editor-block-list-item-ugb-${ blockname }:first` ).click( { force: true } )
	return cy.get( `[data-type="ugb/${ blockname }"]` ).last()
} )

/**
 * Command for typing in the block inserter textarea.
 */
Cypress.Commands.add( 'typeInInserterTextarea', ( input = '' ) => {
	cy.document().then( doc => {
		// Sometimes the textarea has to be clicked first before typing.
		if ( doc.querySelector( `.block-editor-default-block-appender` ) ) {
			cy.get( `textarea[aria-label="Add block"]` ).click( { force: true } )
		}
		cy.get( `p[aria-label="Empty block; start writing or type forward slash to choose a block"]` ).click( { force: true } ).type( input, { force: true } )
	} )
} )

/**
 * Command for adding a specific ugb block in the inserter textarea.
 */
Cypress.Commands.add( 'addUgbBlockInInserterTextarea', ( blockname = 'accordion' ) => {
	if ( blockname === 'feature' || blockname === 'icon' ) {
		cy.typeInInserterTextarea( `/${ blockname }{downarrow}{enter}` )
		return cy.get( `[data-type="ugb/${ blockname }"]` ).last()
	} else if ( blockname === 'text' ) {
		cy.typeInInserterTextarea( `/advanced-${ blockname }{downarrow}{enter}` )
		return cy.get( `[data-type="ugb/${ blockname }"]` ).last()
	}
	cy.typeInInserterTextarea( `/${ blockname }{enter}` )
	return cy.get( `[data-type="ugb/${ blockname }"]` ).last()
} )

/**
 * Command for deleting a specific block.
 */
Cypress.Commands.add( 'removeBlock', { prevSubject: 'element' }, subject => {
	cy.log( subject )
	cy.get( subject ).click( { force: true } )
	cy.get( `.components-button.components-dropdown-menu__toggle[aria-label="More options"]` ).click( { force: true } )
	cy.get( `button` ).contains( `Remove Block` ).click( { force: true } )
} )

/**
 * Command for opening the block inspectore of a block.
 */
Cypress.Commands.add( 'openInspector', { prevSubject: 'element' }, ( subject, tab ) => {
	// We are only allowing chain wp-block elements to enter this command.
	if ( cy.get( subject ).should( 'have.class', 'wp-block' ) ) {
		cy.get( subject ).click( { force: true } )
		cy.document().then( doc => {
			if ( ! doc.querySelector( '.interface-interface-skeleton__sidebar' ) ) {
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
Cypress.Commands.add( 'collapse', { prevSubject: 'element' }, ( subject, name = 'General' ) => {
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
Cypress.Commands.add( 'toggleStyle', { prevSubject: 'element' }, ( subject, name = 'Block Title', enabled = true ) => {
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
 * DOM Selector for each options in the block
 * inspector.
 */
const CONTROLS = {
	general: {
		closeAdjacentOnOpen: {
			type: 'checkbox',
			selector: '.ugb--help-tip-accordion-adjacent-open',
		},
		openAtTheStart: {
			type: 'checkbox',
			selector: '.ugb--help-tip-accordion-open-start',
		},
		reverseArrow: {
			type: 'checkbox',
			selector: '.ugb--help-tip-accordion-reverse-arrow',
		},
		borderRadius: {
			type: 'range-control',
			selector: '.ugb--help-tip-general-border-radius',
		},
		shadowOutline: {
			type: 'range-control',
			selector: '.ugb--help-tip-general-shadow',
		},
		align: {
			type: 'button-group',
			selector: '.ugb--help-tip-alignment-all',
		},
	},
	columnBackground: {
		backgroundType: {
			type: 'button-group',
			selector: '.ugb--help-tip-background-color-type>div>div',
		},
		backgroundColor1: {
			type: 'color-picker',
			selector: '.ugb--help-tip-background-color1',
		},
		backgroundColor2: {
			type: 'color-picker',
			selector: '.ugb--help-tip-background-color2',
		},
		gradientSettings: {
			type: 'popover-settings',
			selector: '.ugb--help-tip-gradient-color-settings',
			childOptions: {
				gradientDirection: {
					type: 'range-control',
					selector: '.ugb--help-tip-gradient-direction',
				},
				color1Location: {
					type: 'range-control',
					selector: '.ugb--help-tip-gradient-location1',
				},
				color2Location: {
					type: 'range-control',
					selector: '.ugb--help-tip-gradient-location2',
				},
				backgroundBlendMode: {
					type: 'dropdown',
					selector: '.ugb--help-tip-background-blend-mode',
				},
			},
		},
		// TODO: Background Image or Video
	},
	title: {
		typography: {
			type: 'popover-settings',
			selector: '.ugb--help-tip-typography',
			childOptions: {
				fontFamily: {
					type: 'font-family',
					selector: '.ugb--help-tip-typography-family',
				},
				fontSize: {
					type: 'range-control',
					selector: '.ugb--help-tip-typography-size',
				},
				fontWeight: {
					type: 'dropdown',
					selector: '.ugb--help-tip-typography-weight',
				},
				fontTransform: {
					type: 'dropdown',
					selector: '.ugb--help-tip-typography-transform',
				},
				lineHeight: {
					type: 'range-control',
					selector: '.ugb--help-tip-typography-line-height',
				},
				letterSpacing: {
					type: 'range-control',
					selector: '.ugb--help-tip-typography-letter-spacing',
				},
			},
		},
		fontSize: {
			type: 'range-control',
			selector: '.ugb--help-tip-typography-size',
		},
		htmlTag: {
			type: 'button-group',
			selector: '.ugb--help-tip-typography-html-tag',
		},
		titleColor: {
			type: 'color-picker',
			selector: '.ugb--help-tip-title-color',
		},
		titleAlign: {
			type: 'button-group',
			selector: '.ugb--help-tip-alignment-title',
		},
	},

	// Accordion Option.
	arrow: {
		size: {
			type: 'range-control',
			selector: '.ugb--help-tip-arrow-size',
		},
		color: {
			type: 'color-picker',
			selector: '.ugb--help-tip-accordion-arrow-color',
		},
	},

	spacing: {
		padding: {
			type: 'range-control',
			selector: '.ugb--help-tip-spacing-padding>div>.ugb-four-range-control__range>div',
		},
		title: {
			type: 'range-control',
			selector: '.ugb--help-tip-spacing-title',
		},
	},
}

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
	// TODO: Add a fourRangeControl Handler here.
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
 * General Commands
 */
Cypress.Commands.add( 'adjustOptions', { prevSubject: 'element' }, ( subject, options = {} ) => {
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
				} = CONTROLS[ option ][ optionEntry ].childOptions[ entry ]
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
					} = CONTROLS[ option ][ optionEntry ]
					const el = doc.querySelector( selector )
					if ( ! el ) {
						cy.get( subject ).collapse( option )
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
