/**
 * External dependencies
 */
import config from 'root/cypress.json'
import { lowerCase } from 'lodash'

/**
 * Function for getting the base control
 *
 * @param {boolean} isInPopover
 * @return {*} generated cypress getter
 */
export function getBaseControl( isInPopover = false ) {
	const baseControlEl = ! isInPopover
		? cy.get( '.components-panel__body.is-opened>.components-base-control', { log: false } )
		: cy.get( '.components-popover__content', { log: false } ).find( '.components-base-control', { log: false } )
	return baseControlEl
}

/**
 * Function for generating a RegExp used
 * in contains cypress function.
 *
 * @param {string} name
 * @return {RegExp} generated RegExp
 */
export function containsRegExp( name = '' ) {
	return new RegExp( `^${ ( typeof name !== 'string' ? '' : name ).replace( /[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g, '\\$&' ) }$` )
}

/**
 * Function for changing the unit in control.
 *
 * @param {string} unit desired unit
 * @param {string} name selector name
 * @param {boolean} isInPopover if the control is in popover
 */
export function changeUnit( unit = '', name = '', isInPopover = false ) {
	const selector = () => getBaseControl( isInPopover )
		.contains( containsRegExp( name ) )
		.parentsUntil( '.components-panel__body>.components-base-control', { log: false } )
		.parent( { log: false } )
	if ( unit ) {
		selector()
			.then( $baseControl => {
				if ( $baseControl.find( '.ugb-base-control-multi-label__units', { log: false } ).length ) {
					selector()
						.find( 'button', { log: false } )
						.contains( containsRegExp( unit ) )
						.click( { force: true, log: false } )
				}
			} )
	}
}

/**
 * Function that returns the original link address and preview address
 *
 * @param {Function} callback
 */
export function getAddresses( callback = () => {} ) {
	cy.window().then( _win => {
		const _currUrl = _win.location.href
		const parsedPostID = _currUrl.match( /post=([0-9]*)/g )[ 0 ].split( '=' )[ 1 ]
		const previewUrl = `/?page_id=${ parsedPostID }&preview=true`
		const currUrl = _currUrl.replace( config.baseUrl, '/' )
		callback( {
			currUrl, previewUrl, postID: parsedPostID,
		} )
	} )
}

/**
 * Function that returns the current editor's preview mode.
 *
 * @param {Function} callback
 */
export function getPreviewMode( callback = () => {} ) {
	select( _select => {
		const previewMode =
			_select( 'core/edit-post' ).__experimentalGetPreviewDeviceType
				?	_select( 'core/edit-post' ).__experimentalGetPreviewDeviceType()
				: 'Desktop'
		callback( previewMode )
	} )
}

/**
 * Function used to generate a parsed class names to be
 * used as a selector.
 *
 * @param {Array} classList
 */
export function parseClassList( classList = [] ) {
	const excludedClassNames = [
		'ugb-accordion--open',
		'ugb-icon-list__left-align',
		'ugb-icon-list__center-align',
		'ugb-icon-list__right-align',
	]
	const parsedClassList = classList.split( ' ' )
		.filter( className => ! className.match( /ugb-(.......)$/ ) && ! excludedClassNames.includes( className ) )
		.map( className => `.${ className }` )
		.join( '' )
	return parsedClassList
}

/*
* Function used for getting the `wp` object.
*
* @param {Function} callback
*/
export function wp( callback = () => {} ) {
	cy.window( { log: false } ).then( win => {
		callback( win.wp )
	} )
}

/**
 * Function used for getting the `wp.data.dispatch` function
 *
 * @param {Function} callback
 */
export function dispatch( callback = () => {} ) {
	wp( _wp => callback( _wp.data.dispatch ) )
}

/**
 * Function used for getting the `wp.data.select` function
 *
 * @param {Function} callback
 */
export function select( callback = () => {} ) {
	wp( _wp => callback( _wp.data.select ) )
}

/**
 * Function for getting the active tab
 * in inspector.
 *
 * @param {*} callback callback function
 */
export function getActiveTab( callback = () => {} ) {
	cy
		.get( '.ugb-panel-tabs__wrapper>button.edit-post-sidebar__panel-tab.is-active', { log: false } )
		.invoke( 'attr', 'aria-label' )
		.then( ariaLabel => {
			// Get the active tab.
			const tab = lowerCase( ariaLabel.split( ' ' )[ 0 ] )

			callback( tab )
		} )
}
