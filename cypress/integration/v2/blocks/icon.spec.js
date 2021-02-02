
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, assertAligns, assertBlockTitleDescription, assertBlockBackground, assertSeparators, registerTests,
} from '~stackable-e2e/helpers'

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

function desktopStyle() {
	it( 'should adjust desktop options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/icon' )
		cy.waitFA()

		cy.openInspector( 'ugb/icon', 'Style' )

		// Test General options
		cy.collapse( 'General' )
		cy.adjust( 'Number of Icons / Columns', 4 )
		cy.changeIcon( 'ugb/icon', undefined, 1, 'info' )
		cy.changeIcon( 'ugb/icon', undefined, 2, 'info' )
		cy.changeIcon( 'ugb/icon', undefined, 3, 'info' )
		cy.changeIcon( 'ugb/icon', undefined, 4, 'info' )
		cy.get( '.ugb-icon__item4' ).should( 'exist' )

		assertAligns( 'Align', '.ugb-inner-block' )

		// Test Title options
		cy.collapse( 'Title' )
		cy.toggleStyle( 'Title' )
		cy.adjust( 'Title on Top', true )
		cy.typeBlock( 'ugb/icon', '.ugb-icon__item1 .ugb-icon__title', 'Title 1' )
		cy.typeBlock( 'ugb/icon', '.ugb-icon__item2 .ugb-icon__title', 'Title 2' )
		cy.typeBlock( 'ugb/icon', '.ugb-icon__item3 .ugb-icon__title', 'Title 3' )
		cy.typeBlock( 'ugb/icon', '.ugb-icon__item4 .ugb-icon__title', 'Title 4' )
		cy.adjust( 'Title HTML Tag', 'h4' )
			.assertHtmlTag( '.ugb-icon__title', 'h4' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Serif',
			[ `Size` ]: 18,
			[ `Weight` ]: '200',
			[ `Transform` ]: 'lowercase',
			[ `Line-Height` ]: {
				value: 26,
				unit: 'px',
			},
			[ `Letter Spacing` ]: 1.3,
		} )
		cy.adjust( 'Size', 25 )
		cy.adjust( 'Title Color', '#636363' ).assertComputedStyle( {
			'.ugb-icon__title': {
				[ `font-size` ]: '25px',
				[ `font-weight` ]: '200',
				[ `text-transform` ]: 'lowercase',
				[ `letter-spacing` ]: '1.3px',
				[ `color` ]: '#636363',
				[ `line-height` ]: '26px',
			},
		} )
		// Test Title Alignment
		assertAligns( 'Align', '.ugb-icon__title' )

		// Test Icon options
		cy.collapse( 'Icon' )
		cy.adjust( 'Icon Color', '#acacac' ).assertComputedStyle( {
			'.ugb-icon-inner-svg': {
				[ `color` ]: '#acacac',
				[ `fill` ]: '#acacac',
			},
		} )
		cy.adjust( 'Icon Color Type', 'gradient' )
		cy.adjust( 'Icon Color #1', '#f00069' )
		cy.adjust( 'Icon Color #2', '#000000' )
		cy.adjust( 'Gradient Direction (degrees)', 180 )
		cy.adjust( 'Icon Size', 59 ).assertComputedStyle( {
			'.ugb-icon-inner-svg': {
				[ `fill` ]: 'url("#grad-f00069-000000-180")',
				[ `height` ]: '59px',
				[ `width` ]: '59px',
			},
		} )
		cy.adjust( 'Icon Opacity', 0.5 ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `opacity` ]: '0.5',
			},
		} )
		cy.adjust( 'Icon Rotation', 31 )

		// TODO: Add Multicolor test

		cy.adjust( 'Background Shape', true )
		cy.adjust( 'Shape Color', '#bcdeff' )
		cy.adjust( 'Shape Opacity', 0.9 )
		cy.adjust( 'Shape Size', 1.4 )
		cy.adjust( 'Horizontal Offset', 9 )
		cy.adjust( 'Vertical Offset', 8 ).assertComputedStyle( {
			'.ugb-icon__bg-shape': {
				[ `fill` ]: '#bcdeff',
				[ `color` ]: '#bcdeff',
				[ `opacity` ]: '0.9',
			},
		} )
		cy.adjust( 'Align', 'left' ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `align-self` ]: 'flex-start',
			},
		} )
		cy.adjust( 'Align', 'center' ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `align-self` ]: 'center',
			},
		} )
		cy.adjust( 'Align', 'right' ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `align-self` ]: 'flex-end',
			},
		} )

		// Test Effects option
		cy.collapse( 'Effects' )
		cy.adjust( 'Hover Effect', 'lift-more' )
			.assertClassName( '.ugb-icon__item', 'ugb--hover-lift-more' )

		// Test Block Title and Description
		assertBlockTitleDescription()

		// Test Spacing options
		cy.collapse( 'Spacing' )
		cy.adjust( 'Block Title', 30 ).assertComputedStyle( {
			'.ugb-block-title': {
				[ `margin-bottom` ]: '30px',
			},
		} )
		cy.adjust( 'Block Description', 22 ).assertComputedStyle( {
			'.ugb-block-description': {
				[ `margin-bottom` ]: '22px',
			},
		} )
		cy.adjust( 'Paddings', 27 ).assertComputedStyle( {
			'.ugb-icon__content-wrapper': {
				[ `padding-bottom` ]: '27px',
				[ `padding-left` ]: '27px',
				[ `padding-right` ]: '27px',
				[ `padding-top` ]: '27px',
			},
		} )
		cy.adjust( 'Icon', 14 ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `margin-bottom` ]: '14px',
			},
		} )
		cy.adjust( 'Title', 29 ).assertComputedStyle( {
			'.ugb-icon__title': {
				[ `margin-bottom` ]: '29px',
			},
		} )

		// Test Block Background
		assertBlockBackground( { viewport: 'Desktop' } )

		// Test Top and Bottom Separator
		assertSeparators( { viewport: 'Desktop' } )
	} )
}

function tabletStyle() {
	it( 'should adjust tablet options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/icon' )
		cy.waitFA()
		cy.openInspector( 'ugb/icon', 'Style' )

		// Test General options
		cy.collapse( 'General' )
		cy.adjust( 'Number of Icons / Columns', 6 )
		cy.changeIcon( 'ugb/icon', undefined, 1, 'info' )
		cy.changeIcon( 'ugb/icon', undefined, 2, 'info' )
		cy.changeIcon( 'ugb/icon', undefined, 3, 'info' )
		cy.changeIcon( 'ugb/icon', undefined, 4, 'info' )
		cy.changeIcon( 'ugb/icon', undefined, 5, 'info' )
		cy.changeIcon( 'ugb/icon', undefined, 6, 'info' )
		cy.get( '.ugb-icon__item6' ).should( 'exist' )

		assertAligns( 'Align', '.ugb-inner-block', { viewport: 'Tablet' } )

		// Test Title options
		cy.collapse( 'Title' )
		cy.toggleStyle( 'Title' )
		cy.adjust( 'Title on Top', true )
		cy.typeBlock( 'ugb/icon', '.ugb-icon__item1 .ugb-icon__title', 'Title 1' )
		cy.typeBlock( 'ugb/icon', '.ugb-icon__item2 .ugb-icon__title', 'Title 2' )
		cy.typeBlock( 'ugb/icon', '.ugb-icon__item3 .ugb-icon__title', 'Title 3' )
		cy.typeBlock( 'ugb/icon', '.ugb-icon__item4 .ugb-icon__title', 'Title 4' )
		cy.typeBlock( 'ugb/icon', '.ugb-icon__item5 .ugb-icon__title', 'Title 5' )
		cy.typeBlock( 'ugb/icon', '.ugb-icon__item6 .ugb-icon__title', 'Title 6' )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Tablet',
				value: 30,
				unit: 'px',
			},
			[ `Line-Height` ]: {
				viewport: 'Tablet',
				value: 22,
				unit: 'px',
			},
		} )
		cy.adjust( 'Size', 28, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-icon__title': {
				[ `font-size` ]: '28px',
				[ `line-height` ]: '22px',
			},
		} )

		// Test Title Alignment
		assertAligns( 'Align', '.ugb-icon__title', { viewport: 'Tablet' } )

		// Test Icon options
		cy.collapse( 'Icon' )
		cy.adjust( 'Icon Size', 45, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-icon-inner-svg': {
				[ `height` ]: '45px',
				[ `width` ]: '45px',
			},
		} )
		cy.adjust( 'Align', 'left', { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `align-self` ]: 'flex-start',
			},
		} )
		cy.adjust( 'Align', 'center', { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `align-self` ]: 'center',
			},
		} )
		cy.adjust( 'Align', 'right', { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `align-self` ]: 'flex-end',
			},
		} )

		// Test Effects option
		cy.collapse( 'Effects' )
		cy.adjust( 'Hover Effect', 'scale-more' )
			.assertClassName( '.ugb-icon__item', 'ugb--hover-scale-more' )

		// Test Block Title and Description
		assertBlockTitleDescription( { viewport: 'Tablet' } )

		// Test Spacing options
		cy.collapse( 'Spacing' )
		cy.adjust( 'Block Title', 25, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-block-title': {
				[ `margin-bottom` ]: '25px',
			},
		} )
		cy.adjust( 'Block Description', 35, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-block-description': {
				[ `margin-bottom` ]: '35px',
			},
		} )
		cy.adjust( 'Paddings', 20, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-icon__content-wrapper': {
				[ `padding-bottom` ]: '20px',
				[ `padding-left` ]: '20px',
				[ `padding-right` ]: '20px',
				[ `padding-top` ]: '20px',
			},
		} )
		cy.adjust( 'Icon', 24, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `margin-bottom` ]: '24px',
			},
		} )
		cy.adjust( 'Title', 15, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-icon__title': {
				[ `margin-bottom` ]: '15px',
			},
		} )

		// Test Block Background
		assertBlockBackground( '.ugb-icon', { viewport: 'Tablet' } )

		// Test Top and Bottom Separator
		assertSeparators( { viewport: 'Tablet' } )
	} )
}

function mobileStyle() {
	it( 'should adjust mobile options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/icon' )
		cy.waitFA()
		cy.openInspector( 'ugb/icon', 'Style' )

		// Test General options
		cy.collapse( 'General' )
		cy.adjust( 'Number of Icons / Columns', 4 )
		cy.changeIcon( 'ugb/icon', undefined, 1, 'info' )
		cy.changeIcon( 'ugb/icon', undefined, 2, 'info' )
		cy.changeIcon( 'ugb/icon', undefined, 3, 'info' )
		cy.changeIcon( 'ugb/icon', undefined, 4, 'info' )
		cy.get( '.ugb-icon__item4' ).should( 'exist' )

		assertAligns( 'Align', '.ugb-inner-block', { viewport: 'Mobile' } )

		// Test Title options
		cy.collapse( 'Title' )
		cy.toggleStyle( 'Title' )
		cy.adjust( 'Title on Top', true )
		cy.typeBlock( 'ugb/icon', '.ugb-icon__item1 .ugb-icon__title', 'Title 1' )
		cy.typeBlock( 'ugb/icon', '.ugb-icon__item2 .ugb-icon__title', 'Title 2' )
		cy.typeBlock( 'ugb/icon', '.ugb-icon__item3 .ugb-icon__title', 'Title 3' )
		cy.typeBlock( 'ugb/icon', '.ugb-icon__item4 .ugb-icon__title', 'Title 4' )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport: 'Mobile',
				value: 30,
				unit: 'px',
			},
			[ `Line-Height` ]: {
				viewport: 'Mobile',
				value: 22,
				unit: 'px',
			},
		} )
		cy.adjust( 'Size', 28, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-icon__title': {
				[ `font-size` ]: '28px',
				[ `line-height` ]: '22px',
			},
		} )

		// Test Title Alignment
		assertAligns( 'Align', '.ugb-icon__title', { viewport: 'Mobile' } )

		// Test Icon options
		cy.collapse( 'Icon' )
		cy.adjust( 'Icon Size', 58, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-icon-inner-svg': {
				[ `height` ]: '58px',
				[ `width` ]: '58px',
			},
		} )
		cy.adjust( 'Align', 'left', { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `align-self` ]: 'flex-start',
			},
		} )
		cy.adjust( 'Align', 'center', { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `align-self` ]: 'center',
			},
		} )
		cy.adjust( 'Align', 'right', { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `align-self` ]: 'flex-end',
			},
		} )

		// Test Effects option
		cy.collapse( 'Effects' )
		cy.adjust( 'Hover Effect', 'lift' )
			.assertClassName( '.ugb-icon__item', 'ugb--hover-lift' )

		// Test Block Title and Description
		assertBlockTitleDescription( { viewport: 'Mobile' } )

		// Test Spacing options
		cy.collapse( 'Spacing' )
		cy.adjust( 'Block Title', 25, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-block-title': {
				[ `margin-bottom` ]: '25px',
			},
		} )
		cy.adjust( 'Block Description', 35, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-block-description': {
				[ `margin-bottom` ]: '35px',
			},
		} )
		cy.adjust( 'Paddings', 20, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-icon__content-wrapper': {
				[ `padding-bottom` ]: '20px',
				[ `padding-left` ]: '20px',
				[ `padding-right` ]: '20px',
				[ `padding-top` ]: '20px',
			},
		} )
		cy.adjust( 'Icon', 24, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-icon__icon': {
				[ `margin-bottom` ]: '24px',
			},
		} )
		cy.adjust( 'Title', 15, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-icon__title': {
				[ `margin-bottom` ]: '15px',
			},
		} )

		// Test Block Background.
		assertBlockBackground( { viewport: 'Mobile' } )

		// Test Top and Bottom Separator.
		assertSeparators( { viewport: 'Mobile' } )
	} )
}

