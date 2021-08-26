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
	assertLink,
} from '.'

describe( 'Button Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	typeContent,
	assertLink,
] ) )
