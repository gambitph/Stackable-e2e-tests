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
	innerBlocksExist,
	addImage,
} from '.'

describe( 'Card Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	innerBlocks,
	innerBlocksExist,
	addImage,
] ) )
