/**
 * Internal dependencies
 */
import {
	containsRegExp,
} from '../util'

/**
 * Register functions to Cypress Commands.
 */
Cypress.Commands.add( 'toggleSidebar', toggleSidebar )
Cypress.Commands.add( 'openSidebar', openSidebar )
Cypress.Commands.add( 'closeSidebar', closeSidebar )
Cypress.Commands.add( 'openInspector', openInspector )
Cypress.Commands.add( 'collapse', collapse )
Cypress.Commands.add( 'toggleStyle', toggleStyle )
Cypress.Commands.add( 'getPreviewMode', getPreviewMode )

/**
 * Command for toggling a sidebar
 *
 * @param {string} sidebarName
 * @param {boolean} value
 */
export function toggleSidebar( sidebarName = '', value = true ) {
	cy.wp().then( wp => {
		return new Cypress.Promise( ( resolve, reject ) => {
			wp.data.dispatch( 'core/edit-post' )[ value ? 'openGeneralSidebar' : 'closeGeneralSidebar' ]( sidebarName )
				.then( resolve )
				.catch( reject )
		} )
	} )
}

/**
 * Stackable Command for opening a sidebar button.
 *
 * @param {string} label
 */
export function openSidebar( label = 'Settings' ) {
	const sidebarNamespace = {
		'Settings': 'edit-post/block',
		'Stackable Settings': 'stackable-global-settings/sidebar',
	}
	cy.toggleSidebar( sidebarNamespace[ label ], true )
}

/**
 * Stackable Command for closing a sidebar button.
 *
 * @param {string} label
 */
export function closeSidebar( label = 'Settings' ) {
	const sidebarNamespace = {
		'Settings': 'edit-post/block',
		'Stackable Settings': 'stackable-global-settings/sidebar',
	}
	cy.toggleSidebar( sidebarNamespace[ label ], false )
}

/**
 * Stackable Command for opening the block inspectore of a block.
 *
 * @param {*} subject
 * @param {string} tab
 * @param {string} selector
 */
export function openInspector( subject, tab, selector ) {
	cy.selectBlock( subject, selector )
	cy.openSidebar( 'Settings' )

	cy
		.get( 'button.edit-post-sidebar__panel-tab' )
		.contains( containsRegExp( 'Block' ) )
		.click( { force: true } )

	cy
		.get( 'button.edit-post-sidebar__panel-tab' )
		.contains( containsRegExp( tab ) )
		.click( { force: true } )
}

/**
 * Stackable Command for collapsing an accordion.
 *
 * @param {string} name
 * @param {boolean} toggle
 */
export function collapse( name = 'General', toggle = true ) {
	cy.wp().then( wp => {
		switch ( wp.data.select( 'core/edit-post' ).getActiveGeneralSidebarName() ) {
			case 'stackabe-global-settings/sidebar': {
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
			default: {
				return cy
					.get( '.components-panel__body .components-panel__body-title' )
					.contains( containsRegExp( name ) )
					.parentsUntil( '.components-panel__body' )
					.parent()
					.find( 'button.components-panel__body-toggle' )
					.invoke( 'attr', 'aria-expanded' )
					.then( ariaExpanded => {
						// Open the accordion if aria-expanded is false.
						if ( ariaExpanded !== toggle.toString() ) {
							cy
								.get( '.components-panel__body .components-panel__body-title' )
								.contains( containsRegExp( name ) )
								.parentsUntil( '.components-panel__body' )
								.parent()
								.find( 'button.components-panel__body-toggle' )
								.click( { force: true } )
						}
					} )
			}
		}
	} )
}

/**
 * Stackable Command for enabling/disabling an
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

/**
 * Command that returns the current editor's preview mode.
 *
 */
export function getPreviewMode() {
	return cy.wp().then( wp => {
		return new Cypress.Promise( resolve => {
			const previewMode = wp.data.select( 'core/edit-post' ).__experimentalGetPreviewDeviceType
				?	wp.data.select( 'core/edit-post' ).__experimentalGetPreviewDeviceType()
				: 'Desktop'
			resolve( previewMode )
		} )
	} )
}
