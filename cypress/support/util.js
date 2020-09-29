/**
 * External dependencies
 */
import { lowerCase } from 'lodash'

/**
 * Function for getting the base control
 *
 * @param {string} tab where the control is located.
 * @param {boolean} isInPopover
 * @return {*} generated cypress getter
 */
export const getBaseControl = ( tab = 'style', isInPopover = false ) => {
	const baseControlEl = ! isInPopover ? cy.get( `.ugb-panel-${ tab }>.components-panel__body.is-opened>.components-base-control` ) : cy.get( '.components-popover__content' ).find( '.components-base-control' )
	return baseControlEl
}

/**
 * Function for generating a RegExp used
 * in contains cypress function.
 *
 * @param {string} name
 * @return {RegExp} generated RegExp
 */
export const containsRegExp = ( name = '' ) => new RegExp( `^${ name.replace( /[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, '\\$&' ) }$` )

/**
 * Function for getting the active tab
 * in inspector.
 *
 * @param {*} callbackFunc callback function
 */
export const getActiveTab = ( callbackFunc = () => {} ) => {
	cy
		.get( '.ugb-panel-tabs__wrapper>button.edit-post-sidebar__panel-tab.is-active' )
		.invoke( 'attr', 'aria-label' )
		.then( ariaLabel => {
			// Get the active tab.
			const tab = lowerCase( ariaLabel.split( ' ' )[ 0 ] )

			callbackFunc( tab )
		} )
}

/**
 * Function for changing the responsive mode.
 *
 * @param {string} viewport desired viewport
 * @param {string} name selector name
 * @param {string} tab current active tab
 * @param {boolean} isInPopover if the control is in popover
 */
export const changeResponsiveMode = ( viewport = 'Desktop', name = '', tab = 'style', isInPopover = false ) => {
	cy.document().then( doc => {
		const responsiveButtonGroupElement = doc.querySelector( '.ugb-base-control-multi-label__responsive' )

		if ( responsiveButtonGroupElement ) {
			const responsiveButtonElement = doc.querySelector( `button[aria-label="${ viewport }"]` )
			if ( ! responsiveButtonElement ) {
				getBaseControl( tab, isInPopover )
					.contains( containsRegExp( name ) )
					.parentsUntil( `.ugb-panel-${ tab }>.components-panel__body>.components-base-control` )
					.parent()
					.find( `button[aria-label="Desktop"]` )
					.click( { force: true } )
			}

			getBaseControl( tab, isInPopover )
				.contains( containsRegExp( name ) )
				.parentsUntil( `.ugb-panel-${ tab }>.components-panel__body>.components-base-control` )
				.parent()
				.find( `button[aria-label="${ viewport }"]` )
				.click( { force: true } )
		}
	} )
}

/**
 * Function for changing the unit in control.
 *
 * @param {string} unit desired unit
 * @param {string} name selector name
 * @param {string} tab current active tab
 * @param {boolean} isInPopover if the control is in popover
 */
export const changeUnit = ( unit = '', name = '', tab = 'style', isInPopover = false ) => {
	if ( unit ) {
		cy.document().then( doc => {
			const unitsButtonGroupElement = doc.querySelector( '.ugb-base-control-multi-label__units' )

			if ( unitsButtonGroupElement ) {
				getBaseControl( tab, isInPopover )
					.contains( containsRegExp( name ) )
					.parentsUntil( `.ugb-panel-${ tab }>.components-panel__body>.components-base-control` )
					.parent()
					.find( `button` )
					.contains( containsRegExp( unit ) )
					.click( { force: true } )
			}
		} )
	}
}

