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

describe( 'Blockquote Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	typeContent,
	pressEnterKey,
] ) )
