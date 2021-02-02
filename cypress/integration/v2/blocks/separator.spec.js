/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchLayouts, registerTests,
} from '~stackable-e2e/helpers'

describe( 'Separator Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/separator', '.ugb-separator' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/separator' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/separator', [
		'Wave 1',
		'Wave 2',
		'Wave 3',
		'Wave 4',
		'Slant 1',
		'Slant 2',
		'Curve 1',
		'Curve 2',
		'Curve 3',
		'Rounded 1',
		'Rounded 2',
		'Rounded 3',
	] ) )
}

function desktopStyle() {
	it( 'should adjust desktop options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/separator' )
		cy.openInspector( 'ugb/separator', 'Style' )

		cy.collapse( 'Separator' )
		cy.adjust( 'Separator Color', '#c99292' )
		cy.adjust( 'Separator Width', 2.1 )
		cy.adjust( 'Flip Horizontally', true ).assertComputedStyle( {
			'.ugb-separator__layer-1': {
				[ `fill` ]: '#c99292',
				[ `transform` ]: 'matrix(-2.1, 0, 0, 1, 0, 0)',
			},
		} )

		cy.adjust( 'Shadow', true )
		cy.get( 'div.ugb-separator__svg-inner' ).find( '.ugb-separator__shadow' ).should( 'exist' )

		// Test General options
		cy.collapse( 'General' )
		cy.adjust( 'Height', 240 ).assertComputedStyle( {
			'.ugb-separator__svg-wrapper': {
				[ `height` ]: '240px',
			},
		} )
		cy.adjust( 'Flip Vertically', true )
			.assertClassName( '.ugb-separator', 'ugb-separator--flip-vertical' )
		cy.adjust( 'Flip Horizontally', true )
			.assertClassName( '.ugb-separator', 'ugb-separator--flip-horizontal' )

		cy.adjust( 'Background Color', '#733535' ).assertComputedStyle( {
			'.ugb-separator': {
				[ `background-color` ]: '#733535',
			},
		} )

		// Test Spacing options
		cy.collapse( 'Spacing' )

		// Test Paddings
		cy.adjust( 'Padding Top', 126, { unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator__top-pad': {
				[ `height` ]: '126px',
			},
		} )
		cy.resetStyle( 'Padding Top' )
		cy.adjust( 'Padding Top', 40, { unit: 'em' } ).assertComputedStyle( {
			'.ugb-separator__top-pad': {
				[ `height` ]: '40em',
			},
		} )
		cy.adjust( 'Padding Bottom', 111, { unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator__bottom-pad': {
				[ `height` ]: '111px',
			},
		} )
		cy.resetStyle( 'Padding Bottom' )
		cy.adjust( 'Padding Bottom', 36, { unit: 'em' } ).assertComputedStyle( {
			'.ugb-separator__bottom-pad': {
				[ `height` ]: '36em',
			},
		} )

		/**
		 *	Test Margins
		 *	Separator top & bottom margins have:
		 *	-15 on backend, -1 on frontend
		 */
		cy.adjust( 'Margin Top', 20, { unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator': {
				[ `margin-top` ]: '5px',
			},
		}, {
			assertFrontend: false,
		} )
		cy.adjust( 'Margin Top', 20, { unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator': {
				[ `margin-top` ]: '19px',
			},
		}, {
			assertBackend: false,
		} )
		cy.adjust( 'Margin Top', 20, { unit: '%' } ).assertComputedStyle( {
			'.ugb-separator': {
				[ `margin-top` ]: '5%',
			},
		}, {
			assertFrontend: false,
		} )
		cy.adjust( 'Margin Top', 20, { unit: '%' } ).assertComputedStyle( {
			'.ugb-separator': {
				[ `margin-top` ]: '19%',
			},
		}, {
			assertBackend: false,
		} )

		// Test Margin Bottom
		cy.adjust( 'Margin Bottom', 35, { unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator': {
				[ `margin-bottom` ]: '20px',
			},
		}, {
			assertFrontend: false,
		} )
		cy.adjust( 'Margin Bottom', 35, { unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator': {
				[ `margin-bottom` ]: '34px',
			},
		}, {
			assertBackend: false,
		} )
		cy.adjust( 'Margin Bottom', 40, { unit: '%' } ).assertComputedStyle( {
			'.ugb-separator': {
				[ `margin-bottom` ]: '25%',
			},
		}, {
			assertFrontend: false,
		} )
		cy.adjust( 'Margin Bottom', 40, { unit: '%' } ).assertComputedStyle( {
			'.ugb-separator': {
				[ `margin-bottom` ]: '39%',
			},
		}, {
			assertBackend: false,
		} )

		// Test Layer 2
		cy.collapse( 'Layer 2' )
		cy.toggleStyle( 'Layer 2' )
		cy.adjust( 'Layer Color', '#000000' )
		cy.adjust( 'Layer Height', 0.94 )
		cy.adjust( 'Layer Width', 1.7 )
		cy.adjust( 'Flip Horizontally', true )
		cy.adjust( 'Opacity', 0.6 )
		cy.adjust( 'Mix Blend Mode', 'soft-light' ).assertComputedStyle( {
			'.ugb-separator__layer-2': {
				[ `fill` ]: '#000000',
				[ `opacity` ]: '0.6',
				[ `mix-blend-mode` ]: 'soft-light',
				[ `transform` ]: 'matrix(-1.7, 0, 0, 0.94, 0, 0)',
			},
		} )

		// Test Layer 3
		cy.collapse( 'Layer 3' )
		cy.toggleStyle( 'Layer 3' )
		cy.adjust( 'Layer Color', '#ffffff' )
		cy.adjust( 'Layer Height', 0.79 )
		cy.adjust( 'Layer Width', 3.3 )
		cy.adjust( 'Flip Horizontally', true )
		cy.adjust( 'Opacity', 0.2 ).assertComputedStyle( {
			'.ugb-separator__layer-3': {
				[ `fill` ]: '#ffffff',
				[ `opacity` ]: '0.2',
				[ `transform` ]: 'matrix(-3.3, 0, 0, 0.79, 0, 0)',
			},
		} )
	} )
}

function tabletStyle() {
	it( 'should adjust tablet options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/separator' )
		cy.openInspector( 'ugb/separator', 'Style' )

		// Test General options
		cy.collapse( 'General' )
		cy.adjust( 'Height', 217, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-separator__svg-wrapper': {
				[ `height` ]: '217px',
			},
		} )
		cy.resetStyle( 'Height' )

		// Test Spacing options
		cy.collapse( 'Spacing' )

		// Test Paddings
		cy.adjust( 'Padding Top', 126, { viewport: 'Tablet', unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator__top-pad': {
				[ `height` ]: '126px',
			},
		} )
		cy.resetStyle( 'Padding Top' )
		cy.adjust( 'Padding Top', 40, { viewport: 'Tablet', unit: 'em' } ).assertComputedStyle( {
			'.ugb-separator__top-pad': {
				[ `height` ]: '40em',
			},
		} )
		cy.adjust( 'Padding Bottom', 111, { viewport: 'Tablet', unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator__bottom-pad': {
				[ `height` ]: '111px',
			},
		} )
		cy.resetStyle( 'Padding Bottom' )
		cy.adjust( 'Padding Bottom', 36, { viewport: 'Tablet', unit: 'em' } ).assertComputedStyle( {
			'.ugb-separator__bottom-pad': {
				[ `height` ]: '36em',
			},
		} )

		/**
		 *	Test Margins
		 *	Separator top & bottom margins have:
		 *	-1 on backend, -1 on frontend
		 */
		cy.adjust( 'Margin Top', 20, { viewport: 'Tablet', unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator': {
				[ `margin-top` ]: '19px',
			},
		} )
		cy.adjust( 'Margin Top', 25, { viewport: 'Tablet', unit: '%' } ).assertComputedStyle( {
			'.ugb-separator': {
				[ `margin-top` ]: '24%',
			},
		} )

		// Test Margin Bottom
		cy.adjust( 'Margin Bottom', 35, { viewport: 'Tablet', unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator': {
				[ `margin-bottom` ]: '34px',
			},
		} )
		cy.adjust( 'Margin Bottom', 40, { viewport: 'Tablet', unit: '%' } ).assertComputedStyle( {
			'.ugb-separator': {
				[ `margin-bottom` ]: '39%',
			},
		} )
	} )
}

function mobileStyle() {
	it( 'should adjust mobile options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/separator' )
		cy.openInspector( 'ugb/separator', 'Style' )

		// Test General options
		cy.collapse( 'General' )
		cy.adjust( 'Height', 217, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-separator__svg-wrapper': {
				[ `height` ]: '217px',
			},
		} )
		cy.resetStyle( 'Height' )

		// Test Spacing options
		cy.collapse( 'Spacing' )

		// Test Paddings
		cy.adjust( 'Padding Top', 126, { viewport: 'Mobile', unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator__top-pad': {
				[ `height` ]: '126px',
			},
		} )
		cy.resetStyle( 'Padding Top' )
		cy.adjust( 'Padding Top', 40, { viewport: 'Mobile', unit: 'em' } ).assertComputedStyle( {
			'.ugb-separator__top-pad': {
				[ `height` ]: '40em',
			},
		} )
		cy.adjust( 'Padding Bottom', 111, { viewport: 'Mobile', unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator__bottom-pad': {
				[ `height` ]: '111px',
			},
		} )
		cy.resetStyle( 'Padding Bottom' )
		cy.adjust( 'Padding Bottom', 36, { viewport: 'Mobile', unit: 'em' } ).assertComputedStyle( {
			'.ugb-separator__bottom-pad': {
				[ `height` ]: '36em',
			},
		} )

		/**
		 *	Test Margins
		 *	Separator top & bottom margins have:
		 *	-1 on backend, -1 on frontend
		 */
		cy.adjust( 'Margin Top', 20, { viewport: 'Mobile', unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator': {
				[ `margin-top` ]: '19px',
			},
		} )
		cy.adjust( 'Margin Top', 25, { viewport: 'Mobile', unit: '%' } ).assertComputedStyle( {
			'.ugb-separator': {
				[ `margin-top` ]: '24%',
			},
		} )

		// Test Margin Bottom
		cy.adjust( 'Margin Bottom', 35, { viewport: 'Mobile', unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator': {
				[ `margin-bottom` ]: '34px',
			},
		} )
		cy.adjust( 'Margin Bottom', 40, { viewport: 'Mobile', unit: '%' } ).assertComputedStyle( {
			'.ugb-separator': {
				[ `margin-bottom` ]: '39%',
			},
		} )
	} )
}

