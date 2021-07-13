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

describe( 'Video Popup Block ( Other Tests )', registerTests( [
	blockExist,
	blockError,
	switchDesign,
	typeContent,
] ) )
