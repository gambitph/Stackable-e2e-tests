/**
 * External dependencies
 */
import { lowerCase } from 'lodash'
import {
	assertBlockExist, blockErrorTest, switchLayouts, switchDesigns, assertAligns, assertBlockBackground, assertSeparators, responsiveAssertHelper, assertTypography, assertAdvancedTab,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

export {
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	typeContent,
	desktopStyle,
	tabletStyle,
	mobileStyle,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/text', '.ugb-text' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/text' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/text', [
		{ value: 'Plain', selector: '.ugb-text--design-plain' },
		{ value: 'Side Title 1', selector: '.ugb-text--design-side-title-1' },
		{ value: 'Side Title 2', selector: '.ugb-text--design-side-title-2' },
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

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/text' ).asBlock( 'textBlock', { isStatic: true } )

		cy.openInspector( 'ugb/text', 'Style' )
		cy.toggleStyle( 'Title' )
		cy.toggleStyle( 'Subtitle' )

		cy.typeBlock( 'ugb/text', '.ugb-text__title', 'Hello World! 1' )
			.assertBlockContent( '.ugb-text__title', 'Hello World! 1' )
		cy.typeBlock( 'ugb/text', '.ugb-text__subtitle', 'Helloo World!! 12' )
			.assertBlockContent( '.ugb-text__subtitle', 'Helloo World!! 12' )
		cy.typeBlock( 'ugb/text', '.ugb-text__text-1', 'Hellooo World!!! 123' )
			.assertBlockContent( '.ugb-text__text-1', 'Hellooo World!!! 123' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/text' ).asBlock( 'textBlock', { isStatic: true } )
		cy.openInspector( 'ugb/text', 'Style' )
	} )

	// eslint-disable-next-line no-undef
	afterEach( () => cy.assertFrontendStyles( '@textBlock' ) )

	it( `should assert General options in ${ lowerCase( viewport ) }`, () => {
		// Test General options
		cy.collapse( 'General' )
		desktopOnly( () => {
			cy.adjust( 'Columns', 2 )
				.assertClassName( '.ugb-text', 'ugb-text--columns-2' )
		} )
		assertAligns( 'Align', '.ugb-inner-block', { viewport } )
	} )

	it( `should assert Column Rule options in ${ lowerCase( viewport ) }`, () => {
		desktopOnly( () => {
		// Test Column Rule
			cy.collapse( 'Column Rule' )
			cy.toggleStyle( 'Column Rule' )
			cy.adjust( 'Color', '#000000' )
			cy.adjust( 'Width', 3 )
			cy.adjust( 'Height', 48 ).assertComputedStyle( {
				'.ugb-text__rule': {
					'background-color': '#000000',
					'width': '3px',
					'height': '48%',
				},
			} )
		} )
	} )

	it( `should assert Text options in ${ lowerCase( viewport ) }`, () => {
		cy.typeBlock( 'ugb/text', '.ugb-text__text-1', 'Hellooo World!!! 123' )
		// Test Text options
		cy.collapse( 'Text' )

		desktopOnly( () => {
			cy.adjust( 'Text Color', '#333333' ).assertComputedStyle( {
				'.ugb-text__text p': {
					'color': '#333333',
				},
			} )
		} )
		cy.adjust( 'Size', 1.3, { viewport, unit: 'em' } ).assertComputedStyle( {
			'.ugb-text__text p': {
				'font-size': '1.3em',
			},
		} )
		assertTypography( '.ugb-text__text p', { viewport } )
		assertAligns( 'Align', '.ugb-text__text p', { viewport } )
	} )

	it( `should assert Title options in ${ lowerCase( viewport ) }`, () => {
		// Test Title
		cy.collapse( 'Title' )
		cy.toggleStyle( 'Title' )
		cy.typeBlock( 'ugb/text', '.ugb-text__title', 'Title here' )

		desktopOnly( () => {
			cy.adjust( 'Title HTML Tag', 'h3' )
				.assertHtmlTag( '.ugb-text__title', 'h3' )
			cy.adjust( 'Title Color', '#333333' ).assertComputedStyle( {
				'.ugb-text__title': {
					'color': '#333333',
				},
			} )
			const aligns = [ 'flex-start', 'center', 'flex-end' ]
			aligns.forEach( align => {
				cy.adjust( 'Vertical Align', align ).assertComputedStyle( {
					'.ugb-text__title-wrapper': {
						'justify-content': align,
					},
				} )
			} )
		} )

		cy.adjust( 'Size', 1.6, { viewport, unit: 'em' } ).assertComputedStyle( {
			'.ugb-text__title': {
				'font-size': '1.6em',
			},
		} )
		assertTypography( '.ugb-text__title', { viewport } )
		assertAligns( 'Align', '.ugb-text__title', { viewport } )
	} )

	it( `should assert Subtitle options in ${ lowerCase( viewport ) }`, () => {
		// Test Subtitle options
		cy.collapse( 'Subtitle' )
		cy.toggleStyle( 'Subtitle' )
		cy.typeBlock( 'ugb/text', '.ugb-text__subtitle', 'Subtitle here' )

		desktopOnly( () => {
			cy.adjust( 'Subtitle on Top', true )
			cy.adjust( 'Subtitle Color', '#333333' ).assertComputedStyle( {
				'.ugb-text__subtitle': {
					'color': '#333333',
				},
			} )
		} )

		cy.adjust( 'Size', 0.9, { viewport, unit: 'em' } ).assertComputedStyle( {
			'.ugb-text__subtitle': {
				'font-size': '0.9em',
			},
		} )
		assertTypography( '.ugb-text__subtitle', { viewport } )
		assertAligns( 'Align', '.ugb-text__subtitle', { viewport } )
	} )

	it( `should assert Spacing options in ${ lowerCase( viewport ) }`, () => {
		cy.toggleStyle( 'Text' )
		cy.toggleStyle( 'Subtitle' )
		cy.collapse( 'Spacing' )
		cy.adjust( 'Paddings', [ 25, 26, 27, 28 ], { viewport, unit: 'px' } ).assertComputedStyle( {
			'.ugb-text__text-wrapper': {
				'padding-top': '25px',
				'padding-right': '26px',
				'padding-bottom': '27px',
				'padding-left': '28px',
			},
		} )
		cy.adjust( 'Paddings', [ 3, 4, 5, 6 ], { viewport, unit: 'em' } ).assertComputedStyle( {
			'.ugb-text__text-wrapper': {
				'padding-top': '3em',
				'padding-right': '4em',
				'padding-bottom': '5em',
				'padding-left': '6em',
			},
		} )
		cy.adjust( 'Paddings', [ 17, 18, 19, 20 ], { viewport, unit: '%' } ).assertComputedStyle( {
			'.ugb-text__text-wrapper': {
				'padding-top': '17%',
				'padding-right': '18%',
				'padding-bottom': '19%',
				'padding-left': '20%',
			},
		} )
		cy.adjust( 'Title', 23, { viewport } ).assertComputedStyle( {
			'.ugb-text__title': {
				'margin-bottom': '23px',
			},
		} )
		cy.adjust( 'Subtitle', 8, { viewport } ).assertComputedStyle( {
			'.ugb-text__subtitle': {
				'margin-bottom': '8px',
			},
		} )
		cy.adjust( 'Text', 21, { viewport } ).assertComputedStyle( {
			'.ugb-text__text': {
				'margin-bottom': '21px',
			},
		} )
	} )

	it( `should assert Block Background options in ${ lowerCase( viewport ) }`, () => {
		// Test Block Background
		assertBlockBackground( '.ugb-text', { viewport } )
	} )

	it( `should assert Top & Bottom Separator options in ${ lowerCase( viewport ) }`, () => {
		// Test Top and Bottom Separator
		assertSeparators( { viewport } )
	} )
}

function advancedTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/text' ).asBlock( 'textBlock', { isStatic: true } )
	cy.openInspector( 'ugb/text', 'Advanced' )

	assertAdvancedTab( '.ugb-text', {
		viewport,
		customCssSelectors: [
			'.ugb-text__text',
		],
	} )

	// Add more block specific tests.
	cy.assertFrontendStyles( '@textBlock' )
}
