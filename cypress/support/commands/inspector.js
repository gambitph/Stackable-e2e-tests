/**
 * External dependencies
 */
import { kebabCase } from 'lodash'

/**
 * Internal dependencies
 */
import { selectBlock } from './index'
import { containsRegExp, getActiveTab } from '../util'

/**
 * Register functions to Cypress Commands.
 */
Cypress.Commands.add( 'openSidebar', openSidebar )
Cypress.Commands.add( 'openInspector', openInspector )
Cypress.Commands.add( 'collapse', collapse )
Cypress.Commands.add( 'toggleStyle', toggleStyle )

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
