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
	switchLayout,
	switchDesign,
	typeContent,
} from '.'

describe( 'Number Box Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	typeContent,
] ) )
