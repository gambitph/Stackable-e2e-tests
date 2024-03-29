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
	pressBackspace,
	addBlocks,
} from '.'

describe( 'Text Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	typeContent,
	pressEnterKey,
	pressBackspace,
	addBlocks,
] ) )
