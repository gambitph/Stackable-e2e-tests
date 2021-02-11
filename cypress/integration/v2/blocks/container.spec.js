/**
 * External dependencies
 */
import { blocks } from '~stackable-e2e/config'
import {
	assertAligns, assertBlockExist, blockErrorTest, switchLayouts, registerTests, responsiveAssertHelper,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )

describe( 'Container Block', registerTests( [
	blockExist,
	blockError,
	innerBlocks,
	switchLayout,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/container', '.ugb-container' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/container' ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks inside Advanced Columns and Grid', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/container' )

		blocks
			.filter( blockName => blockName !== 'ugb/container' )
			.forEach( blockName => cy.appendBlock( blockName ) )
	} )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/container', [
		{ value: 'Basic', selector: '.ugb-container--design-basic' },
		{ value: 'Plain', selector: '.ugb-container--design-plain' },
		{ value: 'Image', selector: '.ugb-container--design-image' },
		{ value: 'image2', selector: '.ugb-container--design-image2' },
		{ value: 'image3', selector: '.ugb-container--design-image3' },
	] ) )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/container' )
	cy.openInspector( 'ugb/container', 'Style' )

	// General Tab
	cy.collapse( 'General' )

	// Test Height
	cy.adjust( 'Height', 'short' ).assertComputedStyle( {
		'.ugb-container__side': {
			[ `padding-top` ]: '35px',
			[ `padding-bottom` ]: '35px',
		},
	} )
	cy.adjust( 'Height', 'normal' ).assertComputedStyle( {
		'.ugb-container__wrapper': {
			[ `padding-top` ]: '60px',
			[ `padding-bottom` ]: '60px',
		},
	} )
	cy.adjust( 'Height', 'tall' ).assertComputedStyle( {
		'.ugb-container__side': {
			[ `padding-top` ]: '120px',
			[ `padding-bottom` ]: '120px',
		},
	} )
	cy.adjust( 'Height', 'half' ).assertComputedStyle( {
		'.ugb-container__wrapper': {
			[ `min-height` ]: '50vh',
		},
	} )
	cy.adjust( 'Height', 'full' ).assertComputedStyle( {
		'.ugb-container__wrapper': {
			[ `min-height` ]: '100vh',
		},
	} )

	// Test Content Vertical Align
	cy.adjust( 'Content Vertical Align', 'flex-start' ).assertComputedStyle( {
		'.ugb-container__wrapper': {
			[ `justify-content` ]: 'flex-start',
		},
	} )
	cy.adjust( 'Content Vertical Align', 'center' ).assertComputedStyle( {
		'.ugb-container__wrapper': {
			[ `justify-content` ]: 'center',
		},
	} )
	cy.adjust( 'Content Vertical Align', 'flex-end' ).assertComputedStyle( {
		'.ugb-container__wrapper': {
			[ `justify-content` ]: 'flex-end',
		},
	} )

	// Test Content Width
	cy.adjust( 'Content Width (%)', 68 ).assertComputedStyle( {
		'.ugb-container__content-wrapper': {
			[ `width` ]: '68%',
		},
	} )

	// Test Content Horizontal Align
	cy.adjust( 'Content Horizontal Align', 'flex-start' ).assertComputedStyle( {
		'.ugb-container__side': {
			[ `align-items` ]: 'flex-start',
		},
	} )
	cy.adjust( 'Content Horizontal Align', 'center' ).assertComputedStyle( {
		'.ugb-container__side': {
			[ `align-items` ]: 'center',
		},
	} )
	cy.adjust( 'Content Horizontal Align', 'flex-end' ).assertComputedStyle( {
		'.ugb-container__side': {
			[ `align-items` ]: 'flex-end',
		},
	} )

	// Test Text Align
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	// Container Tab
	cy.collapse( 'Container' )

	// Background Tab
	desktopOnly( () => {
		// Test Single
		cy.adjust( 'Background', {
			[ `Color Type` ]: 'single',
			[ `Background Color` ]: '#000000',
			[ `Background Color Opacity` ]: 0.7,
		} ).assertComputedStyle( {
			'.ugb-container__wrapper': {
				[ `background-color` ]: 'rgba(0, 0, 0, 0.7)',
			},
		} )

		// Test Gradient
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
		} ).assertComputedStyle( {
			'.ugb-container__wrapper:before': {
				[ `background-image` ]: 'linear-gradient(160deg, #ff5c5c 28%, #7bff5a 75%)',
				[ `mix-blend-mode` ]: 'hue',
			},
			'.ugb-container__wrapper': {
				[ `background-color` ]: '#ff5c5c',
			},
		} )
	} )

	// Test Image
	cy.setBlockAttribute( {
		[ `column${ viewport === 'Desktop' ? '' : viewport }BackgroundMediaUrl` ]: Cypress.env( 'DUMMY_IMAGE_URL' ),
	} )

	desktopOnly( () => {
		cy.adjust( 'Background', {
			[ `Background Media Tint Strength` ]: 7,
			[ `Fixed Background` ]: true,
			[ `Adv. Background Image Settings` ]: {
				[ `Image Position` ]: 'top right',
				[ `Image Repeat` ]: 'repeat-x',
				[ `Image Size` ]: 'cover',
				[ `Image Blend Mode` ]: 'exclusion',
			},
		} ).assertComputedStyle( {
			'.ugb-container__wrapper': {
				[ `background-image` ]: `url("${ Cypress.env( 'DUMMY_IMAGE_URL' ) }")`,
				[ `background-attachment` ]: 'fixed',
				[ `background-position` ]: '100% 0%',
				[ `background-repeat` ]: 'repeat-x',
				[ `background-size` ]: 'cover',
				[ `background-blend-mode` ]: 'exclusion',
			},
			'.ugb-container__wrapper:before': {
				[ `opacity` ]: '0.7',
			},
		} )
	} )

	desktopOnly( () => {
		// Test Borders
		cy.adjust( 'Borders', 'solid' ).assertComputedStyle( {
			'.ugb-container__wrapper': {
				[ `border-style` ]: 'solid',
			},
		} )
		cy.adjust( 'Borders', 'dashed' ).assertComputedStyle( {
			'.ugb-container__wrapper': {
				[ `border-style` ]: 'dashed',
			},
		} )
		cy.adjust( 'Borders', 'dotted' ).assertComputedStyle( {
			'.ugb-container__wrapper': {
				[ `border-style` ]: 'dotted',
			},
		} )
		cy.adjust( 'Border Width', 4 )
		cy.adjust( 'Border Color', '#a12222' )
		cy.adjust( 'Border Radius', 26 ).assertComputedStyle( {
			'.ugb-container__wrapper': {
				[ `border-top-width` ]: '4px',
				[ `border-bottom-width` ]: '4px',
				[ `border-left-width` ]: '4px',
				[ `border-right-width` ]: '4px',
				[ `border-color` ]: '#a12222',
				[ `border-radius` ]: '26px',
			},
		} )

		// Test Shadow Outline
		cy.adjust( 'Shadow / Outline', 5 )
			.assertClassName( '.ugb-container__wrapper', 'ugb--shadow-5' )
	} )

	// Spacing Tab
	cy.collapse( 'Spacing' )

	// Test Padding
	cy.adjust( 'Paddings', 100, { viewport } ).assertComputedStyle( {
		'.ugb-container__wrapper': {
			[ `padding-top` ]: '100px',
			[ `padding-bottom` ]: '100px',
			[ `padding-right` ]: '100px',
			[ `padding-left` ]: '100px',
		},
	} )
	cy.resetStyle( 'Paddings' )
	cy.adjust( 'Paddings', 15, { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-container__wrapper': {
			[ `padding-top` ]: '15em',
			[ `padding-bottom` ]: '15em',
			[ `padding-right` ]: '15em',
			[ `padding-left` ]: '15em',
		},
	} )
	cy.resetStyle( 'Paddings' )
	cy.adjust( 'Paddings', 50, { viewport, unit: '%' } ).assertComputedStyle( {
		'.ugb-container__wrapper': {
			[ `padding-top` ]: '50%',
			[ `padding-bottom` ]: '50%',
			[ `padding-right` ]: '50%',
			[ `padding-left` ]: '50%',
		},
	} )

	// Text Colors Tab
	cy.collapse( 'Text Colors' )

	// Test Colors
}
