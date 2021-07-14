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
	switchLayout,
} from '.'

describe( 'Container Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	innerBlocks,
	switchLayout,
] ) )
