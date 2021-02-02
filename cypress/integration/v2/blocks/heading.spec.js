
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, assertAligns, registerTests,
} from '~stackable-e2e/helpers'

describe( 'Advanced Heading Block', registerTests( [
	blockExist,
	blockError,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/heading', '.ugb-heading' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/heading' ) )
}

function desktopStyle() {
	it( 'should adjust desktop options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/heading' )
		cy.openInspector( 'ugb/heading', 'Style' )

		// Test General Alignment

		cy.collapse( 'General' )
		assertAligns( 'Align', '.ugb-inner-block' )

		// Test Title Options

		cy.collapse( 'Title' )
		cy.adjust( 'Title HTML Tag', 'h3' )
			.assertHtmlTag( '.ugb-heading__title', 'h3' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Serif',
			[ `Size` ]: 60,
			[ `Weight` ]: '600',
			[ `Transform` ]: 'uppercase',
			[ `Line-Height` ]: {
				value: 26,
				unit: 'px',
			},
			[ `Letter Spacing` ]: 2.4,
		} )
		cy.adjust( 'Size', 1.75, { unit: 'em' } )
		cy.adjust( 'Title Color', '#f00069' )
			.assertComputedStyle( {
				'.ugb-heading__title': {
					[ `font-size` ]: '1.75em',
					[ `font-weight` ]: '600',
					[ `text-transform` ]: 'uppercase',
					[ `letter-spacing` ]: '2.4px',
					[ `color` ]: '#f00069',
					[ `line-height` ]: '26px',
				},
			} )

		// Test Title Alignment

		assertAligns( 'Align', '.ugb-heading__title' )

		// Test Subtitle options

		cy.collapse( 'Subtitle' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Serif',
			[ `Size` ]: 30,
			[ `Weight` ]: '200',
			[ `Transform` ]: 'lowercase',
			[ `Line-Height` ]: {
				value: 22,
				unit: 'px',
			},
			[ `Letter Spacing` ]: 1.3,
		} )
		cy.adjust( 'Size', 1.25, { unit: 'em' } )
		cy.resetStyle( 'Size' )
		cy.adjust( 'Size', 1.75, { unit: 'em' } )
		cy.adjust( 'Subtitle Color', '#000000' )
			.assertComputedStyle( {
				'.ugb-heading__subtitle': {
					[ `font-size` ]: '1.75em',
					[ `font-weight` ]: '200',
					[ `text-transform` ]: 'lowercase',
					[ `letter-spacing` ]: '1.3px',
					[ `color` ]: '#000000',
					[ `line-height` ]: '22px',
				},
			} )

		// Test Subtitle Alignment

		assertAligns( 'Align', '.ugb-heading__subtitle' )

		// Test Top Line options

		cy.collapse( 'Top Line' )
		cy.toggleStyle( 'Top Line' )
		cy.adjust( 'Line Color', '#000000' )
		cy.adjust( 'Width', 390, { unit: 'px' } )
		cy.adjust( 'Height', 11 ).assertComputedStyle( {
			'.ugb-heading__top-line': {
				[ `background-color` ]: '#000000',
				[ `height` ]: '11px',
				[ `width` ]: '390px',
			},
		} )

		// Test Top Line Alignment

		cy.adjust( 'Align', 'left' ).assertComputedStyle( {
			'.ugb-heading__top-line': {
				[ `margin-left` ]: '0px',
			},
		} )
		cy.adjust( 'Align', 'center' )
		cy.adjust( 'Align', 'right' ).assertComputedStyle( {
			'.ugb-heading__top-line': {
				[ `margin-right` ]: '0px',
			},
		} )

		// Test Bottom Line options

		cy.collapse( 'Bottom Line' )
		cy.toggleStyle( 'Bottom Line' )
		cy.adjust( 'Line Color', '#000000' )
		cy.adjust( 'Width', 300, { unit: 'px' } )
		cy.adjust( 'Height', 11 ).assertComputedStyle( {
			'.ugb-heading__bottom-line': {
				[ `background-color` ]: '#000000',
				[ `height` ]: '11px',
				[ `width` ]: '300px',
			},
		} )

		// Test Bottom Line Alignment

		cy.adjust( 'Align', 'left' ).assertComputedStyle( {
			'.ugb-heading__bottom-line': {
				[ `margin-left` ]: '0px',
			},
		} )
		cy.adjust( 'Align', 'center' )
		cy.adjust( 'Align', 'right' ).assertComputedStyle( {
			'.ugb-heading__top-line': {
				[ `margin-right` ]: '0px',
			},
		} )

		// Test Spacing options

		cy.collapse( 'Spacing' )
		cy.adjust( 'Top Line', 36 ).assertComputedStyle( {
			'.ugb-heading__top-line': {
				[ `margin-bottom` ]: '36px',
			},
		} )
		cy.adjust( 'Title', 40 ).assertComputedStyle( {
			'.ugb-heading__title': {
				[ `margin-bottom` ]: '40px',
			},
		} )
		cy.adjust( 'Subtitle', 25 ).assertComputedStyle( {
			'.ugb-heading__subtitle': {
				[ `margin-bottom` ]: '25px',
			},
		} )
		cy.adjust( 'Bottom Line', 12 ).assertComputedStyle( {
			'.ugb-heading__bottom-line': {
				[ `margin-bottom` ]: '12px',
			},
		} )
	} )
}

function tabletStyle() {
	it( 'should adjust tablet options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/heading' )
		cy.openInspector( 'ugb/heading', 'Style' )

		// Test General Alignment

		cy.collapse( 'General' )
		assertAligns( 'Align', '.ugb-inner-block', { viewport: 'Tablet' } )

		// Test Title Size

		cy.collapse( 'Title' )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Tablet',
				value: 30,
				unit: 'px',
			},
			[ `Line-Height` ]: {
				viewport: 'Tablet',
				value: 26,
				unit: 'px',
			},
		} )
		cy.adjust( 'Size', 38, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-heading__title': {
				[ `font-size` ]: '38px',
				[ `line-height` ]: '26px',
			},
		} )

		// Test Title Alignment

		assertAligns( 'Align', '.ugb-heading__title', { viewport: 'Tablet' } )

		// Test Subtitle Size

		cy.collapse( 'Subtitle' )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Tablet',
				value: 30,
				unit: 'px',
			},
			[ `Line-Height` ]: {
				viewport: 'Tablet',
				value: 22,
				unit: 'px',
			},
		} )
		cy.adjust( 'Size', 28, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-heading__subtitle': {
				[ `font-size` ]: '28px',
				[ `line-height` ]: '22px',
			},
		} )

		// Test Subtitle Alignment

		assertAligns( 'Align', '.ugb-heading__subtitle', { viewport: 'Tablet' } )

		// Test Top Line Alignment

		cy.collapse( 'Top Line' )
		cy.adjust( 'Align', 'left', { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-heading__top-line': {
				[ `margin-left` ]: '0px',
			},
		} )
		cy.adjust( 'Align', 'center', { viewport: 'Tablet' } )
		cy.adjust( 'Align', 'right', { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-heading__top-line': {
				[ `margin-right` ]: '0px',
			},
		} )

		// Test Bottom Line Alignment

		cy.collapse( 'Bottom Line' )
		cy.adjust( 'Align', 'left', { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-heading__bottom-line': {
				[ `margin-left` ]: '0px',
			},
		} )
		cy.adjust( 'Align', 'center', { viewport: 'Tablet' } )
		cy.adjust( 'Align', 'right', { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-heading__top-line': {
				[ `margin-right` ]: '0px',
			},
		} )

		// Test Spacing options

		cy.collapse( 'Spacing' )
		cy.adjust( 'Top Line', 7, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-heading__top-line': {
				[ `margin-bottom` ]: '7px',
			},
		} )
		cy.adjust( 'Title', 1, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-heading__title': {
				[ `margin-bottom` ]: '1px',
			},
		} )
		cy.adjust( 'Subtitle', 44, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-heading__subtitle': {
				[ `margin-bottom` ]: '44px',
			},
		} )
		cy.adjust( 'Bottom Line', 14, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-heading__bottom-line': {
				[ `margin-bottom` ]: '14px',
			},
		} )
	} )
}

function mobileStyle() {
	it( 'should adjust mobile options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/heading' )
		cy.openInspector( 'ugb/heading', 'Style' )

		// Test General Alignment

		cy.collapse( 'General' )
		assertAligns( 'Align', '.ugb-inner-block', { viewport: 'Mobile' } )

		// Test Title Size

		cy.collapse( 'Title' )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Mobile',
				value: 30,
				unit: 'px',
			},
			[ `Line-Height` ]: {
				viewport: 'Mobile',
				value: 20,
				unit: 'px',
			},
		} )
		cy.adjust( 'Size', 38, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-heading__title': {
				[ `font-size` ]: '38px',
				[ `line-height` ]: '20px',
			},
		} )

		// Test Title Alignment

		assertAligns( 'Align', '.ugb-heading__title', { viewport: 'Mobile' } )

		// Test Subtitle Size

		cy.collapse( 'Subtitle' )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Mobile',
				value: 29,
				unit: 'px',
			},
			[ `Line-Height` ]: {
				viewport: 'Mobile',
				value: 18,
				unit: 'px',
			},
		} )
		cy.adjust( 'Size', 26, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-heading__subtitle': {
				[ `font-size` ]: '26px',
				[ `line-height` ]: '18px',
			},
		} )

		// Test Subtitle Alignment

		assertAligns( 'Align', '.ugb-heading__subtitle', { viewport: 'Mobile' } )

		// Test Top Line Alignment

		cy.collapse( 'Top Line' )
		cy.adjust( 'Align', 'left', { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-heading__top-line': {
				[ `margin-left` ]: '0px',
			},
		} )
		cy.adjust( 'Align', 'center', { viewport: 'Mobile' } )
		cy.adjust( 'Align', 'right', { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-heading__top-line': {
				[ `margin-right` ]: '0px',
			},
		} )

		// Test Bottom Line Alignment

		cy.collapse( 'Bottom Line' )
		cy.adjust( 'Align', 'left', { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-heading__bottom-line': {
				[ `margin-left` ]: '0px',
			},
		} )
		cy.adjust( 'Align', 'center', { viewport: 'Mobile' } )
		cy.adjust( 'Align', 'right', { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-heading__top-line': {
				[ `margin-right` ]: '0px',
			},
		} )

		// Test Spacing options

		cy.collapse( 'Spacing' )
		cy.adjust( 'Top Line', 10, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-heading__top-line': {
				[ `margin-bottom` ]: '10px',
			},
		} )
		cy.adjust( 'Title', 4, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-heading__title': {
				[ `margin-bottom` ]: '4px',
			},
		} )
		cy.adjust( 'Subtitle', 40, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-heading__subtitle': {
				[ `margin-bottom` ]: '40px',
			},
		} )
		cy.adjust( 'Bottom Line', 17, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-heading__bottom-line': {
				[ `margin-bottom` ]: '17px',
			},
		} )
	} )
}

