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

const [ desktopGlobal, tabletGlobal, mobileGlobal ] = responsiveAssertHelper( globalTypoNativeBlocks, { tab: 'Global Typography on Native Blocks' } )

describe( 'Global Settings', registerTests( [
	 desktopGlobal,
	 tabletGlobal,
	 mobileGlobal,
] ) ) //Viewports

function globalTypoNativeBlocks( viewport, desktopOnly ) {
	it( 'should assert global typography on native blocks', () => {
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

		const nativeBlocks = [
			'core/paragraph',
			'core/list',
			'core/heading',
		]
		// eslint-disable-next-line no-undef
		desktopOnly( () => {
			cy.addBlock( 'core / paragraph' )
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

			/*
		//adding a block for each native block
		nativeBlocks.forEach( blockName => {
			cy.addBlock( blockName )
		} )
		*/
			//should then type in sample text for each native block type (list, para, h1-h6)
			//assertion for applying global typo

			blocks
				.filter( blockName => {
					const blacklist = [
						'core/embed',
						'core/latest-posts',
						'core/html',
						'core/cover',
						'core/buttons',
						'core/media-text',
						'core/separator',
						'core/image',
						'core/gallery',
						'core/quote',
						'core/shortcode',
						'core/archives',
						'core/audio',
						'core/categories',
						'core/pullquote',
						'core/social-links',
						'core/spacer',
						'core/video',
						'core/calendar',
						'core/code',
						'core/columns',
						'core/file',
						'core/group',
						'core/latest-comments',
						'core/more',
						'core/nextpage',
						'core/preformatted',
						'core/rss',
						'core/table',
						'core/tag-cloud',
						'core/verse',
						'core/search',
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
						if ( nativeBlocks.includes( blockName ) ) {
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
							} 	)
						}

						if ( nativeBlocks.includes( blockName ) ) {
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
	} )
}
