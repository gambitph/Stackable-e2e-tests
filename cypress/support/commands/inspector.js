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
	const sidebarNamespace = {
		[ `Settings` ]: 'edit-post/block',
		[ `Stackable Settings` ]: 'stackable-global-settings/sidebar',
	}

	cy.window().then( win => {
		win.wp.data.dispatch( 'core/edit-post' ).openGeneralSidebar( sidebarNamespace[ label ] )
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
		.get( `button.edit-post-sidebar__panel-tab` )
		.contains( containsRegExp( tab ) )
		.click( { force: true } )
}

/**
 * Command for collapsing an accordion.
 *
 * @param {string} name
 * @param {boolean} toggle
 */
export function collapse( name = 'General', toggle = true ) {
	getActiveTab( tab => {
		if ( tab === 'Stackable Global Settings' ) {
			return cy
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
		}

		return cy
			.get( `.ugb-panel-${ tab }>.components-panel__body .components-panel__body-title` )
			.contains( containsRegExp( name ) )
			.parentsUntil( `.ugb-panel-${ tab }>.components-panel__body` )
			.parent()
			.find( 'button.components-panel__body-toggle' )
			.invoke( 'attr', 'aria-expanded' )
			.then( ariaExpanded => {
				// Open the accordion if aria-expanded is false.
				if ( ariaExpanded !== toggle.toString() ) {
					cy
						.get( `.ugb-panel-${ tab }>.components-panel__body .components-panel__body-title` )
						.contains( containsRegExp( name ) )
						.parentsUntil( `.ugb-panel-${ tab }>.components-panel__body` )
						.parent()
						.find( 'button.components-panel__body-toggle' )
						.click( { force: true } )
				}
			} )
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
	const selector = () => 	cy
		.get( '.components-panel__body' )
		.contains( containsRegExp( name ) )
		.parentsUntil( '.components-panel__body' )
		.parent()
		.find( '.components-form-toggle.ugb-toggle-panel-form-toggle' )

	selector()
		.invoke( 'attr', 'class' )
		.then( classNames => {
			if ( classNames.match( /is-checked/ ) !== enabled ) {
				selector()
					.find( 'input' )
					.click( { force: true } )
			}
		} )
}
