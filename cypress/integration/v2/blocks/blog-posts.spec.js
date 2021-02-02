/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests,
} from '~stackable-e2e/helpers'

describe( 'Blog Posts Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/blog-posts', '.ugb-blog-posts' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/blog-posts' ) )
}

function switchLayout() {
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
}

function switchDesign() {
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
}

