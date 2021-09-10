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

describe( 'Icon Box Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	innerBlocksExist,
] ) )
