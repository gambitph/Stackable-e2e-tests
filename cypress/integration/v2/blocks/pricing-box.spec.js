/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests,
} from '~stackable-e2e/helpers'

describe( 'Pricing Box Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/pricing-box', '.ugb-pricing-box' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/pricing-box' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/pricing-box', [
		{ value: 'Basic', selector: '.ugb-pricing-box--design-basic' },
		{ value: 'Plain', selector: '.ugb-pricing-box--design-plain' },
		{ value: 'Compact', selector: '.ugb-pricing-box--design-compact' },
		{ value: 'Colored', selector: '.ugb-pricing-box--design-colored' },
		{ value: 'Sectioned', selector: '.ugb-pricing-box--design-sectioned' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/pricing-box', [
		'Aurora Pricing Box',
		'Bean Pricing Box',
		'Cary Pricing Box',
		'Decora Pricing Box',
		'Detour Pricing Box',
		'Dim Pricing Box',
		'Dustin Pricing Box',
		'Elevate Pricing Box',
		'Flex Pricing Box',
		'Heights Pricing Box',
		'Hue Pricing Box',
		'Lounge Pricing Box',
		'Lume Pricing Box',
		'Lush Pricing Box',
		'Prime Pricing Box',
		'Speck Pricing Box',
		'Upland Pricing Box',
		'Yule Pricing Box',
	] ) )
}

