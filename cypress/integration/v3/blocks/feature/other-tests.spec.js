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
	typeContent,
	assertWidth,
} from '.'

describe( 'Feature Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	innerBlocks,
	typeContent,
	assertWidth,
] ) )
