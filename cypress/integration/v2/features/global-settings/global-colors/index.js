/**
 * External dependencies
 */
import { blocks } from '~stackable-e2e/config'
import { compareVersions } from '~common/util'

const colors = [
	{
		name: 'Custom Color Red',
		color: '#ff0000',
	},
	{
		name: 'Aqua',
		color: '#3fcee8',
	},
	{
		name: 'Yellow Sun',
		color: '#f2e374',
	},
	{
		name: 'Stackable Pink',
		color: '#f00069',
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
	'ugb/blog-posts',
]

const blocksWithSeparator = [
	'ugb/columns',
	'ugb/container',
	'ugb/icon-list',
	'ugb/video-popup',
	'ugb/testimonial',
	'ugb/team-member',
	'ugb/button',
	'ugb/blockquote',
]

export function adjustGlobalColorTest() {
	it( 'should adjust global colors and assert the color picker in blocks', () => {
		cy.setupWP()
		// Global settings should still load in the frontend.
		cy.loadFrontendJsCssFiles()
		// Publish one post to test global colors in blog-posts
		cy.registerPosts( { numOfPosts: 1 } )
		cy.newPage()

		// Add Global colors
		cy.addBlock( 'core/paragraph' )
		colors.forEach( val => {
			cy.addEditGlobalColor( {
				name: val.name,
				color: val.color,
			} )
		} )
		cy.adjust( 'Use only Stackable colors', true )

		// Assert the colors in blog posts first because this is a dynamic block.
		// It cannot use the block snapshots.
		cy.addBlock( 'ugb/blog-posts' )
		cy.openInspector( 'ugb/blog-posts', 'Style' )
		cy.collapse( 'Title' )
		colors.forEach( val => {
			cy.adjust( 'Text Color', val.name ).assertComputedStyle( {
				'.ugb-blog-posts__title a': {
					'color': val.color,
				},
			} )
		} )

		blocks
			.filter( blockName => blockName !== 'ugb/blog-posts' )
			.forEach( blockName => {
				const name = blockName.split( '/' ).pop()
				cy.addBlock( blockName ).asBlock( blockName, { isStatic: true } )
				cy.openInspector( blockName, 'Style' )

				// Check if the Global colors are added in blocks
				if ( blocksWithTitle.includes( blockName ) ) {
					// Type into heading, text and expand block title for color assertion.
					if ( Array( 'heading', 'text', 'expand' ).includes( name ) ) {
						if ( name === 'text' ) {
							cy.toggleStyle( 'Title' )
						}
						cy.typeBlock( blockName, `.ugb-${ name }__title`, 'Title for this block' )
					}

					cy.collapse( 'Title' )
					// Assert each added global color in blocks with title
					colors.forEach( val => {
						cy
							.adjust( 'Title Color', val.name )
							.assertComputedStyle( {
								[ `.ugb-${ name === 'count-up' ? 'countup' : name }__title` ]: {
									'color': val.color,
								},
							} )
					} )
				}

				if ( blocksWithSeparator.includes( blockName ) ) {
					cy.collapse( 'Top Separator' )
					colors.forEach( val => {
						cy
							.adjust( 'Color', val.name )
							.assertComputedStyle( {
								'.ugb-top-separator svg': {
									'fill': val.color,
								},
							} )
					} )
				}

				if ( name === 'divider' || name === 'spacer' ) {
					cy.collapse( 'General' )
					colors.forEach( val => {
						cy
							.adjust( `${ blockName === 'ugb/divider' ? 'Color' : 'Background Color' }`, val.name )
							.assertComputedStyle( {
								[ `${ name === 'divider' ? '.ugb-divider__hr' : '.ugb-spacer--inner' }` ]: {
									'background-color': val.color,
								},
							} )
					} )
				}

				if ( name === 'separator' ) {
					cy.collapse( 'Separator' )
					colors.forEach( val => {
						cy
							.adjust( 'Separator Color', val.name )
							.assertComputedStyle( {
								'.ugb-separator__layer-1': {
									'fill': val.color,
								},
							} )
					} )
				}

				cy.getPostUrls().then( ( { editorUrl } ) => {
					cy.assertFrontendStyles( `@${ blockName }` )
					cy.visit( editorUrl )
				} )
			} )

		cy.savePost()
	} )
}

export function changeGlobalColorTest() {
	it( 'should assert the changing of global color', () => {
		cy.setupWP()
		// Global settings should still load in the frontend.
		cy.loadFrontendJsCssFiles()
		cy.registerPosts( { numOfPosts: 1 } )
		cy.newPage()

		cy.addBlock( 'core/paragraph' )
		// Add one global color: Stackable Pink
		cy.addEditGlobalColor( {
			name: colors[ 3 ].name,
			color: colors[ 3 ].color,
		} )
		cy.adjust( 'Use only Stackable colors', true )

		blocks
			.forEach( blockName => {
				const name = blockName.split( '/' ).pop()
				cy.addBlock( blockName )
				cy.openInspector( blockName, 'Style' )

				if ( blocksWithTitle.includes( blockName ) ) {
					// Type into heading, text and expand block title for color assertion.
					if ( Array( 'heading', 'text', 'expand' ).includes( name ) ) {
						if ( name === 'text' ) {
							cy.toggleStyle( 'Title' )
						}
						cy.typeBlock( blockName, `.ugb-${ name }__title`, 'Title for this block' )
					}

					cy.collapse( 'Title' )
					// Set the title color to: Stackable Pink
					cy.adjust( `${ name === 'blog-posts' ? 'Text' : 'Title' } Color`, 1 )
				}

				if ( blocksWithSeparator.includes( blockName ) ) {
					cy.collapse( 'Top Separator' )
					// Set the separator color to: Stackable Pink
					cy.adjust( 'Color', 1 )
				}

				if ( name === 'divider' || name === 'spacer' ) {
					cy.collapse( 'General' )
					// Set the color to: Stackable Pink
					cy.adjust( `${ blockName === 'ugb/divider' ? 'Color' : 'Background Color' }`, 1 )
				}

				if ( name === 'separator' ) {
					cy.collapse( 'Separator' )
					// Set the color to: Stackable Pink
					cy.adjust( 'Separator Color', 1 )
				}
			} )

		// Edit the global color: Stackable Pink to Aquamarine
		cy.addBlock( 'core/paragraph' )
		cy.addEditGlobalColor( {
			name: 'Aquamarine',
			color: '#0ccbbf',
			currName: 'Stackable Pink',
		} )
		// Assert the edited global color in blocks
		blocks
			.forEach( blockName => {
				const name = blockName.split( '/' ).pop()
				cy.openInspector( blockName, 'Style' )

				// Assert the Aquamarine global color in blocks
				if ( blocksWithTitle.includes( blockName ) && name !== 'blog-posts' ) {
					cy
						.selectBlock( blockName )
						.assertComputedStyle( {
							[ `.ugb-${ name === 'count-up' ? 'countup' : name }__title` ]: {
								'color': '#0ccbbf',
							},
						} )
				}

				if ( name === 'blog-posts' ) {
					cy
						.selectBlock( blockName )
						.assertComputedStyle( {
							'.ugb-blog-posts__title a': {
								'color': '#0ccbbf',
							},
						} )
				}

				if ( blocksWithSeparator.includes( blockName ) ) {
					cy
						.selectBlock( blockName )
						.assertComputedStyle( {
							'.ugb-top-separator svg': {
								'fill': '#0ccbbf',
							},
						} )
				}

				if ( name === 'divider' || name === 'spacer' ) {
					cy
						.selectBlock( blockName )
						.assertComputedStyle( {
							[ `${ name === 'divider' ? '.ugb-divider__hr' : '.ugb-spacer--inner' }` ]: {
								'background-color': '#0ccbbf',
							},
						} )
				}

				if ( name === 'separator' ) {
					// Adjust a random option in Separator to assert the global color
					// selectBlock does not work in Separator due to its html structure.
					cy.collapse( 'Separator' )
					cy
						.adjust( 'Shadow', true )
						.assertComputedStyle( {
							'.ugb-separator__layer-1': {
								'fill': '#0ccbbf',
							},
						} )
				}
			} )

		cy.savePost()
	} )
}

export function globalColorNativeBlocks() {
	it( 'should assert global colors in native blocks', () => {
		cy.setupWP()

		// Global settings should still load in the frontend.
		cy.loadFrontendJsCssFiles()
		cy.newPage()

		const nativeBlocks = [
			'core/paragraph',
			'core/separator',
			'core/heading',
			'core/list',
			'core/buttons',
			'core/cover',
		]

		nativeBlocks.forEach( blockName => {
			cy.addBlock( blockName )
			if ( blockName !== 'core/separator' && blockName !== 'core/cover' ) {
				cy
					.get( `.wp-block[data-type='${ blockName }']` )
					.type( 'Block Title', { force: true } )
			}
			if ( blockName === 'core/buttons' ) {
				cy.typeBlock( 'core/button', '.wp-block-button__link', 'My button' )
			}
		} )

		colors.forEach( val => {
			cy.addEditGlobalColor( {
				name: val.name,
				color: val.color,
			} )
		} )
		cy.adjust( 'Use only Stackable colors', true )

		const isWpLessThan58 = () => compareVersions( Cypress.env( 'WORDPRESS_VERSION' ), '5.8.0', '<' )

		nativeBlocks.forEach( blockName => {
			if ( blockName !== 'core/cover' ) {
				cy.selectBlock( `${ blockName === 'core/buttons' ? 'core/button' : blockName }` )
				cy.openSidebar( 'Settings' )
				cy.collapse( `${ isWpLessThan58() ? 'Color settings' : 'Color' }` )
				colors.forEach( val => {
					cy
						.adjust( `${ blockName === 'core/separator'
							? 'Color'
							: isWpLessThan58()
								? 'Text Color'
								: 'Text color' }`, val.name )
						.assertComputedStyle( {
							[ `${ blockName === 'core/buttons' ? '.wp-block-button__link' : '' }` ]: {
								'color': val.color,
							},
						}, {
							'activePanel': `${ isWpLessThan58() ? 'Color settings' : 'Color' }`,
						} )
						// Active panel option is added so that when the test goes back
						// to the backend, it will open this panel
						// Gutenberg native blocks can have multiple opened panels
				} )
			}
		} )

		cy.savePost()
	} )
}

export function deleteGlobalColorTest() {
	it( 'should assert deleted global color values', () => {
		cy.setupWP()
		// Global settings should still load in the frontend.
		cy.loadFrontendJsCssFiles()
		cy.registerPosts( { numOfPosts: 1 } )
		cy.newPage()

		cy.addBlock( 'core/paragraph' )
		cy.addEditGlobalColor( {
			name: colors[ 3 ].name,
			color: colors[ 3 ].color,
		} )
		cy.adjust( 'Use only Stackable colors', true )

		blocks
			.forEach( blockName => {
				const name = blockName.split( '/' ).pop()
				cy.addBlock( blockName )
				cy.openInspector( blockName, 'Style' )

				if ( blocksWithTitle.includes( blockName ) ) {
					if ( Array( 'heading', 'text', 'expand' ).includes( name ) ) {
						if ( name === 'text' ) {
							cy.toggleStyle( 'Title' )
						}
						cy.typeBlock( blockName, `.ugb-${ name }__title`, 'Title for this block' )
					}

					cy.collapse( 'Title' )
					cy.adjust( `${ name === 'blog-posts' ? 'Text' : 'Title' } Color`, 1 )
				}

				if ( blocksWithSeparator.includes( blockName ) ) {
					cy.collapse( 'Top Separator' )
					cy.adjust( 'Color', 1 )
				}

				if ( name === 'divider' || name === 'spacer' ) {
					cy.collapse( 'General' )
					cy.adjust( `${ blockName === 'ugb/divider' ? 'Color' : 'Background Color' }`, 1 )
				}

				if ( name === 'separator' ) {
					cy.collapse( 'Separator' )
					cy.adjust( 'Separator Color', 1 )
				}
			} )

		// Reset the global colors
		cy.addBlock( 'core/paragraph' )
		cy.resetGlobalColor()
		// Add a global color with the same name as the removed one.
		// This should not affect the color of the blocks.
		cy.addEditGlobalColor( {
			name: colors[ 3 ].name,
			color: '#eeeeee',
		} )

		blocks
			.forEach( blockName => {
				const name = blockName.split( '/' ).pop()
				cy.openInspector( blockName, 'Style' )

				if ( blocksWithTitle.includes( blockName ) && name !== 'blog-posts' ) {
					cy
						.selectBlock( blockName )
						.assertComputedStyle( {
							[ `.ugb-${ name === 'count-up' ? 'countup' : name }__title` ]: {
								'color': colors[ 3 ].color,
							},
						} )
				}

				if ( name === 'blog-posts' ) {
					cy
						.selectBlock( blockName )
						.assertComputedStyle( {
							'.ugb-blog-posts__title a': {
								'color': colors[ 3 ].color,
							},
						} )
				}

				if ( blocksWithSeparator.includes( blockName ) ) {
					cy
						.selectBlock( blockName )
						.assertComputedStyle( {
							'.ugb-top-separator svg': {
								'fill': colors[ 3 ].color,
							},
						} )
				}

				if ( name === 'divider' || name === 'spacer' ) {
					cy
						.selectBlock( blockName )
						.assertComputedStyle( {
							[ `${ name === 'divider' ? '.ugb-divider__hr' : '.ugb-spacer--inner' }` ]: {
								'background-color': colors[ 3 ].color,
							},
						} )
				}

				if ( name === 'separator' ) {
					// Adjust a random option in Separator to assert the global color
					// selectBlock does not work in Separator due to its html structure.
					cy.collapse( 'Separator' )
					cy
						.adjust( 'Shadow', true )
						.assertComputedStyle( {
							'.ugb-separator__layer-1': {
								'fill': colors[ 3 ].color,
							},
						} )
				}
			} )

		cy.savePost()
	} )
}
