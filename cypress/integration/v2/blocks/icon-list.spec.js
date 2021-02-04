/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, registerTests, responsiveAssertHelper, assertAligns, assertBlockTitleDescription, assertBlockBackground, assertSeparators,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )

describe( 'Icon List Block', registerTests( [
	blockExist,
	blockError,
	switchDesign,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/icon-list', '.ugb-icon-list' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/icon-list' ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/icon-list', [
		'Angled Icon List',
		'Arch Icon List',
		'Aspire Icon List',
		'Aspire Icon List 2',
		'Aurora Icon List',
		'Capital Icon List',
		'Dare Icon List',
		'Devour Icon List',
		'Dustin Icon List',
		'Elevate Icon List',
		'Flex Icon List',
		'Glow Icon List',
		'Heights Icon List 1',
		'Heights Icon List 2',
		'Lume Icon List',
		'Lush Icon List',
		'Prime Icon List',
		'Proact Icon List 1',
		'Proact Icon List 2',
		'Propel Icon List',
		'Seren Icon List',
		'Speck Icon List',
		'Yule Icon List',
	] ) )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()

	cy.addBlock( 'ugb/icon-list' )

	cy.openInspector( 'ugb/icon-list', 'Style' )
	cy.collapse( 'General' )
	cy.adjust( 'Columns', 4, { viewport } ).assertComputedStyle( {
		'.ugb-icon-list ul': {
			[ `columns` ]: 'auto 4',
		},
	}, { wait: 300 } )
	desktopOnly( () => {
		cy.adjust( 'Display as a grid (left to right & evenly spaced)', true )
	} )
	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	desktopOnly( () => {
		cy.collapse( 'Spacing' )
		cy.adjust( 'List Gap', 25 ).assertComputedStyle( {
			'ul li': {
				[ `margin-bottom` ]: '25px',
			},
		} )
	} )

	cy.collapse( 'Icon' )
	cy.waitFA()
	cy.adjust( 'Icon', 'info' )
	desktopOnly( () => {
		cy.adjust( 'Icon Color', '#538fa9' )
	} )
	cy.adjust( 'Icon Size', 23, { viewport } ).assertComputedStyle( {
		'li:before': {
			[ `width` ]: '23px',
			[ `height` ]: '23px',
		},
	} )
	desktopOnly( () => {
		cy.adjust( 'Icon Opacity', 0.6 )
		cy.adjust( 'Icon Rotation', 128 ).assertComputedStyle( {
			'li:before': {
				[ `opacity` ]: '0.6',
				[ `transform` ]: 'matrix(-0.615661, 0.788011, -0.788011, -0.615661, 0, 0)',
			},
		} )
	} )

	cy.collapse( 'List Text' )
	cy.adjust( 'Typography', {
		[ `Size` ]: {
			viewport,
			value: 50,
		},
		[ `Line-Height` ]: {
			viewport,
			unit: 'em',
			value: 4,
		},
	} ).assertComputedStyle( {
		li: {
			[ `font-size` ]: '50px',
			[ `line-height` ]: '4em',
		},
	}, { wait: 300 } )

	cy.adjust( 'Typography', {
		[ `Size` ]: {
			viewport,
			unit: 'em',
			value: 7,
		},
		[ `Line-Height` ]: {
			viewport,
			unit: 'px',
			value: 24,
		},
	} ).assertComputedStyle( {
		li: {
			[ `font-size` ]: '7em',
			[ `line-height` ]: '24px',
		},
	}, { wait: 300 } )

	desktopOnly( () => {
		cy.adjust( 'Typography', {
			[ `Weight` ]: '700',
			[ `Transform` ]: 'lowercase',
			[ `Letter Spacing` ]: 2.9,
		} ).assertComputedStyle( {
			li: {
				[ `font-weight` ]: '700',
				[ `text-transform` ]: 'lowercase',
				[ `letter-spacing` ]: '2.9px',
			},
		} )

		cy.adjust( 'Color', '#742f2f' ).assertComputedStyle( {
			li: {
				[ `color` ]: '#742f2f',
			},
		}, { wait: 300 } )
	} )

	assertBlockTitleDescription( { viewport } )
	assertBlockBackground( '.ugb-icon-list', { viewport } )
	assertSeparators( { viewport } )
}
