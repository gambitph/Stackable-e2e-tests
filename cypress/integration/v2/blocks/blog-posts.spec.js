/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, responsiveAssertHelper, assertAdvancedTab,
} from '~stackable-e2e/helpers'

const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Blog Posts Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/blog-posts', '.ugb-blog-posts' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/blog-posts' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/blog-posts', [
		{ value: 'Basic', selector: '.ugb-blog-posts--design-basic' },
		{ value: 'List', selector: '.ugb-blog-posts--design-list' },
		{ value: 'Portfolio', selector: '.ugb-blog-posts--design-portfolio' },
		{ value: 'portfolio2', selector: '.ugb-blog-posts--design-portfolio2' },
		{ value: 'Vertical Card', selector: '.ugb-blog-posts--design-vertical-card' },
		{ value: 'Horizontal Card', selector: '.ugb-blog-posts--design-horizontal-card' },
		{ value: 'vertical-card2', selector: '.ugb-blog-posts--design-vertical-card2' },
		{ value: 'Image Card', selector: '.ugb-blog-posts--design-image-card' },
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

function advancedTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/blog-posts' )

	cy.openInspector( 'ugb/blog-posts', 'Advanced' )

	assertAdvancedTab( '.ugb-blog-posts', {
		viewport,
		customCssSelectors: [
			'.ugb-blog-posts__item',
			'.ugb-blog-posts__meta',
			'.ugb-blog-posts__title a',
			'.ugb-blog-posts__excerpt',
		],
	} )
}

