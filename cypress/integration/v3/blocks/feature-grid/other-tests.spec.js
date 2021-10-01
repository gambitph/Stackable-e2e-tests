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
	assertWidth,
} from '.'

describe( 'Feature Grid Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	innerBlocksExist,
	assertWidth,
] ) )
