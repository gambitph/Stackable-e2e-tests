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
	loadedFiles,
} from '.'

describe( 'Notification Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	innerBlocks,
	innerBlocksExist,
	loadedFiles,
] ) )
