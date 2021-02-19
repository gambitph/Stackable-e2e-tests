
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, responsiveAssertHelper, assertAligns, assertTypography, assertBlockTitleDescription, assertBlockBackground, assertSeparators,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )

describe( 'Number Box Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/number-box', '.ugb-number-box' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/number-box' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/number-box', [
		'Basic',
		{ value: 'Plain', selector: '.ugb-number-box--design-plain' },
		{ value: 'Background', selector: '.ugb-number-box--design-background' },
		{ value: 'Heading', selector: '.ugb-number-box--design-heading' },
		{ value: 'heading2', selector: '.ugb-number-box--design-heading2' },
		{ value: 'Faded', selector: '.ugb-number-box--design-faded' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/number-box', [
		'Angled Number Box',
		'Aurora Number Box',
		'Capital Number Box',
		'Cary Number Box',
		'Elevate Number Box',
		'Flex Number Box',
		'Hue Number Box',
		'Lounge Number Box',
		'Lume Number Box',
		'Lush Number Box',
		'Propel Number Box',
		'Speck Number Box',
	] ) )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/number-box' )
	cy.openInspector( 'ugb/number-box', 'Style' )

	// General Tab
	cy.collapse( 'General' )

	desktopOnly( () => {
		cy.adjust( 'Columns', 3 )
		cy.get( '.ugb-number-box__item3' ).should( 'exist' )
	} )
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	// Container Tab
	cy.collapse( 'Container' )

	// Background
	desktopOnly( () => {
		cy.adjust( 'Background', {
			'Color Type': 'single',
			'Background Color': '#000000',
			'Background Color Opacity': 0.7,
		} ).assertComputedStyle( {
			'.ugb-number-box__item': {
				'background-color': 'rgba(0, 0, 0, 0.7)',
			},
		} )

		cy.adjust( 'Background', {
			'Color Type': 'gradient',
			'Background Color #1': '#ff5c5c',
			'Background Color #2': '#7bff5a',
			'Adv. Gradient Color Settings': {
				'Gradient Direction (degrees)': 160,
				'Color 1 Location': 28,
				'Color 2 Location': 75,
				'Background Gradient Blend Mode': 'hue',
			},
		} ).assertComputedStyle( {
			'.ugb-number-box__item:before': {
				'background-image': 'linear-gradient(160deg, #ff5c5c 28%, #7bff5a 75%)',
				'mix-blend-mode': 'hue',
			},
			'.ugb-number-box__item': {
				'background-color': '#ff5c5c',
			},
		} )
	} )

	// Image
	cy.setBlockAttribute( {
		[ `column${ viewport === 'Desktop' ? '' : viewport }BackgroundMediaUrl` ]: Cypress.env( 'DUMMY_IMAGE_URL' ),
	} )
	cy.adjust( 'Background', {
		'Adv. Background Image Settings': {
			'Image Position': {
				viewport,
				value: 'top right',
			},
			'Image Repeat': {
				viewport,
				value: 'repeat-x',
			},
			'Image Size': {
				viewport,
				value: 'cover',
			},
		},
	} ).assertComputedStyle( {
		'.ugb-number-box__item': {
			'background-position': '100% 0%',
			'background-repeat': 'repeat-x',
			'background-size': 'cover',
		},
	} )

	desktopOnly( () => {
		cy.setBlockAttribute( {
			[ `column${ viewport === 'Desktop' ? '' : viewport }BackgroundMediaUrl` ]: Cypress.env( 'DUMMY_IMAGE_URL' ),
		} )
		cy.adjust( 'Background', {
			'Background Media Tint Strength': 7,
			'Fixed Background': true,
			'Adv. Background Image Settings': {
				'Image Blend Mode': 'exclusion',
			},
		} ).assertComputedStyle( {
			'.ugb-number-box__item': {
				'background-attachment': 'fixed',
				'background-blend-mode': 'exclusion',
			},
			'.ugb-number-box__item:before': {
				'opacity': '0.7',
			},
		} )
	} )

	// Borders
	desktopOnly( () => {
		// Implement adjustBorder once merged into master
		cy.adjust( 'Borders', 'solid' )
		cy.adjust( 'Border Color', '#a12222' )
		cy.adjust( 'Border Radius', 26 ).assertComputedStyle( {
			'.ugb-number-box__item': {
				'border-style': 'solid',
				'border-color': '#a12222',
				'border-radius': '26px',
			},
		} )
		cy.adjust( 'Shadow / Outline', 5 )
			.assertClassName( '.ugb-number-box__item', 'ugb--shadow-5' )
	} )

	cy.adjust( 'Borders', 'dashed' )
	cy.adjust( 'Border Width', 4, { viewport } ).assertComputedStyle( {
		'.ugb-number-box__item': {
			'border-style': 'dashed',
			'border-top-width': '4px',
			'border-bottom-width': '4px',
			'border-left-width': '4px',
			'border-right-width': '4px',
		},
	} )

	// Spacing Tab
	cy.collapse( 'Spacing' )

	cy.adjust( 'Paddings', 30, { viewport } ).assertComputedStyle( {
		'.ugb-number-box__item': {
			'padding-top': '30px',
			'padding-bottom': '30px',
			'padding-right': '30px',
			'padding-left': '30px',
		},
	} )
	cy.resetStyle( 'Paddings' )
	cy.adjust( 'Paddings', 5, { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-number-box__item': {
			'padding-top': '5em',
			'padding-bottom': '5em',
			'padding-right': '5em',
			'padding-left': '5em',
		},
	} )
	cy.resetStyle( 'Paddings' )
	cy.adjust( 'Paddings', 25, { viewport, unit: '%' } ).assertComputedStyle( {
		'.ugb-number-box__item': {
			'padding-top': '25%',
			'padding-bottom': '25%',
			'padding-right': '25%',
			'padding-left': '25%',
		},
	} )

	cy.adjust( 'Number', 33 )
	cy.adjust( 'Title', 43 )
	cy.adjust( 'Title', 53 )
		.assertComputedStyle( {
			'.ugb-number-box__number': {
				'margin-bottom': '33px',
			},
			'.ugb-number-box__title': {
				'margin-bottom': '43px',
			},
			'.ugb-number-box__description': {
				'margin-bottom': '53px',
			},
		} )

	// Number
	cy.collapse( 'Number' )

	// TO DO: Add test for Number Input

	assertTypography( '.ugb-number-box__number' )
	cy.adjust( 'Size', 47, { viewport } ).assertComputedStyle( {
		'.ugb-number-box__number': {
			'font-size': '47px',
		},
	} )
	cy.adjust( 'Size', 4, { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-number-box__number': {
			'font-size': '4em',
		},
	} )
	cy.adjust( 'Shape Size', 2, { viewport } ).assertComputedStyle( {
		'.ugb-number-box__number': {
			'height': '2em',
			'width': '2em',
			'line-height': '2em',
		},
	} )

	desktopOnly( () => {
		cy.adjust( 'Number Shape', 'none' ).assertClassName( '.ugb-number-box', 'ugb-number-box--number-style-none' )
		cy.adjust( 'Number Shape', 'square' ).assertClassName( '.ugb-number-box', 'ugb-number-box--number-style-square' )

		cy.adjust( 'Number Background Color', '#d1dfe4' )
		cy.adjust( 'Number Color', '#000000' )
		cy.adjust( 'Opacity', 0.5 ).assertComputedStyle( {
			'.ugb-number-box__number': {
				'background-color': '#d1dfe4',
				'color': '#000000',
				'opacity': '0.5',
			},
		} )
	} )

	assertAligns( 'Align', '.ugb-number-box__number', { viewport } )

	// Title Tab and Description Tab
	cy.collapse( 'Title' )

	desktopOnly( () => {
		cy.adjust( 'Title HTML Tag', 'h4' ).assertHtmlTag( '.ugb-number-box__title', 'h4' )
	} )

	const titleDescriptionTabs = [
		{
			name: 'Title',
			class: '.ugb-number-box__title',
		},
		{
			name: 'Description',
			class: '.ugb-number-box__description',
		},
	]
	titleDescriptionTabs.forEach( tab => {
		cy.collapse( tab.name )

		desktopOnly( () => {
			cy.adjust( `${ tab.name } Color`, '#742f2f' ).assertComputedStyle( {
				[ `${ tab.class }` ]: {
					'color': '#742f2f',
				},
			} )
		} )

		cy.adjust( 'Size', 55, { viewport } ).assertComputedStyle( {
			[ `${ tab.class }` ]: {
				'font-size': '55px',
			},
		} )
		cy.adjust( 'Size', 2, { viewport, unit: 'em' } ).assertComputedStyle( {
			[ `${ tab.class }` ]: {
				'font-size': '2em',
			},
		} )

		assertTypography( tab.class, { viewport } )
		assertAligns( 'Align', tab.class, { viewport } )
	} )

	assertBlockTitleDescription( { viewport } )
	assertBlockBackground( '.ugb-number-box', { viewport } )
	assertSeparators( { viewport } )
}
