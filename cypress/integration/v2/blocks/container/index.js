/**
 * External dependencies
 */
import { lowerCase } from 'lodash'
import { blocks } from '~stackable-e2e/config'
import {
	assertAligns, assertBlockBackground, assertBlockExist, assertContainerLink, assertSeparators, blockErrorTest, switchLayouts, responsiveAssertHelper, assertContainer, assertAdvancedTab,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { disableItAssertion: true } )

export {
	blockExist,
	blockError,
	innerBlocks,
	switchLayout,
	desktopStyle,
	tabletStyle,
	mobileStyle,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/container', '.ugb-container' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/container' ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks inside Container', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/container' )

		blocks
			.filter( blockName => blockName !== 'ugb/container' )
			.forEach( blockName => cy.addInnerBlock( 'ugb/container', blockName ) )

		cy.savePost()
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
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/container' ).asBlock( 'containerBlock', { isStatic: true } )
		cy.openInspector( 'ugb/container', 'Style' )
	} )

	// eslint-disable-next-line no-undef
	afterEach( () => {
		cy.assertFrontendStyles( '@containerBlock' )
	} )

	it( `should assert General options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'General' )
		cy.adjust( 'Height', 'short', { viewport } ).assertComputedStyle( {
			'.ugb-container__side': {
				'padding-top': '35px',
				'padding-bottom': '35px',
			},
		} )
		cy.adjust( 'Height', 'normal', { viewport } ).assertComputedStyle( {
			'.ugb-container__side': {
				'padding-top': '0px',
				'padding-bottom': '0px',
			},
		} )
		cy.adjust( 'Height', 'tall', { viewport } ).assertComputedStyle( {
			'.ugb-container__side': {
				'padding-top': '120px',
				'padding-bottom': '120px',
			},
		} )
		cy.adjust( 'Height', 'half', { viewport } ).assertComputedStyle( {
			'.ugb-container__wrapper': {
				'min-height': '50vh',
			},
		} )
		cy.adjust( 'Height', 'full', { viewport } ).assertComputedStyle( {
			'.ugb-container__wrapper': {
				'min-height': '100vh',
			},
		} )

		// Test Content Vertical Align
		const verticalAligns = [ 'flex-start', 'center', 'flex-end' ]
		verticalAligns.forEach( align => {
			cy.adjust( 'Height', 'full', { viewport } )
				.adjust( 'Content Vertical Align', align, { viewport } )
				.assertComputedStyle( {
					'.ugb-container__wrapper': {
						'justify-content': align,
					},
				} )
		} )

		// Test Content Width
		cy.adjust( 'Content Width (%)', 50, { viewport } ).assertComputedStyle( {
			'.ugb-container__content-wrapper': {
				'width': '50%',
			},
		} )

		// Test Content Horizontal Align
		const horizontalAligns = [ 'flex-start', 'center', 'flex-end' ]
		horizontalAligns.forEach( align => {
			cy.adjust( 'Content Width (%)', 50, { viewport } )
				.adjust( 'Content Horizontal Align', align, { viewport } )
				.assertComputedStyle( {
					'.ugb-container__side': {
						'align-items': align,
					},
				} )
		} )

		// Test Text Align
		assertAligns( 'Align', '.ugb-inner-block', { viewport } )
	} )

	it( `should assert Container options in ${ lowerCase( viewport ) }`, () => {
		// Container Tab
		cy.collapse( 'Container' )
		assertContainer( '.ugb-container__wrapper', { viewport }, 'column%sBackgroundMediaUrl' )
	} )

	it( `should assert Spacing options in ${ lowerCase( viewport ) }`, () => {
	// Spacing Tab
		cy.collapse( 'Spacing' )

		// Test Padding
		cy.adjust( 'Paddings', [ 25, 26, 27, 28 ], { viewport, unit: 'px' } ).assertComputedStyle( {
			'.ugb-container__wrapper': {
				'padding-top': '25px',
				'padding-right': '26px',
				'padding-bottom': '27px',
				'padding-left': '28px',
			},
		} )
		cy.resetStyle( 'Paddings' )
		cy.adjust( 'Paddings', [ 3, 4, 5, 6 ], { viewport, unit: 'em' } ).assertComputedStyle( {
			'.ugb-container__wrapper': {
				'padding-top': '3em',
				'padding-right': '4em',
				'padding-bottom': '5em',
				'padding-left': '6em',
			},
		} )
		cy.resetStyle( 'Paddings' )
		cy.adjust( 'Paddings', [ 17, 18, 19, 20 ], { viewport, unit: '%' } ).assertComputedStyle( {
			'.ugb-container__wrapper': {
				'padding-top': '17%',
				'padding-right': '18%',
				'padding-bottom': '19%',
				'padding-left': '20%',
			},
		} )
	} )

	it( `should assert Text Colors options in ${ lowerCase( viewport ) }`, () => {
		desktopOnly( () => {
			cy.collapse( 'Text Colors' )
			cy.adjust( 'Heading Color', '#8e8ee0' )
			cy.adjust( 'Text Color', '#24b267' )
			cy.adjust( 'Link Color', '#642c2c' )
			cy.adjust( 'Link Hover Color', '#ba89df' )

			cy.addInnerBlock( 'ugb/container', 'ugb/card' )
			cy.openInspector( 'ugb/card', 'Style' )
			cy.collapse( 'Button' )
			cy.adjust( 'Design', {
				label: 'Link',
				value: 'link',
			} ).assertComputedStyle( {
				'.ugb-card__title': {
					'color': '#8e8ee0',
				},
				'.ugb-card__subtitle': {
					'color': '#24b267',
				},
				'.ugb-card__description': {
					'color': '#24b267',
				},
				'.ugb-button': {
					'color': '#642c2c',
				},
			} )
		} )
	} )

	it( `should assert Block Background options in ${ lowerCase( viewport ) }`, () => {
		assertBlockBackground( '.ugb-container', { viewport } )
	} )

	it( `should assert Top & Bottom Separators options in ${ lowerCase( viewport ) }`, () => {
		assertSeparators( { viewport } )
	} )

	it( `should assert Container Link options in ${ lowerCase( viewport ) }`, () => {
		assertContainerLink( '.ugb-container__wrapper', { viewport } )
	} )
}

function advancedTab( viewport ) {
	it( `should assert advanced options in ${ lowerCase( viewport ) }`, () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/container' ).asBlock( 'containerBlock', { isStatic: true } )

		cy.openInspector( 'ugb/container', 'Advanced' )

		assertAdvancedTab( '.ugb-container', {
			viewport,
			disableColumnVerticalAlign: true,
			customCssSelectors: [
				'.ugb-container__content-wrapper',
			],
		} )

		// Add more block specific tests.
		cy.assertFrontendStyles( '@containerBlock' )
	} )
}
