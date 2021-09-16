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

describe( 'Separator Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
] ) )
