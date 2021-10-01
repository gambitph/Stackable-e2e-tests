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
	loadedFiles,
} from '.'

describe( 'Expand Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	innerBlocksExist,
	loadedFiles,
] ) )
