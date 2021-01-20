
/**
 * External dependencies
 */
import { range } from 'lodash'

/**
 * Internal dependencies
 */
import { blocks } from '../config'
import { getAddresses } from '../support/util'
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts,
} from '../support/helpers'

describe( 'Accordion Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/accordion', '.ugb-accordion' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/accordion' ) )

	it( 'should allow adding inner blocks inside accordion', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/accordion' )
		cy.selectBlock( 'ugb/accordion' )
		cy.get( '.ugb-accordion__heading' ).click( { force: true } )
		cy.deleteBlock( 'core/paragraph' )
		cy.wait( 1000 )

		blocks
			.filter( blockName => blockName !== 'ugb/accordion' )
			.forEach( blockName => cy.appendBlock( blockName ) )
	} )
	it( 'should switch layout', switchLayouts( 'ugb/accordion', [
		'Basic',
		'Plain',
		'Line Colored',
		'Colored',
	] ) )
	it( 'should switch design', switchDesigns( 'ugb/accordion', [
		'Dim Accordion',
		'Elevate Accordion',
		'Lounge Accordion',
	] ) )

	it( 'should adjust desktop options inside style tab', () => {
		cy.setupWP()
		cy.newPage()

		// Test 'Close adjacent on open' feature
		range( 1, 4 ).forEach( idx => {
			cy.addBlock( 'ugb/accordion' )
			cy.typeBlock( 'ugb/accordion', '.ugb-accordion__title', `Accordion ${ idx }`, idx - 1 )
			cy.openInspector( 'ugb/accordion', 'Style', `Accordion ${ idx }` )
			cy.collapse( 'General' )
			cy.adjust( 'Close adjacent on open', true )
		} )

		cy.publish()
		getAddresses( ( { currUrl, previewUrl } ) => {
			cy.visit( previewUrl )
			range( 0, 3 ).forEach( idx1 => {
				cy
					.get( '.ugb-accordion' )
					.eq( idx1 )
					.find( '.ugb-accordion__heading' )
					.click( { force: true } )
					.then( () => {
						range( 0, 3 ).forEach( idx2 => {
							if ( idx1 !== idx2 ) {
								cy
									.get( '.ugb-accordion' )
									.eq( idx2 )
									.invoke( 'attr', 'aria-expanded' )
									.then( ariaExpanded => {
										expect( ariaExpanded ).toBe( 'false' )
									} )
							}
						} )
					} )
			} )
			cy.visit( currUrl )
		} )
		cy.deleteBlock( 'ugb/accordion', 'Accordion 2' )
		cy.deleteBlock( 'ugb/accordion', 'Accordion 3' )

		// Test 'open at start'
		cy.openInspector( 'ugb/accordion', 'Style' )
		cy.collapse( 'General' )
		cy.adjust( 'Open at the start', true )
		cy.publish()
		getAddresses( ( { currUrl, previewUrl } ) => {
			cy.visit( previewUrl )
			cy
				.get( '.ugb-accordion' )
				.invoke( 'attr', 'aria-expanded' )
				.then( ariaExpanded => {
					expect( ariaExpanded ).toBe( 'true' )
					cy.visit( currUrl )
				} )
		} )

		// Test 'Reverse arrow'
		cy.openInspector( 'ugb/accordion', 'Style' )
		cy.collapse( 'General' )
		cy.adjust( 'Reverse arrow', true ).assertComputedStyle( {
			'.ugb-accordion__heading': {
				[ `flex-direction` ]: 'row-reverse',
			},
		} )

		// Test General Alignment
		const aligns = [ 'left', 'center', 'right' ]
		aligns.forEach( align => {
			cy.adjust( 'Align', align ).assertComputedStyle( {
				'.ugb-inner-block': {
					[ `text-align` ]: align,
				},
			} )
		} )

		cy.collapse( 'Container' )

		// Test Single Background Color
		cy.adjust( 'Background', {
			[ `Color Type` ]: 'single',
			[ `Background Color` ]: '#000000',
			[ `Background Color Opacity` ]: '0.5',
		} ).assertComputedStyle( {
			'.ugb-accordion__heading': {
				[ `background-color` ]: 'rgba(0, 0, 0, 0.5)',
			},
		} )

		// Test Gradient Background Color
		cy.collapse( 'Container' )
		cy.adjust( 'Background', {
			[ `Color Type` ]: 'gradient',
			[ `Background Color #1` ]: '#f00069',
			[ `Background Color #2` ]: '#000000',
			[ `Adv. Gradient Color Settings` ]: {
		  [ `Gradient Direction (degrees)` ]: '180deg',
		  [ `Color 1 Location` ]: '11%',
		  [ `Color 2 Location` ]: '80%',
		  [ `Background Gradient Blend Mode` ]: 'hard-light',
			},
		} ).assertComputedStyle( {
			'.ugb-accordion__heading:before': {
				[ `background-image` ]: 'linear-gradient(#f00069 11%, #000000 80%)',
				[ `mix-blend-mode` ]: 'hard-light',
			},
		} )

		// Test Border Radius
		cy.adjust( 'Border Radius', 30 ).assertComputedStyle( {
			'.ugb-accordion__heading': {
				[ `border-radius` ]: '30px',
			},
		} )

		// Test Border Options
		cy.adjust( 'Borders', 'solid' )
		cy.adjust( 'Border Width', 3 )
		cy.adjust( 'Border Color', '#f1f1f1' ).assertComputedStyle( {
			'.ugb-accordion__heading': {
				[ `border-style` ]: 'solid',
				[ `border-color` ]: '#f1f1f1',
				[ `border-top-width` ]: '3px',
				[ `border-bottom-width` ]: '3px',
				[ `border-left-width` ]: '3px',
				[ `border-right-width` ]: '3px',
			},
		} )

		// Test Shadow / Outline
		cy.adjust( 'Shadow / Outline', 9 )
			.assertClassName( '.ugb-accordion__heading', 'ugb--shadow-9' )

		cy.collapse( 'Spacing' )
		// Test Padding options
		cy.adjust( 'Padding', 46 ).assertComputedStyle( {
			'.ugb-accordion__heading': {
				[ `padding-top` ]: '46px',
				[ `padding-right` ]: '46px',
				[ `padding-bottom` ]: '46px',
				[ `padding-left` ]: '46px',
			},
		} )

		// Test Title spacing
		cy.adjust( 'Title', 63 )
		cy.typeBlock( 'ugb/accordion', '.ugb-accordion__title', `Accordion 1` )
			.assertComputedStyle( {
				'.ugb-accordion__heading': {
					[ `margin-bottom` ]: '63px',
				},
			} )

		// Test Title options
		cy.collapse( 'Title' )
		cy.adjust( 'Title HTML Tag', 'h3' )
			.assertHtmlTag( '.ugb-accordion__title', 'h3' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Serif',
			[ `Size` ]: 60,
			[ `Weight` ]: '600',
			[ `Transform` ]: 'uppercase',
			[ `Line-Height` ]: 1.6,
			[ `Letter Spacing` ]: 2.4,
		} )
		cy.adjust( 'Size', 1.75, { unit: 'em' } )
		cy.adjust( 'Title Color', '#f00069' )
			.assertComputedStyle( {
				'.ugb-accordion__title': {
					[ `font-size` ]: '1.75em',
					[ `font-weight` ]: '600',
					[ `text-transform` ]: 'uppercase',
					[ `letter-spacing` ]: '2.4px',
					[ `color` ]: '#f00069',
				},
			} )

		const titleAligns = [ 'left', 'center', 'right' ]
		titleAligns.forEach( align => {
			cy.adjust( 'Align', align ).assertComputedStyle( {
				'.ugb-accordion__title': {
					[ `text-align` ]: align,
				},
			} )
		} )

		// Test Arrow settings
		cy.collapse( 'Arrow' )
		cy.adjust( 'Size', 31 )
		cy.adjust( 'Color', '#333333' )
			.assertComputedStyle( {
				'.ugb-accordion__arrow': {
					[ `width` ]: '31px',
					[ `height` ]: '31px',
					[ `fill` ]: '#333333',
				},
			} )
	} )

	it( 'should adjust tablet options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/accordion' )
		cy.openInspector( 'ugb/accordion', 'Style' )
		cy.changePreviewMode( 'Tablet' )

		// Test General Alignment
		cy.collapse( 'General' )
		const aligns = [ 'left', 'center', 'right' ]
		aligns.forEach( align => {
			cy.adjust( 'Align', align, { viewport: 'Tablet' } ).assertComputedStyle( {
				'.ugb-inner-block': {
					[ `text-align` ]: align,
				},
			} )
		} )

		cy.changePreviewMode( 'Tablet' )

		// Test Container options
		cy.collapse( 'Container' )
		cy.adjust( 'Background', {
			[ `Color Type` ]: 'single',
			[ `Background Color` ]: '#ffffff',
			[ `Background Color Opacity` ]: '0.5',
		}, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-accordion__heading': {
				[ `background-color` ]: 'rgba(255, 255, 255, 0.5)',
			},
		} )
		cy.adjust( 'Background', {
			[ `Color Type` ]: 'gradient',
			[ `Background Color #1` ]: '#f00069',
			[ `Background Color #2` ]: '#000000',
			[ `Adv. Gradient Color Settings` ]: {
		  [ `Gradient Direction (degrees)` ]: '180deg',
		  [ `Color 1 Location` ]: '11%',
		  [ `Color 2 Location` ]: '80%',
		  [ `Background Gradient Blend Mode` ]: 'multiply',
			},
		}, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-accordion__heading:before': {
				[ `background-image` ]: 'linear-gradient(#f00069 11%, #000000 80%)',
				[ `mix-blend-mode` ]: 'multiply',
			},
		} )
		cy.adjust( 'Border Radius', 26, { viewport: 'Tablet' } )
		cy.adjust( 'Borders', 'dashed', { viewport: 'Tablet' } )
		cy.adjust( 'Border Color', '#333333', { viewport: 'Tablet' } )
		cy.adjust( 'Border Width', 4, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-accordion__heading': {
				[ `border-radius` ]: '26px',
				[ `background-color` ]: 'rgba(0, 0, 0, 0.5)',
				[ `border-top-width` ]: '4px',
				[ `border-right-width` ]: '4px',
				[ `border-bottom-width` ]: '4px',
				[ `border-left-width` ]: '4px',
				[ `border-top-style` ]: 'dashed',
				[ `border-right-style` ]: 'dashed',
				[ `border-bottom-style` ]: 'dashed',
				[ `border-left-style` ]: 'dashed',
				[ `border-color` ]: '#333333',
			},
		} )

		// TODO: Background Image / Video

		cy.changePreviewMode( 'Tablet' )

		// Test Spacing options
		cy.collapse( 'Spacing' )
		cy.adjust( 'Padding', 31, { viewport: 'Tablet' } )
		cy.get( 'div.ugb-accordion__heading' ).click( { force: true } )
		cy.adjust( 'Title', 20, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-accordion__heading': {
				[ `margin-bottom` ]: '20px',
				[ `padding-top` ]: '31px',
				[ `padding-right` ]: '31px',
				[ `padding-bottom` ]: '31px',
				[ `padding-left` ]: '31px',
			},
		} )

		cy.changePreviewMode( 'Tablet' )

		// Test Title options
		cy.collapse( 'Title' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Serif',
			[ `Size` ]: 60,
			[ `Weight` ]: '600',
			[ `Transform` ]: 'capitalize',
			[ `Line-Height` ]: 1.6,
			[ `Letter Spacing` ]: 2.4,
		}, { viewport: 'Tablet' } )
		cy.adjust( 'Title Color', '#ffffff', { viewport: 'Tablet' } )
		cy.adjust( 'Size', 29, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-accordion__title': {
				[ `font-size` ]: '29px',
				[ `font-weight` ]: '600',
				[ `text-transform` ]: 'capitalize',
				[ `letter-spacing` ]: '2.4px',
				[ `color` ]: '#ffffff',
			},
		} )
		const titleAligns = [ 'left', 'center', 'right' ]
		titleAligns.forEach( align => {
			cy.adjust( 'Align', align, { viewport: 'Tablet' } ).assertComputedStyle( {
				'.ugb-accordion__title': {
					[ `text-align` ]: align,
				},
			} )
		} )

		cy.changePreviewMode( 'Tablet' )

		// Test Arrow options
		cy.collapse( 'Arrow' )
		cy.adjust( 'Size', 30, { viewport: 'Tablet' } )
		cy.adjust( 'Color', '#ff0000', { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-accordion__arrow': {
				[ `fill` ]: '#ff0000',
				[ `height` ]: '30px',
				[ `width` ]: '30px',
			},
		} )
	} )

	it( 'should adjust mobile options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/accordion' )
		cy.openInspector( 'ugb/accordion', 'Style' )
		cy.changePreviewMode( 'Mobile' )

		// Test General Alignment
		cy.collapse( 'General' )
		const aligns = [ 'left', 'center', 'right' ]
		aligns.forEach( align => {
			cy.adjust( 'Align', align, { viewport: 'Mobile' } ).assertComputedStyle( {
				'.ugb-inner-block': {
					[ `text-align` ]: align,
				},
			} )
		} )

		cy.changePreviewMode( 'Mobile' )
		cy.collapse( 'Container' )

		// Test Container options
		cy.adjust( 'Background', {
			[ `Color Type` ]: 'single',
			[ `Background Color` ]: '#ffffff',
			[ `Background Color Opacity` ]: '0.5',
		}, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-accordion__heading': {
				[ `background-color` ]: 'rgba(255, 255, 255, 0.5)',
			},
		} )
		cy.adjust( 'Background', {
			[ `Color Type` ]: 'gradient',
			[ `Background Color #1` ]: '#f00069',
			[ `Background Color #2` ]: '#000000',
			[ `Adv. Gradient Color Settings` ]: {
		  [ `Gradient Direction (degrees)` ]: '180deg',
		  [ `Color 1 Location` ]: '15%',
		  [ `Color 2 Location` ]: '60%',
		  [ `Background Gradient Blend Mode` ]: 'exclusion',
			},
		}, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-accordion__heading:before': {
				[ `background-image` ]: 'linear-gradient(#f00069 15%, #000000 60%)',
				[ `mix-blend-mode` ]: 'exclusion',
			},
		} )
		cy.adjust( 'Border Radius', 50, { viewport: 'Mobile' } )
		cy.adjust( 'Borders', 'dotted', { viewport: 'Mobile' } )
		cy.adjust( 'Border Color', '#333333', { viewport: 'Mobile' } )
		cy.adjust( 'Border Width', 5, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-accordion__heading': {
				[ `border-radius` ]: '50px',
				[ `background-color` ]: 'rgba(0, 0, 0, 0.5)',
				[ `border-top-width` ]: '5px',
				[ `border-right-width` ]: '5px',
				[ `border-bottom-width` ]: '5px',
				[ `border-left-width` ]: '5px',
				[ `border-top-style` ]: 'dotted',
				[ `border-right-style` ]: 'dotted',
				[ `border-bottom-style` ]: 'dotted',
				[ `border-left-style` ]: 'dotted',
				[ `border-color` ]: '#333333',
			},
		} )

		// TODO: Background Image / Video

		cy.changePreviewMode( 'Mobile' )

		// Test Spacing options
		cy.collapse( 'Spacing' )
		cy.adjust( 'Padding', 31, { viewport: 'Mobile' } )
		cy.get( 'div.ugb-accordion__heading' ).click( { force: true } )
		cy.adjust( 'Title', 20, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-accordion__heading': {
				[ `margin-bottom` ]: '20px',
				[ `padding-top` ]: '31px',
				[ `padding-right` ]: '31px',
				[ `padding-bottom` ]: '31px',
				[ `padding-left` ]: '31px',
			},
		} )

		cy.changePreviewMode( 'Mobile' )

		// Test Title options
		cy.collapse( 'Title' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Serif',
			[ `Size` ]: 60,
			[ `Weight` ]: '600',
			[ `Transform` ]: 'capitalize',
			[ `Line-Height` ]: 1.6,
			[ `Letter Spacing` ]: 2.4,
		}, { viewport: 'Mobile' } )
		cy.adjust( 'Title Color', '#ffffff', { viewport: 'Mobile' } )
		cy.adjust( 'Size', 29, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-accordion__title': {
				[ `font-size` ]: '29px',
				[ `font-weight` ]: '600',
				[ `text-transform` ]: 'capitalize',
				[ `letter-spacing` ]: '2.4px',
				[ `color` ]: '#ffffff',
			},
		} )
		const titleAligns = [ 'left', 'center', 'right' ]
		titleAligns.forEach( align => {
			cy.adjust( 'Align', align, { viewport: 'Mobile' } ).assertComputedStyle( {
				'.ugb-accordion__title': {
					[ `text-align` ]: align,
				},
			} )
		} )

		cy.changePreviewMode( 'Mobile' )

		// Test Arrow options
		cy.collapse( 'Arrow' )
		cy.adjust( 'Size', 30, { viewport: 'Mobile' } )
		cy.adjust( 'Color', '#ff0000', { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-accordion__arrow': {
				[ `fill` ]: '#ff0000',
				[ `height` ]: '30px',
				[ `width` ]: '30px',
			},
		} )
	} )
} )
