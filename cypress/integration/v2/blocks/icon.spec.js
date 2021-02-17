
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, assertAligns, assertBlockTitleDescription, assertBlockBackground, assertSeparators, registerTests, responsiveAssertHelper, assertTypography,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )

describe( 'Icon Block', registerTests( [
	blockExist,
	blockError,
	switchDesign,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/icon', '.ugb-icon' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/icon' ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/icon', [
		'Cary Icon',
		'Elevate Icon',
		'Hue Icon',
		'Lume Icon',
	] ) )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/icon' )

	cy.openInspector( 'ugb/icon', 'Style' )

	// Test General options
	cy.collapse( 'General' )
	cy.waitFA()
	cy.adjust( 'Number of Icons / Columns', 4 )
	cy.get( '.ugb-icon__item4' ).should( 'exist' )
	cy.changeIcon( 1, 'info' )
	cy.changeIcon( 2, 'info' )
	cy.changeIcon( 3, 'info' )
	cy.changeIcon( 4, 'info' )

	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	// Test Title options
	cy.collapse( 'Title' )
	cy.toggleStyle( 'Title' )
	cy.typeBlock( 'ugb/icon', '.ugb-icon__item1 .ugb-icon__title', 'Title 1' )
	cy.typeBlock( 'ugb/icon', '.ugb-icon__item2 .ugb-icon__title', 'Title 2' )
	cy.typeBlock( 'ugb/icon', '.ugb-icon__item3 .ugb-icon__title', 'Title 3' )
	cy.typeBlock( 'ugb/icon', '.ugb-icon__item4 .ugb-icon__title', 'Title 4' )

	cy.adjust( 'Title on Top', true )
	desktopOnly( () => {
		cy.adjust( 'Title HTML Tag', 'h4' )
			.assertHtmlTag( '.ugb-icon__title', 'h4' )
		cy.adjust( 'Title Color', '#742f2f' ).assertComputedStyle( {
			'.ugb-icon__title': {
				'color': '#742f2f',
			},
		} )
	} )
	assertTypography( '.ugb-icon__title', { viewport } )
	assertAligns( 'Align', '.ugb-icon__title', { viewport } )

	// Test Icon options
	cy.collapse( 'Icon' )
	desktopOnly( () => {
		cy.adjust( 'Icon Color', '#acacac' ).assertComputedStyle( {
			'.ugb-icon-inner-svg': {
				'color': '#acacac',
				'fill': '#acacac',
			},
		} )
		cy.adjust( 'Icon Color Type', 'gradient' )
		cy.adjust( 'Icon Color #1', '#f00069' )
		cy.adjust( 'Icon Color #2', '#000000' )
		cy.adjust( 'Gradient Direction (degrees)', 180 )
		cy.adjust( 'Icon Opacity', 0.5 )
		cy.adjust( 'Icon Rotation', 31 ).assertComputedStyle( {
			'.ugb-icon__icon': {
				'opacity': '0.5',
			},
			'.ugb-icon-inner-svg': {
				'fill': 'url("#grad-f00069-000000-180")',
				'transform': 'matrix(0.857167, 0.515038, -0.515038, 0.857167, 0, 0)',
			},
		} )
	} )

	cy.adjust( 'Icon Size', 23, { viewport } ).assertComputedStyle( {
		'.ugb-icon-inner-svg': {
			'height': '23px',
			'width': '23px',
		},
	} )

	// TODO: Add Multicolor test

	desktopOnly( () => {
		cy.adjust( 'Background Shape', true )
		cy.adjust( 'Shape', { label: 'Circle', value: 'circle' } )
		cy.adjust( 'Shape Color', '#bcdeff' )
		cy.adjust( 'Shape Opacity', 0.9 )
		cy.adjust( 'Shape Size', 1.4 )
		cy.adjust( 'Horizontal Offset', 9 )
		cy.adjust( 'Vertical Offset', 8 ).assertComputedStyle( {
			'.ugb-icon__bg-shape': {
				'fill': '#bcdeff',
				'color': '#bcdeff',
				'opacity': '0.9',
			},
		} )
	} )
	cy.adjust( 'Align', 'left', { viewport } ).assertComputedStyle( {
		'.ugb-icon__icon': {
			'align-self': 'flex-start',
		},
	} )
	cy.adjust( 'Align', 'center', { viewport } ).assertComputedStyle( {
		'.ugb-icon__icon': {
			'align-self': 'center',
		},
	} )
	cy.adjust( 'Align', 'right', { viewport } ).assertComputedStyle( {
		'.ugb-icon__icon': {
			'align-self': 'flex-end',
		},
	} )

	// Test Effects option
	desktopOnly( () => {
		cy.collapse( 'Effects' )
		const effects = [
			'lift',
			'lift-more',
			'scale',
			'scale-more',
			'lower',
			'lower-more',
		]
		effects.forEach( effect => {
			cy.adjust( 'Hover Effect', effect )
				.assertClassName( '.ugb-icon__item', `ugb--hover-${ effect }` )
		} )
	} )

	// Test Spacing options
	cy.collapse( 'Spacing' )
	cy.adjust( 'Paddings', 27, { viewport } ).assertComputedStyle( {
		'.ugb-icon__content-wrapper': {
			'padding-bottom': '27px',
			'padding-left': '27px',
			'padding-right': '27px',
			'padding-top': '27px',
		},
	} )
	cy.adjust( 'Paddings', 3, { unit: 'em', viewport } ).assertComputedStyle( {
		'.ugb-icon__content-wrapper': {
			'padding-bottom': '3em',
			'padding-left': '3em',
			'padding-right': '3em',
			'padding-top': '3em',
		},
	} )
	cy.adjust( 'Paddings', 12, { unit: '%', viewport } ).assertComputedStyle( {
		'.ugb-icon__content-wrapper': {
			'padding-bottom': '12%',
			'padding-left': '12%',
			'padding-right': '12%',
			'padding-top': '12%',
		},
	} )
	cy.adjust( 'Icon', 14, { viewport } ).assertComputedStyle( {
		'.ugb-icon__icon': {
			'margin-bottom': '14px',
		},
	} )
	cy.adjust( 'Title', 29, { viewport } ).assertComputedStyle( {
		'.ugb-icon__title': {
			'margin-bottom': '29px',
		},
	} )

	// Test Block Title and Description
	assertBlockTitleDescription( { viewport } )

	// Test Block Background
	assertBlockBackground( '.ugb-icon', { viewport } )

	// Test Top and Bottom Separator
	assertSeparators( { viewport } )
}

