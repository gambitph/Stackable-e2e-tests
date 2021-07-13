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
	switchDesign,
	typeContent,
} from '.'

describe( 'Icon List Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	switchDesign,
	typeContent,
] ) )
