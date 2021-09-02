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
} from '.'

describe( 'Hero Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	innerBlocks,
	typeContent,
] ) )
