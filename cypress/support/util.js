/**
 * External dependencies
 */
import { lowerCase, escapeRegExp } from 'lodash'

/**
 * Function for getting the base control
 *
 * @param {boolean} isInPopover
 * @return {*} generated cypress getter
 */
export function getBaseControl( isInPopover = false ) {
	return ! isInPopover
		? cy.get( '.components-panel__body.is-opened>.components-base-control', { log: false } )
		: cy.get( '.components-popover__content', { log: false } ).find( '.components-base-control', { log: false } )
}

/**
 * Function for generating a RegExp used
 * in contains cypress function.
 *
 * @param {string} name
 * @return {RegExp} generated RegExp
 */
export function containsRegExp( name = '' ) {
	return new RegExp( `^${ escapeRegExp( ( typeof name !== 'string' ? '' : name ) ) }$` )
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

/**
 * Function for getting the active tab
 * in inspector.
 *
 * @param {Function} callback callback function
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

/**
 * Function for getting all blocks recursively.
 *
 * @param {Array} blocks
 */
export function getBlocksRecursive( blocks ) {
	const allBlocks = []
	const _getBlocksRecursive = _blocks => {
		_blocks.forEach( _block => {
			allBlocks.push( _block )
			if ( _block.innerBlocks.length ) {
				_getBlocksRecursive( _block.innerBlocks )
			}
		} )
	}
	_getBlocksRecursive( blocks )
	return allBlocks
}

/**
 * Create our own resolver with setTimeout
 * since gutenberg promise resolver can be unstable.
 *
 * @param {Function} resolver
 */
export function dispatchResolver( resolver = () => {} ) {
	return () => setTimeout( () => {
		resolver()
	}, 1 )
}
