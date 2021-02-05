
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests,
} from '~stackable-e2e/helpers'

describe( 'Number Box Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/number-box', '.ugb-number-box' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/number-box' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/number-box', [
		'Basic',
		{ value: 'Plain', selector: '.ugb-number-box--design-plain' },
		{ value: 'Background', selector: '.ugb-number-box--design-background' },
		{ value: 'Heading', selector: '.ugb-number-box--design-heading' },
		{ value: 'heading2', selector: '.ugb-number-box--design-heading2' },
		{ value: 'Faded', selector: '.ugb-number-box--design-faded' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/number-box', [
		'Angled Number Box',
		'Aurora Number Box',
		'Capital Number Box',
		'Cary Number Box',
		'Elevate Number Box',
		'Flex Number Box',
		'Hue Number Box',
		'Lounge Number Box',
		'Lume Number Box',
		'Lush Number Box',
		'Propel Number Box',
		'Speck Number Box',
	] ) )
}

