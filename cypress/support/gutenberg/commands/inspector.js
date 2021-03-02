/**
 * External dependencies
 */
import { containsRegExp } from '~common/util'

/**
 * Register functions to Cypress Commands.
 */
Cypress.Commands.add( 'toggleSidebar', toggleSidebar )
Cypress.Commands.add( 'openSidebar', openSidebar )
Cypress.Commands.add( 'closeSidebar', closeSidebar )
Cypress.Commands.add( 'getBaseControl', getBaseControl )
Cypress.Commands.add( 'collapse', collapse )

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
 * Command for opening a sidebar button.
 *
 * @param {string} sidebarName
 */
export function openSidebar( sidebarName = '' ) {
	cy.toggleSidebar( sidebarName, true )
}

/**
 * Command for closing a sidebar button.
 *
 * @param {string} sidebarName
 */
export function closeSidebar( sidebarName = '' ) {
	cy.toggleSidebar( sidebarName, false )
}

/**
 * Command for getting the base control
 * element that matches the label or regex
 *
 * @param {string | RegExp} matches
 * @param {Object} options
 */
export function getBaseControl( matches, options = {} ) {
	const {
		isInPopover = false,
		customParentSelector = '.components-panel__body',
	} = options
	return ( ! isInPopover
		? cy.get( `${ customParentSelector ? `${ customParentSelector }>` : '' }.components-base-control` )
		: cy.get( '.components-popover__content' ).find( '.components-base-control' ) )
		.contains( containsRegExp( matches ) )
		.closest( `${ customParentSelector ? `${ customParentSelector }>` : '' }.components-base-control` )
}

/**
 * Command for collapsing inspector accordion.
 *
 * @param {string} name
 * @param {boolean} toggle
 */
export function collapse( name = 'General', toggle = true ) {
	const toggleTitleSelector = () => cy
		.get( '.components-panel__body .components-panel__body-title' )
		.contains( containsRegExp( name ) )
		.closest( '.components-panel__body' )
		.find( 'button.components-panel__body-toggle' )

	toggleTitleSelector()
		.invoke( 'attr', 'aria-expanded' )
		.then( ariaExpanded => {
			// Open the accordion if aria-expanded is false.
			if ( ariaExpanded !== toggle.toString() ) {
				toggleTitleSelector()
					.click( { force: true } )
			}
		} )
}
