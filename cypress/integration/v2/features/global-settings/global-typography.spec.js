/**
 * External dependencies
 */

import { lowerCase, range } from 'lodash'
import { registerBlockSnapshots } from '~gutenberg-e2e/plugins'
import {
	responsiveAssertHelper,
	registerTests,
} from '~stackable-e2e/helpers'
import { blocks } from '~stackable-e2e/config'

const [ desktopGlobalTypography, tabletGlobalTypography, mobileGlobalTypography ] = responsiveAssertHelper( assertGlobalTypography, { disableItAssertion: true } )
const [ desktopUnits, tabletUnits, mobileUnits ] = responsiveAssertHelper( globalTypographyUnits, { disableItAssertion: true } )

describe( 'Global Typography', registerTests( [
	desktopGlobalTypography,
	tabletGlobalTypography,
	mobileGlobalTypography,
	desktopUnits,
	tabletUnits,
	mobileUnits,
	globalTypographyNativeBlocks,
	globalTypographyBlockAdjust,
] ) )

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
const blocksWithoutTexts = [
	'ugb/container',
	'ugb/button',
	'ugb/blockquote',
	'ugb/divider',
	'ugb/spacer',
	'ugb/separator',
	'ugb/blog-posts',
]

// Added native blocks
const nativeBlocks = [
	'core/heading',
	'core/paragraph',
	'core/list',
]

const willAssertTypographyStyles = [
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

function assertGlobalTypography( viewport, desktopOnly ) {
	it( `should assert all global typography options in ${ lowerCase( viewport ) }`, () => {
		cy.setupWP()
		cy.forceTypographyStyles()
		// Publish one post to test in blog-posts
		cy.registerPosts( { numOfPosts: 1 } )
		cy.newPage()
		cy.addBlock( 'core/paragraph' )
		willAssertTypographyStyles.forEach( val => {
			desktopOnly( () => {
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
			if ( viewport !== 'Desktop' ) {
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
			}
		} )

		const adjustAssertTypographyStyles = selector => {
			desktopOnly( () => {
				willAssertTypographyStyles.forEach( val => {
					cy.adjust( 'Title HTML Tag', val.tag ).assertComputedStyle( {
						[ selector ]: {
							'font-family': `${ val.font }, sans-serif`,
							'font-size': `${ val.size }px`,
							'font-weight': val.weight,
							'text-transform': val.transform,
							'line-height': `${ val.lineHeight }em`,
							'letter-spacing': `${ val.letterSpacing }px`,
						},
					} )
				} )
			} )
			if ( viewport !== 'Desktop' ) {
				willAssertTypographyStyles.forEach( val => {
					cy.changePreviewMode( viewport )
					cy.adjust( 'Title HTML Tag', val.tag ).assertComputedStyle( {
						[ selector ]: {
							'font-size': `${ val.size }px`,
							'line-height': `${ val.lineHeight }em`,
						},
					} )
				} )
			}
		}

		// Assert in blog posts first because this is a dynamic block.
		// It cannot use the block snapshots.
		cy.addBlock( 'ugb/blog-posts' )
		cy.openInspector( 'ugb/blog-posts', 'Style' )
		cy.collapse( 'Title' )
		adjustAssertTypographyStyles( '.ugb-blog-posts__title' )

		blocks
			.filter( blockName => ! blocksWithoutTexts.includes( blockName ) )
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

				if ( blocksWithTitle.includes( blockName ) ) {
					cy.collapse( 'Title' )
					adjustAssertTypographyStyles( `.ugb-${ name === 'count-up' ? 'countup' : name }__title` )
				}

				if ( blocksWithBlockTitle.includes( blockName ) ) {
					cy.toggleStyle( 'Block Title' )
					adjustAssertTypographyStyles( `.ugb-${ name } .ugb-block-title` )
				}

				cy.getPostUrls().then( ( { editorUrl } ) => {
					block.assertFrontendStyles()
					cy.visit( editorUrl )
				} )
			} )
	} )
}

function globalTypographyUnits( viewport ) {
	it( `should adjust emFontSize and pxLineHeight units of Global Typography in ${ viewport }`, () => {
		cy.setupWP()
		cy.forceTypographyStyles()
		// Publish one post to test in blog-posts
		cy.registerPosts( { numOfPosts: 1 } )
		cy.newPage()

		// Test fontSize em and lineHeight px values for all viewports
		const emFontSize = [ 4.2, 4.1, 3.9, 3.8, 3.7, 3.6, 3.5 ]
		const pxLineHeight = [ 64, 58, 54, 48, 44, 38, 34 ]

		cy.addBlock( 'core/paragraph' )
		emFontSize.forEach( ( fontSize, idx ) => {
			cy.adjustGlobalTypography( willAssertTypographyStyles[ idx ].tag, {
				'Size': {
					value: fontSize,
					unit: 'em',
					viewport,
				},
				'Line-Height': {
					value: pxLineHeight[ idx ],
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
		emFontSize.forEach( ( fontSize, idx ) => {
			// Adjust preview to the current viewport
			// We need to do this because Title HTML tag does not have viewport controls.
			cy.changePreviewMode( viewport )
			cy.adjust( 'Title HTML Tag', willAssertTypographyStyles[ idx ].tag ).assertComputedStyle( {
				'.ugb-blog-posts__title': {
					'font-size': `${ fontSize }em`,
					'line-height': `${ pxLineHeight[ idx ] }px`,
				},
			} )
		} )

		blocks
			.filter( blockName => ! blocksWithoutTexts.includes( blockName ) )
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

				emFontSize.forEach( ( fontSize, idx ) => {
					if ( blocksWithTitle.includes( blockName ) ) {
						cy.collapse( 'Title' )
						cy.adjust( 'Title HTML Tag', willAssertTypographyStyles[ idx ].tag ).assertComputedStyle( {
							[ `.ugb-${ name === 'count-up' ? 'countup' : name }__title` ]: {
								'font-size': `${ fontSize }em`,
								'line-height': `${ pxLineHeight[ idx ] }px`,
							},
						} )
					}

					if ( blocksWithBlockTitle.includes( blockName ) ) {
						cy.toggleStyle( 'Block Title' )
						cy.adjust( 'Title HTML Tag', willAssertTypographyStyles[ idx ].tag ).assertComputedStyle( {
							[ `.ugb-${ name } .ugb-block-title` ]: {
								'font-size': `${ fontSize }em`,
								'line-height': `${ pxLineHeight[ idx ] }px`,
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

function globalTypographyNativeBlocks() {
	it( 'should assert global typography on native blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/divider' ) // placeholder
		range( 1, 8 ).forEach( idx => {
			cy.adjustGlobalTypography( willAssertTypographyStyles[ idx - 1 ].tag, {
				'Font Family': willAssertTypographyStyles[ idx - 1 ].font,
				'Size': {
					value: willAssertTypographyStyles[ idx - 1 ].size,
					unit: 'px',
				},
				'Weight': willAssertTypographyStyles[ idx - 1 ].weight,
				'Transform': willAssertTypographyStyles[ idx - 1 ].transform,
				'Line-Height': {
					value: willAssertTypographyStyles[ idx - 1 ].lineHeight,
					unit: 'em',
				},
				'Letter Spacing': willAssertTypographyStyles[ idx - 1 ].letterSpacing,
			} )
		} )

	   nativeBlocks.forEach( blockName => {
			cy.addBlock( blockName )
			cy
				.get( `.wp-block[data-type='${ blockName }'` )
				.type( 'Block Title', { force: true } )

			if ( blockName === 'core/heading' ) {
				range( 1, 7 ).forEach( idx => {
					cy.changeHeadingLevel( blockName, 0, `Heading ${ idx }` )
					cy.selectBlock( blockName ).assertComputedStyle( {
						'': {
							'font-family': `${ willAssertTypographyStyles[ idx - 1 ].font }, sans-serif`,
							'font-size': `${ willAssertTypographyStyles[ idx - 1 ].size }px`,
							'font-weight': willAssertTypographyStyles[ idx - 1 ].weight,
							'text-transform': willAssertTypographyStyles[ idx - 1 ].transform,
							'line-height': `${ willAssertTypographyStyles[ idx - 1 ].lineHeight }em`,
							'letter-spacing': `${ willAssertTypographyStyles[ idx - 1 ].letterSpacing }px`,
						},
					} )
				} )
			} else if ( blockName === 'core/paragraph' || blockName === 'core/list' ) {
				cy.selectBlock( blockName ).assertComputedStyle( {
					[ `${ blockName === 'core/paragraph' ? '' : 'li' }` ]: {
						'font-family': `${ willAssertTypographyStyles[ 6 ].font }, sans-serif`,
						'font-size': `${ willAssertTypographyStyles[ 6 ].size }px`,
						'font-weight': willAssertTypographyStyles[ 6 ].weight,
						'text-transform': willAssertTypographyStyles[ 6 ].transform,
						'line-height': `${ willAssertTypographyStyles[ 6 ].lineHeight }em`,
						'letter-spacing': `${ willAssertTypographyStyles[ 6 ].letterSpacing }px`,
					},
				} )
			}
		} )
	} )
}

function globalTypographyBlockAdjust() {
	it( 'should not allow Global Typography to be applied on an adjusted block', () => {
		cy.setupWP()
		cy.newPage()

		cy.addBlock( 'ugb/accordion' )
		cy.adjustGlobalTypography( willAssertTypographyStyles[ 3 ].tag, {
			'Font Family': willAssertTypographyStyles[ 3 ].font,
			'Size': {
				value: willAssertTypographyStyles[ 3 ].size,
				unit: 'px',
			},
			'Weight': willAssertTypographyStyles[ 3 ].weight,
			'Transform': willAssertTypographyStyles[ 3 ].transform,
			'Line-Height': {
				value: willAssertTypographyStyles[ 3 ].lineHeight,
				unit: 'em',
			},
			'Letter Spacing': willAssertTypographyStyles[ 3 ].letterSpacing,
		} )

		cy.openInspector( 'ugb/accordion', 'Style' )
		cy.collapse( 'Title' )
		cy.adjust( 'Typography', {
			'Font Family': 'Adamina',
			'Size': 32,
			'Weight': '400',
			'Transform': 'lowercase',
			'Line-Height': 2.3,
			'Letter Spacing': 1.2,
		} ).assertComputedStyle( {
			'.ugb-accordion__title': {
				'font-family': 'Adamina, sans-serif',
				'font-size': '32px',
				'font-weight': '400',
				'text-transform': 'lowercase',
				'line-height': '2.3em',
				'letter-spacing': '1.2px',
			},
		} )
	} )
}
