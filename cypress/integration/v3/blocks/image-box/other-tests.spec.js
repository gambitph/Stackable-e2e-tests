/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'

/**
 * Internal dependencies
 */
import {
	blockExist,
	blockError,
	innerBlocksExist,
} from '.'

describe( 'Image Box Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	innerBlocksExist,
] ) )
