/**
 * Internal dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts,
} from '../support/helpers'

describe( 'Testimonial Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/testimonial', '.ugb-testimonial' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/testimonial' ) )

	it( 'should switch layout', switchLayouts( 'ugb/testimonial', [
		'Basic',
		'Plain',
		{
			value: 'basic2',
		},
		'Bubble',
		'Background',
		'Vertical',
		'Vertical Inverse',
	] ) )

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
} )
