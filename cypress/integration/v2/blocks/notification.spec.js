/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests,
} from '~stackable-e2e/helpers'

describe( 'Notification Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/notification', '.ugb-notification' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/notification' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/notification', [
		'Basic',
		'Plain',
		'Bordered',
		'Outlined',
		'Large Icon',
	] ) )
}

function switchDesign() {
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
}

