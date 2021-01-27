
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, assertAligns,
} from '~stackable-e2e/helpers'

describe( 'Icon Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/icon', '.ugb-icon' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/icon' ) )

	it( 'should switch design', switchDesigns( 'ugb/icon', [
		'Cary Icon',
		'Elevate Icon',
		'Hue Icon',
		'Lume Icon',
	] ) )

	it( 'should adjust desktop options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/icon' )
		cy.openInspector( 'ugb/icon', 'Style' )

		// Test General options
		cy.collapse( 'General' )
		cy.adjust( 'Number of Icons / Columns', 4 )
		cy.get( '.ugb-icon__item4' ).should( 'exist' )

		assertAligns( 'Align', '.ugb-inner-block' )

		// Test Title options
		cy.collapse( 'Title' )
		cy.toggleStyle( 'Title' )
		cy.adjust( 'Title on Top', true )
		cy.adjust( 'Title HTML Tag', 'h4' )
			.assertHtmlTag( '.ugb-icon__title', 'h4' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Serif',
			[ `Size` ]: 18,
			[ `Weight` ]: '200',
			[ `Transform` ]: 'lowercase',
			[ `Line-Height` ]: {
				value: 26,
				unit: 'px',
			},
			[ `Letter Spacing` ]: 1.3,
		} )
		cy.adjust( 'Size', 25 )
		cy.adjust( 'Title Color', '#636363' ).assertComputedStyle( {
			'.ugb-icon__title': {
				[ `font-size` ]: '25px',
				[ `font-weight` ]: '200',
				[ `text-transform` ]: 'lowercase',
				[ `letter-spacing` ]: '1.3px',
				[ `color` ]: '#636363',
				[ `line-height` ]: '26px',
			},
		} )
		// Test Title Alignment
		assertAligns( 'Align', '.ugb-icon__title' )

		// Test Icon options
		cy.collapse( 'Icon' )
		cy.adjust( 'Icon Color', '#acacac' ).assertComputedStyle( {
			'.ugb-icon-inner-svg': {
				[ `color` ]: '#acacac',
				[ `fill` ]: '#acacac',
			},
		} )
		cy.adjust( 'Icon Color Type', 'gradient' )
		cy.adjust( 'Icon Color #1', '#f00069' )
		cy.adjust( 'Icon Color #2', '#000000' )
		cy.adjust( 'Gradient Direction (degrees)', 180 )
		cy.adjust( 'Icon Size', 59 ).assertComputedStyle( {
			'.ugb-icon-inner-svg': {
				[ `fill` ]: 'url("#grad-f00069-000000-180")',
				[ `height` ]: '59px',
				[ `width` ]: '59px',
			},
		} )
		cy.adjust( 'Icon Opacity', 0.5 ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `opacity` ]: '0.5',
			},
		} )
		cy.adjust( 'Icon Rotation', 31 )

		// TODO: Add Multicolor test

		cy.adjust( 'Background Shape', true )
		cy.adjust( 'Shape Color', '#bcdeff' )
		cy.adjust( 'Shape Opacity', 0.9 )
		cy.adjust( 'Shape Size', 1.4 )
		cy.adjust( 'Horizontal Offset', 9 )
		cy.adjust( 'Vertical Offset', 8 ).assertComputedStyle( {
			'.ugb-icon__bg-shape': {
				[ `fill` ]: '#bcdeff',
				[ `color` ]: '#bcdeff',
				[ `opacity` ]: '0.9',
			},
		} )
		cy.adjust( 'Align', 'left' ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `align-self` ]: 'flex-start',
			},
		} )
		cy.adjust( 'Align', 'center' ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `align-self` ]: 'center',
			},
		} )
		cy.adjust( 'Align', 'right' ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `align-self` ]: 'flex-end',
			},
		} )

		// Test Effects option
		cy.collapse( 'Effects' )
		cy.adjust( 'Hover Effect', 'lift-more' )
			.assertClassName( '.ugb-icon__item', 'ugb--hover-lift-more' )

		// Test Block Title
		cy.collapse( 'Block Title' )
		cy.toggleStyle( 'Block Title' )
		cy.adjust( 'Title HTML Tag', 'h2' )
			.assertHtmlTag( '.ugb-block-title', 'h2' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Sans-Serif',
			[ `Size` ]: 31,
			[ `Weight` ]: '700',
			[ `Transform` ]: 'uppercase',
			[ `Line-Height` ]: {
				value: 46,
				unit: 'px',
			},
			[ `Letter Spacing` ]: 1.3,
		} )
		cy.adjust( 'Size', 46 )
		cy.adjust( 'Title Color', '#636363' )
		cy.adjust( 'Max Width', 748 ).assertComputedStyle( {
			'.ugb-block-title': {
				[ `font-size` ]: '46px',
				[ `font-weight` ]: '700',
				[ `text-transform` ]: 'uppercase',
				[ `letter-spacing` ]: '1.3px',
				[ `color` ]: '#636363',
				[ `max-width` ]: '748px',
				[ `line-height` ]: '46px',
			},
		} )
		cy.adjust( 'Horizontal Align', 'flex-start' ).assertComputedStyle( {
			'.ugb-block-title': {
				[ `margin-left` ]: '0px',
			},
		} )
		cy.adjust( 'Horizontal Align', 'center' )
		cy.adjust( 'Horizontal Align', 'flex-end' ).assertComputedStyle( {
			'.ugb-block-title': {
				[ `margin-right` ]: '0px',
			},
		} )

		// Test Block Title Alignment
		assertAligns( 'Text Align', '.ugb-block-title' )

		// Test Block Description
		cy.collapse( 'Block Description' )
		cy.toggleStyle( 'Block Description' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Serif',
			[ `Size` ]: 25,
			[ `Weight` ]: '300',
			[ `Transform` ]: 'lowercase',
			[ `Line-Height` ]: {
				value: 36,
				unit: 'px',
			},
			[ `Letter Spacing` ]: 1.3,
		} )
		cy.adjust( 'Size', 31 )
		cy.adjust( 'Description Color', '#636363' )
		cy.adjust( 'Max Width', 734 ).assertComputedStyle( {
			'.ugb-block-description': {
				[ `font-size` ]: '31px',
				[ `font-weight` ]: '300',
				[ `text-transform` ]: 'lowercase',
				[ `letter-spacing` ]: '1.3px',
				[ `color` ]: '#636363',
				[ `max-width` ]: '734px',
				[ `line-height` ]: '36px',
			},
		} )
		cy.adjust( 'Horizontal Align', 'flex-start' ).assertComputedStyle( {
			'.ugb-block-description': {
				[ `margin-left` ]: '0px',
			},
		} )
		cy.adjust( 'Horizontal Align', 'center' )
		cy.adjust( 'Horizontal Align', 'flex-end' ).assertComputedStyle( {
			'.ugb-block-description': {
				[ `margin-right` ]: '0px',
			},
		} )

		// Test Block Description Alignment
		assertAligns( 'Text Align', '.ugb-block-description' )

		// Test Spacing options
		cy.collapse( 'Spacing' )
		cy.adjust( 'Block Title', 30 ).assertComputedStyle( {
			'.ugb-block-title': {
				[ `margin-bottom` ]: '30px',
			},
		} )
		cy.adjust( 'Block Description', 22 ).assertComputedStyle( {
			'.ugb-block-description': {
				[ `margin-bottom` ]: '22px',
			},
		} )
		cy.adjust( 'Paddings', 27 ).assertComputedStyle( {
			'.ugb-icon__content-wrapper': {
				[ `padding-bottom` ]: '27px',
				[ `padding-left` ]: '27px',
				[ `padding-right` ]: '27px',
				[ `padding-top` ]: '27px',
			},
		} )
		cy.adjust( 'Icon', 14 ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `margin-bottom` ]: '14px',
			},
		} )
		cy.adjust( 'Title', 29 ).assertComputedStyle( {
			'.ugb-icon__title': {
				[ `margin-bottom` ]: '29px',
			},
		} )

		// Test Block Background options
		cy.collapse( 'Block Background' )
		cy.toggleStyle( 'Block Background' )
		cy.adjust( 'No Paddings', true )
		cy.adjust( 'Background Color', '#ffffff' )
		cy.adjust( 'Background Color Opacity', 0.7 ).assertComputedStyle( {
			'.ugb-icon': {
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
			[ `Background Gradient Blend Mode` ]: 'multiply',
		} ).assertComputedStyle( {
			'.ugb-icon:before': {
				[ `background-image` ]: 'linear-gradient(#6d6d6d 11%, #cd2653 80%)',
				[ `mix-blend-mode` ]: 'multiply',
			},
		} )
		// TODO: Add Background Image test

		// Test Top Separator
		cy.collapse( 'Top Separator' )
		cy.toggleStyle( 'Top Separator' )
		cy.adjust( 'Design', 'wave-2' )
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
			[ `Mix Blend Mode` ]: 'overlay',
		} ).assertComputedStyle( {
			'.ugb-top-separator .ugb-separator__layer-2': {
				[ `fill` ]: '#ffffff',
				[ `transform` ]: 'matrix(-1.9, 0, 0, 1.16, 0, 0)',
				[ `opacity` ]: '0.3',
				[ `mix-blend-mode` ]: 'overlay',
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

		// Test Bottom Separator
		cy.collapse( 'Bottom Separator' )
		cy.toggleStyle( 'Bottom Separator' )
		cy.adjust( 'Design', 'curve-3' )
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
			[ `Mix Blend Mode` ]: 'saturation',
		} ).assertComputedStyle( {
			'.ugb-bottom-separator .ugb-separator__layer-2': {
				[ `fill` ]: '#ffffff',
				[ `transform` ]: 'matrix(-1.9, 0, 0, 1.16, 0, 0)',
				[ `opacity` ]: '0.3',
				[ `mix-blend-mode` ]: 'saturation',
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

	it( 'should adjust tablet options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/icon' )
		cy.openInspector( 'ugb/icon', 'Style' )

		// Test General options
		cy.collapse( 'General' )
		cy.adjust( 'Number of Icons / Columns', 6 )
		cy.get( '.ugb-icon__item6' ).should( 'exist' )

		assertAligns( 'Align', '.ugb-inner-block', { viewport: 'Tablet' } )

		// Test Title options
		cy.collapse( 'Title' )
		cy.toggleStyle( 'Title' )
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
			'.ugb-icon__title': {
				[ `font-size` ]: '28px',
				[ `line-height` ]: '22px',
			},
		} )

		// Test Title Alignment
		assertAligns( 'Align', '.ugb-icon__title', { viewport: 'Tablet' } )

		// Test Icon options
		cy.collapse( 'Icon' )
		cy.adjust( 'Icon Size', 45, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-icon-inner-svg': {
				[ `height` ]: '45px',
				[ `width` ]: '45px',
			},
		} )
		cy.adjust( 'Align', 'left', { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `align-self` ]: 'flex-start',
			},
		} )
		cy.adjust( 'Align', 'center', { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `align-self` ]: 'center',
			},
		} )
		cy.adjust( 'Align', 'right', { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `align-self` ]: 'flex-end',
			},
		} )

		// Test Effects option
		cy.collapse( 'Effects' )
		cy.adjust( 'Hover Effect', 'scale-more' )
			.assertClassName( '.ugb-icon__item', 'ugb--hover-scale-more' )

		// Test Block Title
		cy.collapse( 'Block Title' )
		cy.toggleStyle( 'Block Title' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Sans-Serif',
			[ `Size` ]: 31,
			[ `Weight` ]: '700',
			[ `Transform` ]: 'uppercase',
			[ `Line-Height` ]: {
				viewport: 'Tablet',
				value: 42,
				unit: 'px',
			},
			[ `Letter Spacing` ]: 1.3,
		} )
		cy.adjust( 'Size', 46, { viewport: 'Tablet' } )
		cy.adjust( 'Title Color', '#636363' )
		cy.adjust( 'Max Width', 748, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-block-title': {
				[ `font-size` ]: '46px',
				[ `font-weight` ]: '700',
				[ `text-transform` ]: 'uppercase',
				[ `letter-spacing` ]: '1.3px',
				[ `color` ]: '#636363',
				[ `max-width` ]: '748px',
				[ `line-height` ]: '42px',
			},
		} )

		// Test Block Title Alignment
		assertAligns( 'Text Align', '.ugb-block-title', { viewport: 'Tablet' } )

		// Test Block Description
		cy.collapse( 'Block Description' )
		cy.toggleStyle( 'Block Description' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Sans-Serif',
			[ `Size` ]: 21,
			[ `Weight` ]: '700',
			[ `Transform` ]: 'uppercase',
			[ `Line-Height` ]: {
				viewport: 'Tablet',
				value: 38,
				unit: 'px',
			},
			[ `Letter Spacing` ]: 1.3,
		} )
		cy.adjust( 'Size', 36, { viewport: 'Tablet' } )
		cy.adjust( 'Description Color', '#636363' )
		cy.adjust( 'Max Width', 748, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-block-description': {
				[ `font-size` ]: '36px',
				[ `font-weight` ]: '700',
				[ `text-transform` ]: 'uppercase',
				[ `letter-spacing` ]: '1.3px',
				[ `color` ]: '#636363',
				[ `max-width` ]: '748px',
				[ `line-height` ]: '38px',
			},
		} )

		// Test Block Description Alignment
		assertAligns( 'Text Align', '.ugb-block-description', { viewport: 'Tablet' } )

		// Test Spacing options
		cy.collapse( 'Spacing' )
		cy.adjust( 'Block Title', 25, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-block-title': {
				[ `margin-bottom` ]: '25px',
			},
		} )
		cy.adjust( 'Block Description', 35, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-block-description': {
				[ `margin-bottom` ]: '35px',
			},
		} )
		cy.adjust( 'Paddings', 20, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-icon__content-wrapper': {
				[ `padding-bottom` ]: '20px',
				[ `padding-left` ]: '20px',
				[ `padding-right` ]: '20px',
				[ `padding-top` ]: '20px',
			},
		} )
		cy.adjust( 'Icon', 24, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `margin-bottom` ]: '24px',
			},
		} )
		cy.adjust( 'Title', 15, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-icon__title': {
				[ `margin-bottom` ]: '15px',
			},
		} )

		// TODO: Add Background Image test

		// Test Top Separator
		cy.collapse( 'Top Separator' )
		cy.toggleStyle( 'Top Separator' )
		cy.adjust( 'Height', 191, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-top-separator>.ugb-separator-wrapper': {
				[ `height` ]: '191px',
			},
		} )

		// Test Bottom Separator
		cy.collapse( 'Bottom Separator' )
		cy.toggleStyle( 'Bottom Separator' )
		cy.adjust( 'Height', 150, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-bottom-separator>.ugb-separator-wrapper': {
				[ `height` ]: '150px',
			},
		} )
	} )

	it( 'should adjust mobile options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/icon' )
		cy.openInspector( 'ugb/icon', 'Style' )

		// Test General options
		cy.collapse( 'General' )
		cy.adjust( 'Number of Icons / Columns', 4 )
		cy.get( '.ugb-icon__item4' ).should( 'exist' )

		assertAligns( 'Align', '.ugb-inner-block', { viewport: 'Mobile' } )

		// Test Title options
		cy.collapse( 'Title' )
		cy.toggleStyle( 'Title' )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Mobile',
				value: 30,
				unit: 'px',
			},
			[ `Line-Height` ]: {
				viewport: 'Mobile',
				value: 22,
				unit: 'px',
			},
		} )
		cy.adjust( 'Size', 28, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-icon__title': {
				[ `font-size` ]: '28px',
				[ `line-height` ]: '22px',
			},
		} )

		// Test Title Alignment
		assertAligns( 'Align', '.ugb-icon__title', { viewport: 'Mobile' } )

		// Test Icon options
		cy.collapse( 'Icon' )
		cy.adjust( 'Icon Size', 58, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-icon-inner-svg': {
				[ `height` ]: '58px',
				[ `width` ]: '58px',
			},
		} )
		cy.adjust( 'Align', 'left', { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `align-self` ]: 'flex-start',
			},
		} )
		cy.adjust( 'Align', 'center', { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `align-self` ]: 'center',
			},
		} )
		cy.adjust( 'Align', 'right', { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `align-self` ]: 'flex-end',
			},
		} )

		// Test Effects option
		cy.collapse( 'Effects' )
		cy.adjust( 'Hover Effect', 'lift' )
			.assertClassName( '.ugb-icon__item', 'ugb--hover-lift' )

		// Test Block Title
		cy.collapse( 'Block Title' )
		cy.toggleStyle( 'Block Title' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Sans-Serif',
			[ `Size` ]: 31,
			[ `Weight` ]: '700',
			[ `Transform` ]: 'uppercase',
			[ `Line-Height` ]: {
				viewport: 'Mobile',
				value: 42,
				unit: 'px',
			},
			[ `Letter Spacing` ]: 1.3,
		} )
		cy.adjust( 'Size', 46, { viewport: 'Mobile' } )
		cy.adjust( 'Title Color', '#636363' )
		cy.adjust( 'Max Width', 748, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-block-title': {
				[ `font-size` ]: '46px',
				[ `font-weight` ]: '700',
				[ `text-transform` ]: 'uppercase',
				[ `letter-spacing` ]: '1.3px',
				[ `color` ]: '#636363',
				[ `max-width` ]: '748px',
				[ `line-height` ]: '42px',
			},
		} )

		// Test Block Title Alignment
		assertAligns( 'Text Align', '.ugb-block-title', { viewport: 'Mobile' } )

		// Test Block Description
		cy.collapse( 'Block Description' )
		cy.toggleStyle( 'Block Description' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Sans-Serif',
			[ `Size` ]: 21,
			[ `Weight` ]: '700',
			[ `Transform` ]: 'uppercase',
			[ `Line-Height` ]: {
				viewport: 'Mobile',
				value: 38,
				unit: 'px',
			},
			[ `Letter Spacing` ]: 1.3,
		} )
		cy.adjust( 'Size', 36, { viewport: 'Mobile' } )
		cy.adjust( 'Description Color', '#636363' )
		cy.adjust( 'Max Width', 748, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-block-description': {
				[ `font-size` ]: '36px',
				[ `font-weight` ]: '700',
				[ `text-transform` ]: 'uppercase',
				[ `letter-spacing` ]: '1.3px',
				[ `color` ]: '#636363',
				[ `max-width` ]: '748px',
				[ `line-height` ]: '38px',
			},
		} )

		// Test Block Description Alignment
		assertAligns( 'Text Align', '.ugb-block-description', { viewport: 'Mobile' } )

		// Test Spacing options
		cy.collapse( 'Spacing' )
		cy.adjust( 'Block Title', 25, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-block-title': {
				[ `margin-bottom` ]: '25px',
			},
		} )
		cy.adjust( 'Block Description', 35, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-block-description': {
				[ `margin-bottom` ]: '35px',
			},
		} )
		cy.adjust( 'Paddings', 20, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-icon__content-wrapper': {
				[ `padding-bottom` ]: '20px',
				[ `padding-left` ]: '20px',
				[ `padding-right` ]: '20px',
				[ `padding-top` ]: '20px',
			},
		} )
		cy.adjust( 'Icon', 24, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `margin-bottom` ]: '24px',
			},
		} )
		cy.adjust( 'Title', 15, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-icon__title': {
				[ `margin-bottom` ]: '15px',
			},
		} )

		// TODO: Add Background Image test

		// Test Top Separator
		cy.collapse( 'Top Separator' )
		cy.toggleStyle( 'Top Separator' )
		cy.adjust( 'Height', 191, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-top-separator>.ugb-separator-wrapper': {
				[ `height` ]: '191px',
			},
		} )

		// Test Bottom Separator
		cy.collapse( 'Bottom Separator' )
		cy.toggleStyle( 'Bottom Separator' )
		cy.adjust( 'Height', 150, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-bottom-separator>.ugb-separator-wrapper': {
				[ `height` ]: '150px',
			},
		} )
	} )
} )
