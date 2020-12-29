
/**
 * External dependencies
 */
import { range } from 'lodash'

/**
 * Internal dependencies
 */
import { blocks } from '../config'
import { getAddresses } from '../support/util'
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts,
} from '../support/helpers'

describe( 'Expand Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/expand', '.ugb-expand' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/expand' ) )
} )
