import './styles'
import './global-settings'

/**
 * External dependencies
 */
import {
	kebabCase, keys, camelCase, startCase,
} from 'lodash'

/**
 * Internal dependencies
 */
import '../wait-until'
import {
	containsRegExp, getActiveTab, waitLoader, rgbToHex, getAddresses,
} from '../util'

Cypress.Commands.add( 'setupWP', setupWP )
Cypress.Commands.add( 'loginAdmin', loginAdmin )
Cypress.Commands.add( 'hideAnyGutenbergTip', hideAnyGutenbergTip )
Cypress.Commands.add( 'newPage', newPage )
Cypress.Commands.add( 'deactivatePlugin', deactivatePlugin )
Cypress.Commands.add( 'activatePlugin', activatePlugin )
Cypress.Commands.add( 'toggleBlockInserterButton', toggleBlockInserterButton )
Cypress.Commands.add( 'addBlock', addBlock )
Cypress.Commands.add( 'selectBlock', selectBlock )
Cypress.Commands.add( 'assertComputedStyle', { prevSubject: 'element' }, assertComputedStyle )
Cypress.Commands.add( 'typeBlock', typeBlock )
Cypress.Commands.add( 'assertClassName', { prevSubject: 'element' }, assertClassName )
Cypress.Commands.add( 'changePreviewMode', changePreviewMode )
Cypress.Commands.add( 'deleteBlock', deleteBlock )
Cypress.Commands.add( 'openSidebar', openSidebar )
Cypress.Commands.add( 'openInspector', openInspector )
Cypress.Commands.add( 'scrollSidebarToView', scrollSidebarToView )
Cypress.Commands.add( 'scrollEditorToView', scrollEditorToView )
Cypress.Commands.add( 'collapse', collapse )
Cypress.Commands.add( 'toggleStyle', toggleStyle )
Cypress.Commands.add( 'publish', publish )
Cypress.Commands.add( 'adjustLayout', adjustLayout )
Cypress.Commands.add( 'adjustDesign', adjustDesign )
Cypress.Commands.add( 'changeIcon', changeIcon )
Cypress.Commands.add( 'assertPluginError', assertPluginError )
Cypress.Commands.add( 'appendBlock', appendBlock )

export function setupWP( args = {} ) {
	const params = new URLSearchParams( {
		plugins: args.plugins || [],
		setup: true,
	} )
	cy.visit( '/?' + params.toString() )
	loginAdmin()
}

export function loginAdmin() {
	cy.visit( '/wp-login.php' )
	cy.get( '#user_login' ).clear().type( 'admin' )
	cy.get( '#user_pass' ).clear().type( 'admin' )
	cy.get( '#loginform' ).submit()
}

export function hideAnyGutenbergTip() {
	cy.get( 'body' ).then( $body => {
		if ( $body.find( '.edit-post-welcome-guide' ).length ) {
			cy.get( '.edit-post-welcome-guide button:eq(0)' ).click()
		}
	} )
}

export function newPage() {
	cy.visit( '/wp-admin/post-new.php?post_type=page' )
	hideAnyGutenbergTip()
}

export function deactivatePlugin( slug ) {
	cy.get( 'body' ).then( $body => {
		if ( $body.find( 'form[name="loginform"]' ).length ) {
			// Login user if still not logged in.
			loginAdmin()
		}
	} )
	cy.visit( `/?deactivate-plugin=${ slug }` )
	cy.visit( `/wp-admin/` )
}

export function activatePlugin( slug ) {
	cy.get( 'body' ).then( $body => {
		if ( $body.find( 'form[name="loginform"]' ).length ) {
			// Login user if still not logged in.
			loginAdmin()
		}
	} )
	cy.visit( `/?activate-plugin=${ slug }` )
	cy.visit( `/wp-admin/` )
}

/**
 * Command for clicking the block inserter button
 */
export function toggleBlockInserterButton() {
	// Click the adder button located at the upper left part of the screen.
	cy.get( '.edit-post-header-toolbar__inserter-toggle' ).click( { force: true } )
}

/**
 * Command for adding a specific block in the inserter button.
 *
 * @param {string} blockname
 */
export function addBlock( blockname = 'ugb/accordion' ) {
	toggleBlockInserterButton()
	const [ plugin, block ] = blockname.split( '/' )
	if ( plugin === 'core' ) {
		// core blocks have different selector buttons.
		cy.get( `.block-editor-block-types-list>.block-editor-block-types-list__list-item>.editor-block-list-item-${ block }:first` ).click( { force: true } )
	} else {
		cy.get( `.block-editor-block-types-list>.block-editor-block-types-list__list-item>.editor-block-list-item-${ plugin }-${ block }:first` ).click( { force: true } )
	}
	return cy.get( `[data-type="${ blockname }"]` ).last()
}

/**
 * Command for selecting a specific block.
 *
 * @param {*} subject
 * @param {string} selector
 */
export function selectBlock( subject, selector ) {
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
	} = options

	const _assertComputedStyle = ( win, element, cssRule, expectedValue, pseudoEl ) => {
		let computedStyle = win.getComputedStyle( element, pseudoEl ? `:${ pseudoEl }` : undefined )[ camelCase( cssRule ) ]
		if ( typeof computedStyle === 'string' && computedStyle.match( /rgb\(/ ) ) {
			// Force rgb computed style to be hex.
			computedStyle = computedStyle.replace( /rgb\(([0-9]*), ([0-9]*), ([0-9]*)\)/g, val => rgbToHex( val ) )
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
					const excludedClassNames = [ 'ugb-accordion--open' ]
					const parsedClassList = classList.split( ' ' )
						.filter( className => ! className.match( /ugb-(.......)$/ ) && ! excludedClassNames.includes( className ) )
						.map( className => `.${ className }` )
						.join( '' )
					keys( cssObject ).forEach( _selector => {
						const selector = _selector.split( ':' )
						cy
							.get( `.is-selected${ ` ${ selector[ 0 ] }` }` )
							.then( $block => {
								cy.window().then( win => {
									keys( cssObject[ _selector ] ).forEach( cssRule => {
										_assertComputedStyle( win, $block[ 0 ], cssRule, cssObject[ _selector ][ cssRule ], selector.length === 2 && selector[ 1 ] )
									} )
								} )
							} )
					} )

					if ( assertFrontend ) {
						publish()
						getAddresses( ( { currUrl, previewUrl } ) => {
							cy.visit( previewUrl )

							cy.window().then( frontendWindow => {
								cy.document().then( frontendDocument => {
									keys( cssObject ).forEach( _selector => {
										const selector = _selector.split( ':' )
										const willAssertElement = frontendDocument.querySelector( `${ parsedClassList } ${ selector[ 0 ] }` )
										if ( willAssertElement ) {
											keys( cssObject[ _selector ] ).forEach( cssRule => {
												_assertComputedStyle( frontendWindow, willAssertElement, cssRule, cssObject[ _selector ][ cssRule ], selector.length === 2 && selector[ 1 ] )
											} )
										}
									} )
								} )
							} )

							cy.visit( currUrl )

							cy
								.get( parsedClassList )
								.click( { force: true } )

							openSidebar( 'Settings' )

							cy
								.get( `button[aria-label="${ startCase( tab ) } Tab"]` )
								.click( { force: true } )

							collapse( activePanel )
						}
						)
					}
				} )
		} )
	} )
}

/**
 * Command for typing in blocks
 *
 * @param {*} subject
 * @param {string} contentSelector
 * @param {string} content
 * @param {string} customSelector
 */
export function typeBlock( subject, contentSelector = '', content = '', customSelector = '' ) {
	const block = selectBlock( subject, customSelector )
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
		selectBlock( subject, customSelector )
	}
}

/**
 * Command for asserting the included classNames.
 *
 * @param  {*} subject
 * @param {string} customSelector
 * @param {string} expectedValue
 */
export function assertClassName( subject, customSelector = '', expectedValue = '' ) {
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
}

/**
 * Command for changing the preview mode.
 *
 * @param {string} mode
 */
export function changePreviewMode( mode = 'Desktop' ) {
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
}

/**
 * Command for deleting a specific block.
 *
 * @param {*} subject
 * @param {string} selector
 */
export function deleteBlock( subject, selector ) {
	selectBlock( subject, selector )
	cy.get( 'button[aria-label="More options"]' ).first().click( { force: true } )
	cy.get( 'button' ).contains( 'Remove block' ).click( { force: true } )
}

/**
 * Command for opening a sidebar button.
 *
 * @param {string} label
 */
export function openSidebar( label = 'Settings' ) {
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
}

/**
 * Command for opening the block inspectore of a block.
 *
 * @param {*} subject
 * @param {string} tab
 * @param {string} selector
 */
export function openInspector( subject, tab, selector ) {
	selectBlock( subject, selector )
	openSidebar( 'Settings' )

	cy
		.get( `button[aria-label="${ tab } Tab"]` )
		.click( { force: true } )
}

/**
 * Command for scrolling the sidebar panel to
 * a specific selector.
 *
 * @param {string} selector
 */
export function scrollSidebarToView( selector ) {
	cy.document().then( doc => {
		const selectedEl = doc.querySelector( selector )
		if ( selectedEl ) {
			const { y } = selectedEl.getBoundingClientRect()
			if ( y ) {
				cy.get( '.interface-complementary-area' ).scrollTo( 0, y )
			}
		}
	} )
}

/**
 * Command for scrolling the editor panel to
 * a specific selector.
 *
 * @param {string} selector
 */
export function scrollEditorToView( selector ) {
	cy.document().then( doc => {
		const selectedEl = doc.querySelector( selector )
		if ( selectedEl ) {
			const { y } = selectedEl.getBoundingClientRect()
			if ( y ) {
				cy.get( '.interface-interface-skeleton__content' ).scrollTo( 0, y )
			}
		}
	} )
}

/**
 * Command for collapsing an accordion.
 *
 * @param {string} name
 * @param {boolean} toggle
 */
export function collapse( name = 'General', toggle = true ) {
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
}

/**
 * Command for enabling/disabling an
 * accordion.
 *
 * @param {string} name
 * @param {boolean} enabled
 */
export function toggleStyle( name = 'Block Title', enabled = true ) {
	cy.document().then( doc => {
		const kebabCaseName = kebabCase( name )
		const el = doc.querySelector( `.ugb-panel--${ kebabCaseName }>h2>button>span>.ugb-toggle-panel-form-toggle` )
		if ( el ) {
			// Click the checkbox if necessary. Otherwise, don't check the checkbox.
			if ( ( enabled && ! Array.from( el.classList ).includes( 'is-checked' ) ) || ( ! enabled && Array.from( el.classList ).includes( 'is-checked' ) ) ) {
				scrollSidebarToView( `.ugb-panel--${ kebabCaseName }>h2>button>span>.ugb-toggle-panel-form-toggle>input` )
				cy.get( `.ugb-panel--${ kebabCaseName }>h2>button>span>.ugb-toggle-panel-form-toggle>input` ).click( { force: true } )
			}
		}
	} )
}

/**
 * Command for publishing a page.
 */
export function publish() {
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
}

/**
 * Command for changing the icon in icon block.
 *
 * @param {string} selector
 * @param {number} index
 * @param {string} keyword
 * @param {string} icon
 */
export function changeIcon( selector, index = 1, keyword = '', icon ) {
	selectBlock( 'ugb/icon', selector )
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
}

/**
 * Command for asserting an error due to
 * plugin activation.
 */
export function assertPluginError() {
	cy.get( '.xdebug-error' ).should( 'not.exist' )
}

/**
 * Command for appending inner block using block appender
 *
 * @param {string} blockName
 * @param {string} parentSelector
 */
export function appendBlock( blockName = 'ugb/accordion', parentSelector ) {
	cy
		.get( `${ parentSelector ? `${ parentSelector } ` : '' }button.block-editor-button-block-appender` )
		.first()
		.click( { force: true } )

	cy
		.get( 'button' )
		.contains( 'Browse all' )
		.click( { force: true } )

	cy
		.get( `button.editor-block-list-item-${ blockName.replace( '/', '-' ) }:first` )
		.click( { force: true } )

	cy.deleteBlock( blockName )
}
