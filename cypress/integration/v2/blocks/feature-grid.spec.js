
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, assertAdvancedTab,
} from '~stackable-e2e/helpers'

describe( 'Feature Grid Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/feature-grid', '.ugb-feature-grid' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/feature-grid' ) )

	it( 'should switch layout', switchLayouts( 'ugb/feature-grid', [
		'Basic',
		'Plain',
		'Horizontal',
		'Large Mid',
		'Zigzag',
	] ) )

	it( 'should switch design', switchDesigns( 'ugb/feature-grid', [
		'Angled Feature Grid',
		'Arch Feature Grid',
		'Aspire Feature Grid',
		'Aurora Feature Grid',
		'Bean Feature Grid',
		'Capital Feature Grid',
		'Chic Feature Grid',
		'Dare Feature Grid 1',
		'Dare Feature Grid 2',
		'Dare Feature Grid 3',
		'Decora Feature Grid',
		'Detour Feature Grid',
		'Devour Feature Grid',
		'Dim Feature Grid',
		'Dustin Feature Grid',
		'Elevate Feature Grid',
		'Flex Feature Grid',
		'Glow Feature Grid 1',
		'Glow Feature Grid 2',
		'Heights Feature Grid 1',
		'Heights Feature Grid 2',
		'Hue Feature Grid',
		'Lush Feature Grid 1',
		'Lush Feature Grid 2',
		'Peplum Feature Grid',
		'Prime Feature Grid',
		'Proact Feature Grid',
		'Propel Feature Grid',
		'Seren Feature Grid',
		'Speck Feature Grid',
		'Upland Feature Grid',
		'Yule Feature Grid',
	] ) )

	it( 'should adjust desktop options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/feature-grid' )
		cy.openInspector( 'ugb/feature-grid', 'Style' )

		// Test General options
		cy.collapse( 'General' )
		cy.adjust( 'Columns', 4 )
		cy.get( 'div.ugb-block-content' ).find( '.ugb-feature-grid__item4' ).should( 'exist' )

		const aligns = [ 'left', 'center', 'right' ]
		aligns.forEach( align => {
			cy.adjust( 'Align', align ).assertComputedStyle( {
				'.ugb-inner-block': {
					[ `text-align` ]: align,
				},
			} )
		} )

		// Test Container options
		cy.collapse( 'Container' )
		cy.adjust( 'Background', {
			[ `Color Type` ]: 'single',
			[ `Background Color` ]: '#000000',
			[ `Background Color Opacity` ]: '0.5',
		} ).assertComputedStyle( {
			'.ugb-feature-grid__item': {
				[ `background-color` ]: 'rgba(0, 0, 0, 0.5)',
			},
		} )
		cy.resetStyle( 'Background' )
		cy.adjust( 'Background', {
			[ `Color Type` ]: 'gradient',
			[ `Background Color #1` ]: '#f00069',
			[ `Background Color #2` ]: '#000000',
			[ `Adv. Gradient Color Settings` ]: {
				[ `Gradient Direction (degrees)` ]: '180deg',
				[ `Color 1 Location` ]: '11%',
				[ `Color 2 Location` ]: '80%',
				[ `Background Gradient Blend Mode` ]: 'color-burn',
			},
		} ).assertComputedStyle( {
			'.ugb-feature-grid__item:before': {
				[ `background-image` ]: 'linear-gradient(#f00069 11%, #000000 80%)',
				[ `mix-blend-mode` ]: 'color-burn',
			},
		} )
		cy.adjust( 'Border Radius', 26 )
		cy.adjust( 'Borders', 'dashed' )
		cy.adjust( 'Border Color', '#333333' )
		cy.adjust( 'Border Width', 4 ).assertComputedStyle( {
			'.ugb-feature-grid__item': {
				[ `border-top-left-radius` ]: '26px',
				[ `border-top-right-radius` ]: '26px',
				[ `border-bottom-left-radius` ]: '26px',
				[ `border-bottom-right-radius` ]: '26px',
				[ `border-top-width` ]: '4px',
				[ `border-right-width` ]: '4px',
				[ `border-bottom-width` ]: '4px',
				[ `border-left-width` ]: '4px',
				[ `border-top-style` ]: 'dashed',
				[ `border-right-style` ]: 'dashed',
				[ `border-bottom-style` ]: 'dashed',
				[ `border-left-style` ]: 'dashed',
				[ `border-top-color` ]: '#333333',
				[ `border-right-color` ]: '#333333',
				[ `border-bottom-color` ]: '#333333',
				[ `border-left-color` ]: '#333333',
			},
		} )

		// TODO: Background Image / Video
	} )

	it( 'should adjust options inside advanced tab', assertAdvancedTab( 'ugb/feature-grid',
		{},
		// Desktop Test.
		() => {

		},
		// Tablet Test.
		() => {

		},
		// Mobile Test.
		() => {

		} ) )
} )
