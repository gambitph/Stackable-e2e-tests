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
		{ value: 'Basic', selector: '.ugb-notification--design-basic' },
		{ value: 'Plain', selector: '.ugb-notification--design-plain' },
		{ value: 'Bordered', selector: '.ugb-notification--design-bordered' },
		{ value: 'Outlined', selector: '.ugb-notification--design-outlined' },
		{ value: 'Large Icon', selector: '.ugb-notification--design-large-icon' },
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

