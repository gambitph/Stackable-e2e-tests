/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, responsiveAssertHelper, assertAdvancedTab, assertAligns, assertTypography, assertBlockTitleDescription, assertBlockBackground, assertSeparators,
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
	cy.adjust( 'Paddings', [ 21, 22, 23, 24 ], { viewport, unit: 'px' } ).assertComputedStyle( {
		'.ugb-blog-posts__item': {
			'padding-top': '21px',
			'padding-bottom': '23px',
			'padding-right': '22px',
			'padding-left': '24px',
		},
	} )
	cy.collapse( 'Spacing' )
	cy.adjust( 'Paddings', [ 1, 2, 3, 4 ], { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-blog-posts__item': {
			'padding-top': '1em',
			'padding-bottom': '3em',
			'padding-right': '2em',
			'padding-left': '4em',
		},
	} )
	cy.collapse( 'Spacing' )
	cy.adjust( 'Paddings', [ 13, 14, 15, 16 ], { viewport, unit: '%' } ).assertComputedStyle( {
		'.ugb-blog-posts__item': {
			'padding-top': '13%',
			'padding-bottom': '15%',
			'padding-right': '14%',
			'padding-left': '16%',
		},
	} )
	cy.collapse( 'Spacing' )
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
	assertTypography( '.ugb-blog-posts__category a', { viewport } )
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
	assertAligns( 'Align', '.ugb-blog-posts__category a', { viewport } )

	cy.collapse( 'Title' )
	assertTypography( '.ugb-blog-posts__title a', { viewport } )
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
	assertAligns( 'Align', '.ugb-blog-posts__title a', { viewport } )

	cy.collapse( 'Excerpt' )
	assertTypography( '.ugb-blog-posts__excerpt p', { viewport } )
	desktopOnly( () => {
		cy.adjust( 'Excerpt Length', 43 )
		cy.adjust( 'Text Color', '#7f40d1' ).assertComputedStyle( {
			'.ugb-blog-posts__excerpt p': {
				'color': '#7f40d1',
			},
		} )
	} )
	assertAligns( 'Align', '.ugb-blog-posts__excerpt p', { viewport } )

	cy.collapse( 'Meta' )
	assertTypography( '.ugb-blog-posts__meta', { viewport } )
	desktopOnly( () => {
		// TODO: Add assertion for Show Author & Show Comments
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
			.then( content => {
				content.find( '.ugb-blog-posts__meta' )
				expect( '.ugb-blog-posts__meta' ).to.contain( ',' )
			} )
	} )
	assertAligns( 'Align', '.ugb-blog-posts__meta', { viewport } )

	cy.collapse( 'Read More Link' )
	assertTypography( '.ugb-blog-posts__readmore a', { viewport } )
	desktopOnly( () => {
		// TODO: Add assertion for Read More text
		cy.adjust( 'Text Color', '#ff6a6a' ).assertComputedStyle( {
			'.ugb-blog-posts__readmore a': {
				'color': '#ff6a6a',
			},
		} )
		cy.adjust( 'Hover Color', '#ffffff' )
	} )
	assertAligns( 'Align', '.ugb-blog-posts__readmore a', { viewport } )

	cy.typeBlock( 'ugb/blog-posts', '.ugb-button .ugb-button--inner', 'More Posts' )
	cy.collapse( 'Load More Button' )
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
		cy.waitFA()
		cy.adjust( 'Icon', 'info' )
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
	cy.newPage()
	cy.addBlock( 'ugb/blog-posts' )

	cy.openInspector( 'ugb/blog-posts', 'Advanced' )

	assertAdvancedTab( '.ugb-blog-posts', { viewport } )
}

