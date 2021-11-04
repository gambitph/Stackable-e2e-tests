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
	resizeHeight,
} from '.'

describe( 'Spacer Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	resizeHeight,
] ) )
