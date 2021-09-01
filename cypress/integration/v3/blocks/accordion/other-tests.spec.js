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
	innerBlocks,
	typeContent,
	pressEnterKey,
	loadedFiles,
} from '.'

describe( 'Accordion Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	innerBlocks,
	typeContent,
	pressEnterKey,
	loadedFiles,
] ) )
