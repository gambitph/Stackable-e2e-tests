
/**
 * External dependencies
 */
import { lowerCase } from 'lodash'
import {
	assertBlockExist, blockErrorTest, assertAligns, responsiveAssertHelper, assertTypography, assertAdvancedTab,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

export {
	blockExist,
	blockError,
	typeContent,
	desktopStyle,
	tabletStyle,
	mobileStyle,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/heading', '.ugb-heading' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/heading' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/heading' ).asBlock( 'headingBlock', { isStatic: true } )

		cy.typeBlock( 'ugb/heading', '.ugb-heading__title', 'Hello World! 1' )
			.assertBlockContent( '.ugb-heading__title', 'Hello World! 1' )
		cy.typeBlock( 'ugb/heading', '.ugb-heading__subtitle', 'Helloo World!! 12' )
			.assertBlockContent( '.ugb-heading__subtitle', 'Helloo World!! 12' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/heading' ).asBlock( 'headingBlock', { isStatic: true } )
		cy.openInspector( 'ugb/heading', 'Style' )
		cy.typeBlock( 'ugb/heading', '.ugb-heading__title', 'Hello World! 1' )
		cy.typeBlock( 'ugb/heading', '.ugb-heading__subtitle', 'Helloo World!! 12' )
	} )

	// eslint-disable-next-line no-undef
	afterEach( () => cy.assertFrontendStyles( '@headingBlock' ) )

	it( `should assert General options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'General' )
		assertAligns( 'Align', '.ugb-inner-block', { viewport } )
	} )

	it( `should assert Title options in ${ lowerCase( viewport ) }`, () => {
		cy.typeBlock( 'ugb/heading', '.ugb-heading__title', 'Title here' )
		cy.collapse( 'Title' )
		desktopOnly( () => {
			cy.adjust( 'Title HTML Tag', 'h4' )
				.assertHtmlTag( '.ugb-heading__title', 'h4' )
			cy.adjust( 'Title Color', '#742f2f' ).assertComputedStyle( {
				'.ugb-heading__title': {
					'color': '#742f2f',
				},
			} )
		} )
		assertTypography( '.ugb-heading__title', { viewport } )
		assertAligns( 'Align', '.ugb-heading__title', { viewport } )
	} )

	it( `should assert Subtitle options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Subtitle' )
		cy.typeBlock( 'ugb/heading', '.ugb-heading__subtitle', 'Subtitle here' )
		desktopOnly( () => {
			cy.adjust( 'Subtitle Color', '#742f2f' ).assertComputedStyle( {
				'.ugb-heading__subtitle': {
					'color': '#742f2f',
				},
			} )
		} )
		assertTypography( '.ugb-heading__subtitle', { viewport } )
		assertAligns( 'Align', '.ugb-heading__subtitle', { viewport } )
	} )

	it( `should assert Top Line options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Top Line' )
		cy.toggleStyle( 'Top Line' )
		desktopOnly( () => {
			cy.adjust( 'Line Color', '#000000' )
			cy.adjust( 'Width', 390, { unit: 'px' } )
			cy.adjust( 'Height', 11 ).assertComputedStyle( {
				'.ugb-heading__top-line': {
					'background-color': '#000000',
					'height': '11px',
					'width': '390px',
				},
			} )
		} )
		cy.adjust( 'Align', 'left', { viewport } ).assertComputedStyle( {
			'.ugb-heading__top-line': {
				'margin-left': '0px',
				'margin-right': 'auto',
			},
		} )
		cy.adjust( 'Align', 'center', { viewport } ).assertComputedStyle( {
			'.ugb-heading__top-line': {
				'margin-left': 'auto',
				'margin-right': 'auto',
			},
		} )
		cy.adjust( 'Align', 'right', { viewport } ).assertComputedStyle( {
			'.ugb-heading__top-line': {
				'margin-right': '0px',
				'margin-left': 'auto',
			},
		} )
	} )

	it( `should assert Bottom Line options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Bottom Line' )
		cy.toggleStyle( 'Bottom Line' )
		desktopOnly( () => {
			cy.adjust( 'Line Color', '#000000' )
			cy.adjust( 'Width', 300, { unit: 'px' } )
			cy.adjust( 'Height', 11 ).assertComputedStyle( {
				'.ugb-heading__bottom-line': {
					'background-color': '#000000',
					'height': '11px',
					'width': '300px',
				},
			} )
		} )
		cy.adjust( 'Align', 'left', { viewport } ).assertComputedStyle( {
			'.ugb-heading__bottom-line': {
				'margin-left': '0px',
				'margin-right': 'auto',
			},
		} )
		cy.adjust( 'Align', 'center', { viewport } ).assertComputedStyle( {
			'.ugb-heading__bottom-line': {
				'margin-left': 'auto',
				'margin-right': 'auto',
			},
		} )
		cy.adjust( 'Align', 'right', { viewport } ).assertComputedStyle( {
			'.ugb-heading__bottom-line': {
				'margin-right': '0px',
				'margin-left': 'auto',
			},
		} )
	} )

	it( `should assert Spacing options in ${ lowerCase( viewport ) }`, () => {
		cy.toggleStyle( 'Top Line' )
		cy.toggleStyle( 'Bottom Line' )
		cy.collapse( 'Spacing' )
		cy.adjust( 'Top Line', 36, { viewport } ).assertComputedStyle( {
			'.ugb-heading__top-line': {
				'margin-bottom': '36px',
			},
		} )
		cy.adjust( 'Title', 40, { viewport } ).assertComputedStyle( {
			'.ugb-heading__title': {
				'margin-bottom': '40px',
			},
		} )
		cy.adjust( 'Subtitle', 25, { viewport } ).assertComputedStyle( {
			'.ugb-heading__subtitle': {
				'margin-bottom': '25px',
			},
		} )
		cy.adjust( 'Bottom Line', 12, { viewport } ).assertComputedStyle( {
			'.ugb-heading__bottom-line': {
				'margin-bottom': '12px',
			},
		} )
	} )
}

function advancedTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/heading' ).asBlock( 'headingBlock', { isStatic: true } )

	cy.typeBlock( 'ugb/heading', '.ugb-heading__title', 'Title here' )
	cy.typeBlock( 'ugb/heading', '.ugb-heading__subtitle', 'Subtitle here' )
	cy.openInspector( 'ugb/heading', 'Advanced' )

	assertAdvancedTab( '.ugb-heading', {
		viewport,
		customCssSelectors: [
			'.ugb-heading__title',
			'.ugb-heading__subtitle',
		],
	} )

	// Add more block specific tests.
	cy.assertFrontendStyles( '@headingBlock' )
}
