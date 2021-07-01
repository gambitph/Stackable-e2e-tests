/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, responsiveAssertHelper, assertAdvancedTab, assertAligns, assertTypography, assertBlockTitleDescription, assertBlockBackground, assertSeparators,
	assertBlockTitleDescriptionContent,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Blog Posts Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	typeContent,
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

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.registerPosts( { numOfPosts: 1 } )
		cy.newPage()
		cy.addBlock( 'ugb/blog-posts' )

		cy.openInspector( 'ugb/blog-posts', 'Style' )
		cy.toggleStyle( 'Load More Button' )

		cy.typeBlock( 'ugb/blog-posts', '.ugb-button--inner', 'Helloo World!! 12345' )
			.assertBlockContent( '.ugb-button--inner', 'Helloo World!! 12345' )

		assertBlockTitleDescriptionContent( 'ugb/blog-posts' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.registerPosts( { numOfPosts: 4 } )
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
			'.ugb-blog-posts__title': {
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

	desktopOnly( () => {
		cy.collapse( 'Posts Settings' )
		cy.adjust( 'Number of items', 4 )
		cy
			.get( '.ugb-block-content' )
			.find( '.ugb-blog-posts__item' )
			.should( 'have.length', 4 )

		cy.adjust( 'Offset', 2 )
		cy
			.get( '.ugb-block-content' )
			.find( '.ugb-blog-posts__item' )
			.should( 'have.length', 2 )
		cy.resetStyle( 'Offset' )

		/**
		 * TODOs:
		 * - Order by
		 * - Post Type
		 * - Filter by Taxonomy
		 * - Taxonomy Filter Type
		 * - Categories / Tags
		 * - Exclude Post IDs
		 * - Display Specific Post IDs
		 */
	} )

	cy.toggleStyle( 'Load More Button' )
	cy.collapse( 'Spacing' )
	cy.adjust( 'Paddings', [ 25, 26, 27, 28 ], { viewport, unit: 'px' } ).assertComputedStyle( {
		'.ugb-blog-posts__item': {
			'padding-top': '25px',
			'padding-right': '26px',
			'padding-bottom': '27px',
			'padding-left': '28px',
		},
	} )
	cy.adjust( 'Paddings', [ 3, 4, 5, 6 ], { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-blog-posts__item': {
			'padding-top': '3em',
			'padding-right': '4em',
			'padding-bottom': '5em',
			'padding-left': '6em',
		},
	} )
	cy.adjust( 'Paddings', [ 17, 18, 19, 20 ], { viewport, unit: '%' } ).assertComputedStyle( {
		'.ugb-blog-posts__item': {
			'padding-top': '17%',
			'padding-right': '18%',
			'padding-bottom': '19%',
			'padding-left': '20%',
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

	cy.collapse( 'Featured Image' )
	// TODO: Add Image Size assertion
	cy.adjust( 'Image Height', 357, { viewport } ).assertComputedStyle( {
		'.ugb-blog-posts__featured-image img': {
			'height': '357px',
		},
	} )

	cy.collapse( 'Category' )
	assertTypography( '.ugb-blog-posts__category', { viewport } )
	desktopOnly( () => {
		cy.adjust( 'Color', '#7689d5' ).assertComputedStyle( {
			'.ugb-blog-posts__category a': {
				'color': '#7689d5',
			},
		} )
		cy.adjust( 'Highlighted', true )
			.assertClassName( '.ugb-blog-posts', 'ugb-blog-posts--cat-highlighted' )
		cy.adjust( 'Color', '#d57575' ).assertComputedStyle( {
			'.ugb-blog-posts__category a': {
				'background-color': '#d57575',
			},
		} )
		cy.adjust( 'Hover Color', '#ffffff' )
	} )
	assertAligns( 'Align', '.ugb-blog-posts__category', { viewport } )

	cy.collapse( 'Title' )
	assertTypography( '.ugb-blog-posts__title', { viewport } )
	desktopOnly( () => {
		cy.adjust( 'Title HTML Tag', 'h5' )
			.assertHtmlTag( '.ugb-blog-posts__title', 'h5' )
		cy.adjust( 'Text Color', '#5d5af3' ).assertComputedStyle( {
			'.ugb-blog-posts__title a': {
				'color': '#5d5af3',
			},
		} )
		cy.adjust( 'Hover Color', '#ffffff' )
	} )
	assertAligns( 'Align', '.ugb-blog-posts__title', { viewport } )

	cy.collapse( 'Excerpt' )
	assertTypography( '.ugb-blog-posts__excerpt', { viewport } )
	desktopOnly( () => {
		cy.adjust( 'Excerpt Length', 43 )
		cy.adjust( 'Text Color', '#7f40d1' ).assertComputedStyle( {
			'.ugb-blog-posts__excerpt': {
				'color': '#7f40d1',
			},
		} )
	} )
	assertAligns( 'Align', '.ugb-blog-posts__excerpt', { viewport } )

	cy.collapse( 'Meta' )
	assertTypography( '.ugb-blog-posts__meta', { viewport } )
	desktopOnly( () => {
		cy.adjust( 'Show Author', true )
		cy.get( '.ugb-blog-posts__meta' ).contains( 'admin' ).should( 'exist' )
		cy.adjust( 'Show Comments', true )
		cy.get( '.ugb-blog-posts__meta' ).contains( 'comments' ).should( 'exist' )
		cy.adjust( 'Show Date', true )
		cy.get( '.ugb-blog-posts__date' ).should( 'exist' )
		cy.adjust( 'Text Color', '#ff5500' ).assertComputedStyle( {
			'.ugb-blog-posts__meta': {
				'color': '#ff5500',
			},
		} )
		cy.adjust( 'Separator', 'comma' )
		cy
			.get( '.ugb-blog-posts__content' )
			.find( '.ugb-blog-posts__meta' ).contains( ',' ).should( 'exist' )
	} )
	assertAligns( 'Align', '.ugb-blog-posts__meta', { viewport } )

	cy.collapse( 'Read More Link' )
	assertTypography( '.ugb-blog-posts__readmore', { viewport } )
	desktopOnly( () => {
		cy.adjust( 'Customize Read More Link', 'click here' )
		cy.get( '.ugb-blog-posts__readmore a' ).contains( 'click here' ).should( 'exist' )
		cy.adjust( 'Text Color', '#ff6a6a' ).assertComputedStyle( {
			'.ugb-blog-posts__readmore a': {
				'color': '#ff6a6a',
			},
		} )
		cy.adjust( 'Hover Color', '#ffffff' )
	} )
	assertAligns( 'Align', '.ugb-blog-posts__readmore', { viewport } )

	// Test Pagination.
	cy.collapse( 'Posts Settings' )
	cy.adjust( 'Number of items', 2 )
	cy.toggleStyle( 'Pagination' )
	desktopOnly( () => {
		cy.adjust( 'Show previous and next buttons', true )
		cy.adjust( 'Previous label', 'Prev' )
		cy.adjust( 'Next label', 'Next' )

		cy.adjust( 'Color Type', 'gradient' )
		cy.adjust( 'Button Color #1', '#a13939' )
		cy.adjust( 'Button Color #2', '#4e59d4' )
		cy.adjust( 'Gradient Direction (degrees)', 138 ).assertComputedStyle( {
			'.ugb-blog-posts__pagination .ugb-button': {
				'background-image': 'linear-gradient(138deg, #a13939, #4e59d4)',
			},
		} )
		cy.adjust( 'Text Color', '#ffa03b' )
		cy.adjust( 'Hover Effect', 'scale' )
			.assertClassName( '.ugb-blog-posts__pagination > button', 'ugb--hover-effect-scale' )
		cy.adjust( 'Hover & Active Opacity', 0.6 )
		cy.adjust( 'Hover & Active Colors', {
			'Button Color #1': '#bd8b8b',
			'Button Color #2': '#3fa35b',
			'Gradient Direction (degrees)': 72,
			'Text Color': '#80194d',
		} )

		assertTypography( '.ugb-blog-posts__pagination .ugb-button .ugb-button--inner', { enableLineHeight: false } )
		cy.adjust( 'Button Size', 'large' )
			.assertClassName( '.ugb-blog-posts__pagination .ugb-button', 'ugb-button--size-large' )
		cy.adjust( 'Border Radius', 40 )
		cy.adjust( 'Vertical Padding', 15 )
		cy.adjust( 'Horizontal Padding', 43 )
		cy.adjust( 'Shadow', 4 ).assertClassName( '.ugb-blog-posts__pagination .ugb-button', 'ugb--shadow-4' )
		cy.adjust( 'Opacity', 0.6 ).assertComputedStyle( {
			'.ugb-blog-posts__pagination .ugb-button': {
				'padding-top': '15px',
				'padding-right': '43px',
				'padding-bottom': '15px',
				'padding-left': '43px',
				'opacity': '0.6',
				'border-radius': '40px',
			},
			'.ugb-blog-posts__pagination .is-active': {
				'background-image': 'linear-gradient(72deg, #bd8b8b, #3fa35b)',
			},
		} )
	} )

	if ( viewport !== 'Desktop' ) {
		assertTypography( '.ugb-blog-posts__pagination .ugb-button .ugb-button--inner', {
			viewport,
			enableWeight: false,
			enableTransform: false,
			enableLineHeight: false,
			enableLetterSpacing: false,
		} )
	}

	assertAligns( 'Align', '.ugb-blog-posts__pagination.ugb-button-container', { viewport } )

	cy.toggleStyle( 'Load More Button' )
	cy.typeBlock( 'ugb/blog-posts', '.ugb-button .ugb-button--inner', 'More Posts' )
	cy.collapse( 'Load More Button' )
	cy.waitFA()
	cy.adjust( 'Icon', 'info' )
	desktopOnly( () => {
		// TODO; Add assertion for Number of items
		cy.adjust( 'Color Type', 'gradient' )
		cy.adjust( 'Button Color #1', '#a13939' )
		cy.adjust( 'Button Color #2', '#4e59d4' )
		cy.adjust( 'Gradient Direction (degrees)', 138 )
		cy.adjust( 'Text Color', '#ffa03b' )
		cy.adjust( 'Hover Effect', 'scale' )
			.assertClassName( '.ugb-button', 'ugb--hover-effect-scale' )
		cy.adjust( 'Hover Opacity', 0.6 )
		cy.adjust( 'Hover Colors', {
			'Button Color #1': '#bd8b8b',
			'Button Color #2': '#3fa35b',
			'Gradient Direction (degrees)': 72,
			'Text Color': '#80194d',
		} )

		assertTypography( '.ugb-button .ugb-button--inner', { enableLineHeight: false } )
		cy.adjust( 'Button Size', 'large' )
			.assertClassName( '.ugb-button', 'ugb-button--size-large' )
		cy.adjust( 'Border Radius', 40 )
		cy.adjust( 'Vertical Padding', 15 )
		cy.adjust( 'Horizontal Padding', 43 )
		cy.adjust( 'Shadow', 4 )
		cy.adjust( 'Opacity', 0.6 ).assertComputedStyle( {
			'.ugb-button': {
				'background-color': '#a13939',
				'background-image': 'linear-gradient(138deg, #a13939, #4e59d4)',
				'padding-top': '15px',
				'padding-right': '43px',
				'padding-bottom': '15px',
				'padding-left': '43px',
				'opacity': '0.6',
				'border-radius': '40px',
			},
		} )
		cy.adjust( 'Adv. Icon Settings', {
			'Icon Size': 41,
			'Icon Spacing': 25,
		} ).assertComputedStyle( {
			'.ugb-button svg': {
				'height': '41px',
				'width': '41px',
				'margin-right': '25px',
			},
		} )
	} )

	if ( viewport !== 'Desktop' ) {
		assertTypography( '.ugb-button .ugb-button--inner', {
			viewport,
			enableWeight: false,
			enableTransform: false,
			enableLineHeight: false,
			enableLetterSpacing: false,
		} )
	}

	assertAligns( 'Align', '.ugb-button-container', { viewport } )

	assertBlockTitleDescription( { viewport } )
	assertBlockBackground( '.ugb-blog-posts', { viewport } )
	assertSeparators( { viewport } )
}

function advancedTab( viewport ) {
	cy.setupWP()
	cy.registerPosts( { numOfPosts: 1 } )
	cy.newPage()
	cy.addBlock( 'ugb/blog-posts' )

	cy.openInspector( 'ugb/blog-posts', 'Advanced' )

	assertAdvancedTab( '.ugb-blog-posts', {
		viewport,
		customCssSelectors: [
			'.ugb-blog-posts__item',
			'.ugb-blog-posts__category',
			'.ugb-blog-posts__meta',
			'.ugb-blog-posts__title a',
			'.ugb-blog-posts__excerpt',
		],
	} )
}

