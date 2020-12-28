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
	kebabCase, keys, camelCase, findIndex, startCase,
} from 'lodash'

/**
 * Internal dependencies
 */
import './wait-until'
import {
	getBaseControl, containsRegExp, getActiveTab, changeResponsiveMode, changeUnit, waitLoader, rgbToHex, getAddresses,
} from './util'

Cypress.Commands.add( 'setupWP', ( args = {} ) => {
	const params = new URLSearchParams( {
		plugins: args.plugins || [],
		setup: true,
	} )
	cy.visit( '/?' + params.toString() )
	cy.loginAdmin()
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
	cy.visit( '/wp-admin/post-new.php?post_type=page' )
	cy.hideAnyGutenbergTip()
} )

Cypress.Commands.add( 'deactivatePlugin', slug => {
	cy.get( 'body' ).then( $body => {
		if ( $body.find( 'form[name="loginform"]' ).length ) {
			// Login user if still not logged in.
			cy.loginAdmin()
		}
	} )
	cy.visit( `/?deactivate-plugin=${ slug }` )
	cy.visit( `/wp-admin/` )
} )

Cypress.Commands.add( 'activatePlugin', slug => {
	cy.get( 'body' ).then( $body => {
		if ( $body.find( 'form[name="loginform"]' ).length ) {
			// Login user if still not logged in.
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
	// Click the adder button located at the upper left part of the screen.
	cy.get( '.edit-post-header-toolbar__inserter-toggle' ).click( { force: true } )
} )

/**
 * Command for adding a specific block in the inserter button.
 */
Cypress.Commands.add( 'addBlock', ( blockname = 'ugb/accordion' ) => {
	cy.toggleBlockInserterButton()
	const [ plugin, block ] = blockname.split( '/' )
	if ( plugin === 'core' ) {
		// core blocks have different selector buttons.
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
		// Select a specific block based on nth position (base zero).
		cy.get( `.block-editor-block-list__layout>[data-type="${ subject }"]` ).eq( selector ).click( { force: true } )
	} else if ( selector && typeof selector === 'string' ) {
		// Select a selector based on text input inside
		cy.get( `.block-editor-block-list__layout>[data-type="${ subject }"]` ).contains( containsRegExp( selector ) ).click( { force: true } )
	} else {
		// Otherwise, just select the last matched block.
		cy.get( `.block-editor-block-list__layout>[data-type="${ subject }"]` ).last().click( { force: true } )
	}
} )

/**
 * Command for asserting the computed style of a block.
 */
Cypress.Commands.add( 'assertComputedStyle', { prevSubject: 'element' }, ( subject, cssObject = {}, options = {} ) => {
	const {
		assertFrontend = true,
	} = options

	const assertComputedStyle = ( win, element, cssRule, expectedValue ) => {
		let computedStyle = win.getComputedStyle( element )[ camelCase( cssRule ) ]
		if ( typeof computedStyle === 'string' && computedStyle.match( /rgb\(/ ) ) {
			// Force rgb computed style to be hex.
			computedStyle = rgbToHex( computedStyle )
		}
		expect( computedStyle ).toBe( expectedValue )
	}

	getActiveTab( tab => {
		cy.document().then( doc => {
			const activePanel = doc.querySelector( 'button.components-panel__body-toggle[aria-expanded="true"]' ).innerText
			cy
				.get( subject )
				.find( '.ugb-main-block' )
				.invoke( 'attr', 'class' )
				.then( classList => {
					const parsedClassList = classList.split( ' ' ).map( className => `.${ className }` ).join( '' )
					keys( cssObject ).forEach( selector => {
						cy
							.get( `.is-selected${ ` ${ selector }` }` )
							.then( $block => {
								cy.window().then( win => {
									keys( cssObject[ selector ] ).forEach( cssRule => {
										assertComputedStyle( win, $block[ 0 ], cssRule, cssObject[ selector ][ cssRule ] )
									} )
								} )
							} )
					} )

					if ( assertFrontend ) {
						cy.publish()
						getAddresses( ( { currUrl, previewUrl } ) => {
							cy.visit( previewUrl )

							cy.window().then( frontendWindow => {
								cy.document().then( frontendDocument => {
									keys( cssObject ).forEach( selector => {
										const willAssertElement = frontendDocument.querySelector( `${ parsedClassList } ${ selector }` )
										if ( willAssertElement ) {
											keys( cssObject[ selector ] ).forEach( cssRule => {
												assertComputedStyle( frontendWindow, willAssertElement, cssRule, cssObject[ selector ][ cssRule ] )
											} )
										}
									} )
								} )
							} )

							cy.visit( currUrl )

							cy
								.get( parsedClassList )
								.click( { force: true } )

							cy.openSidebar( 'Settings' )

							cy
								.get( `button[aria-label="${ startCase( tab ) } Tab"]` )
								.click( { force: true } )

							cy.collapse( activePanel )
						}
						)
					}
				} )
		} )
	} )
} )

/**
 * Command for typing in blocks
 */
Cypress.Commands.add( 'typeBlock', ( subject, contentSelector = '', content = '', customSelector = '' ) => {
	const block = cy.selectBlock( subject, customSelector )
	if ( contentSelector ) {
		block
			.find( contentSelector )
			.click( { force: true } )
			.type( `{selectall}${ content }`, { force: true } )
			.then( $element => {
				expect( $element ).to.contain( content )
			} )
	} else {
		block
			.click( { force: true } )
			.type( `{selectall}${ content }`, { force: true } )
			.then( $element => {
				if ( content[ 0 ] !== '/' ) {
					expect( $element ).to.contain( content )
				}
			} )
	}
	if ( content[ 0 ] !== '/' ) {
		cy.selectBlock( subject, customSelector )
	}
} )

/**
 * Command for asserting the included classNames.
 */
Cypress.Commands.add( 'assertClassName', { prevSubject: 'element' }, ( subject, customSelector = '', expectedValue = '' ) => {
	cy
		.get( subject )
		.invoke( 'attr', 'id' )
		.then( id => {
			const block = cy.get( `#${ id }${ ` ${ customSelector }` || `` }` )
			block
				.invoke( 'attr', 'class' )
				.then( $classNames => {
					const parsedClassNames = $classNames.split( ' ' )
					expect( parsedClassNames.includes( expectedValue ) ).toBe( true )
				} )
		} )
} )

/**
 * Command for changing the preview mode.
 */
Cypress.Commands.add( 'changePreviewMode', ( mode = 'Desktop' ) => {
	cy
		.get( 'button' )
		.contains( containsRegExp( 'Preview' ) )
		.invoke( 'attr', 'aria-expanded' )
		.then( $ariaExpanded => {
			if ( $ariaExpanded === 'false' ) {
				cy
					.get( 'button' )
					.contains( containsRegExp( 'Preview' ) )
					.click( { force: true } )
			}

			cy
				.get( 'button.block-editor-post-preview__button-resize' )
				.contains( containsRegExp( mode ) )
				.click( { force: true } )
		} )
} )

/**
 * Command for deleting a specific block.
 */
Cypress.Commands.add( 'deleteBlock', ( subject, selector ) => {
	cy.selectBlock( subject, selector )
	cy.get( 'button[aria-label="More options"]' ).first().click( { force: true } )
	cy.get( 'button' ).contains( 'Remove block' ).click( { force: true } )
} )

/**
 * Command for opening a sidebar button.
 */
Cypress.Commands.add( 'openSidebar', ( label = 'Settings' ) => {
	cy
		.get( `button[aria-label="${ label }"]` )
		.invoke( 'attr', 'aria-expanded' )
		.then( ariaExpanded => {
			// Open the inspector first if not visible.
			if ( ariaExpanded === 'false' ) {
				cy
					.get( `button[aria-label="${ label }"]` )
					.click( { force: true } )
			}
		} )
} )

/**
 * Command for opening the block inspectore of a block.
 */
Cypress.Commands.add( 'openInspector', ( subject, tab, selector ) => {
	cy.selectBlock( subject, selector )
	cy.openSidebar( 'Settings' )

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
Cypress.Commands.add( 'scrollEditorToView', selector => {
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
Cypress.Commands.add( 'collapse', ( name = 'General', toggle = true ) => {
	cy
		.document()
		.then( doc => {
			const globalSettingsElement = doc.querySelector( '.ugb-global-settings__inspector' )

			if ( globalSettingsElement ) {
				cy
					.get( 'button.components-panel__body-toggle' )
					.contains( containsRegExp( name ) )
					.invoke( 'attr', 'aria-expanded' )
					.then( ariaExpanded => {
						if ( ariaExpanded !== toggle.toString() ) {
							cy
								.get( 'button.components-panel__body-toggle' )
								.contains( containsRegExp( name ) )
								.click( { force: true } )
						}
					} )
			} else {
				getActiveTab( tab => {
					cy
						.get( `.ugb-panel-${ tab }>.components-panel__body` )
						.contains( containsRegExp( name ) )
						.parentsUntil( `.ugb-panel-${ tab }>.components-panel__body` )
						.parent()
						.find( 'button.components-panel__body-toggle' )
						.invoke( 'attr', 'aria-expanded' )
						.then( ariaExpanded => {
							// Open the accordion if aria-expanded is false.
							if ( ariaExpanded !== toggle.toString() ) {
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
			}
		} )
} )

/**
 * Command for enabling/disabling an
 * accordion.
 */
Cypress.Commands.add( 'toggleStyle', ( name = 'Block Title', enabled = true ) => {
	cy.document().then( doc => {
		const kebabCaseName = kebabCase( name )
		const el = doc.querySelector( `.ugb-panel--${ kebabCaseName }>h2>button>span>.ugb-toggle-panel-form-toggle` )
		if ( el ) {
			// Click the checkbox if necessary. Otherwise, don't check the checkbox.
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
		'single', // Default value for column background type.
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
 * Command for adjusting the design control.
 * Mainly used for top and bottom separator modules.
 */
Cypress.Commands.add( 'designControl', ( name, value, options = {} ) => {
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
} )

/**
 * Command for adjusting the color picker
 */
Cypress.Commands.add( 'colorControl', ( name, value, options = {} ) => {
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
			// We are adding an additional click as sometimes click does not register.
			.click( { force: true, log: false } )
	} )
} )

/**
 * Command for adjusting the popover control.
 */
Cypress.Commands.add( 'popoverControl', ( name, value = {} ) => {
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

				cy.adjust( key, childValue, {
					viewport, unit, isInPopover: true,
				} )
			} else {
				cy.adjust( key, value[ key ], { isInPopover: true } )
			}
		} )

		// Close the popover button.
		clickPopoverButton()
	} else if ( typeof value === 'boolean' ) {
		// In some cases, a popover control has an input checkbox.
		getActiveTab( tab => {
			cy
				.get( `.ugb-panel-${ tab }>.components-panel__body>.components-base-control` )
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
 * Command for adjusting the icon control.
 */
Cypress.Commands.add( 'iconControl', ( name, value, options = {} ) => {
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
} )

/**
 * Command for resetting the icon control.
 */
Cypress.Commands.add( 'iconControlReset', ( name, options = {} ) => {
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

	// Always return the selected block which will be used in functions that require chained wp-block elements.
	return cy.get( '.block-editor-block-list__block.is-selected' )
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
} )

/**
 * Command for publishing a page.
 */
Cypress.Commands.add( 'publish', () => {
	const selector = () => cy
		.get( 'button.editor-post-publish-button__button' )

	selector()
		.invoke( 'attr', 'aria-disabled' )
		.then( ariaDisabled => {
			if ( ariaDisabled === 'false' ) {
				selector()
					.click( { force: true } )
			}

			cy
				.get( '.interface-interface-skeleton__actions' )
				.then( $actions => {
					//
					/**
					 * Click the publish button in publish panel
					 * when necessary.
					 */
					if ( $actions.find( '.editor-post-publish-panel' ).length ) {
						cy
							.get( '.editor-post-publish-panel' )
							.contains( containsRegExp( 'Publish' ) )
							.click( { force: true } )

						if ( $actions.find( 'button[aria-label="Close panel"]' ).length ) {
							cy
								.get( 'button[aria-label="Close panel"]' )
								.click( { force: true } )
						}
					}

					cy.wait( 1000 )
				} )
		} )
} )

/**
 * Command for changing the layout of the block.
 */
Cypress.Commands.add( 'adjustLayout', ( option = '' ) => {
	cy
		.get( '.ugb-design-control-wrapper' )
		.find( `input[value="${ kebabCase( option ) }"]` )
		.click( { force: true } )
} )

/**
 * Command for changing the design of the block.
 */
Cypress.Commands.add( 'adjustDesign', ( option = '' ) => {
	cy
		.get( '.ugb-design-library-items' )
		.find( '.ugb-design-library-item' )
		.contains( containsRegExp( option ) )
		.parentsUntil( '.ugb-design-library-item' )
		.parent()
		.find( 'button' )
		.click( { force: true } )
} )

/**
 * Command for adding a global color in Stackable Settings.
 */
Cypress.Commands.add( 'addGlobalColor', ( options = {} ) => {
	const {
		name = '',
		color = '',
	} = options

	cy.openSidebar( 'Stackable Settings' )
	cy.collapse( 'Global Color Palette' )

	cy
		.get( '.components-panel__body-toggle' )
		.contains( containsRegExp( 'Global Color Palette' ) )
		.invoke( 'attr', 'aria-expanded' )
		.then( ariaExpanded => {
			if ( ariaExpanded === 'false' ) {
				cy
					.get( 'button' )
					.contains( containsRegExp( 'Global Color Palette' ) )
					.click( { force: true } )
			}

			cy
				.get( 'button[aria-label="Add New Color"]' )
				.click( { force: true } )
				.then( () => {
					// Type the color if defined.
					if ( color ) {
						cy
							.get( '.components-color-picker__inputs-field' )
							.contains( containsRegExp( 'Color value in hexadecimal' ) )
							.parentsUntil( '.components-color-picker__inputs-field' )
							.find( 'input' )
							.click( { force: true } )
							.type( `{selectall}${ color }{enter}` )
					}

					// Type the name if defined.
					if ( name ) {
						cy
							.get( '.components-color-picker__input-field' )
							.contains( containsRegExp( 'Style name' ) )
							.parentsUntil( '.components-color-picker__input-field' )
							.find( 'input' )
							.click( { force: true } )
							.type( `{selectall}${ name }{enter}` )
					}

					// Click outside the popover to close it.
					cy
						.get( '.ugb-global-settings-color-picker' )
						.click( { force: true } )
				} )
		} )
} )

/**
 * Command for resetting the global color palette.
 */
Cypress.Commands.add( 'resetGlobalColor', () => {
	cy.openSidebar( 'Stackable Settings' )
	cy.collapse( 'Global Color Palette' )

	const selector = () => cy
		.get( '.ugb-global-settings-color-picker__reset-button' )
		.find( 'button' )

	selector()
		.invoke( 'attr', 'disabled' )
		.then( $disabled => {
			if ( typeof $disabled === 'undefined' ) {
				selector()
					.click( { force: true } )

				/**
				 * Click the cconfirmation reset button.
				 */
				cy
					.get( '.components-button-group' )
					.find( 'button' )
					.contains( 'Reset' )
					.click( { force: true } )
			}
		} )
} )

/**
 * Command for deleting a global color in Stackable Settings.
 */
Cypress.Commands.add( 'deleteGlobalColor', ( selector = 0 ) => {
	cy.openSidebar( 'Stackable Settings' )
	cy.collapse( 'Global Color Palette' )

	if ( typeof selector === 'number' ) {
		// Delete a global color by index number.
		cy
			.get( '.components-circular-option-picker__option-wrapper' )
			.eq( selector )
			.find( 'button' )
			.click( { force: true } )
	} else if ( typeof selector === 'string' ) {
		// Delete a global color by name.
		cy
			.get( '.components-circular-option-picker__option-wrapper' )
			.find( `button[aria-label="${ selector }"]` )
			.click( { force: true } )
	}

	cy
		.get( 'button' )
		.contains( containsRegExp( 'Delete color' ) )
		.click( { force: true } )

	// Delete the confirm Delete button.
	cy
		.get( 'button' )
		.contains( containsRegExp( 'Delete' ) )
		.click( { force: true } )
} )

/**
 * Command for adjusting the global typography in Stackable Settings.
 */
Cypress.Commands.add( 'adjustGlobalTypography', ( selector = 'h1', options = {} ) => {
	const globalTypographyOptions = [
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'p',
	]

	cy.openSidebar( 'Stackable Settings' )
	cy.collapse( 'Global Typography' )

	const clickEditButton = () => cy
		.get( '.ugb-global-settings-typography-control' )
		.eq( findIndex( globalTypographyOptions, value => value === selector ) )
		.find( 'button[aria-label="Edit"]' )
		.click( { force: true } )

	cy
		.get( '.components-panel__body-toggle' )
		.contains( containsRegExp( 'Global Typography' ) )
		.invoke( 'attr', 'aria-expanded' )
		.then( ariaExpanded => {
			if ( ariaExpanded === 'false' ) {
				cy
					.get( '.components-panel__body-toggle' )
					.contains( containsRegExp( 'Global Typography' ) )
					.click( { force: true } )
			}

			clickEditButton()

			keys( options ).forEach( key => {
				// If the an option entry is an object, get the value, viewport, and unit property to be passed
				// in adjust function.
				if ( typeof options[ key ] === 'object' && ! Array.isArray( options[ key ] ) ) {
					const {
						viewport = 'Desktop',
						unit = '',
						value = '',
					} = options[ key ]

					cy.adjust( key, value, {
						viewport, unit, isInPopover: true,
					} )
				} else {
					cy.adjust( key, options[ key ], { isInPopover: true } )
				}
			} )

			clickEditButton()
		} )
} )

/**
 * Command for resetting the global typogragpy style.
 */
Cypress.Commands.add( 'resetGlobalTypography', ( selector = 'h1' ) => {
	const globalTypographyOptions = [
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'p',
	]

	cy.openSidebar( 'Stackable Settings' )
	cy.collapse( 'Global Typography' )

	// Click the reset button.
	cy
		.get( '.ugb-global-settings-typography-control' )
		.eq( findIndex( globalTypographyOptions, value => value === selector ) )
		.find( 'button[aria-label="Reset"]' )
		.click( { force: true } )

	// Click the confirmation reset button.
	cy
		.get( '.components-button-group' )
		.find( 'button' )
		.contains( 'Reset' )
		.click( { force: true } )
} )

/**
 * Command for changing the icon in icon block.
 */
Cypress.Commands.add( 'changeIcon', ( selector, index = 1, keyword = '', icon ) => {
	cy.selectBlock( 'ugb/icon', selector )
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
} )

/**
 * Command for asserting an error due to
 * plugin activation.
 */
Cypress.Commands.add( 'assertPluginError', () => {
	cy.get( '.xdebug-error' ).should( 'not.exist' )
} )
