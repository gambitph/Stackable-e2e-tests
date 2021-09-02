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
	typeContent,
	loadedFiles,
} from '.'

describe( 'Expand Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	typeContent,
	loadedFiles,
] ) )
