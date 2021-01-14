/**
 * Internal dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts,
} from '../support/helpers'

describe( 'Blockquote Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/blockquote', '.ugb-blockquote' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/blockquote' ) )

	it( 'should switch layout', switchLayouts( 'ugb/blockquote', [
		'Basic',
		'Plain',
		'Centered Quote',
		'Huge',
		'Highlight',
	] ) )
	it( 'should switch design', switchDesigns( 'ugb/blockquote', [
		'Cary Blockquote',
		'Chic Blockquote',
		'Dare Blockquote',
		'Detour Blockquote',
		'Dim Blockquote',
		'Dustin Blockquote',
		'Elevate Blockquote',
		'Hue Blockquote',
		'Lounge Blockquote',
		'Lume Blockquote',
		'Lush Blockquote',
		'Propel Blockquote',
		'Seren Blockquote',
		'Yule Blockquote',
	] ) )
	it( 'should adjust desktop options in style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/blockquote' )
		cy.openInspector( 'ugb/blockquote', 'Style' )

		//Test General Alignment
		cy.collapse( 'General' )
		const aligns = [ 'left', 'center', 'right' ]
		aligns.forEach( align => {
			cy.adjust( 'Align', align ).assertComputedStyle( {
				'.ugb-inner-block': {
					[ `text-align` ]: align,
				},
			} )
		} )

		//Test Spacing options
		cy.collapse( 'Spacing' )
		cy.adjust( 'Paddings', 51 ).assertComputedStyle( {
			'.ugb-blockquote__item': {
				[ `padding-top` ]: '51px',
				[ `padding-bottom` ]: '51px',
				[ `padding-right` ]: '51px',
				[ `padding-left` ]: '51px',
			},
		} )
		cy.resetStyle( 'Paddings' )
		cy.adjust( 'Paddings', 3, { unit: 'em' } ).assertComputedStyle( {
			'.ugb-blockquote__item': {
				[ `padding-top` ]: '3em',
				[ `padding-bottom` ]: '3em',
				[ `padding-right` ]: '3em',
				[ `padding-left` ]: '3em',
			},
		} )
		cy.resetStyle( 'Paddings' )
		cy.adjust( 'Paddings', 17, { unit: '%' } ).assertComputedStyle( {
			'.ugb-blockquote__item': {
				[ `padding-top` ]: '17%',
				[ `padding-bottom` ]: '17%',
				[ `padding-right` ]: '17%',
				[ `padding-left` ]: '17%',
			},
		} )

		//Test Quotation Mark options
		cy.collapse( 'Quotation Mark' )
		cy.adjust( 'Icon', 'square' )
		cy.adjust( 'Color', '#f00069' )
		cy.adjust( 'Size', 104 )
		cy.adjust( 'Opacity', 0.7 )
		cy.adjust( 'Horizontal Position', 65 )
		cy.adjust( 'Vertical Position', 31 ).assertComputedStyle( {
			'.ugb-blockquote__quote': {
				[ `fill` ]: '#f00069',
				[ `height` ]: '104px',
				[ `width` ]: '104px',
				[ `opacity` ]: '0.7',
				[ `left` ]: '65px',
				[ `top` ]: '31px',
			},
		} )

		//Test Text options
		cy.collapse( 'Text' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Serif',
			[ `Size` ]: 18,
			[ `Weight` ]: '200',
			[ `Transform` ]: 'lowercase',
			[ `Line-Height` ]: 1.6,
			[ `Letter Spacing` ]: 1.3,
		} )
		cy.adjust( 'Size', 1.25, { unit: 'em' } )
		cy.resetStyle( 'Size' )
		cy.adjust( 'Size', 1.75, { unit: 'em' } )
		cy.adjust( 'Text Color', '#ffffff' ).assertComputedStyle( {
			'.ugb-blockquote__text': {
				[ `font-size` ]: '1.75em',
				[ `font-weight` ]: '200',
				[ `text-transform` ]: 'lowercase',
				[ `letter-spacing` ]: '1.3px',
				[ `color` ]: '#ffffff',
			},
		} )

		//Test Text Alignment
		const textAligns = [ 'left', 'center', 'right' ]
		textAligns.forEach( align => {
			cy.adjust( 'Align', align ).assertComputedStyle( {
				'.ugb-blockquote__item': {
					[ `text-align` ]: align,
				},
			} )
		} )

		//Test Block Background options
		cy.collapse( 'Block Background' )
		cy.toggleStyle( 'Block Background' )
		cy.adjust( 'No Paddings', true )
		cy.adjust( 'Color Type', 'single' )
		cy.adjust( 'Background Color', '#ffffff' )
		cy.adjust( 'Background Color Opacity', 0.7 ).assertComputedStyle( {
			'.ugb-blockquote': {
				[ `background-color` ]: 'rgba(255, 255, 255, 0.7)',
			},
		} )
		cy.adjust( 'Color Type', 'gradient' )
		cy.adjust( 'Background Color #1', '#6d6d6d' )
		cy.adjust( 'Background Color #2', '#cd2653' )
		cy.adjust( 'Adv. Gradient Color Settings', {
			[ `Gradient Direction (degrees)` ]: '180deg',
			[ `Color 1 Location` ]: '11%',
			[ `Color 2 Location` ]: '80%',
			[ `Background Gradient Blend Mode` ]: 'hard-light',
		} ).assertComputedStyle( {
			'.ugb-blockquote:before': {
				[ `background-image` ]: 'linear-gradient(#6d6d6d 11%, #cd2653 80%)',
				[ `mix-blend-mode` ]: 'hard-light',
			},
		} )
		//Add Background Image test

		//Test Top Separator
		cy.collapse( 'Top Separator' )
		cy.toggleStyle( 'Top Separator' )
		cy.adjust( 'Design', 'wave-3' )
		cy.adjust( 'Color', '#000000' )
		cy.adjust( 'Height', 237 )
		cy.adjust( 'Width', 1.7 ).assertComputedStyle( {
			'.ugb-top-separator svg': {
				[ `fill` ]: '#000000',
			},
		} )
		cy.adjust( 'Flip Horizontally', true )
		cy.adjust( 'Flip Vertically', true )
		cy.adjust( 'Shadow', false )
		cy.adjust( 'Bring to Front', true ).assertComputedStyle( {
			'.ugb-top-separator': {
				'z-index': '6',
			},
		} )
		cy.adjust( 'Separator Layer 2', {
			[ `Color` ]: '#ffffff',
			[ `Layer Height` ]: '1.16',
			[ `Layer Width` ]: '1.9',
			[ `Flip Horizontally` ]: true,
			[ `Opacity` ]: '0.3',
			[ `Mix Blend Mode` ]: 'exclusion',
		} ).assertComputedStyle( {
			'.ugb-top-separator .ugb-separator__layer-2': {
				[ `fill` ]: '#ffffff',
				[ `transform` ]: 'matrix(-1.9, 0, 0, 1.16, 0, 0)', //scaleX(-1)scaleY(1.16)scaleX(1.9)
				[ `opacity` ]: '0.3',
				[ `mix-blend-mode` ]: 'exclusion',
			},
		} )

		cy.adjust( 'Separator Layer 3', {
			[ `Color` ]: '#6d6d6d',
			[ `Layer Height` ]: '1.03',
			[ `Layer Width` ]: '1.2',
			[ `Flip Horizontally` ]: true,
			[ `Opacity` ]: '0.8',
		} ).assertComputedStyle( {
			'.ugb-top-separator .ugb-separator__layer-3': {
				[ `fill` ]: '#6d6d6d',
				[ `transform` ]: 'matrix(-1.2, 0, 0, 1.03, 0, 0)',
				[ `opacity` ]: '0.8',
			},
		} )

		//Test Bottom Separator
		cy.collapse( 'Bottom Separator' )
		cy.toggleStyle( 'Bottom Separator' )
		cy.adjust( 'Design', 'slant-2' )
		cy.adjust( 'Color', '#f00069' )
		cy.adjust( 'Height', 237 )
		cy.adjust( 'Width', 1.7 ).assertComputedStyle( {
			'.ugb-bottom-separator svg': {
				[ `fill` ]: '#f00069',
			},
		} )
		cy.adjust( 'Flip Horizontally', true )
		cy.adjust( 'Flip Vertically', true )
		cy.adjust( 'Shadow', false )
		cy.adjust( 'Bring to Front', true ).assertComputedStyle( {
			'.ugb-bottom-separator': {
				'z-index': '6',
			},
		} )
		cy.adjust( 'Separator Layer 2', {
			[ `Color` ]: '#ffffff',
			[ `Layer Height` ]: '1.16',
			[ `Layer Width` ]: '1.9',
			[ `Flip Horizontally` ]: true,
			[ `Opacity` ]: '0.3',
			[ `Mix Blend Mode` ]: 'exclusion',
		} ).assertComputedStyle( {
			'.ugb-bottom-separator .ugb-separator__layer-2': {
				[ `fill` ]: '#ffffff',
				[ `transform` ]: 'matrix(-1.9, 0, 0, 1.16, 0, 0)',
				[ `opacity` ]: '0.3',
				[ `mix-blend-mode` ]: 'exclusion',
			},
		} )

		cy.adjust( 'Separator Layer 3', {
			[ `Color` ]: '#6d6d6d',
			[ `Layer Height` ]: '1.03',
			[ `Layer Width` ]: '1.2',
			[ `Flip Horizontally` ]: true,
			[ `Opacity` ]: '0.8',
		} ).assertComputedStyle( {
			'.ugb-bottom-separator .ugb-separator__layer-3': {
				[ `fill` ]: '#6d6d6d',
				[ `transform` ]: 'matrix(-1.2, 0, 0, 1.03, 0, 0)',
				[ `opacity` ]: '0.8',
			},
		} )
	} )
} )
