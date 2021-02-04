/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, assertAligns, assertBlockBackground, assertSeparators,
} from '~stackable-e2e/helpers'

describe( 'Call To Action Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	desktopStyle,
	responsiveAssert( 'Tablet' ),
	responsiveAssert( 'Mobile' ),
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/cta', '.ugb-cta' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/cta' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/cta', [
		'Basic',
		'Plain',
		'Horizontal',
		'Horizontal 2',
		'Horizontal 3',
		'Split Centered',
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/cta', [
		'Angled Call to Action 1',
		'Angled Call to Action 2',
		'Arch Call to Action',
		'Arch Call to Action 2',
		'Aspire Call to Action',
		'Aurora Call to Action 1',
		'Aurora Call to Action 2',
		'Bean Call to Action',
		'Capital Call to Action 1',
		'Capital Call to Action 2',
		'Cary Call to Action',
		'Chic Call to Action',
		'Dare Call to Action',
		'Decora Call to Action',
		'Devour Call to Action 1',
		'Devour Call to Action 2',
		'Dim Call to Action 1',
		'Dim Call to Action 2',
		'Dim Call to Action 3',
		'Dustin Call to Action 1',
		'Dustin Call to Action 2',
		'Elevate Call to Action',
		'Flex Call to Action',
		'Glow Call to Action',
		'Heights Call to Action 1',
		'Heights Call to Action 2',
		'Hue Call to Action 1',
		'Hue Call to Action 2',
		'Lounge Call to Action',
		'Lume Call to Action',
		'Lush Call to Action',
		'Peplum Call to Action',
		'Prime Call to Action',
		'Proact Call to Action 1',
		'Proact Call to Action 2',
		'Propel Call to Action',
		'Seren Call to Action',
		'Speck Call to Action',
		'Upland Call to Action',
		'Yule Call to Action',
	] ) )
}

function desktopStyle() {
	it( 'should adjust desktop options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/cta' )
		cy.openInspector( 'ugb/cta', 'Style' )

		// Test General options
		cy.collapse( 'General' )
		assertAligns( 'Align', '.ugb-inner-block' )

		// Test Container options
		cy.collapse( 'Container' )
		cy.adjust( 'Background', {
			[ `Color Type` ]: 'single',
			[ `Background Color` ]: '#000000',
			[ `Background Color Opacity` ]: 0.7,
		} ).assertComputedStyle( {
			'.ugb-cta__item': {
				[ `background-color` ]: 'rgba(0, 0, 0, 0.7)',
			},
		} )
		cy.setBlockAttribute( {
			[ `columnBackgroundMediaUrl` ]: 'http://sandbox.gambit.ph/for-test/wp-content/uploads/sites/85/2020/12/avi-richards-ojBNujxI2_c-unsplash.jpg',
		} )
		cy.adjust( 'Background', {
			[ `Background Media Tint Strength` ]: 7,
			[ `Fixed Background` ]: true,
		} ).assertComputedStyle( {
			'.ugb-cta__item': {
				[ `background-image` ]: 'url("http://sandbox.gambit.ph/for-test/wp-content/uploads/sites/85/2020/12/avi-richards-ojBNujxI2_c-unsplash.jpg")',
				[ `background-attachment` ]: 'fixed',

			},
			'.ugb-cta__item:before': {
				[ `opacity` ]: '0.7',
			},
		} )
		cy.adjust( 'Background', {
			[ `Adv. Background Image Settings` ]: {
				[ `Image Position` ]: 'top right',
				[ `Image Repeat` ]: 'no-repeat',
				[ `Image Size` ]: 'cover',
				[ `Image Blend Mode` ]: 'hue',
			},
		} ).assertComputedStyle( {
			'.ugb-cta__item': {
				[ `background-size` ]: 'cover',
				[ `background-blend-mode` ]: 'hue',
			},
		} )

		// Test Container Gradient
		cy.adjust( 'Background', {
			[ `Color Type` ]: 'gradient',
			[ `Background Color #1` ]: '#000000',
			[ `Background Color #2` ]: '#ff0000',
			[ `Adv. Gradient Color Settings` ]: {
				[ `Gradient Direction (degrees)` ]: '160deg',
				[ `Color 1 Location` ]: '30%',
				[ `Color 2 Location` ]: '83%',
				[ `Background Gradient Blend Mode` ]: 'difference',
			},
		} ).assertComputedStyle( {
			'.ugb-cta__item:before': {
				[ `background-image` ]: 'linear-gradient(160deg, #000000 30%, #ff0000 83%)',
				[ `mix-blend-mode` ]: 'difference',
			},
		} )

		cy.adjust( 'Borders', 'solid' )
		cy.adjust( 'Border Width', 4 )
		cy.adjust( 'Border Color', '#ff0000' )
		cy.adjust( 'Border Radius', 26 ).assertComputedStyle( {
			'.ugb-cta__item': {
				[ `border-top-left-radius` ]: '26px',
				[ `border-top-right-radius` ]: '26px',
				[ `border-bottom-left-radius` ]: '26px',
				[ `border-bottom-right-radius` ]: '26px',
				[ `border-top-width` ]: '4px',
				[ `border-right-width` ]: '4px',
				[ `border-bottom-width` ]: '4px',
				[ `border-left-width` ]: '4px',
				[ `border-top-style` ]: 'solid',
				[ `border-right-style` ]: 'solid',
				[ `border-bottom-style` ]: 'solid',
				[ `border-left-style` ]: 'solid',
				[ `border-top-color` ]: '#ff0000',
				[ `border-right-color` ]: '#ff0000',
				[ `border-bottom-color` ]: '#ff0000',
				[ `border-left-color` ]: '#ff0000',
			},
		} )
		cy.adjust( 'Shadow / Outline', 2 )
			.assertClassName( '.ugb-cta__item', 'ugb--shadow-2' )

		// Test Spacing options
		cy.collapse( 'Spacing' )
		cy.adjust( 'Paddings', 48 ).assertComputedStyle( {
			'.ugb-cta__item': {
				[ `padding-top` ]: '48px',
				[ `padding-bottom` ]: '48px',
				[ `padding-right` ]: '48px',
				[ `padding-left` ]: '48px',
			},
		} )
		cy.resetStyle( 'Paddings' )
		cy.adjust( 'Paddings', 7, { unit: 'em' } ).assertComputedStyle( {
			'.ugb-cta__item': {
				[ `padding-top` ]: '7em',
				[ `padding-bottom` ]: '7em',
				[ `padding-right` ]: '7em',
				[ `padding-left` ]: '7em',
			},
		} )
		cy.resetStyle( 'Paddings' )
		cy.adjust( 'Paddings', 19, { unit: '%' } ).assertComputedStyle( {
			'.ugb-cta__item': {
				[ `padding-top` ]: '19%',
				[ `padding-bottom` ]: '19%',
				[ `padding-right` ]: '19%',
				[ `padding-left` ]: '19%',
			},
		} )
		cy.adjust( 'Title', 31 ).assertComputedStyle( {
			'.ugb-cta__title': {
				[ `margin-bottom` ]: '31px',
			},
		} )
		cy.adjust( 'Description', 56 ).assertComputedStyle( {
			'.ugb-cta__description': {
				[ `margin-bottom` ]: '56px',
			},
		} )
		cy.adjust( 'Button', 24 ).assertComputedStyle( {
			'.ugb-button-container': {
				[ `margin-bottom` ]: '24px',
			},
		} )

		// Test Title options
		cy.collapse( 'Title' )
		cy.adjust( 'Title HTML Tag', 'h5' )
			.assertHtmlTag( '.ugb-cta__title', 'h5' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Serif',
			[ `Size` ]: 23,
			[ `Weight` ]: '600',
			[ `Transform` ]: 'uppercase',
			[ `Line-Height` ]: {
				value: 49,
				unit: 'px',
			},
			[ `Letter Spacing` ]: 1.9,
		} )
		cy.adjust( 'Size', 1.75, { unit: 'em' } )
		cy.adjust( 'Title Color', '#333333' ).assertComputedStyle( {
			'.ugb-cta__title': {
				[ `font-size` ]: '1.75em',
				[ `font-weight` ]: '600',
				[ `text-transform` ]: 'uppercase',
				[ `letter-spacing` ]: '1.9px',
				[ `color` ]: '#333333',
				[ `line-height` ]: '49px',
			},
		} )
		assertAligns( 'Align', '.ugb-cta__title' )

		// Test Description options
		cy.collapse( 'Description' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Sans-Serif',
			[ `Size` ]: 23,
			[ `Weight` ]: '200',
			[ `Transform` ]: 'capitalize',
			[ `Line-Height` ]: {
				value: 49,
				unit: 'px',
			},
			[ `Letter Spacing` ]: 1.9,
		} )
		cy.adjust( 'Size', 1.3, { unit: 'em' } )
		cy.adjust( 'Description Color', '#333333' ).assertComputedStyle( {
			'.ugb-cta__description': {
				[ `font-size` ]: '1.3em',
				[ `font-weight` ]: '200',
				[ `text-transform` ]: 'capitalize',
				[ `letter-spacing` ]: '1.9px',
				[ `color` ]: '#333333',
				[ `line-height` ]: '49px',
			},
		} )
		assertAligns( 'Align', '.ugb-cta__description' )

		// Test Button options
		cy.collapse( 'Button' )
		cy.adjust( 'Button Color Type', 'single' )
		cy.adjust( 'Button Color', '#ff0000' )
		cy.adjust( 'Text Color', '#ffffff' ).assertComputedStyle( {
			'.ugb-button': {
				[ `background-color` ]: '#ff0000',
			},
			'.ugb-button--inner': {
				[ `color` ]: '#ffffff',
			},
		} )
		cy.adjust( 'Hover Effect', 'lift' )
			.assertClassName( '.ugb-button', 'ugb--hover-effect-lift' )
		cy.adjust( 'Hover Opacity', 0.6 )
		cy.adjust( 'Hover Colors', {
			[ `Button Color` ]: '#ffffff',
			[ `Text Color` ]: '#000000',
		} )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Serif',
			[ `Size` ]: 19,
			[ `Weight` ]: '200',
			[ `Transform` ]: 'lowercase',
			[ `Letter Spacing` ]: 2,
		} ).assertComputedStyle( {
			'.ugb-button--inner': {
				[ `font-size` ]: '19px',
				[ `font-weight` ]: '200',
				[ `text-transform` ]: 'lowercase',
				[ `letter-spacing` ]: '2px',
			},
		} )
		cy.adjust( 'Button Size', 'medium' )
			.assertClassName( '.ugb-button', 'ugb-button--size-medium' )
		cy.adjust( 'Border Radius', 35 )
		cy.adjust( 'Vertical Padding', 4 )
		cy.adjust( 'Horizontal Padding', 27 )
		cy.adjust( 'Shadow', 2 )
			.assertClassName( '.ugb-button', 'ugb--shadow-2' )
		cy.adjust( 'Opacity', 0.6 ).assertComputedStyle( {
			'.ugb-button': {
				[ `border-radius` ]: '35px',
				[ `padding-top` ]: '4px',
				[ `padding-bottom` ]: '4px',
				[ `padding-left` ]: '27px',
				[ `padding-right` ]: '27px',
				[ `opacity` ]: '0.6',
			},
		} )
		cy.waitFA()
		cy.adjust( 'Icon', 'info' )
		cy.adjust( 'Adv. Icon Settings', {
			[ `Icon Size` ]: 18,
			[ `Icon Position` ]: 'right',
			[ `Icon Spacing` ]: 29,
		} ).assertComputedStyle( {
			'.ugb-button svg': {
				[ `width` ]: '18px',
				[ `height` ]: '18px',
				[ `margin-left` ]: '29px',
			},
		} )
		assertAligns( 'Align', '.ugb-button-container' )

		// Test Effects
		cy.collapse( 'Effects' )
		cy.adjust( 'Hover Effect', 'lift' )
			.assertClassName( '.ugb-cta__item', 'ugb--hover-lift' )

		// Test Block Background
		assertBlockBackground( '.ugb-cta', { viewport: 'Desktop' } )

		// Test Top and Bottom Separator
		assertSeparators( { viewport: 'Desktop' } )
	} )
}

function responsiveAssert( mode ) {
	return () => {
		it( `should adjust ${ mode } options inside style tab`, () => {
			cy.setupWP()
			cy.newPage()
			cy.addBlock( 'ugb/cta' )
			cy.openInspector( 'ugb/cta', 'Style' )

			cy.collapse( 'General' )
			assertAligns( 'Align', '.ugb-inner-block', { viewport: mode } )

			cy.collapse( 'Container' )
			cy.setBlockAttribute( {
				[ `column${ mode }BackgroundMediaUrl` ]: 'http://sandbox.gambit.ph/for-test/wp-content/uploads/sites/85/2020/12/avi-richards-ojBNujxI2_c-unsplash.jpg',
			} )
			cy.adjust( 'Background', {
				[ `Adv. Background Image Settings` ]: {
					[ `Image Position` ]: {
						viewport: mode,
						value: 'top left',
					},
					[ `Image Repeat` ]: {
						viewport: mode,
						value: 'no-repeat',
					},
					[ `Image Size` ]: {
						viewport: mode,
						value: 'cover',
					},
				},
			} ).assertComputedStyle( {
				'.ugb-cta__item': {
					[ `background-size` ]: 'cover',
				},
			} )

			cy.collapse( 'Spacing' )
			cy.adjust( 'Paddings', 30, { viewport: mode, unit: 'px' } ).assertComputedStyle( {
				'.ugb-cta__item': {
					[ `padding-top` ]: '30px',
					[ `padding-bottom` ]: '30px',
					[ `padding-right` ]: '30px',
					[ `padding-left` ]: '30px',
				},
			} )
			cy.resetStyle( 'Paddings' )
			cy.adjust( 'Paddings', 4, { viewport: mode, unit: 'em' } ).assertComputedStyle( {
				'.ugb-cta__item': {
					[ `padding-top` ]: '4em',
					[ `padding-bottom` ]: '4em',
					[ `padding-right` ]: '4em',
					[ `padding-left` ]: '4em',
				},
			} )
			cy.resetStyle( 'Paddings' )
			cy.adjust( 'Paddings', 21, { viewport: mode, unit: '%' } ).assertComputedStyle( {
				'.ugb-cta__item': {
					[ `padding-top` ]: '21%',
					[ `padding-bottom` ]: '21%',
					[ `padding-right` ]: '21%',
					[ `padding-left` ]: '21%',
				},
			} )
			cy.adjust( 'Title', 47, { viewport: mode } ).assertComputedStyle( {
				'.ugb-cta__title': {
					[ `margin-bottom` ]: '47px',
				},
			} )
			cy.adjust( 'Description', 28, { viewport: mode } ).assertComputedStyle( {
				'.ugb-cta__description': {
					[ `margin-bottom` ]: '28px',
				},
			} )
			cy.adjust( 'Button', 9, { viewport: mode } ).assertComputedStyle( {
				'.ugb-button-container': {
					[ `margin-bottom` ]: '9px',
				},
			} )

			cy.collapse( 'Title' )
			cy.adjust( 'Typography', {
				[ `Size` ]: {
					viewport: mode,
					value: 34,
					unit: 'px',
				},
				[ `Line-Height` ]: {
					viewport: mode,
					value: 24,
					unit: 'px',
				},
			} ).assertComputedStyle( {
				'.ugb-cta__title': {
					[ `font-size` ]: '34px',
					[ `line-height` ]: '24px',
				},
			} )
			assertAligns( 'Align', '.ugb-cta__title', { viewport: mode } )

			cy.collapse( 'Description' )
			cy.adjust( 'Typography', {
				[ `Size` ]: {
					viewport: mode,
					value: 25,
					unit: 'px',
				},
				[ `Line-Height` ]: {
					viewport: mode,
					value: 21,
					unit: 'px',
				},
			} ).assertComputedStyle( {
				'.ugb-cta__description': {
					[ `font-size` ]: '25px',
					[ `line-height` ]: '21px',
				},
			} )
			assertAligns( 'Align', '.ugb-cta__description', { viewport: mode } )

			cy.collapse( 'Button' )
			assertAligns( 'Align', '.ugb-button-container', { viewport: mode } )

			assertBlockBackground( '.ugb-cta', { viewport: mode } )

			assertSeparators( { viewport: mode } )
		} )
	}
}

