/**
 * External dependencies
 */
import { registerBlockSnapshots } from '~gutenberg-e2e/plugins'
import { blocks } from '~stackable-e2e/config'

describe( 'Global Settings', () => {
	it( 'should adjust Stackable Global Colors', () => {
		cy.setupWP()
		cy.newPage()

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

		cy.addBlock( 'core/paragraph' )
		// Add Global colors
		colors.forEach( val => {
			cy.addGlobalColor( {
				name: val.name,
				color: val.color,
			} )
		} )
		cy.adjust( 'Use only Stackable colors', true )

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

		// Global Color test TODOs
		// Posts block
	} )
} )
