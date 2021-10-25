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
	pressBackspace,
} from '.'

describe( 'Subtitle Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	typeContent,
	pressBackspace,
] ) )
