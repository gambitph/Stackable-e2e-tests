
/**
 * External dependencies
 */
import { range } from 'lodash'
import { blocks } from '~stackable-e2e/config'
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, assertAligns, registerTests, responsiveAssertHelper, assertTypography, assertContainer, assertAdvancedTab,
} from '~stackable-e2e/helpers'
import { registerBlockSnapshots } from '~gutenberg-e2e/plugins'

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

		cy.savePost()
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
		cy.addBlock( 'ugb/accordion' ).as( 'accordionBlock' )
		registerBlockSnapshots( 'accordionBlock' )

		cy.typeBlock( 'ugb/accordion', '.ugb-accordion__title', 'Hello World! 1234' )
			.assertBlockContent( '.ugb-accordion__title', 'Hello World! 1234' )
	} )
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

		cy.savePost()
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
		cy.savePost()
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
		cy.deleteBlock( 'ugb/accordion', 'Accordion 1' )
	} )

	cy.addBlock( 'ugb/accordion' ).as( 'accordionBlock' )
	const accordionBlock = registerBlockSnapshots( 'accordionBlock' )

	// Test General Reverse Arrow and Alignment
	cy.openInspector( 'ugb/accordion', 'Style' )
	cy.collapse( 'General' )
	cy.adjust( 'Open at the start', true )

	desktopOnly( () => {
		cy.adjust( 'Reverse arrow', true ).assertComputedStyle( {
			'.ugb-accordion__heading': {
				'flex-direction': 'row-reverse',
			},
		} )
	} )
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	cy.collapse( 'Container' )

	// Test Container
	assertContainer( '.ugb-accordion__heading', { viewport }, 'container%sBackgroundMediaUrl' )

	cy.collapse( 'Spacing' )
	// Test Padding options
	desktopOnly( () => {
		cy.adjust( 'Padding', [ 35, 36, 37, 38 ] ).assertComputedStyle( {
			'.ugb-accordion__heading': {
				'padding-top': '35px',
				'padding-right': '36px',
				'padding-bottom': '37px',
				'padding-left': '38px',
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

function advancedTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/accordion' ).as( 'accordionBlock' )
	const accordionBlock = registerBlockSnapshots( 'accordionBlock' )

	cy.openInspector( 'ugb/accordion', 'Advanced' )

	assertAdvancedTab( '.ugb-accordion', {
		viewport,
		customCssSelectors: [
			'.ugb-accordion__heading',
			'.ugb-accordion__title',
			'.ugb-accordion__arrow',
			'.ugb-accordion__content',
		],
	} )

	// Add more block specific tests.
	accordionBlock.assertFrontendStyles()
}
