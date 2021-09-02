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
} from '.'

describe( 'Icon Button Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	selectIcon,
] ) )
