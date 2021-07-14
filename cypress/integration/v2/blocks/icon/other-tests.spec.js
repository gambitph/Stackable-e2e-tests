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
	blockSpecificTests,
} from '.'

describe( 'Icon Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	switchDesign,
	typeContent,
	blockSpecificTests,
] ) )
