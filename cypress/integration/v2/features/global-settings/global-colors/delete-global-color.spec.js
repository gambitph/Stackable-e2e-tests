/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'

/**
 * Internal dependencies
 */
import { deleteGlobalColorTest } from '.'

describe( 'Global Colors ( Delete Global Colors )', registerTests( [ deleteGlobalColorTest ] ) )
