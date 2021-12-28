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
	pressEnterKey,
} from '.'

describe( 'Button Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	typeContent,
	pressEnterKey,
] ) )
