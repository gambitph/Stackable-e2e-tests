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
} from '.'

describe( 'V3 Heading Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	typeContent,
] ) )
