/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, responsiveAssertHelper, assertAdvancedTab, assertAligns,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Blog Posts Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	desktopStyle,
	tabletStyle,
	mobileStyle,
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

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/blog-posts' )
	cy.openInspector( 'ugb/blog-posts', 'Style' )

	cy.collapse( 'General' )
	desktopOnly( () => {
		cy.adjust( 'Columns', 3 )
		cy.adjust( 'Border Radius', 27 ).assertComputedStyle( {
			'.ugb-block-content': {
				'grid-template-columns': 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)',
			},
			'.ugb-blog-posts__featured-image': {
				'border-radius': '27px',
			},
		} )
		cy.adjust( 'Columns', 2 )
		cy.adjust( 'Shadow / Outline', 7 )
			.assertClassName( '.ugb-blog-posts__featured-image', 'ugb--shadow-7' )
		cy.adjust( 'Content Order', 'category,title,meta,excerpt' ).assertComputedStyle( {
			'.ugb-blog-posts__category': {
				'order': '1',
			},
			'ugb-blog-posts__title': {
				'order': '4',
			},
			'.ugb-blog-posts__meta': {
				'order': '5',
			},
			'.ugb-blog-posts__excerpt': {
				'order': '10',
			},
			'.ugb-blog-posts__readmore': {
				'order': '10',
			},
		} )
	} )

	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	// TODO: Post Settings Assertion

	cy.toggleStyle( 'Load More Button' )
	cy.collapse( 'Spacing' )
	cy.adjust( 'Paddings', 29, { viewport, unit: 'px' } ).assertComputedStyle( {
		'.ugb-blog-posts__item': {
			'padding-top': '29px',
			'padding-bottom': '29px',
			'padding-right': '29px',
			'padding-left': '29px',
		},
	} )
	cy.adjust( 'Paddings', 4, { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-blog-posts__item': {
			'padding-top': '4em',
			'padding-bottom': '4em',
			'padding-right': '4em',
			'padding-left': '4em',
		},
	} )
	cy.adjust( 'Paddings', 13, { viewport, unit: '%' } ).assertComputedStyle( {
		'.ugb-blog-posts__item': {
			'padding-top': '13%',
			'padding-bottom': '13%',
			'padding-right': '13%',
			'padding-left': '13%',
		},
	} )
	cy.adjust( 'Image', 37, { viewport } )
	cy.adjust( 'Category', 6, { viewport } )
	cy.adjust( 'Title', 29, { viewport } )
	cy.adjust( 'Excerpt', 24, { viewport } )
	cy.adjust( 'Meta', 18, { viewport } )
	cy.adjust( 'Read More', 27, { viewport } )
	cy.adjust( 'Load More', 32, { viewport } ).assertComputedStyle( {
		'.ugb-blog-posts__featured-image': {
			'margin-bottom': '37px',
		},
		'.ugb-blog-posts__category': {
			'margin-bottom': '6px',
		},
		'.ugb-blog-posts__title': {
			'margin-bottom': '29px',
		},
		'.ugb-blog-posts__excerpt': {
			'margin-bottom': '24px',
		},
		'.ugb-blog-posts__meta': {
			'margin-bottom': '18px',
		},
		'.ugb-blog-posts__readmore': {
			'margin-bottom': '27px',
		},
		'.ugb-blog-posts__load-more-button': {
			'margin-top': '32px',
		},
	} )
}

function advancedTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/blog-posts' )

	cy.openInspector( 'ugb/blog-posts', 'Advanced' )

	assertAdvancedTab( '.ugb-blog-posts', { viewport } )
}

