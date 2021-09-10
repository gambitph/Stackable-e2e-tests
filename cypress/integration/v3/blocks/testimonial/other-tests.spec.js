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
} from '.'

describe( 'Testimonial Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	innerBlocks,
	innerBlocksExist,
] ) )
