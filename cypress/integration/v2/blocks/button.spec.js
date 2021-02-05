/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests,
} from '~stackable-e2e/helpers'

describe( 'Button Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/button', '.ugb-button' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/button' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/button', [
		'Basic',
		{ value: 'Spread', selector: '.ugb-button--design-spread' },
		{ value: 'fullwidth', selector: '.ugb-button--design-fullwidth' },
		{ value: 'Grouped 1', selector: '.ugb-button--design-grouped-1' },
		{ value: 'Grouped 2', selector: '.ugb-button--design-grouped-2' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/button', [
		'Chic Button',
		'Decora Button',
		'Elevate Button',
		'Glow Button',
		'Heights Button',
		'Lume Button',
	] ) )
}

