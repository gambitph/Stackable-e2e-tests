/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchLayouts, switchDesigns, assertAligns, assertBlockBackground, assertSeparators, registerTests,
} from '~stackable-e2e/helpers'

describe( 'Advanced Text Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/text', '.ugb-text' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/text' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/text', [
		'Plain',
		'Side Title 1',
		'Side Title 2',
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/text', [
		'Angled Advanced Text',
		'Aspire Advanced Text',
		'Aurora Advanced Text',
		'Dare Advanced Text',
		'Decora Advanced Text',
		'Detour Advanced Text',
		'Dim Advanced Text',
		'Elevate Advanced Text',
		'Flex Advanced Text',
		'Glow Advanced Text',
		'Lounge Advanced Text',
		'Lume Advanced Text',
		'Lush Advanced Text',
		'Peplum Advanced Text',
		'Proact Advanced Text 1',
		'Proact Advanced Text 2',
		'Seren Advanced Text',
	] ) )
}

function desktopStyle() {
	it( 'should adjust desktop options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/text' )
		cy.openInspector( 'ugb/text', 'Style' )

		// Test General options
		cy.collapse( 'General' )
		cy.adjust( 'Columns', 2 )
			.assertClassName( '.ugb-text', 'ugb-text--columns-2' )
		assertAligns( 'Align', '.ugb-inner-block' )

		// Test Column Rule
		cy.collapse( 'Column Rule' )
		cy.toggleStyle( 'Column Rule' )
		cy.adjust( 'Color', '#000000' )
		cy.adjust( 'Width', 3 )
		cy.adjust( 'Height', 86 ).assertComputedStyle( {
			'.ugb-text__rule': {
				[ `background-color` ]: '#000000',
				[ `width` ]: '3px',
				[ `height` ]: '86%',
			},
		} )

		// Test Text options
		cy.collapse( 'Text' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Serif',
			[ `Size` ]: 23,
			[ `Weight` ]: '600',
			[ `Transform` ]: 'lowercase',
			[ `Line-Height` ]: {
				value: 49,
				unit: 'px',
			},
			[ `Letter Spacing` ]: 1.9,
		} )
		cy.adjust( 'Size', 1.75, { unit: 'em' } )
		cy.adjust( 'Text Color', '#333333' ).assertComputedStyle( {
			'.ugb-text__text p': {
				[ `font-size` ]: '1.75em',
				[ `font-weight` ]: '600',
				[ `text-transform` ]: 'lowercase',
				[ `letter-spacing` ]: '1.9px',
				[ `color` ]: '#333333',
				[ `line-height` ]: '49px',
			},
		} )
		assertAligns( 'Align', '.ugb-text__text p' )

		// Test Title
		cy.collapse( 'Title' )
		cy.toggleStyle( 'Title' )
		cy.typeBlock( 'ugb/text', '.ugb-text__title', 'Title here' )
		cy.adjust( 'Title HTML Tag', 'h3' )
			.assertHtmlTag( '.ugb-text__title', 'h3' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Sans-Serif',
			[ `Size` ]: 26,
			[ `Weight` ]: '600',
			[ `Transform` ]: 'uppercase',
			[ `Line-Height` ]: {
				value: 49,
				unit: 'px',
			},
			[ `Letter Spacing` ]: 1.9,
		} )
		cy.adjust( 'Size', 2.75, { unit: 'em' } )
		cy.adjust( 'Title Color', '#333333' ).assertComputedStyle( {
			'.ugb-text__title': {
				[ `font-size` ]: '2.75em',
				[ `font-weight` ]: '600',
				[ `text-transform` ]: 'uppercase',
				[ `letter-spacing` ]: '1.9px',
				[ `color` ]: '#333333',
				[ `line-height` ]: '49px',
			},
		} )

		const aligns = [ 'flex-start', 'center', 'flex-end' ]
		aligns.forEach( align => {
			cy.adjust( 'Vertical Align', align ).assertComputedStyle( {
				'.ugb-text__title-wrapper': {
					[ `justify-content` ]: align,
				},
			} )
		} )
		assertAligns( 'Align', '.ugb-text__title' )

		// Test Subtitle options
		cy.collapse( 'Subtitle' )
		cy.toggleStyle( 'Subtitle' )
		cy.typeBlock( 'ugb/text', '.ugb-text__subtitle', 'Subtitle here' )
		cy.adjust( 'Subtitle on Top', true )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Sans-Serif',
			[ `Size` ]: 15,
			[ `Weight` ]: '200',
			[ `Transform` ]: 'uppercase',
			[ `Line-Height` ]: {
				value: 16,
				unit: 'px',
			},
			[ `Letter Spacing` ]: 1.5,
		} )
		cy.adjust( 'Size', 0.9, { unit: 'em' } )
		cy.adjust( 'Subtitle Color', '#333333' ).assertComputedStyle( {
			'.ugb-text__subtitle': {
				[ `font-size` ]: '0.9em',
				[ `font-weight` ]: '200',
				[ `text-transform` ]: 'uppercase',
				[ `letter-spacing` ]: '1.5px',
				[ `color` ]: '#333333',
				[ `line-height` ]: '16px',
			},
		} )

		// Test Spacing options
		cy.collapse( 'Spacing' )
		cy.adjust( 'Paddings', 28 ).assertComputedStyle( {
			'.ugb-text__text-wrapper': {
				[ `padding-top` ]: '28px',
				[ `padding-bottom` ]: '28px',
				[ `padding-right` ]: '28px',
				[ `padding-left` ]: '28px',
			},
		} )
		cy.resetStyle( 'Paddings' )
		cy.adjust( 'Paddings', 5, { unit: 'em' } ).assertComputedStyle( {
			'.ugb-text__text-wrapper': {
				[ `padding-top` ]: '5em',
				[ `padding-bottom` ]: '5em',
				[ `padding-right` ]: '5em',
				[ `padding-left` ]: '5em',
			},
		} )
		cy.resetStyle( 'Paddings' )
		cy.adjust( 'Paddings', 16, { unit: '%' } ).assertComputedStyle( {
			'.ugb-text__text-wrapper': {
				[ `padding-top` ]: '16%',
				[ `padding-bottom` ]: '16%',
				[ `padding-right` ]: '16%',
				[ `padding-left` ]: '16%',
			},
		} )
		cy.adjust( 'Title', 23 ).assertComputedStyle( {
			'.ugb-text__title': {
				[ `margin-bottom` ]: '23px',
			},
		} )
		cy.adjust( 'Subtitle', 8 ).assertComputedStyle( {
			'.ugb-text__subtitle': {
				[ `margin-bottom` ]: '8px',
			},
		} )
		cy.adjust( 'Text', 21 ).assertComputedStyle( {
			'.ugb-text__text': {
				[ `margin-bottom` ]: '21px',
			},
		} )

		// Test Block Background
		assertBlockBackground( '.ugb-text', { viewport: 'Desktop' } )

		// Test Top and Bottom Separator
		assertSeparators( { viewport: 'Desktop' } )
	} )
}

function tabletStyle() {
	it( 'should adjust tablet options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/text' )
		cy.openInspector( 'ugb/text', 'Style' )

		// Test General options
		cy.collapse( 'General' )
		assertAligns( 'Align', '.ugb-inner-block', { viewport: 'Tablet' } )

		// Test Text options
		cy.collapse( 'Text' )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Tablet',
				value: 18,
				unit: 'px',
			},
			[ `Line-Height` ]: {
				viewport: 'Tablet',
				value: 26,
				unit: 'px',
			},
		} )
		cy.adjust( 'Size', 1.3, { viewport: 'Tablet', unit: 'em' } ).assertComputedStyle( {
			'.ugb-text__text p': {
				[ `font-size` ]: '1.3em',
				[ `line-height` ]: '26px',
			},
		} )
		assertAligns( 'Align', '.ugb-text__text p', { viewport: 'Tablet' } )

		// Test Title options
		cy.collapse( 'Title' )
		cy.toggleStyle( 'Title' )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Tablet',
				value: 26,
				unit: 'px',
			},
			[ `Line-Height` ]: {
				viewport: 'Tablet',
				value: 29,
				unit: 'px',
			},
		} )
		cy.adjust( 'Size', 1.6, { viewport: 'Tablet', unit: 'em' } ).assertComputedStyle( {
			'.ugb-text__title': {
				[ `font-size` ]: '1.6em',
				[ `line-height` ]: '29px',
			},
		} )
		assertAligns( 'Align', '.ugb-text__title', { viewport: 'Tablet' } )

		// Test Subtitle options
		cy.collapse( 'Subtitle' )
		cy.toggleStyle( 'Subtitle' )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Tablet',
				value: 26,
				unit: 'px',
			},
			[ `Line-Height` ]: {
				viewport: 'Tablet',
				value: 25,
				unit: 'px',
			},
		} )
		cy.adjust( 'Size', 0.9, { viewport: 'Tablet', unit: 'em' } ).assertComputedStyle( {
			'.ugb-text__subtitle': {
				[ `font-size` ]: '0.9em',
				[ `line-height` ]: '25px',
			},
		} )
		assertAligns( 'Align', '.ugb-text__subtitle', { viewport: 'Tablet' } )

		// Test Spacing options
		cy.collapse( 'Spacing' )
		cy.adjust( 'Paddings', 28, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-text__text-wrapper': {
				[ `padding-top` ]: '28px',
				[ `padding-bottom` ]: '28px',
				[ `padding-right` ]: '28px',
				[ `padding-left` ]: '28px',
			},
		} )
		cy.resetStyle( 'Paddings' )
		cy.adjust( 'Paddings', 5, { viewport: 'Tablet', unit: 'em' } ).assertComputedStyle( {
			'.ugb-text__text-wrapper': {
				[ `padding-top` ]: '5em',
				[ `padding-bottom` ]: '5em',
				[ `padding-right` ]: '5em',
				[ `padding-left` ]: '5em',
			},
		} )
		cy.resetStyle( 'Paddings' )
		cy.adjust( 'Paddings', 16, { viewport: 'Tablet', unit: '%' } ).assertComputedStyle( {
			'.ugb-text__text-wrapper': {
				[ `padding-top` ]: '16%',
				[ `padding-bottom` ]: '16%',
				[ `padding-right` ]: '16%',
				[ `padding-left` ]: '16%',
			},
		} )
		cy.adjust( 'Title', 23, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-text__title': {
				[ `margin-bottom` ]: '23px',
			},
		} )
		cy.adjust( 'Subtitle', 8, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-text__subtitle': {
				[ `margin-bottom` ]: '8px',
			},
		} )
		cy.adjust( 'Text', 21, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-text__text': {
				[ `margin-bottom` ]: '21px',
			},
		} )

		// Test Block Background
		assertBlockBackground( '.ugb-text', { viewport: 'Tablet' } )

		// Test Top and Bottom Separator
		assertSeparators( { viewport: 'Tablet' } )
	} )
}

function mobileStyle() {
	it( 'should adjust mobile options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/text' )
		cy.openInspector( 'ugb/text', 'Style' )

		// Test General options
		cy.collapse( 'General' )
		assertAligns( 'Align', '.ugb-inner-block', { viewport: 'Mobile' } )

		// Test Text options
		cy.collapse( 'Text' )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Mobile',
				value: 18,
				unit: 'px',
			},
			[ `Line-Height` ]: {
				viewport: 'Mobile',
				value: 26,
				unit: 'px',
			},
		} )
		cy.adjust( 'Size', 1.3, { viewport: 'Mobile', unit: 'em' } ).assertComputedStyle( {
			'.ugb-text__text p': {
				[ `font-size` ]: '1.3em',
				[ `line-height` ]: '26px',
			},
		} )
		assertAligns( 'Align', '.ugb-text__text p', { viewport: 'Mobile' } )

		// Test Title options
		cy.collapse( 'Title' )
		cy.toggleStyle( 'Title' )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Mobile',
				value: 26,
				unit: 'px',
			},
			[ `Line-Height` ]: {
				viewport: 'Mobile',
				value: 29,
				unit: 'px',
			},
		} )
		cy.adjust( 'Size', 1.6, { viewport: 'Mobile', unit: 'em' } ).assertComputedStyle( {
			'.ugb-text__title': {
				[ `font-size` ]: '1.6em',
				[ `line-height` ]: '29px',
			},
		} )
		assertAligns( 'Align', '.ugb-text__title', { viewport: 'Mobile' } )

		// Test Subtitle options
		cy.collapse( 'Subtitle' )
		cy.toggleStyle( 'Subtitle' )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Mobile',
				value: 26,
				unit: 'px',
			},
			[ `Line-Height` ]: {
				viewport: 'Mobile',
				value: 25,
				unit: 'px',
			},
		} )
		cy.adjust( 'Size', 0.9, { viewport: 'Mobile', unit: 'em' } ).assertComputedStyle( {
			'.ugb-text__subtitle': {
				[ `font-size` ]: '0.9em',
				[ `line-height` ]: '25px',
			},
		} )
		assertAligns( 'Align', '.ugb-text__subtitle', { viewport: 'Mobile' } )

		// Test Spacing options
		cy.collapse( 'Spacing' )
		cy.adjust( 'Paddings', 28, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-text__text-wrapper': {
				[ `padding-top` ]: '28px',
				[ `padding-bottom` ]: '28px',
				[ `padding-right` ]: '28px',
				[ `padding-left` ]: '28px',
			},
		} )
		cy.resetStyle( 'Paddings' )
		cy.adjust( 'Paddings', 5, { viewport: 'Mobile', unit: 'em' } ).assertComputedStyle( {
			'.ugb-text__text-wrapper': {
				[ `padding-top` ]: '5em',
				[ `padding-bottom` ]: '5em',
				[ `padding-right` ]: '5em',
				[ `padding-left` ]: '5em',
			},
		} )
		cy.resetStyle( 'Paddings' )
		cy.adjust( 'Paddings', 16, { viewport: 'Mobile', unit: '%' } ).assertComputedStyle( {
			'.ugb-text__text-wrapper': {
				[ `padding-top` ]: '16%',
				[ `padding-bottom` ]: '16%',
				[ `padding-right` ]: '16%',
				[ `padding-left` ]: '16%',
			},
		} )
		cy.adjust( 'Title', 23, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-text__title': {
				[ `margin-bottom` ]: '23px',
			},
		} )
		cy.adjust( 'Subtitle', 8, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-text__subtitle': {
				[ `margin-bottom` ]: '8px',
			},
		} )
		cy.adjust( 'Text', 21, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-text__text': {
				[ `margin-bottom` ]: '21px',
			},
		} )

		// Test Block Background
		assertBlockBackground( '.ugb-text', { viewport: 'Mobile' } )

		// Test Top and Bottom Separator
		assertSeparators( { viewport: 'Mobile' } )
	} )
}

