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
	typeContent,
} from '.'

describe( 'Advanced Columns and Grid Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	innerBlocks,
	switchLayout,
	typeContent,
] ) )
