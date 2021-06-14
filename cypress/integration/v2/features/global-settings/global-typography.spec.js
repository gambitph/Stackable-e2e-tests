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

const [ desktopGlobal, tabletGlobal, mobileGlobal ] = responsiveAssertHelper( globalTypography, { tab: 'Global Typography' } )

describe( 'Global Settings', registerTests( [
	desktopGlobal,
	tabletGlobal,
	mobileGlobal,
] ) )

function globalTypography( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()

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

	desktopOnly( () => {
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

		blocks
			.filter( blockName => {
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
				return ! blacklist.includes( blockName )
			} )
			.forEach( blockName => {
				const name = blockName.split( '/' ).pop()

				cy.addBlock( blockName ).as( 'block' )
				const block = registerBlockSnapshots( 'block' )
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

	/*
	const tabletMobileViewports = [ 'Tablet', 'Mobile' ]
	if ( tabletMobileViewports.includes( viewport ) ) {
		cy.addBlock( 'core/paragraph' )
		range( 1, 8 ).forEach( idx => {
			cy.adjustGlobalTypography( globalTypo[ idx - 1 ].tag, {
				'Size': {
					value: globalTypo[ idx - 1 ].size,
					unit: 'px',
					viewport,
				},
				'Line-Height': {
					value: globalTypo[ idx - 1 ].lineHeight,
					unit: 'em',
					viewport,
				},
			} )
		} )

		blocks
			.filter( blockName => {
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
				return ! blacklist.includes( blockName )
			} )
			.forEach( blockName => {
				const name = blockName.split( '/' ).pop()

				cy.addBlock( blockName ).as( 'block' )
				const block = registerBlockSnapshots( 'block' )
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
				range( 1, 8 ).forEach( idx => {
					if ( blocksWithTitle.includes( blockName ) ) {
						cy.collapse( 'Title' )
						cy.adjust( 'Title HTML Tag', globalTypo[ idx - 1 ].tag ).assertComputedStyle( {
							[ `.ugb-${ name === 'count-up' ? 'countup' : name }__title` ]: {
								'font-size': `${ globalTypo[ idx - 1 ].size }px`,
								'line-height': `${ globalTypo[ idx - 1 ].lineHeight }em`,
							},
						} )
					}

					if ( blocksWithBlockTitle.includes( blockName ) ) {
						cy.toggleStyle( 'Block Title' )
						cy.adjust( 'Title HTML Tag', globalTypo[ idx - 1 ].tag ).assertComputedStyle( {
							[ `.ugb-${ name } .ugb-block-title` ]: {
								'font-size': `${ globalTypo[ idx - 1 ].size }px`,
								'line-height': `${ globalTypo[ idx - 1 ].lineHeight }em`,
							},
						} )
					}
				} )

				cy.getPostUrls().then( ( { editorUrl } ) => {
					block.assertFrontendStyles()
					cy.visit( editorUrl )
				} )
			} )
	} */

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

	/*
	blocks
		.filter( blockName => {
			// Blocks that do not have typography module / dynamic block
			const blacklist = [
				'ugb/container',
				'ugb/button',
				'ugb/blockquote',
				'ugb/divider',
				'ugb/spacer',
				'ugb/separator',
				'ugb/blog-posts',
			]
			return ! blacklist.includes( blockName )
		} )
		.forEach( blockName => {
			const name = blockName.split( '/' ).pop()

			// Adjust preview to the current viewport
			// We need to do this because Title HTML tag does not have viewport controls.
			cy.changePreviewMode( viewport )
			cy.openInspector( blockName, 'Style' )
			cy.selectBlock( blockName )

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
		} ) */

	// TODOs:
	// TypeError - Cannot read property originalContent of null
	// Blog posts typography test
}
