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
	addColumn,
} from '.'

describe( 'Button Group Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	addColumn,
] ) )
