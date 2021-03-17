/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchLayouts, registerTests, responsiveAssertHelper, assertAdvancedTab,
} from '~stackable-e2e/helpers'
import { registerBlockSnapshots } from '~gutenberg-e2e/plugins'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Separator Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	desktopStyle,
	tabletStyle,
	mobileStyle,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/separator', '.ugb-separator' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/separator' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/separator', [
		{ value: 'Wave 1', selector: '.ugb-separator--design-wave-1' },
		{ value: 'Wave 2', selector: '.ugb-separator--design-wave-2' },
		{ value: 'Wave 3', selector: '.ugb-separator--design-wave-3' },
		{ value: 'Wave 4', selector: '.ugb-separator--design-wave-4' },
		{ value: 'Slant 1', selector: '.ugb-separator--design-slant-1' },
		{ value: 'Slant 2', selector: '.ugb-separator--design-slant-2' },
		{ value: 'Curve 1', selector: '.ugb-separator--design-curve-1' },
		{ value: 'Curve 2', selector: '.ugb-separator--design-curve-2' },
		{ value: 'Curve 3', selector: '.ugb-separator--design-curve-3' },
		{ value: 'Rounded 1', selector: '.ugb-separator--design-rounded-1' },
		{ value: 'Rounded 2', selector: '.ugb-separator--design-rounded-2' },
		{ value: 'Rounded 3', selector: '.ugb-separator--design-rounded-3' },
	] ) )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/separator' ).as( 'separatorBlock' )
	const separatorBlock = registerBlockSnapshots( 'separatorBlock' )
	cy.openInspector( 'ugb/separator', 'Style' )

	desktopOnly( () => {
		cy.collapse( 'Separator' )
		cy.adjust( 'Separator Color', '#c99292' )
		cy.adjust( 'Separator Width', 2.1 )
		cy.adjust( 'Flip Horizontally', true ).assertComputedStyle( {
			'.ugb-separator__layer-1': {
				'fill': '#c99292',
				'transform': 'matrix(-2.1, 0, 0, 1, 0, 0)',
			},
		} )

		cy.adjust( 'Shadow', true )
		cy.get( 'div.ugb-separator__svg-inner' ).find( '.ugb-separator__shadow' ).should( 'exist' )
	} )

	// Test General options
	cy.collapse( 'General' )
	cy.adjust( 'Height', 240, { viewport } ).assertComputedStyle( {
		'.ugb-separator__svg-wrapper': {
			'height': '240px',
		},
	} )
	cy.resetStyle( 'Height' )

	desktopOnly( () => {
		cy.adjust( 'Flip Vertically', true )
			.assertClassName( '.ugb-separator', 'ugb-separator--flip-vertical' )
		cy.adjust( 'Flip Horizontally', true )
			.assertClassName( '.ugb-separator', 'ugb-separator--flip-horizontal' )

		cy.adjust( 'Background Color', '#733535' ).assertComputedStyle( {
			'.ugb-separator': {
				'background-color': '#733535',
			},
		} )
	} )

	// Test Spacing options
	cy.collapse( 'Spacing' )

	desktopOnly( () => {
		// Test Paddings
		cy.adjust( 'Padding Top', 126, { unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator__top-pad': {
				'height': '126px',
			},
		} )
		cy.resetStyle( 'Padding Top' )
		cy.adjust( 'Padding Top', 40, { unit: 'em' } ).assertComputedStyle( {
			'.ugb-separator__top-pad': {
				'height': '40em',
			},
		} )
		cy.adjust( 'Padding Bottom', 111, { unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator__bottom-pad': {
				'height': '111px',
			},
		} )
		cy.resetStyle( 'Padding Bottom' )
		cy.adjust( 'Padding Bottom', 36, { unit: 'em' } ).assertComputedStyle( {
			'.ugb-separator__bottom-pad': {
				'height': '36em',
			},
		} )

		/**
		 *	Test Margins
		 *	Separator top & bottom margins have:
		 *	-15 on backend, -1 on frontend
		 */
		cy.adjust( 'Margin Top', 20, { unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator': {
				'margin-top': '5px',
			},
		}, {
			assertFrontend: false,
		} )
		cy.adjust( 'Margin Top', 20, { unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator': {
				'margin-top': '19px',
			},
		}, {
			assertBackend: false,
		} )
		cy.adjust( 'Margin Top', 20, { unit: '%' } ).assertComputedStyle( {
			'.ugb-separator': {
				'margin-top': '5%',
			},
		}, {
			assertFrontend: false,
		} )
		cy.adjust( 'Margin Top', 20, { unit: '%' } ).assertComputedStyle( {
			'.ugb-separator': {
				'margin-top': '19%',
			},
		}, {
			assertBackend: false,
		} )

		// Test Margin Bottom
		cy.adjust( 'Margin Bottom', 35, { unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator': {
				'margin-bottom': '20px',
			},
		}, {
			assertFrontend: false,
		} )
		cy.adjust( 'Margin Bottom', 35, { unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator': {
				'margin-bottom': '34px',
			},
		}, {
			assertBackend: false,
		} )
		cy.adjust( 'Margin Bottom', 40, { unit: '%' } ).assertComputedStyle( {
			'.ugb-separator': {
				'margin-bottom': '25%',
			},
		}, {
			assertFrontend: false,
		} )
		cy.adjust( 'Margin Bottom', 40, { unit: '%' } ).assertComputedStyle( {
			'.ugb-separator': {
				'margin-bottom': '39%',
			},
		}, {
			assertBackend: false,
		} )
	} )

	if ( viewport !== 'Desktop' ) {
		// Test Paddings
		cy.adjust( 'Padding Top', 126, { viewport, unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator__top-pad': {
				'height': '126px',
			},
		} )
		cy.resetStyle( 'Padding Top' )
		cy.adjust( 'Padding Top', 40, { viewport, unit: 'em' } ).assertComputedStyle( {
			'.ugb-separator__top-pad': {
				'height': '40em',
			},
		} )
		cy.adjust( 'Padding Bottom', 111, { viewport, unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator__bottom-pad': {
				'height': '111px',
			},
		} )
		cy.resetStyle( 'Padding Bottom' )
		cy.adjust( 'Padding Bottom', 36, { viewport, unit: 'em' } ).assertComputedStyle( {
			'.ugb-separator__bottom-pad': {
				'height': '36em',
			},
		} )

		/**
		 *	Test Margins
		 *	Separator top & bottom margins have:
		 *	-1 on backend, -1 on frontend
		 */
		cy.adjust( 'Margin Top', 20, { viewport, unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator': {
				'margin-top': '19px',
			},
		} )
		cy.adjust( 'Margin Top', 25, { viewport, unit: '%' } ).assertComputedStyle( {
			'.ugb-separator': {
				'margin-top': '24%',
			},
		} )

		// Test Margin Bottom
		cy.adjust( 'Margin Bottom', 35, { viewport, unit: 'px' } ).assertComputedStyle( {
			'.ugb-separator': {
				'margin-bottom': '34px',
			},
		} )
		cy.adjust( 'Margin Bottom', 40, { viewport, unit: '%' } ).assertComputedStyle( {
			'.ugb-separator': {
				'margin-bottom': '39%',
			},
		} )
	}

	desktopOnly( () => {
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
				'fill': '#000000',
				'opacity': '0.6',
				'mix-blend-mode': 'soft-light',
				'transform': 'matrix(-1.7, 0, 0, 0.94, 0, 0)',
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
				'fill': '#ffffff',
				'opacity': '0.2',
				'transform': 'matrix(-3.3, 0, 0, 0.79, 0, 0)',
			},
		} )
	} )
	separatorBlock.assertFrontendStyles()
}

function advancedTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/separator' ).as( 'separatorBlock' )
	const separatorBlock = registerBlockSnapshots( 'separatorBlock' )

	cy.openInspector( 'ugb/separator', 'Advanced' )

	assertAdvancedTab( '.ugb-separator', {
		disableBlockMargins: true,
		disableBlockPaddings: true,
		mainSelector: '.ugb-separator',
		paddingUnits: [ 'px', 'em' ],
		viewport,
	 } )

	separatorBlock.assertFrontendStyles()
}
