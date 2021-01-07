/**
 * Internal dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts,
} from '../support/helpers'

describe( 'Blog Posts Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/blog-posts', '.ugb-blog-posts' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/blog-posts' ) )

	it( 'should switch layout', switchLayouts( 'ugb/blog-posts', [
		'Basic',
		'List',
		'Portfolio',
		{
			value: 'portfolio2',
		},
		'Vertical Card',
		'Horizontal Card',
		{
			value: 'vertical-card2',
		},
		'Image Card',
	] ) )

	it( 'should switch design', switchDesigns( 'ugb/blog-posts', [
		'Cary Blog Post',
		'Decora Blog Post',
		'Dim Blog Post',
		'Dustin Blog Post',
		'Elevate Blog Post',
		'Hue Blog Post',
		'Lounge Blog Post',
		'Lume Blog Post',
		'Lush Blog Post',
		'Peplum Blog Post',
		'Prime Blog Post',
		'Propel Blog Post',
	] ) )
} )
