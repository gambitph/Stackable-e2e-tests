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
	assertIcon,
} from '.'

describe( 'Video Popup Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	innerBlocksExist,
	loadedFiles,
	assertIcon,
] ) )
