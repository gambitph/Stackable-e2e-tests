
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, assertAligns, registerTests, responsiveAssertHelper, assertTypography,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )

describe( 'Advanced Heading Block', registerTests( [
	blockExist,
	blockError,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/heading', '.ugb-heading' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/heading' ) )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/heading' )
	cy.openInspector( 'ugb/heading', 'Style' )

	// Test General Alignment

	cy.collapse( 'General' )
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	// Test Title Options

	cy.collapse( 'Title' )
	desktopOnly( () => {
		cy.adjust( 'Title HTML Tag', 'h4' )
			.assertHtmlTag( '.ugb-heading__title', 'h4' )
		cy.adjust( 'Title Color', '#742f2f' ).assertComputedStyle( {
			'.ugb-heading__title': {
				[ `color` ]: '#742f2f',
			},
		} )
	} )
	assertTypography( '.ugb-heading__title', viewport )
	assertAligns( 'Align', '.ugb-heading__title', { viewport } )

	// Test Subtitle options

	cy.collapse( 'Subtitle' )
	cy.toggleStyle( 'Subtitle' )
	desktopOnly( () => {
		cy.adjust( 'Subtitle Color', '#742f2f' ).assertComputedStyle( {
			'.ugb-heading__subtitle': {
				[ `color` ]: '#742f2f',
			},
		} )
	} )
	assertTypography( '.ugb-heading__subtitle', viewport )
	assertAligns( 'Align', '.ugb-heading__subtitle', { viewport } )

	// Test Top Line options

	cy.collapse( 'Top Line' )
	cy.toggleStyle( 'Top Line' )
	desktopOnly( () => {
		cy.adjust( 'Line Color', '#000000' )
		cy.adjust( 'Width', 390, { unit: 'px' } )
		cy.adjust( 'Height', 11 ).assertComputedStyle( {
			'.ugb-heading__top-line': {
				[ `background-color` ]: '#000000',
				[ `height` ]: '11px',
				[ `width` ]: '390px',
			},
		} )
	} )

	// Test Top Line Alignment

	cy.adjust( 'Align', 'left', { viewport } ).assertComputedStyle( {
		'.ugb-heading__top-line': {
			[ `margin-left` ]: '0px',
			[ `margin-right` ]: 'auto',
		},
	} )
	cy.adjust( 'Align', 'center', { viewport } ).assertComputedStyle( {
		'.ugb-heading__top-line': {
			[ `margin-left` ]: 'auto',
			[ `margin-right` ]: 'auto',
		},
	} )
	cy.adjust( 'Align', 'right', { viewport } ).assertComputedStyle( {
		'.ugb-heading__top-line': {
			[ `margin-right` ]: '0px',
			[ `margin-left` ]: 'auto',
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
				[ `background-color` ]: '#000000',
				[ `height` ]: '11px',
				[ `width` ]: '300px',
			},
		} )
	} )

	// Test Bottom Line Alignment

	cy.adjust( 'Align', 'left', { viewport } ).assertComputedStyle( {
		'.ugb-heading__bottom-line': {
			[ `margin-left` ]: '0px',
			[ `margin-right` ]: 'auto',
		},
	} )
	cy.adjust( 'Align', 'center', { viewport } ).assertComputedStyle( {
		'.ugb-heading__bottom-line': {
			[ `margin-left` ]: 'auto',
			[ `margin-right` ]: 'auto',
		},
	} )
	cy.adjust( 'Align', 'right', { viewport } ).assertComputedStyle( {
		'.ugb-heading__top-line': {
			[ `margin-right` ]: '0px',
			[ `margin-left` ]: 'auto',
		},
	} )

	// Test Spacing options

	cy.collapse( 'Spacing' )
	cy.adjust( 'Top Line', 36, { viewport } ).assertComputedStyle( {
		'.ugb-heading__top-line': {
			[ `margin-bottom` ]: '36px',
		},
	} )
	cy.adjust( 'Title', 40, { viewport } ).assertComputedStyle( {
		'.ugb-heading__title': {
			[ `margin-bottom` ]: '40px',
		},
	} )
	cy.adjust( 'Subtitle', 25, { viewport } ).assertComputedStyle( {
		'.ugb-heading__subtitle': {
			[ `margin-bottom` ]: '25px',
		},
	} )
	cy.adjust( 'Bottom Line', 12, { viewport } ).assertComputedStyle( {
		'.ugb-heading__bottom-line': {
			[ `margin-bottom` ]: '12px',
		},
	} )
}
