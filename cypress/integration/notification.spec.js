
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

describe( 'Notification Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/notification', '.ugb-notification' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/notification' ) )

	it( 'should switch layout', switchLayouts( 'ugb/notification', [
		'Basic',
		'Plain',
		'Bordered',
		'Outlined',
		'Large Icon',
	] ) )
	it( 'should switch design', switchDesigns( 'ugb/notification', [
		'Chic Notification',
		'Detour Notification',
		'Elevate Notification',
		'Heights Notification',
		'Lounge Notification',
		'Propel Notification',
		'Seren Notification',
		'Upland Notification',
		'Yule Notification',
	] ) )
} )
