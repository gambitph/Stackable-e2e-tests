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
} from '.'

describe( 'Columns Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
] ) )
