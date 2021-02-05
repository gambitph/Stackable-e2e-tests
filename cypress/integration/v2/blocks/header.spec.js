/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, assertAligns, assertBlockBackground, assertSeparators,
} from '~stackable-e2e/helpers'

describe( 'Header', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/header', '.ugb-header' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/header' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/header', [
		{ value: 'Basic', selector: '.ugb-header--design-basic' },
		{ value: 'Plain', selector: '.ugb-header--design-plain' },
		{ value: 'Half Overlay', selector: '.ugb-header--design-half-overlay' },
		{ value: 'Center Overlay', selector: '.ugb-header--design-center-overlay' },
		{ value: 'Side Overlay', selector: '.ugb-header--design-side-overlay' },
		{ value: 'Half', selector: '.ugb-header--design-half' },
		{ value: 'Huge', selector: '.ugb-header--design-huge' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/header', [
		'Angled Header',
		'Arch Header 1',
		'Arch Header 2',
		'Aspire Header',
		'Aurora Header',
		'Bean Header',
		'Capital Header',
		'Cary Header',
		'Chic Header',
		'Dare Header',
		'Decora Header',
		'Detour Header',
		'Devour Header',
		'Dim Header',
		'Dustin Header',
		'Elevate Header',
		'Flex Header 1',
		'Flex Header 2',
		'Glow Header',
		'Heights Header',
		'Hue Header',
		'Lounge Header',
		'Lume Header',
		'Lush Header',
		'Peplum Header',
		'Prime Header',
		'Proact Header',
		'Propel Header 1',
		'Propel Header 2',
		'Seren Header',
		'Speck Header',
		'Upland Header',
		'Yule Header',
	] ) )
}

function desktopStyle() {
	it( 'should adjust desktop options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/header' )

		cy.openInspector( 'ugb/header', 'Style' )

		cy.collapse( 'General' )
		cy.adjust( 'Full Height', true )
			.assertClassName( '.ugb-header__item', 'ugb--full-height' )
		assertAligns( 'Align', '.ugb-inner-block' )

		cy.collapse( 'Container' )
		cy.setBlockAttribute( {
			[ `columnBackgroundMediaUrl` ]: 'http://sandbox.gambit.ph/for-test/wp-content/uploads/sites/85/2020/12/avi-richards-ojBNujxI2_c-unsplash.jpg',
		} )
		cy.adjust( 'Background', {
			[ `Color Type` ]: 'gradient',
			[ `Background Color #1` ]: '#ff5c5c',
			[ `Background Color #2` ]: '#7bff5a',
			[ `Adv. Gradient Color Settings` ]: {
				[ `Gradient Direction (degrees)` ]: 160,
				[ `Color 1 Location` ]: 28,
				[ `Color 2 Location` ]: 75,
				[ `Background Gradient Blend Mode` ]: 'hue',
			},
			[ `Background Media Tint Strength` ]: 6,
			[ `Fixed Background` ]: true,
			[ `Adv. Background Image Settings` ]: {
				[ `Image Position` ]: 'center center',
				[ `Image Repeat` ]: 'repeat-x',
				[ `Image Size` ]: 'custom',
				[ `Custom Size` ]: {
					value: 19,
					unit: '%',
				},
				[ `Image Blend Mode` ]: 'exclusion',
			},
		} ).assertComputedStyle( {
			'.ugb-header__item:before': {
				[ `background-image` ]: 'linear-gradient(160deg, #ff5c5c 28%, #7bff5a 75%)',
				[ `opacity` ]: '0.6',
				[ `mix-blend-mode` ]: 'hue',
			},
			'.ugb-header__item': {
				[ `background-color` ]: '#ff5c5c',
				[ `background-attachment` ]: 'fixed',
				[ `background-position` ]: '50% 50%',
				[ `background-repeat` ]: 'repeat-x',
				[ `background-size` ]: '19%',
				[ `background-blend-mode` ]: 'exclusion',
			},
		} )

		cy.adjust( 'Borders', 'solid' )
		cy.adjust( 'Border Width', 4 )
		cy.adjust( 'Border Color', '#a12222' )
		cy.adjust( 'Border Radius', 26 ).assertComputedStyle( {
			'.ugb-header__item': {
				[ `border-style` ]: 'solid',
				[ `border-top-width` ]: '4px',
				[ `border-bottom-width` ]: '4px',
				[ `border-left-width` ]: '4px',
				[ `border-right-width` ]: '4px',
				[ `border-color` ]: '#a12222',
				[ `border-radius` ]: '26px',
			},
		} )
		cy.adjust( 'Shadow / Outline', 7 )
			.assertClassName( '.ugb-header__item', 'ugb--shadow-7' )

		cy.collapse( 'Spacing' )
		cy.adjust( 'Paddings', [ 166, 268, 87, 181 ], { unit: 'px' } ).assertComputedStyle( {
			'.ugb-header__item': {
				[ `padding-top` ]: '166px',
				[ `padding-bottom` ]: '87px',
				[ `padding-right` ]: '268px',
				[ `padding-left` ]: '181px',
			},
		} )

		cy.adjust( 'Paddings', [ 12, 4, 18, 3 ], { unit: 'em' } ).assertComputedStyle( {
			'.ugb-header__item': {
				[ `padding-top` ]: '12em',
				[ `padding-bottom` ]: '18em',
				[ `padding-right` ]: '4em',
				[ `padding-left` ]: '3em',
			},
		} )

		cy.adjust( 'Paddings', [ 24, 12, 34, 21 ], { unit: '%' } ).assertComputedStyle( {
			'.ugb-header__item': {
				[ `padding-top` ]: '24%',
				[ `padding-bottom` ]: '34%',
				[ `padding-right` ]: '12%',
				[ `padding-left` ]: '21%',
			},
		} )

		cy.adjust( 'Title', 42 )
		cy.adjust( 'Subtitle', 21 )
		cy.adjust( 'Button', 43 ).assertComputedStyle( {
			'.ugb-header__title': {
				[ `margin-bottom` ]: '42px',
			},
			'.ugb-header__subtitle': {
				[ `margin-bottom` ]: '21px',
			},
			'.ugb-button-container': {
				[ `margin-bottom` ]: '43px',
			},
		} )

		cy.collapse( 'Title' )
		cy.toggleStyle( 'Title' )
		cy.adjust( 'Title HTML Tag', 'h4' )
			.assertHtmlTag( '.ugb-header__title', 'h4' )
		cy.adjust( 'Typography', {
			[ `Size` ]: 50,
			[ `Weight` ]: '700',
			[ `Transform` ]: 'lowercase',
			[ `Line-Height` ]: 4,
			[ `Letter Spacing` ]: 2.9,
		} ).assertComputedStyle( {
			'.ugb-header__title': {
				[ `font-size` ]: '50px',
				[ `font-weight` ]: '700',
				[ `text-transform` ]: 'lowercase',
				[ `letter-spacing` ]: '2.9px',
				[ `line-height` ]: '4em',
			},
		} )

		cy.adjust( 'Typography', {
			[ `Size` ]: {
				unit: 'em',
				value: 7,
			},
			[ `Line-Height` ]: {
				unit: 'px',
				value: 24,
			},
		} )
		cy.adjust( 'Title Color', '#742f2f' ).assertComputedStyle( {
			'.ugb-header__title': {
				[ `font-size` ]: '7em',
				[ `line-height` ]: '24px',
			},
		}, { wait: 300 } )
		assertAligns( 'Align', '.ugb-header__title' )

		cy.collapse( 'Subtitle' )
		cy.toggleStyle( 'Subtitle' )
		cy.adjust( 'Typography', {
			[ `Size` ]: 50,
			[ `Weight` ]: '700',
			[ `Transform` ]: 'lowercase',
			[ `Line-Height` ]: 4,
			[ `Letter Spacing` ]: 2.9,
		} ).assertComputedStyle( {
			'.ugb-header__subtitle': {
				[ `font-size` ]: '50px',
				[ `font-weight` ]: '700',
				[ `text-transform` ]: 'lowercase',
				[ `letter-spacing` ]: '2.9px',
				[ `line-height` ]: '4em',
			},
		} )

		cy.adjust( 'Typography', {
			[ `Size` ]: {
				unit: 'em',
				value: 7,
			},
			[ `Line-Height` ]: {
				unit: 'px',
				value: 24,
			},
		} )
		cy.adjust( 'Subtitle Color', '#742f2f' ).assertComputedStyle( {
			'.ugb-header__subtitle': {
				[ `font-size` ]: '7em',
				[ `line-height` ]: '24px',
			},
		}, { wait: 300 } )
		assertAligns( 'Align', '.ugb-header__subtitle' )

		cy.collapse( 'Button #1' )
		cy.toggleStyle( 'Button #1' )
		cy.adjust( 'Button Color Type', 'gradient' )
		cy.adjust( 'Button Color #1', '#a13939' )
		cy.adjust( 'Button Color #2', '#4e59d4' )
		cy.adjust( 'Gradient Direction (degrees)', 138 )
		cy.adjust( 'Text Color', '#ffa03b' )
		cy.adjust( 'Hover Effect', 'scale' )
			.assertClassName( '.ugb-button1', 'ugb--hover-effect-scale' )
		cy.adjust( 'Hover Opacity', 0.6 )
		cy.adjust( 'Hover Colors', {
			[ `Button Color #1` ]: '#bd8b8b',
			[ `Button Color #2` ]: '#3fa35b',
			[ `Gradient Direction (degrees)` ]: 72,
			[ `Text Color` ]: '#80194d',
		} )
		cy.adjust( 'Typography', {
			[ `Size` ]: 50,
			[ `Weight` ]: '700',
			[ `Transform` ]: 'lowercase',
			[ `Letter Spacing` ]: 2.9,
		} )
		cy.adjust( 'Button Size', 'large' )
			.assertClassName( '.ugb-button1', 'ugb-button--size-large' )
		cy.adjust( 'Border Radius', 40 )
		cy.adjust( 'Vertical Padding', 15 )
		cy.adjust( 'Horizontal Padding', 43 )
		cy.adjust( 'Shadow', 4 )
		cy.adjust( 'Opacity', 0.6 ).assertComputedStyle( {
			'.ugb-button1 .ugb-button--inner': {
				[ `font-size` ]: '50px',
				[ `font-weight` ]: '700',
				[ `text-transform` ]: 'lowercase',
				[ `letter-spacing` ]: '2.9px',
			},
			'.ugb-button1': {
				[ `background-color` ]: '#a13939',
				[ `background-image` ]: 'linear-gradient(138deg, #a13939, #4e59d4)',
				[ `padding-top` ]: '15px',
				[ `padding-right` ]: '43px',
				[ `padding-bottom` ]: '15px',
				[ `padding-left` ]: '43px',
				[ `opacity` ]: '0.6',
				[ `border-radius` ]: '40px',
			},
		} )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				unit: 'em',
				value: 7,
			},
		} ).assertComputedStyle( {
			'.ugb-button1 .ugb-button--inner': {
				[ `font-size` ]: '7em',
			},
		} )
		cy.waitFA()
		cy.adjust( 'Icon', 'info' )
		cy.adjust( 'Adv. Icon Settings', {
			[ `Icon Size` ]: 41,
			[ `Icon Spacing` ]: 25,
		} ).assertComputedStyle( {
			'.ugb-button1 svg': {
				[ `height` ]: '41px',
				[ `width` ]: '41px',
				[ `margin-right` ]: '25px',
			},
		} )

		cy.collapse( 'Button #2' )
		cy.toggleStyle( 'Button #2' )
		cy.adjust( 'Button Color Type', 'gradient' )
		cy.adjust( 'Button Color #1', '#a13939' )
		cy.adjust( 'Button Color #2', '#4e59d4' )
		cy.adjust( 'Gradient Direction (degrees)', 138 )
		cy.adjust( 'Text Color', '#ffa03b' )
		cy.adjust( 'Hover Effect', 'scale' )
			.assertClassName( '.ugb-button1', 'ugb--hover-effect-scale' )
		cy.adjust( 'Hover Opacity', 0.6 )
		cy.adjust( 'Hover Colors', {
			[ `Button Color #1` ]: '#bd8b8b',
			[ `Button Color #2` ]: '#3fa35b',
			[ `Gradient Direction (degrees)` ]: 72,
			[ `Text Color` ]: '#80194d',
		} )
		cy.adjust( 'Typography', {
			[ `Size` ]: 50,
			[ `Weight` ]: '700',
			[ `Transform` ]: 'lowercase',
			[ `Letter Spacing` ]: 2.9,
		} )
		cy.adjust( 'Button Size', 'large' )
			.assertClassName( '.ugb-button1', 'ugb-button--size-large' )
		cy.adjust( 'Border Radius', 40 )
		cy.adjust( 'Vertical Padding', 15 )
		cy.adjust( 'Horizontal Padding', 43 )
		cy.adjust( 'Shadow', 4 )
		cy.adjust( 'Opacity', 0.6 ).assertComputedStyle( {
			'.ugb-button2 .ugb-button--inner': {
				[ `font-size` ]: '50px',
				[ `font-weight` ]: '700',
				[ `text-transform` ]: 'lowercase',
				[ `letter-spacing` ]: '2.9px',
			},
			'.ugb-button2': {
				[ `background-color` ]: '#a13939',
				[ `background-image` ]: 'linear-gradient(138deg, #a13939, #4e59d4)',
				[ `padding-top` ]: '15px',
				[ `padding-right` ]: '43px',
				[ `padding-bottom` ]: '15px',
				[ `padding-left` ]: '43px',
				[ `opacity` ]: '0.6',
				[ `border-radius` ]: '40px',
			},
		} )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				unit: 'em',
				value: 7,
			},
		} ).assertComputedStyle( {
			'.ugb-button2 .ugb-button--inner': {
				[ `font-size` ]: '7em',
			},
		} )
		cy.waitFA()
		cy.adjust( 'Icon', 'info' )
		cy.adjust( 'Adv. Icon Settings', {
			[ `Icon Size` ]: 41,
			[ `Icon Spacing` ]: 25,
		} ).assertComputedStyle( {
			'.ugb-button2 svg': {
				[ `height` ]: '41px',
				[ `width` ]: '41px',
				[ `margin-right` ]: '25px',
			},
		} )
		cy.adjust( 'Align', 'left', { viewport: 'Desktop' } ).assertComputedStyle( {
			'.ugb-header__buttons': {
				[ `justify-content` ]: 'flex-start',
			},
		} )
		cy.adjust( 'Align', 'center', { viewport: 'Desktop' } ).assertComputedStyle( {
			'.ugb-header__buttons': {
				[ `justify-content` ]: 'center',
			},
		} )
		cy.adjust( 'Align', 'right', { viewport: 'Desktop' } ).assertComputedStyle( {
			'.ugb-header__buttons': {
				[ `justify-content` ]: 'flex-end',
			},
		} )

		assertBlockBackground( '.ugb-header', { viewport: 'Desktop' } )
		assertSeparators( { viewport: 'Desktop' } )
	} )
}

function tabletStyle() {
	it( 'should adjust tablet options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/header' )

		cy.openInspector( 'ugb/header', 'Style' )

		cy.collapse( 'General' )
		assertAligns( 'Align', '.ugb-inner-block', { viewport: 'Tablet' } )

		cy.collapse( 'Container' )
		cy.setBlockAttribute( {
			[ `columnTabletBackgroundMediaUrl` ]: 'http://sandbox.gambit.ph/for-test/wp-content/uploads/sites/85/2020/12/avi-richards-ojBNujxI2_c-unsplash.jpg',
		} )
		cy.adjust( 'Background', {
			[ `Adv. Background Image Settings` ]: {
				[ `Image Position` ]: {
					viewport: 'Tablet',
					value: 'center center',
				},
				[ `Image Repeat` ]: {
					viewport: 'Tablet',
					value: 'repeat-x',
				},
				[ `Image Size` ]: {
					viewport: 'Tablet',
					value: 'custom',
				},
				[ `Custom Size` ]: {
					viewport: 'Tablet',
					value: 19,
					unit: '%',
				},
			},
		} ).assertComputedStyle( {
			'.ugb-header__item': {
				[ `background-position` ]: '50% 50%',
				[ `background-repeat` ]: 'repeat-x',
				[ `background-size` ]: '19%',
			},
		} )

		cy.collapse( 'Spacing' )

		cy.adjust( 'Paddings', [ 10, 12, 13, 8 ], { unit: 'px', viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-header__item': {
				[ `padding-top` ]: '10px',
				[ `padding-bottom` ]: '12px',
				[ `padding-right` ]: '13px',
				[ `padding-left` ]: '8px',
			},
		} )

		cy.adjust( 'Paddings', [ 12, 4, 10, 3 ], { unit: 'em', viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-header__item': {
				[ `padding-top` ]: '12em',
				[ `padding-bottom` ]: '4em',
				[ `padding-right` ]: '10em',
				[ `padding-left` ]: '3em',
			},
		} )

		cy.adjust( 'Paddings', [ 24, 12, 12, 21 ], { unit: '%', viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-header__item': {
				[ `padding-top` ]: '24%',
				[ `padding-bottom` ]: '12%',
				[ `padding-right` ]: '12%',
				[ `padding-left` ]: '21%',
			},
		} )

		cy.adjust( 'Title', 42, { viewport: 'Tablet' } )
		cy.adjust( 'Subtitle', 21, { viewport: 'Tablet' } )
		cy.adjust( 'Button', 43, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-header__title': {
				[ `margin-bottom` ]: '42px',
			},
			'.ugb-header__subtitle': {
				[ `margin-bottom` ]: '21px',
			},
			'.ugb-button-container': {
				[ `margin-bottom` ]: '43px',
			},
		} )

		cy.collapse( 'Title' )
		cy.toggleStyle( 'Title' )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Tablet',
				value: 50,
			},
			[ `Line-Height` ]: {
				viewport: 'Tablet',
				value: 4,
			},
		} ).assertComputedStyle( {
			'.ugb-header__title': {
				[ `font-size` ]: '50px',
				[ `line-height` ]: '4em',
			},
		} )

		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Tablet',
				unit: 'em',
				value: 7,
			},
			[ `Line-Height` ]: {
				viewport: 'Tablet',
				unit: 'px',
				value: 24,
			},
		} ).assertComputedStyle( {
			'.ugb-header__title': {
				[ `font-size` ]: '7em',
				[ `line-height` ]: '24px',
			},
		}, { wait: 300 } )
		assertAligns( 'Align', '.ugb-header__title', { viewport: 'Tablet' } )

		cy.collapse( 'Subtitle' )
		cy.toggleStyle( 'Subtitle' )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Tablet',
				value: 50,
			},
			[ `Line-Height` ]: {
				viewport: 'Tablet',
				value: 4,
			},
		} ).assertComputedStyle( {
			'.ugb-header__subtitle': {
				[ `font-size` ]: '50px',
				[ `line-height` ]: '4em',
			},
		} )

		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Tablet',
				unit: 'em',
				value: 7,
			},
			[ `Line-Height` ]: {
				viewport: 'Tablet',
				unit: 'px',
				value: 24,
			},
		} ).assertComputedStyle( {
			'.ugb-header__subtitle': {
				[ `font-size` ]: '7em',
				[ `line-height` ]: '24px',
			},
		}, { wait: 300 } )
		assertAligns( 'Align', '.ugb-header__subtitle', { viewport: 'Tablet' } )

		cy.collapse( 'Button #1' )
		cy.toggleStyle( 'Button #1' )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Tablet',
				value: 50,
			},
		} ).assertComputedStyle( {
			'.ugb-button1 .ugb-button--inner': {
				[ `font-size` ]: '50px',
			},
		}, { wait: 300 } )

		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Tablet',
				unit: 'em',
				value: 7,
			},
		} ).assertComputedStyle( {
			'.ugb-button1 .ugb-button--inner': {
				[ `font-size` ]: '7em',
			},
		}, { wait: 300 } )

		cy.collapse( 'Button #2' )
		cy.toggleStyle( 'Button #2' )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Tablet',
				value: 50,
			},
		} ).assertComputedStyle( {
			'.ugb-button2 .ugb-button--inner': {
				[ `font-size` ]: '50px',
			},
		}, { wait: 300 } )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Tablet',
				unit: 'em',
				value: 7,
			},
		} ).assertComputedStyle( {
			'.ugb-button2 .ugb-button--inner': {
				[ `font-size` ]: '7em',
			},
		}, { wait: 300 } )
		cy.adjust( 'Align', 'left', { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-header__buttons': {
				[ `justify-content` ]: 'flex-start',
			},
		} )
		cy.adjust( 'Align', 'center', { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-header__buttons': {
				[ `justify-content` ]: 'center',
			},
		} )
		cy.adjust( 'Align', 'right', { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-header__buttons': {
				[ `justify-content` ]: 'flex-end',
			},
		} )

		assertBlockBackground( '.ugb-header', { viewport: 'Tablet' } )
		assertSeparators( { viewport: 'Tablet' } )
	} )
}

function mobileStyle() {
	it( 'should adjust mobile options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/header' )

		cy.openInspector( 'ugb/header', 'Style' )

		cy.collapse( 'General' )
		assertAligns( 'Align', '.ugb-inner-block', { viewport: 'Mobile' } )

		cy.collapse( 'Container' )
		cy.setBlockAttribute( {
			[ `columnMobileBackgroundMediaUrl` ]: 'http://sandbox.gambit.ph/for-test/wp-content/uploads/sites/85/2020/12/avi-richards-ojBNujxI2_c-unsplash.jpg',
		} )
		cy.adjust( 'Background', {
			[ `Adv. Background Image Settings` ]: {
				[ `Image Position` ]: {
					viewport: 'Mobile',
					value: 'center center',
				},
				[ `Image Repeat` ]: {
					viewport: 'Mobile',
					value: 'repeat-x',
				},
				[ `Image Size` ]: {
					viewport: 'Mobile',
					value: 'custom',
				},
				[ `Custom Size` ]: {
					viewport: 'Mobile',
					value: 19,
					unit: '%',
				},
			},
		} ).assertComputedStyle( {
			'.ugb-header__item': {
				[ `background-position` ]: '50% 50%',
				[ `background-repeat` ]: 'repeat-x',
				[ `background-size` ]: '19%',
			},
		} )

		cy.collapse( 'Spacing' )

		cy.adjust( 'Paddings', [ 24, 12, 13, 8 ], { unit: 'px', viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-header__item': {
				[ `padding-top` ]: '24px',
				[ `padding-bottom` ]: '12px',
				[ `padding-right` ]: '13px',
				[ `padding-left` ]: '8px',
			},
		} )

		cy.adjust( 'Paddings', [ 12, 4, 10, 3 ], { unit: 'em', viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-header__item': {
				[ `padding-top` ]: '12em',
				[ `padding-bottom` ]: '4em',
				[ `padding-right` ]: '10em',
				[ `padding-left` ]: '3em',
			},
		} )

		cy.adjust( 'Paddings', [ 24, 12, 12, 21 ], { unit: '%', viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-header__item': {
				[ `padding-top` ]: '24%',
				[ `padding-bottom` ]: '12%',
				[ `padding-right` ]: '12%',
				[ `padding-left` ]: '21%',
			},
		} )

		cy.adjust( 'Title', 42, { viewport: 'Mobile' } )
		cy.adjust( 'Subtitle', 21, { viewport: 'Mobile' } )
		cy.adjust( 'Button', 43, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-header__title': {
				[ `margin-bottom` ]: '42px',
			},
			'.ugb-header__subtitle': {
				[ `margin-bottom` ]: '21px',
			},
			'.ugb-button-container': {
				[ `margin-bottom` ]: '43px',
			},
		} )

		cy.collapse( 'Title' )
		cy.toggleStyle( 'Title' )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Mobile',
				value: 50,
			},
			[ `Line-Height` ]: {
				viewport: 'Mobile',
				value: 4,
			},
		} ).assertComputedStyle( {
			'.ugb-header__title': {
				[ `font-size` ]: '50px',
				[ `line-height` ]: '4em',
			},
		} )

		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Mobile',
				unit: 'em',
				value: 7,
			},
			[ `Line-Height` ]: {
				viewport: 'Mobile',
				unit: 'px',
				value: 24,
			},
		} ).assertComputedStyle( {
			'.ugb-header__title': {
				[ `font-size` ]: '7em',
				[ `line-height` ]: '24px',
			},
		}, { wait: 300 } )
		assertAligns( 'Align', '.ugb-header__title', { viewport: 'Mobile' } )

		cy.collapse( 'Subtitle' )
		cy.toggleStyle( 'Subtitle' )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Mobile',
				value: 50,
			},
			[ `Line-Height` ]: {
				viewport: 'Mobile',
				value: 4,
			},
		} ).assertComputedStyle( {
			'.ugb-header__subtitle': {
				[ `font-size` ]: '50px',
				[ `line-height` ]: '4em',
			},
		} )

		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Mobile',
				unit: 'em',
				value: 7,
			},
			[ `Line-Height` ]: {
				viewport: 'Mobile',
				unit: 'px',
				value: 24,
			},
		} ).assertComputedStyle( {
			'.ugb-header__subtitle': {
				[ `font-size` ]: '7em',
				[ `line-height` ]: '24px',
			},
		}, { wait: 300 } )
		assertAligns( 'Align', '.ugb-header__subtitle', { viewport: 'Mobile' } )

		cy.collapse( 'Button #1' )
		cy.toggleStyle( 'Button #1' )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Mobile',
				value: 50,
			},
		} ).assertComputedStyle( {
			'.ugb-button1 .ugb-button--inner': {
				[ `font-size` ]: '50px',
			},
		}, { wait: 300 } )

		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Mobile',
				unit: 'em',
				value: 7,
			},
		} ).assertComputedStyle( {
			'.ugb-button1 .ugb-button--inner': {
				[ `font-size` ]: '7em',
			},
		}, { wait: 300 } )

		cy.collapse( 'Button #2' )
		cy.toggleStyle( 'Button #2' )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Mobile',
				value: 50,
			},
		} ).assertComputedStyle( {
			'.ugb-button2 .ugb-button--inner': {
				[ `font-size` ]: '50px',
			},
		}, { wait: 300 } )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Mobile',
				unit: 'em',
				value: 7,
			},
		} ).assertComputedStyle( {
			'.ugb-button2 .ugb-button--inner': {
				[ `font-size` ]: '7em',
			},
		} )
		cy.adjust( 'Align', 'left', { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-header__buttons': {
				[ `justify-content` ]: 'flex-start',
			},
		} )
		cy.adjust( 'Align', 'center', { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-header__buttons': {
				[ `justify-content` ]: 'center',
			},
		} )
		cy.adjust( 'Align', 'right', { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-header__buttons': {
				[ `justify-content` ]: 'flex-end',
			},
		} )

		assertBlockBackground( '.ugb-header', { viewport: 'Mobile' } )
		assertSeparators( { viewport: 'Mobile' } )
	} )
}

