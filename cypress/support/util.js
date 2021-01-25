/**
 * External dependencies
 */
import { lowerCase } from 'lodash'

/**
 * Internal dependencies
 */
import config from 'root/cypress.json'

/**
 * Function for getting the base control
 *
 * @param {string} tab where the control is located.
 * @param {boolean} isInPopover
 * @return {*} generated cypress getter
 */
export const getBaseControl = ( tab = 'style', isInPopover = false ) => {
	const baseControlEl = ! isInPopover ? cy.get( `${ tab ? `.ugb-panel-${ tab }>` : `` }.components-panel__body.is-opened>.components-base-control`, { log: false } ) : cy.get( '.components-popover__content', { log: false } ).find( '.components-base-control', { log: false } )
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
	cy.document().then( doc => {
		if ( doc.querySelector( '.ugb-global-settings__inspector' ) ) {
			// Pass an empty string to callback function if the current sidebar opened is Global Settings.
			callbackFunc( '' )
		} else {
			cy
				.get( '.ugb-panel-tabs__wrapper>button.edit-post-sidebar__panel-tab.is-active', { log: false } )
				.invoke( 'attr', 'aria-label' )
				.then( ariaLabel => {
					// Get the active tab.
					const tab = lowerCase( ariaLabel.split( ' ' )[ 0 ] )

					callbackFunc( tab )
				} )
		}
	} )
}

/**
 * Function for changing the responsive mode.
 *
 * @param {string} viewport desired viewport
 * @param {string} name selector name
 * @param {string} tab current active tab
 * @param {boolean} isInPopover if the control is in popover
 * @param {string} customRegExp sometimes selector requires custom regexpressions
 */
export const changeResponsiveMode = ( viewport = 'Desktop', name = '', tab = 'style', isInPopover = false, customRegExp = '' ) => {
	getBaseControl( tab, isInPopover )
		.contains( customRegExp ? new RegExp( customRegExp ) : containsRegExp( name ) )
		.parentsUntil( `.components-panel__body>.components-base-control`, { log: false } )
		.parent( { log: false } )
		.then( $baseControl => {
			if ( $baseControl.find( '.ugb-base-control-multi-label__responsive button[aria-label="Desktop"]', { log: false } ).length ) {
				if ( ! $baseControl.find( `button[aria-label="${ viewport }"]`, { log: false } ).length ) {
					getBaseControl( tab, isInPopover )
						.contains( customRegExp ? new RegExp( customRegExp ) : containsRegExp( name ) )
						.parentsUntil( `.components-panel__body>.components-base-control`, { log: false } )
						.parent( { log: false } )
						.find( `button[aria-label="Desktop"]`, { log: false } )
						.click( { force: true } )
				}

				getBaseControl( tab, isInPopover )
					.contains( customRegExp ? new RegExp( customRegExp ) : containsRegExp( name ) )
					.parentsUntil( `.components-panel__body>.components-base-control`, { log: false } )
					.parent( { log: false } )
					.find( `button[aria-label="Desktop"]` )
					.trigger( 'mouseover', { force: true, log: false } )

				getBaseControl( tab, isInPopover )
					.contains( customRegExp ? new RegExp( customRegExp ) : containsRegExp( name ) )
					.parentsUntil( `.components-panel__body>.components-base-control`, { log: false } )
					.parent( { log: false } )
					.find( `button[aria-label="${ viewport }"]` )
					.click( { force: true, log: false } )
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
		getBaseControl( tab, isInPopover )
			.contains( containsRegExp( name ) )
			.parentsUntil( `.components-panel__body>.components-base-control`, { log: false } )
			.parent( { log: false } )
			.then( $baseControl => {
				if ( $baseControl.find( '.ugb-base-control-multi-label__units', { log: false } ).length ) {
					getBaseControl( tab, isInPopover )
						.contains( containsRegExp( name ) )
						.parentsUntil( `.components-panel__body>.components-base-control`, { log: false } )
						.parent( { log: false } )
						.find( `button`, { log: false } )
						.contains( containsRegExp( unit ) )
						.click( { force: true, log: false } )
				}
			} )
	}
}

/**
 * Function for waiting a spinner button to disappear.
 *
 * @param {string} selector
 * @param {number} interval
 */
export const waitLoader = ( selector = '', interval = 100 ) => {
	cy.wait( 300, { log: false } )
	let done = false

	const update = () => {
		done = ! Cypress.$( selector ).length
		check()
	}

	const check = () => {
		if ( done ) {
			return done
		}

		cy.wait( interval, { log: false } ).then( () => {
			update()
		} )
	}

	return check()
}

/**
 * Function used for converting rgb to hex.
 *
 * @param {string} rgb
 * @return {string} converted string
 */
export const rgbToHex = rgb => {
	if ( ! rgb.match( /rgb\(/ ) ) {
		return rgb
	}

	const parsedRgb = rgb.replace( 'rgb(', '' ).replace( ')', '' ).trim()
	const [ r, g, b ] = parsedRgb.split( ',' ).map( colorCode => parseInt( colorCode ) )
	const componentToHex = component => {
		const hex = component.toString( 16 )
		return hex.length === 1 ? '0' + hex : hex
	}

	return `#${ componentToHex( r ) }${ componentToHex( g ) }${ componentToHex( b ) }`
}

/**
 * Function that returns the original link address and preview address
 *
 * @param {Function} callback
 */
export const getAddresses = ( callback = () => {} ) => {
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
export const getPreviewMode = ( callback = () => {} ) => {
	cy.window( { log: false } ).then( win => {
		const previewMode =	win.wp.data.select( 'core/edit-post' ).__experimentalGetPreviewDeviceType ? win.wp.data.select( 'core/edit-post' ).__experimentalGetPreviewDeviceType() : 'Desktop'
		callback( previewMode )
	} )
}

/**
 * Function used to generate a parsed class names to be
 * used as a selector.
 *
 * @param {Array} classList
 */
export const parseClassList = ( classList = [] ) => {
	const excludedClassNames = [ 'ugb-accordion--open' ]
	const parsedClassList = classList.split( ' ' )
		.filter( className => ! className.match( /ugb-(.......)$/ ) && ! excludedClassNames.includes( className ) )
		.map( className => `.${ className }` )
		.join( '' )
	return parsedClassList
}

