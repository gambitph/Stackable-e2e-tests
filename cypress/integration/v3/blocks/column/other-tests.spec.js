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
	innerBlocks,
	assertWidth,
} from '.'

describe( 'Column Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	innerBlocks,
	assertWidth,
] ) )
