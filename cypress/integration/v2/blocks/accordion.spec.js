
/**
 * External dependencies
 */
import { range } from 'lodash'
import { blocks } from '~stackable-e2e/config'
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, assertAligns, registerTests, responsiveAssertHelper, assertTypography,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )

describe( 'Accordion Block', registerTests( [
	blockExist,
	blockError,
	innerBlocks,
	switchLayout,
	switchDesign,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/accordion', '.ugb-accordion' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/accordion' ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks inside accordion', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/accordion' )
		cy.selectBlock( 'ugb/accordion' )

		blocks
			.filter( blockName => blockName !== 'ugb/accordion' )
			.forEach( blockName => cy.addInnerBlock( 'ugb/accordion', blockName ) )

		cy.publish()
	} )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/accordion', [
		'Basic',
		{ value: 'Plain', selector: '.ugb-accordion--design-plain' },
		{ value: 'Line Colored', selector: '.ugb-accordion--design-line-colored' },
		{ value: 'Colored', selector: '.ugb-accordion--design-colored' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/accordion', [
		'Dim Accordion',
		'Elevate Accordion',
		'Lounge Accordion',
	] ) )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()

	// Test 'Close adjacent on open' feature
	desktopOnly( () => {
		range( 1, 4 ).forEach( idx => {
			cy.addBlock( 'ugb/accordion' )
			cy.typeBlock( 'ugb/accordion', '.ugb-accordion__title', `Accordion ${ idx }`, idx - 1 )
			cy.openInspector( 'ugb/accordion', 'Style', `Accordion ${ idx }` )
			cy.collapse( 'General' )
			cy.adjust( 'Close adjacent on open', true )
		} )

		cy.publish()
		cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
			cy.visit( previewUrl )
			range( 0, 3 ).forEach( idx1 => {
				cy
					.get( '.ugb-accordion' )
					.eq( idx1 )
					.find( '.ugb-accordion__heading' )
					.click( { force: true } )
					.then( () => {
						range( 0, 3 ).forEach( idx2 => {
							if ( idx1 !== idx2 ) {
								cy
									.get( '.ugb-accordion' )
									.eq( idx2 )
									.invoke( 'attr', 'aria-expanded' )
									.then( ariaExpanded => {
										expect( ariaExpanded ).toBe( 'false' )
									} )
							}
						} )
					} )
			} )
			cy.visit( editorUrl )
		} )
		cy.deleteBlock( 'ugb/accordion', 'Accordion 2' )
		cy.deleteBlock( 'ugb/accordion', 'Accordion 3' )

		// Test 'open at start'
		cy.openInspector( 'ugb/accordion', 'Style' )
		cy.collapse( 'General' )
		cy.adjust( 'Open at the start', true )
		cy.publish()
		cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
			cy.visit( previewUrl )
			cy
				.get( '.ugb-accordion' )
				.invoke( 'attr', 'aria-expanded' )
				.then( ariaExpanded => {
					expect( ariaExpanded ).toBe( 'true' )
					cy.visit( editorUrl )
				} )
		} )

		// Test 'Reverse arrow'
		cy.openInspector( 'ugb/accordion', 'Style' )
		cy.collapse( 'General' )
		cy.adjust( 'Reverse arrow', true ).assertComputedStyle( {
			'.ugb-accordion__heading': {
				'flex-direction': 'row-reverse',
			},
		} )
		cy.deleteBlock( 'ugb/accordion', 'Accordion 1' )
	} )
	cy.addBlock( 'ugb/accordion' )

	// Test General Alignment
	cy.openInspector( 'ugb/accordion', 'Style' )
	cy.collapse( 'General' )
	cy.adjust( 'Open at the start', true )
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	cy.collapse( 'Container' )

	// Test Single Background Color
	desktopOnly( () => {
		cy.adjust( 'Background', {
			'Color Type': 'single',
			'Background Color': '#000000',
			'Background Color Opacity': '0.5',
		} ).assertComputedStyle( {
			'.ugb-accordion__heading': {
				'background-color': 'rgba(0, 0, 0, 0.5)',
			},
		} )
	} )
	cy.setBlockAttribute( {
		[ `container${ viewport === 'Desktop' ? '' : viewport }BackgroundMediaUrl` ]: Cypress.env( 'DUMMY_IMAGE_URL' ),
	} )

	// Test Gradient Background Color
	desktopOnly( () => {
		cy.adjust( 'Background', {
			'Color Type': 'gradient',
			'Background Color #1': '#f00069',
			'Background Color #2': '#000000',
			'Adv. Gradient Color Settings': {
				'Gradient Direction (degrees)': '180deg',
				'Color 1 Location': '11%',
				'Color 2 Location': '80%',
				'Background Gradient Blend Mode': 'hard-light',
			},
			'Background Media Tint Strength': 6,
			'Fixed Background': true,
			'Adv. Background Image Settings': {
				'Image Blend Mode': 'hue',
			},
		} ).assertComputedStyle( {
			'.ugb-accordion__heading:before': {
				'background-image': 'linear-gradient(#f00069 11%, #000000 80%)',
				'mix-blend-mode': 'hard-light',
				'opacity': '0.6',
			},
			'.ugb-accordion__heading': {
				'background-blend-mode': 'hue',
				'background-attachment': 'fixed',
			},
		} )
	} )

	cy.adjust( 'Background', {
		'Adv. Background Image Settings': {
			'Image Position': {
				viewport,
				value: 'center center',
			},
			'Image Repeat': {
				viewport,
				value: 'repeat-x',
			},
			'Image Size': {
				viewport,
				value: 'custom',
			},
			'Custom Size': {
				viewport,
				value: 19,
				unit: '%',
			},
		},
	} ).assertComputedStyle( {
		'.ugb-accordion__heading': {
			'background-position': '50% 50%',
			'background-repeat': 'repeat-x',
			'background-size': '19%',
		},
	} )

	// Test Border Radius
	desktopOnly( () => {
		cy.adjust( 'Border Radius', 30 ).assertComputedStyle( {
			'.ugb-accordion__heading': {
				'border-radius': '30px',
			},
		} )
	} )

	// Test Border Options
	desktopOnly( () => {
		cy.adjust( 'Borders', 'solid' )
		cy.adjust( 'Border Width', 3 )
		cy.adjust( 'Border Color', '#f1f1f1' ).assertComputedStyle( {
			'.ugb-accordion__heading': {
				'border-style': 'solid',
				'border-color': '#f1f1f1',
				'border-top-width': '3px',
				'border-bottom-width': '3px',
				'border-left-width': '3px',
				'border-right-width': '3px',
			},
		} )
	} )

	// Test Shadow / Outline
	desktopOnly( () => {
		cy.adjust( 'Shadow / Outline', 9 )
			.assertClassName( '.ugb-accordion__heading', 'ugb--shadow-9' )
	} )

	cy.collapse( 'Spacing' )
	// Test Padding options
	desktopOnly( () => {
		cy.adjust( 'Padding', 46 ).assertComputedStyle( {
			'.ugb-accordion__heading': {
				'padding-top': '46px',
				'padding-right': '46px',
				'padding-bottom': '46px',
				'padding-left': '46px',
			},
		} )
	} )

	// Test Title spacing
	cy.typeBlock( 'ugb/accordion', '.ugb-accordion__title', 'Accordion 1' )
	cy.document().then( doc => {
		if ( ! doc.querySelector( '.ugb-accordion--open' ) ) {
			cy.get( '.ugb-accordion__heading' ).click( { force: true } )
		}
	} )
	cy.adjust( 'Title', 63, { viewport } )
		.assertComputedStyle( {
			'.ugb-accordion__heading': {
				'margin-bottom': '63px',
			},
		} )

	// Test Title options
	cy.collapse( 'Title' )
	desktopOnly( () => {
		cy.adjust( 'Title HTML Tag', 'h3' )
			.assertHtmlTag( '.ugb-accordion__title', 'h3' )
		cy.adjust( 'Title Color', '#f00069' )
			.assertComputedStyle( {
				'.ugb-accordion__title': {
					'color': '#f00069',
				},
			} )
	} )
	assertTypography( '.ugb-accordion__title', { viewport } )
	assertAligns( 'Align', '.ugb-accordion__title', { viewport } )

	// Test Arrow settings
	desktopOnly( () => {
		cy.collapse( 'Arrow' )
		cy.adjust( 'Size', 31 )
		cy.adjust( 'Color', '#333333' )
			.assertComputedStyle( {
				'.ugb-accordion__arrow': {
					'width': '31px',
					'height': '31px',
					'fill': '#333333',
				},
			} )
	} )
}
