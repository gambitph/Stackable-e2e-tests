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
	switchLayout,
	switchDesign,
	typeContent,
	closeAdjacentTest,
} from '.'

describe( 'Accordion Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	innerBlocks,
	switchLayout,
	switchDesign,
	typeContent,
	closeAdjacentTest,
] ) )
