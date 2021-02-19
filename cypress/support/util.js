/**
 * External dependencies
 */
import {
	lowerCase, escapeRegExp, first, last,
} from 'lodash'

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
 * Create a DOM Element based on HTML string
 *
 * @param {string} htmlString
 *
 * @return {*} DOM Element
 */
export function createElementFromHTMLString( htmlString ) {
	const parentElement = document.createElement( 'div' )
	parentElement.innerHTML = htmlString

	return parentElement.firstElementChild
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

/**
 * Function for returning a stringified path location of the block from
 * `wp.data.select('core/block-editor').getBlocks()` by clientId
 *
 * e.g. [0].innerBlocks[2]
 *
 * @param {Array} blocks
 * @param {string} clientId
 *
 * @return {string} stringified path
 */
export function getBlockStringPath( blocks = [], clientId = '' ) {
	const paths = []
	let found = false

	function getBlockStringPathRecursive( _blocks, clientId ) {
		_blocks.forEach( ( _block, index ) => {
			if ( ! found ) {
				paths.push( `[${ index }]` )
			}
			if ( ! found && _block.clientId === clientId ) {
				found = true
			}
			if ( ! found && _block.innerBlocks.length ) {
				paths.push( '.innerBlocks' )
				getBlockStringPathRecursive( _block.innerBlocks, clientId )
				if ( ! found ) {
					paths.pop()
				}
			}
			if ( ! found ) {
				paths.pop()
			}
		} )
	}

	getBlockStringPathRecursive( blocks, clientId )
	return paths.join( '' )
}

/**
 * Function for overwriting log argument.
 *
 * @param {Object} options
 */
export function modifyLogFunc( options = {} ) {
	const {
		position = 'last',
		argumentLength = false,
	} = options

	if ( argumentLength ) {
		return function( originalFn, ...args ) {
			if ( args.length === argumentLength ) {
				const options = args.pop()
				options.log = Cypress.env( 'DEBUG' ) === 'true'
				originalFn( ...args, options )
			}
			return originalFn( ...args, { log: Cypress.env( 'DEBUG' ) === 'true' } )
		}
	}

	return function( originalFn, ...args ) {
		const firstOrLast = position === 'last' ? last : first
		if ( typeof firstOrLast( args ) === 'object' && ! Array.isArray( firstOrLast( args ) ) ) {
			const options = args[ position === 'last' ? 'pop' : 'shift' ]()
			options.log = Cypress.env( 'DEBUG' ) === 'true'
			return position === 'last' ? originalFn( ...args, options ) : originalFn( options, ...args )
		}
		return position === 'last'
			? 			originalFn( ...args, { log: Cypress.env( 'DEBUG' ) === 'true' } )
			: 			originalFn( { log: Cypress.env( 'DEBUG' ) === 'true' }, ...args )
	}
}
