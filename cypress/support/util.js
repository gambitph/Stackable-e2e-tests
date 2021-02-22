/**
 * External dependencies
 */
import {
	escapeRegExp,
} from 'lodash'

/**
 * Function for generating a RegExp used
 * in contains cypress function.
 *
 * @param {string} name
 * @return {RegExp} generated RegExp
 */
export function containsRegExp( name = '' ) {
	if ( name instanceof RegExp ) {
		return name
	}
	return new RegExp( `^${ escapeRegExp( ( typeof name !== 'string' ? '' : name ) ) }$` )
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

