/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, assertAligns, responsiveAssertHelper, assertBlockTitleDescription, assertBlockBackground, assertSeparators, assertTypography,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )

describe( 'Feature Grid Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/feature-grid', '.ugb-feature-grid' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/feature-grid' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/feature-grid', [
		{ value: 'Basic', selector: '.ugb-feature-grid--design-basic' },
		{ value: 'Plain', selector: '.ugb-feature-grid--design-plain' },
		{ value: 'Horizontal', selector: '.ugb-feature-grid--design-horizontal' },
		{ value: 'Large Mid', selector: '.ugb-feature-grid--design-large-mid' },
		{ value: 'Zigzag', selector: '.ugb-feature-grid--design-zigzag' },
	] ) )
}

function switchDesign() {
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
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/feature-grid' )

	cy.openInspector( 'ugb/feature-grid', 'Style' )

	cy.collapse( 'General' )
	cy.adjust( 'Columns', 3 )
	cy.get( '.ugb-feature-grid__item3' ).should( 'exist' )
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	cy.collapse( 'Container' )
	cy.setBlockAttribute( {
		[ `column${ viewport === 'Desktop' ? '' : viewport }BackgroundMediaUrl` ]: Cypress.env( 'DUMMY_IMAGE_URL' ),
		[ `image1Url` ]: Cypress.env( 'DUMMY_IMAGE_URL' ),
		[ `image2Url` ]: Cypress.env( 'DUMMY_IMAGE_URL' ),
		[ `image3Url` ]: Cypress.env( 'DUMMY_IMAGE_URL' ),
		[ `image4Url` ]: Cypress.env( 'DUMMY_IMAGE_URL' ),
	} )
	desktopOnly( () => {
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
				[ `Image Blend Mode` ]: 'exclusion',
			},
		} ).assertComputedStyle( {
			'.ugb-feature-grid__item:before': {
				[ `background-image` ]: 'linear-gradient(160deg, #ff5c5c 28%, #7bff5a 75%)',
				[ `opacity` ]: '0.6',
				[ `mix-blend-mode` ]: 'hue',
			},
			'.ugb-feature-grid__item': {
				[ `background-color` ]: '#ff5c5c',
				[ `background-attachment` ]: 'fixed',
				[ `background-blend-mode` ]: 'exclusion',
			},
		} )
	} )
	cy.adjust( 'Background', {
		[ `Adv. Background Image Settings` ]: {
			[ `Image Position` ]: {
				viewport,
				value: 'center center',
			},
			[ `Image Repeat` ]: {
				viewport,
				value: 'repeat-x',
			},
			[ `Image Size` ]: {
				viewport,
				value: 'custom',
			},
			[ `Custom Size` ]: {
				viewport,
				value: 19,
				unit: '%',
			},
		},
	} ).assertComputedStyle( {
		'.ugb-feature-grid__item': {
			[ `background-position` ]: '50% 50%',
			[ `background-repeat` ]: 'repeat-x',
			[ `background-size` ]: '19%',
		},
	} )
	desktopOnly( () => {
		cy.adjust( 'Borders', 'solid' )
		cy.adjust( 'Border Width', 4 )
		cy.adjust( 'Border Color', '#a12222' )
		cy.adjust( 'Border Radius', 26 ).assertComputedStyle( {
			'.ugb-feature-grid__item': {
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
			.assertClassName( '.ugb-feature-grid__item', 'ugb--shadow-7' )
	} )
	cy.collapse( 'Image' )
	cy.adjust( 'Image Width', 29, { viewport } ).assertComputedStyle( {
		'.ugb-img': {
			[ `width` ]: '29px',
		},
	} )
	desktopOnly( () => {
		cy.adjust( 'Force square image', true )
	} )

	cy.adjust( 'Align', 'left', { viewport } ).assertComputedStyle( {
		'.ugb-feature-grid__image': {
			[ `margin-left` ]: '0px',
			[ `margin-right` ]: 'auto',
		},
	} )
	cy.adjust( 'Align', 'center', { viewport } ).assertComputedStyle( {
		'.ugb-feature-grid__image': {
			[ `margin-left` ]: 'auto',
			[ `margin-right` ]: 'auto',
		},
	} )
	cy.adjust( 'Align', 'right', { viewport } ).assertComputedStyle( {
		'.ugb-feature-grid__image': {
			[ `margin-left` ]: 'auto',
			[ `margin-right` ]: '0px',
		},
	} )

	desktopOnly( () => {
		cy.adjust( 'Shape', {
			label: 'Blob 1',
			value: 'blob1',
		} )
		cy.adjust( 'Flip Shape Horizontally', true )
		cy.adjust( 'Flip Shape Vertically', true )
		cy.adjust( 'Stretch Shape Mask', true ).assertClassName( 'img.ugb-img--shape', 'ugb-image--shape-stretch' )

		// We won't be able to assert image size for now since it requires server handling.
		// `assertHtmlAttribute` command was introduced for the purpose of asserting html attribute values in a selected DOM Element.
	} )

	cy.collapse( 'Title' )
	desktopOnly( () => {
		cy.adjust( 'Title HTML Tag', 'h4' )
			.assertHtmlTag( '.ugb-feature-grid__title', 'h4' )
		cy.adjust( 'Title Color', '#742f2f' ).assertComputedStyle( {
			'.ugb-feature-grid__title': {
				[ `color` ]: '#742f2f',
			},
		} )
	} )
	assertTypography( '.ugb-feature-grid__title', viewport )
	assertAligns( 'Align', '.ugb-feature-grid__title', { viewport } )

	cy.collapse( 'Description' )
	desktopOnly( () => {
		cy.adjust( 'Description Color', '#742f2f' ).assertComputedStyle( {
			'.ugb-feature-grid__description': {
				[ `color` ]: '#742f2f',
			},
		} )
	} )
	assertTypography( '.ugb-feature-grid__description', viewport )
	assertAligns( 'Align', '.ugb-feature-grid__description', { viewport } )

	cy.collapse( 'Button' )
	desktopOnly( () => {
		cy.adjust( 'Button Color', '#4e2e2e' )
		cy.adjust( 'Hover Effect', 'scale' )
			.assertClassName( '.ugb-button', 'ugb--hover-effect-scale' )
		cy.adjust( 'Hover Opacity', 0.6 )
		cy.adjust( 'Hover Colors', {
			[ `Button Color` ]: '#371010',
		} )
		cy.adjust( 'Typography', {
			[ `Weight` ]: '700',
			[ `Transform` ]: 'lowercase',
			[ `Letter Spacing` ]: 2.9,
		} )
		cy.adjust( 'Button Size', 'large' )
			.assertClassName( '.ugb-button', 'ugb-button--size-large' )
		cy.adjust( 'Opacity', 0.2 ).assertComputedStyle( {
			'.ugb-button .ugb-button--inner': {
				[ `font-weight` ]: '700',
				[ `text-transform` ]: 'lowercase',
				[ `letter-spacing` ]: '2.9px',
				[ `color` ]: '#4e2e2e',
			},
		} )
	} )
	cy.waitFA()
	cy.adjust( 'Icon', 'info' )
	cy.adjust( 'Adv. Icon Settings', {
		[ `Icon Size` ]: 41,
		[ `Icon Spacing` ]: 25,
	} ).assertComputedStyle( {
		'.ugb-button svg': {
			[ `height` ]: '41px',
			[ `width` ]: '41px',
			[ `margin-right` ]: '25px',
		},
	} )

	cy.adjust( 'Typography', {
		[ `Size` ]: {
			viewport,
			value: 50,
		},
	} ).assertComputedStyle( {
		'.ugb-button .ugb-button--inner': {
			[ `font-size` ]: '50px',
		},
	} )

	cy.adjust( 'Typography', {
		[ `Size` ]: {
			viewport,
			unit: 'em',
			value: 7,
		},
	} ).assertComputedStyle( {
		'.ugb-button .ugb-button--inner': {
			[ `font-size` ]: '7em',
		},
	} )

	cy.collapse( 'Spacing' )

	cy.adjust( 'Paddings', 24, { viewport, unit: 'px' } ).assertComputedStyle( {
		'.ugb-feature-grid__item': {
			[ `padding-top` ]: '24px',
			[ `padding-bottom` ]: '24px',
			[ `padding-left` ]: '24px',
			[ `padding-right` ]: '24px',
		},
	} )

	cy.adjust( 'Paddings', 4, { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-feature-grid__item': {
			[ `padding-top` ]: '4em',
			[ `padding-bottom` ]: '4em',
			[ `padding-left` ]: '4em',
			[ `padding-right` ]: '4em',
		},
	} )

	cy.adjust( 'Paddings', 12, { viewport, unit: '%' } ).assertComputedStyle( {
		'.ugb-feature-grid__item': {
			[ `padding-top` ]: '12%',
			[ `padding-bottom` ]: '12%',
			[ `padding-left` ]: '12%',
			[ `padding-right` ]: '12%',
		},
	} )

	cy.adjust( 'Image', 13, { viewport } ).assertComputedStyle( {
		'.ugb-feature-grid__image': {
			[ `margin-bottom` ]: '13px',
		},
	} )

	cy.adjust( 'Title', 23, { viewport } ).assertComputedStyle( {
		'.ugb-feature-grid__title': {
			[ `margin-bottom` ]: '23px',
		},
	} )

	cy.adjust( 'Description', 16, { viewport } ).assertComputedStyle( {
		'.ugb-feature-grid__description': {
			[ `margin-bottom` ]: '16px',
		},
	} )

	cy.adjust( 'Button', 21, { viewport } ).assertComputedStyle( {
		'.ugb-button-container': {
			[ `margin-bottom` ]: '21px',
		},
	} )

	desktopOnly( () => {
		cy.collapse( 'Effects' )
		const effects = [
			'shadow',
			'lift',
			'lift-more',
			'lift-shadow',
			'lift-staggered',
			'lift-shadow-staggered',
			'scale',
			'scale-more',
			'lower',
			'lower-more',
		]

		effects.forEach( effect => {
			cy.adjust( 'Hover Effect', effect ).assertClassName( '.ugb-feature-grid__item', `ugb--hover-${ effect }` )
		} )
	} )

	assertBlockTitleDescription( { viewport } )
	assertBlockBackground( '.ugb-feature-grid', { viewport } )
	assertSeparators( { viewport } )
}

