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
	selectIcon,
	innerBlocksExist,
} from '.'

describe( 'Icon Label Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	selectIcon,
	innerBlocksExist,
] ) )
