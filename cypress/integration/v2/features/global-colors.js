/**
 * External dependencies
 */
import { registerBlockSnapshots } from '~gutenberg-e2e/plugins'
import { blocks } from '~stackable-e2e/config'

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

describe( 'Global Settings', () => {
	it( 'should adjust Global Colors and assert the color picker in blocks', () => {
		cy.setupWP()
		cy.newPage()

		// Add Global colors
		cy.addBlock( 'core/paragraph' )
		colors.forEach( val => {
			cy.addGlobalColor( {
				name: val.name,
				color: val.color,
			} )
		} )
		cy.adjust( 'Use only Stackable colors', true )

		blocks
			.filter( blockName => blockName !== 'ugb/blog-posts' )
			.forEach( blockName => {
				const name = blockName.split( '/' ).pop()

				cy.addBlock( blockName ).as( 'block' )
				const block = registerBlockSnapshots( 'block' )
				cy.openInspector( blockName, 'Style' )
				// Check if the Global colors are added in blocks
				if ( blocksWithTitle.includes( blockName ) ) {
					if ( name === 'heading' || name === 'text' ||
					name === 'expand' ) {
						if ( name === 'text' ) {
							cy.toggleStyle( 'Title' )
						}
						cy.typeBlock( blockName, `.ugb-${ name }__title`, 'Title for this block' )
					}

					cy.collapse( 'Title' )
					colors.forEach( ( val, idx ) => {
						cy
							.adjust( 'Title Color', idx + 1 )
							.assertComputedStyle( {
								[ `.ugb-${ name === 'count-up' ? 'countup' : name }__title` ]: {
									'color': val.color,
								},
							} )
					} )
				}

				if ( blocksWithSeparator.includes( blockName ) ) {
					cy.collapse( 'Top Separator' )
					colors.forEach( ( val, idx ) => {
						cy
							.adjust( 'Color', idx + 1 )
							.assertComputedStyle( {
								'.ugb-top-separator svg': {
									'fill': val.color,
								},
							} )
					} )
				}

				if ( name === 'divider' || name === 'spacer' ) {
					cy.collapse( 'General' )
					colors.forEach( ( val, idx ) => {
						cy
							.adjust( `${ blockName === 'ugb/divider' ? 'Color' : 'Background Color' }`, idx + 1 )
							.assertComputedStyle( {
								[ `${ name === 'divider' ? '.ugb-divider__hr' : '.ugb-spacer--inner' }` ]: {
									'background-color': val.color,
								},
							} )
					} )
				}

				if ( name === 'separator' ) {
					cy.collapse( 'Separator' )
					colors.forEach( ( val, idx ) => {
						cy
							.adjust( 'Separator Color', idx + 1 )
							.assertComputedStyle( {
								'.ugb-separator__layer-1': {
									'fill': val.color,
								},
							} )
					} )
				}

				cy.getPostUrls().then( ( { editorUrl } ) => {
					block.assertFrontendStyles()
					cy.visit( editorUrl )
				} )
			} )

		// Delete Global colors
		cy.addBlock( 'core/paragraph' )
		cy.resetGlobalColor()
		cy.adjust( 'Use only Stackable colors', false )
		cy.savePost()
		// Global Color test TODOs:
		// Posts block
	} )

	it( 'should assert the changing of Global Color', () => {
		cy.setupWP()
		cy.newPage()

		cy.addBlock( 'core/paragraph' )
		cy.addGlobalColor( {
			name: colors[ 3 ].name,
			color: colors[ 3 ].color,
		} )
		cy.adjust( 'Use only Stackable colors', true )

		blocks
			.filter( blockName => blockName !== 'ugb/blog-posts' )
			.forEach( blockName => {
				const name = blockName.split( '/' ).pop()
				cy.addBlock( blockName )
				cy.openInspector( blockName, 'Style' )

				if ( blocksWithTitle.includes( blockName ) ) {
					if ( name === 'heading' || name === 'text' ||
					name === 'expand' ) {
						if ( name === 'text' ) {
							cy.toggleStyle( 'Title' )
						}
						cy.typeBlock( blockName, `.ugb-${ name }__title`, 'Title for this block' )
					}

					cy.collapse( 'Title' )
					cy.adjust( 'Title Color', 1 )
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

		// Edit a global color
		cy.addBlock( 'core/paragraph' )
		cy.addGlobalColor( { name: 'Aquamarine', color: '#0ccbbf' }, 'Stackable Pink' )
		// Assert the edited global color in blocks
		blocks
			.filter( blockName => blockName !== 'ugb/blog-posts' )
			.forEach( blockName => {
				const name = blockName.split( '/' ).pop()
				cy.openInspector( blockName, 'Style' )

				if ( blocksWithTitle.includes( blockName ) ) {
					cy
						.selectBlock( blockName )
						.assertComputedStyle( {
							[ `.ugb-${ name === 'count-up' ? 'countup' : name }__title` ]: {
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

		// Delete Global colors
		cy.addBlock( 'core/paragraph' )
		cy.resetGlobalColor()
		cy.adjust( 'Use only Stackable colors', false )
		cy.savePost()
		// Global Color test TODOs:
		// Posts block
	} )

	it( 'should assert global colors in native blocks', () => {
		cy.setupWP()
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
		} )

		colors.forEach( val => {
			cy.addGlobalColor( {
				name: val.name,
				color: val.color,
			} )
		} )
		cy.adjust( 'Use only Stackable colors', true )

		nativeBlocks.forEach( blockName => {
			if ( blockName !== 'core/separator' && blockName !== 'core/cover' ) {
				cy
					.get( `.wp-block[data-type='${ blockName }']` )
					.type( 'Block Title', { force: true } )
			}
			if ( blockName !== 'core/cover' ) {
				cy.selectBlock( `${ blockName === 'core/buttons' ? 'core/button' : blockName }` )
				cy.openSidebar( 'Settings' )
				cy.collapse( 'Color settings' )
				colors.forEach( ( val, idx ) => {
					cy
						.adjust( `${ blockName === 'core/separator' ? 'Color' : 'Text Color' }`, idx + 1 )
				} )
			}
			colors.forEach( ( val, idx ) => {
				cy
					.get( '.components-circular-option-picker__option-wrapper' )
					.eq( idx )
					.find( `button[aria-label="Color: ${ val.name }"]` )
					.should( 'exist' )
					.invoke( 'attr', 'style', `background-color: ${ val.color }` )
					.should( 'have.attr', 'style', `background-color: ${ val.color }` )
			} )
		} )

		// Delete Global colors
		cy.addBlock( 'core/paragraph' )
		cy.resetGlobalColor()
		cy.adjust( 'Use only Stackable colors', false )
		cy.savePost()
	} )
} )
