
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, assertAligns, registerTests, responsiveAssertHelper, assertTypography, assertAdvancedTab,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

describe( 'Advanced Heading Block', registerTests( [
	blockExist,
	blockError,
	typeContent,
	desktopStyle,
	tabletStyle,
	mobileStyle,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
] ) )

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
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/heading' ).asBlock( 'headingBlock', { isStatic: true } )
	cy.openInspector( 'ugb/heading', 'Style' )

	// Test General Alignment

	cy.collapse( 'General' )
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	// Test Title Options

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

	// Test Subtitle options

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

	// Test Top Line options

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

	// Test Top Line Alignment

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

	// Test Bottom Line options

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

	// Test Bottom Line Alignment

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
		'.ugb-heading__top-line': {
			'margin-right': '0px',
			'margin-left': 'auto',
		},
	} )

	// Test Spacing options

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
	cy.assertFrontendStyles( '@headingBlock' )
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
