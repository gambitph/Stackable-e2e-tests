
/**
 * External dependencies
 */
import { range } from 'lodash'
import { blocks } from '~stackable-e2e/config'
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, assertAligns, registerTests, responsiveAssertHelper, assertTypography, assertContainer, assertAdvancedTab,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Accordion Block', registerTests( [
	blockExist,
	blockError,
	innerBlocks,
	switchLayout,
	switchDesign,
	typeContent,
	desktopStyle,
	tabletStyle,
	mobileStyle,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
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

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/accordion' )
		cy.typeBlock( 'ugb/accordion', '.ugb-accordion__title', 'Hello World! 1234' )
		cy.typeBlock( 'ugb/accordion', '.block-editor-block-list__block', 'Hello World! 1234' )
		cy.get( '.ugb-accordion' )
			.find( '.block-editor-block-list__block' )
			.then( $textBlock => {
				$textBlock.addClass( 'e2e-paragraph' )
			} )

		cy.publish()
		cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
			cy.visit( previewUrl )
			cy.get( '.ugb-accordion' )
				.find( '.ugb-accordion__title' )
				.contains( 'Hello World! 1234' )
				.should( 'exist' )
			cy.get( '.ugb-accordion' )
				.find( '.e2e-paragraph' )
				.contains( 'Hello World! 1234' )
				.should( 'exist' )
			cy.visit( editorUrl )
		} )
	} )
}

function styleTab( viewport, desktopOnly, registerBlockSnapshots ) {
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

	cy.addBlock( 'ugb/accordion' ).as( 'accordionBlock' )
	const accordionBlock = registerBlockSnapshots( 'accordionBlock' )

	// Test General Alignment
	cy.openInspector( 'ugb/accordion', 'Style' )
	cy.collapse( 'General' )
	cy.adjust( 'Open at the start', true )
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	cy.collapse( 'Container' )

	// Test Container
	assertContainer( '.ugb-accordion__heading', { viewport }, 'container%sBackgroundMediaUrl' )

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

	accordionBlock.assertFrontendStyles()
}

function advancedTab( viewport, desktopOnly, registerBlockSnapshots ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/accordion' ).as( 'accordionBlock' )
	const accordionBlock = registerBlockSnapshots( 'accordionBlock' )

	cy.openInspector( 'ugb/accordion', 'Advanced' )

	assertAdvancedTab( '.ugb-accordion', { viewport } )

	// Add more block specific tests.
	accordionBlock.assertFrontendStyles()
}
