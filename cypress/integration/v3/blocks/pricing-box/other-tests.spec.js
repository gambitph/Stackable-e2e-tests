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
	assertWidth,
} from '.'

describe( 'Pricing Box Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	typeContent,
	assertWidth,
] ) )
