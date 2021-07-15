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

/**
 * Function for comparing two versions.
 *
 * @param {string} versionA
 * @param {string} versionB
 * @param {string} operator
 */
export function compareVersions( versionA, versionB, operator ) {
	const arrA = versionA.includes( 'RC' )
		? versionA.split( '-' )[ 0 ].split( '.' ).map( num => parseInt( num ) )
		: versionA.split( '.' ).map( num => parseInt( num ) )
	const arrB = versionB.split( '.' ).map( num => parseInt( num ) )

	if ( arrA.length === 2 ) {
		// Append 0 to the version number.
		arrA.push( 0 )
	}

	const compare = {
		'<': () => {
			if ( arrA[ 0 ] < arrB[ 0 ] ) {
				return true
			}
			if ( arrA[ 0 ] === arrB[ 0 ] && arrA[ 1 ] < arrB[ 1 ] ) {
				return true
			}
			if ( arrA.length === 3 ) {
				if ( arrA[ 0 ] === arrB[ 0 ] && arrA[ 1 ] === arrB[ 1 ] && arrA[ 2 ] < arrB[ 2 ] ) {
					return true
				}
			}
			return false
		},
		'>': () => {
			if ( arrA[ 0 ] > arrB[ 0 ] ) {
				return true
			}
			if ( arrA[ 0 ] === arrB[ 0 ] && arrA[ 1 ] > arrB[ 1 ] ) {
				return true
			}
			if ( arrA.length === 3 ) {
				if ( arrA[ 0 ] === arrB[ 0 ] && arrA[ 1 ] === arrB[ 1 ] && arrA[ 2 ] > arrB[ 2 ] ) {
					return true
				}
			}
			return false
		},
		'=': () => JSON.stringify( arrA ) === JSON.stringify( arrB ),
	}

	compare[ operator ]()
}
