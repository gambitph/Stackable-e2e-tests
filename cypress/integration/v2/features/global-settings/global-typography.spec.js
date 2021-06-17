/**
 * External dependencies
 */
import { range } from 'lodash'
import { registerBlockSnapshots } from '~gutenberg-e2e/plugins'
import {
	responsiveAssertHelper,
	registerTests,
} from '~stackable-e2e/helpers'

import { blocks } from '~stackable-e2e/config'

const [ , tabletGlobalTypo, mobileGlobalTypo ] = responsiveAssertHelper( assertGlobalTypographyTabletMobile, { disableItAssertion: true } )
const [ desktopUnits, tabletUnits, mobileUnits ] = responsiveAssertHelper( globalTypographyUnits, { disableItAssertion: true } )

describe( 'Global Typography', registerTests( [
	assertGlobalTypography,
	tabletGlobalTypo,
	mobileGlobalTypo,
	desktopUnits,
	tabletUnits,
	mobileUnits,
] ) )
describe( 'Global Settings', registerTests( [
	globalTypoNativeBlocks,
] ) )
//added native blocks
const nativeBlocks = [
	'core/paragraph',
	'core/list',
	'core/heading',
]
const globalTypo = [
	{
		tag: 'h1',
		font: 'Abel',
		size: 92,
		weight: 'bold',
		transform: 'uppercase',
		lineHeight: 1.3,
		letterSpacing: 2.1,
	},
	{
		tag: 'h2',
		font: 'Aclonica',
		size: 66,
		weight: '900',
		transform: 'capitalize',
		lineHeight: 1.2,
		letterSpacing: 1.1,
	},
	{
		tag: 'h3',
		font: 'ABeeZee',
		size: 50,
		weight: '100',
		transform: 'lowercase',
		lineHeight: 1.1,
		letterSpacing: 1.5,
	},
	{
		tag: 'h4',
		font: 'Acme',
		size: 38,
		weight: '300',
		transform: 'uppercase',
		lineHeight: 2.7,
		letterSpacing: 1.8,
	},
	{
		tag: 'h5',
		font: 'Akronim',
		size: 24,
		weight: '500',
		transform: 'capitalize',
		lineHeight: 2.1,
		letterSpacing: 3.9,
	},
	{
		tag: 'h6',
		font: 'Actor',
		size: 16,
		weight: '600',
		transform: 'uppercase',
		lineHeight: 1.4,
		letterSpacing: 3.5,
	},
	{
		tag: 'p',
		font: 'Alice',
		size: 15,
		weight: '200',
		transform: 'lowercase',
		lineHeight: 1.3,
		letterSpacing: 0.1,
	},
]

const blocksWithTitle = [
	'ugb/accordion',
	'ugb/heading',
	'ugb/text',
	'ugb/icon',
	'ugb/feature-grid',
	'ugb/image-box',
	'ugb/feature',
	'ugb/cta',
	'ugb/card',
	'ugb/header',
	'ugb/count-up',
	'ugb/pricing-box',
	'ugb/notification',
	'ugb/number-box',
	'ugb/expand',
]

const blocksWithBlockTitle = [
	'ugb/columns',
	'ugb/icon-list',
	'ugb/video-popup',
	'ugb/testimonial',
	'ugb/team-member',
]

// Blocks that do not have typography module / dynamic
const blacklist = [
	'ugb/container',
	'ugb/button',
	'ugb/blockquote',
	'ugb/divider',
	'ugb/spacer',
	'ugb/separator',
	'ugb/blog-posts',
]

function assertGlobalTypography() {
	it( 'should assert all global typography options', () => {
		cy.setupWP()
		cy.forceTypographyStyles()
		// Global settings should still load in the frontend.
		cy.loadFrontendJsCssFiles()
		// Publish one post to test in blog-posts
		cy.registerPosts( { numOfPosts: 1 } )
		cy.newPage()
		cy.addBlock( 'core/paragraph' )
		globalTypo.forEach( val => {
			cy.adjustGlobalTypography( val.tag, {
				'Font Family': val.font,
				'Size': {
					value: val.size,
					unit: 'px',
				},
				'Weight': val.weight,
				'Transform': val.transform,
				'Line-Height': {
					value: val.lineHeight,
					unit: 'em',
				},
				'Letter Spacing': val.letterSpacing,
			} )
		} )

		// Assert in blog posts first because this is a dynamic block.
		// It cannot use the block snapshots.
		cy.addBlock( 'ugb/blog-posts' )
		cy.openInspector( 'ugb/blog-posts', 'Style' )
		cy.collapse( 'Title' )
		globalTypo.forEach( val => {
			cy.adjust( 'Title HTML Tag', val.tag ).assertComputedStyle( {
				'.ugb-blog-posts__title': {
					'font-family': `${ val.font }, sans-serif`,
					'font-size': `${ val.size }px`,
					'font-weight': val.weight,
					'text-transform': val.transform,
					'line-height': `${ val.lineHeight }em`,
					'letter-spacing': `${ val.letterSpacing }px`,
				},
			} )
		} )

		blocks
			.filter( blockName => ! blacklist.includes( blockName ) )
			.forEach( blockName => {
				const name = blockName.split( '/' ).pop()

				cy.addBlock( blockName ).as( blockName )
				const block = registerBlockSnapshots( blockName )
				cy.openInspector( blockName, 'Style' )

				if ( Array( 'heading', 'text', 'expand' ).includes( name ) ) {
					if ( name === 'text' ) {
						cy.toggleStyle( 'Title' )
					}
					cy.typeBlock( blockName, `.ugb-${ name }__title`, 'Title for this block' )
				}

				globalTypo.forEach( val => {
					if ( blocksWithTitle.includes( blockName ) ) {
						cy.collapse( 'Title' )
						cy.adjust( 'Title HTML Tag', val.tag ).assertComputedStyle( {
							[ `.ugb-${ name === 'count-up' ? 'countup' : name }__title` ]: {
								'font-family': `${ val.font }, sans-serif`,
								'font-size': `${ val.size }px`,
								'font-weight': val.weight,
								'text-transform': val.transform,
								'line-height': `${ val.lineHeight }em`,
								'letter-spacing': `${ val.letterSpacing }px`,
							},
						} )
					}

					if ( blocksWithBlockTitle.includes( blockName ) ) {
						cy.toggleStyle( 'Block Title' )
						cy.adjust( 'Title HTML Tag', val.tag ).assertComputedStyle( {
							[ `.ugb-${ name } .ugb-block-title` ]: {
								'font-family': `${ val.font }, sans-serif`,
								'font-size': `${ val.size }px`,
								'font-weight': val.weight,
								'text-transform': val.transform,
								'line-height': `${ val.lineHeight }em`,
								'letter-spacing': `${ val.letterSpacing }px`,
							},
						} )
					}
				} )

				cy.getPostUrls().then( ( { editorUrl } ) => {
					block.assertFrontendStyles()
					cy.visit( editorUrl )
				} )
			} )
	} )
}

function assertGlobalTypographyTabletMobile( viewport ) {
	it( `should adjust ${ viewport } settings in Global Typography`, () => {
		if ( Array( 'Tablet', 'Mobile' ).includes( viewport ) ) {
			cy.setupWP()
			cy.forceTypographyStyles()
			// Global settings should still load in the frontend.
			cy.loadFrontendJsCssFiles()
			// Publish one post to test in blog-posts
			cy.registerPosts( { numOfPosts: 1 } )
			cy.newPage()
			cy.addBlock( 'core/paragraph' )
			globalTypo.forEach( val => {
				cy.adjustGlobalTypography( val.tag, {
					'Size': {
						value: val.size,
						unit: 'px',
						viewport,
					},
					'Line-Height': {
						value: val.lineHeight,
						unit: 'em',
						viewport,
					},
				} )
			} )

			// Assert in blog posts first because this is a dynamic block.
			// It cannot use the block snapshots.
			cy.addBlock( 'ugb/blog-posts' )
			cy.openInspector( 'ugb/blog-posts', 'Style' )
			cy.collapse( 'Title' )
			globalTypo.forEach( val => {
				// Adjust preview to the current viewport
				// We need to do this because Title HTML tag does not have viewport controls.
				cy.changePreviewMode( viewport )
				cy.adjust( 'Title HTML Tag', val.tag ).assertComputedStyle( {
					'.ugb-blog-posts__title': {
						'font-size': `${ val.size }px`,
						'line-height': `${ val.lineHeight }em`,
					},
				} )
			} )

			blocks
				.filter( blockName => ! blacklist.includes( blockName ) )
				.forEach( blockName => {
					const name = blockName.split( '/' ).pop()

					cy.addBlock( blockName ).as( blockName )
					const block = registerBlockSnapshots( blockName )
					cy.openInspector( blockName, 'Style' )

					if ( Array( 'heading', 'text', 'expand' ).includes( name ) ) {
						if ( name === 'text' ) {
							cy.toggleStyle( 'Title' )
						}
						cy.typeBlock( blockName, `.ugb-${ name }__title`, 'Title for this block' )
					}

					// Adjust preview to the current viewport
					// We need to do this because Title HTML tag does not have viewport controls.
					cy.changePreviewMode( viewport )

					// Test fontSize px and lineHeight em values for Tablet & Mobile
					globalTypo.forEach( val => {
						if ( blocksWithTitle.includes( blockName ) ) {
							cy.collapse( 'Title' )
							cy.adjust( 'Title HTML Tag', val.tag ).assertComputedStyle( {
								[ `.ugb-${ name === 'count-up' ? 'countup' : name }__title` ]: {
									'font-size': `${ val.size }px`,
									'line-height': `${ val.lineHeight }em`,
								},
							} )
						}

						if ( blocksWithBlockTitle.includes( blockName ) ) {
							cy.toggleStyle( 'Block Title' )
							cy.adjust( 'Title HTML Tag', val.tag ).assertComputedStyle( {
								[ `.ugb-${ name } .ugb-block-title` ]: {
									'font-size': `${ val.size }px`,
									'line-height': `${ val.lineHeight }em`,
								},
							} )
						}
					} )

					cy.getPostUrls().then( ( { editorUrl } ) => {
						block.assertFrontendStyles()
						cy.visit( editorUrl )
					} )
				} )
		}
	} )
}

function globalTypographyUnits( viewport ) {
	it( `should adjust emFontSize and pxLineHeight units of Global Typography in ${ viewport }`, () => {
		cy.setupWP()
		cy.forceTypographyStyles()
		// Global settings should still load in the frontend.
		cy.loadFrontendJsCssFiles()
		// Publish one post to test in blog-posts
		cy.registerPosts( { numOfPosts: 1 } )
		cy.newPage()

		// Test fontSize em and lineHeight px values for all viewports
		const emFontSize = [ 4.2, 4.1, 3.9, 3.8, 3.7, 3.6, 3.5 ]
		const pxLineHeight = [ 64, 58, 54, 48, 44, 38, 34 ]

		cy.addBlock( 'core/paragraph' )
		range( 1, 8 ).forEach( idx => {
			cy.adjustGlobalTypography( globalTypo[ idx - 1 ].tag, {
				'Size': {
					value: emFontSize[ idx - 1 ],
					unit: 'em',
					viewport,
				},
				'Line-Height': {
					value: pxLineHeight[ idx - 1 ],
					unit: 'px',
					viewport,
				},
			} )
		} )

		// Assert in blog posts first because this is a dynamic block.
		// It cannot use the block snapshots.
		cy.addBlock( 'ugb/blog-posts' )
		cy.openInspector( 'ugb/blog-posts', 'Style' )
		cy.collapse( 'Title' )
		range( 1, 8 ).forEach( idx => {
			// Adjust preview to the current viewport
			// We need to do this because Title HTML tag does not have viewport controls.
			cy.changePreviewMode( viewport )
			cy.adjust( 'Title HTML Tag', globalTypo[ idx - 1 ].tag ).assertComputedStyle( {
				'.ugb-blog-posts__title': {
					'font-size': `${ emFontSize[ idx - 1 ] }em`,
					'line-height': `${ pxLineHeight[ idx - 1 ] }px`,
				},
			} )
		} )

		blocks
			.filter( blockName => ! blacklist.includes( blockName ) )
			.forEach( blockName => {
				const name = blockName.split( '/' ).pop()

				cy.addBlock( blockName ).as( blockName )
				const block = registerBlockSnapshots( blockName )
				cy.openInspector( blockName, 'Style' )

				if ( Array( 'heading', 'text', 'expand' ).includes( name ) ) {
					if ( name === 'text' ) {
						cy.toggleStyle( 'Title' )
					}
					cy.typeBlock( blockName, `.ugb-${ name }__title`, 'Title for this block' )
				}

				// Adjust preview to the current viewport
				// We need to do this because Title HTML tag does not have viewport controls.
				cy.changePreviewMode( viewport )
				cy.openInspector( blockName, 'Style' )

				range( 1, 8 ).forEach( idx => {
					if ( blocksWithTitle.includes( blockName ) ) {
						cy.collapse( 'Title' )
						cy.adjust( 'Title HTML Tag', globalTypo[ idx - 1 ].tag ).assertComputedStyle( {
							[ `.ugb-${ name === 'count-up' ? 'countup' : name }__title` ]: {
								'font-size': `${ emFontSize[ idx - 1 ] }em`,
								'line-height': `${ pxLineHeight[ idx - 1 ] }px`,
							},
						} )
					}

					if ( blocksWithBlockTitle.includes( blockName ) ) {
						cy.toggleStyle( 'Block Title' )
						cy.adjust( 'Title HTML Tag', globalTypo[ idx - 1 ].tag ).assertComputedStyle( {
							[ `.ugb-${ name } .ugb-block-title` ]: {
								'font-size': `${ emFontSize[ idx - 1 ] }em`,
								'line-height': `${ pxLineHeight[ idx - 1 ] }px`,
							},
						} )
					}
				} )

				cy.getPostUrls().then( ( { editorUrl } ) => {
					block.assertFrontendStyles()
					cy.visit( editorUrl )
				} )
			} )
	} )
}

function globalTypoNativeBlocks() {
	it( 'should assert global typography on native blocks', () => {
	   cy.setupWP()
	   cy.registerPosts( { numOfPosts: 1 } )
	   cy.newPage()

	   // add the native blocks
	   nativeBlocks.forEach( blockName => {
		   cy.addBlock( blockName )
		   cy
			   .get( `.wp-block[data-type='${ blockName }']` )
			   .type( 'Block Title', { force: true } )
			//if cy.get returns a heading type, test using changeHeadingLevel
			//else,ifblock is a paragraph, run this:
		   cy.selectBlock( blockName ).assertComputedStyle( {
			   '': {
				   'font-family': `${ globalTypo[ 6 ].font }, sans-serif`,
				   'font-size': `${ globalTypo[ 6 ].size }px`,
				   'font-weight': globalTypo[ 6 ].weight,
				   'text-transform': globalTypo[ 6 ].transform,
				   'line-height': `${ globalTypo[ 6 ].lineHeight }em`,
				   'letter-spacing': `${ globalTypo[ 6 ].letterSpacing }px`,
			   },
		   } )
	   } )
	} )
}
