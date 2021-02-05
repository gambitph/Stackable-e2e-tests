/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests,
} from '~stackable-e2e/helpers'

describe( 'Testimonial Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/testimonial', '.ugb-testimonial' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/testimonial' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/testimonial', [
		{ value: 'Basic', selector: '.ugb-testimonial--design-basic' },
		{ value: 'Plain', selector: '.ugb-testimonial--design-plain' },
		{ value: 'basic2', selector: '.ugb-testimonial--design-basic2' },
		{ value: 'Bubble', selector: '.ugb-testimonial--design-bubble' },
		{ value: 'Background', selector: '.ugb-testimonial--design-background' },
		{ value: 'Vertical', selector: '.ugb-testimonial--design-vertical' },
		{ value: 'Vertical Inverse', selector: '.ugb-testimonial--design-vertical-inverse' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/testimonial', [
		'Arch Testimonial',
		'Chic Testimonial',
		'Devour Testimonial',
		'Dim Testimonial',
		'Elevate Testimonial',
		'Glow Testimonial',
		'Lounge Testimonial',
		'Lume Testimonial',
		'Lush Testimonial',
		'Peplum Testimonial',
		'Prime Testimonial 1',
		'Prime Testimonial 2',
		'Propel Testimonial',
		'Speck Testimonial',
		'Upland Testimonial',
		'Yule Testimonial',
	] ) )
}

