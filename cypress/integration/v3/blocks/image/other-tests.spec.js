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
	addImage,
} from '.'

describe( 'Image Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	addImage,
] ) )
