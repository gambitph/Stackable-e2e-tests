/**
 * External dependencies
 */
import { range } from 'lodash'
import { blocks } from '~stackable-e2e/config'
import {
	assertBlockExist, blockErrorTest, switchLayouts, registerTests, assertAligns, assertBlockTitleDescription, assertBlockBackground, assertSeparators, responsiveAssertHelper,
} from '~stackable-e2e/helpers'
import config from 'root/cypress.json'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )
const [ desktopColumnStyle, tabletColumnStyle, mobileColumnStyle ] = responsiveAssertHelper( columnStyleTab )

describe( 'Advanced Columns and Grid Block', registerTests( [
	blockExist,
	blockError,
	innerBlocks,
	switchLayout,
	desktopStyle,
	tabletStyle,
	mobileStyle,
	desktopColumnStyle,
	tabletColumnStyle,
	mobileColumnStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/columns', '.ugb-columns' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/columns' ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks inside Advanced Columns and Grid', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/columns' )

		blocks
			.filter( blockName => blockName !== 'ugb/columns' )
			.forEach( blockName => cy.appendBlock( blockName ) )
	} )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/columns', [
		{ value: 'Grid', selector: '.ugb-columns--design-grid' },
		{ value: 'Plain', selector: '.ugb-columns--design-plain' },
		{ value: 'Uneven', selector: '.ugb-columns--design-uneven' },
		{ value: 'Uneven 2', selector: '.ugb-columns--design-uneven-2' },
		{ value: 'Tiled', selector: '.ugb-columns--design-tiled' },
	] ) )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/columns' )
	cy.openInspector( 'ugb/columns', 'Style' )

	cy.collapse( 'General' )

	desktopOnly( () => {
		range( 2, 7 ).forEach( idx => {
			cy.adjust( 'Columns', idx )
			cy
				.get( '.ugb-columns' )
				.find( '.ugb-column' )
				.should( 'have.length', idx )
		} )
		// TODO: Column Arrangement
	} )

	const desktopTabletViewports = [ 'Desktop', 'Tablet' ]
	if ( desktopTabletViewports.some( _viewport => _viewport === viewport ) ) {
		cy.adjust( 'Columns', 2 )
		cy.adjust( 'Column Widths', { value: '2-2' }, { viewport } ).assertComputedStyle( {
			[ `.ugb-columns__item` ]: {
				[ `grid-template-columns` ]: '1.34fr 0.66fr',
			},
		}, {
			assertFrontend: false,
		} )
	}

	cy.adjust( 'Column Gap', 115, { viewport } ).assertComputedStyle( {
		[ `.ugb-columns__item` ]: {
			[ `grid-column-gap` ]: '115px',
		},
	} )

	cy.adjust( 'Height', 'half', { viewport } ).assertComputedStyle( {
		[ `.ugb-columns__item` ]: {
			[ `min-height` ]: `${ config.viewportHeight / 2 }px`,
		},
	} )

	cy.adjust( 'Height', 'full', { viewport } ).assertComputedStyle( {
		[ `.ugb-columns__item` ]: {
			[ `min-height` ]: `${ config.viewportHeight }px`,
		},
	} )

	cy.adjust( 'Height', 'custom', { viewport } )
	cy.adjust( 'Custom Height', 220, { viewport, unit: 'px' } ).assertComputedStyle( {
		[ `.ugb-columns__item` ]: {
			[ `min-height` ]: '220px',
		},
	} )
	cy.adjust( 'Height', 'custom', { viewport } )
	cy.adjust( 'Custom Height', 31, { viewport, unit: 'vh' } ).assertComputedStyle( {
		[ `.ugb-columns__item` ]: {
			[ `min-height` ]: '31vh',
		},
	} )

	cy.adjust( 'Column Vertical Align', 'center', { viewport } ).assertComputedStyle( {
		[ `.ugb-column` ]: {
			[ `align-items` ]: 'center',
		},
	} )

	assertAligns( 'Align', '.ugb-inner-block', { viewport } )

	desktopOnly( () => {
		// Add a ugb/card block inside the first column
		cy.addInnerBlock( 'ugb/card' )
		cy.openInspector( 'ugb/card', 'Style' )
		cy.collapse( 'General' )
		cy.adjust( 'Columns', 1 )
		cy.collapse( 'Button' )
		cy.adjust( 'Button Design', {
			label: 'Link',
			value: 'link',
		} )
		// Set the text colors in ugb/columns
		cy.openInspector( 'ugb/columns', 'Style' )
		cy.collapse( 'Text Colors' )
		cy.adjust( 'Heading Color', '#8e8ee0' )
		cy.adjust( 'Text Color', '#24b267' )
		cy.adjust( 'Link Color', '#642c2c' )
		cy.adjust( 'Link Hover Color', '#ba89df' )
		// Assert the text colors in ugb/card
		cy.selectBlock( 'ugb/card' ).assertComputedStyle( {
			'.ugb-card__title': {
				[ `color` ]: '#8e8ee0',
			},
			'.ugb-card__subtitle': {
				[ `color` ]: '#24b267',
			},
			'.ugb-card__description': {
				[ `color` ]: '#24b267',
			},
			'.ugb-button': {
				[ `color` ]: '#642c2c',
			},
		} )
		// Go back to ugb/columns
		cy.selectBlock( 'ugb/columns' )
	} )

	assertBlockTitleDescription( { viewport } )
	assertBlockBackground( '.ugb-columns', { viewport } )
	assertSeparators( { viewport } )
}

function columnStyleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/columns' )
	cy.openInspector( 'ugb/column', 'Style', 0 )

	cy.collapse( 'General' )
	const aligns = [ 'flex-start', 'center', 'flex-end' ]
	aligns.forEach( align => {
		cy.openInspector( 'ugb/column', 'Style', 0 )
		cy.adjust( 'Content Vertical Align', align, { viewport } ).assertComputedStyle( {
			'.ugb-column__item': {
				[ `justify-content` ]: align,
			},
		} )
	} )

	cy.openInspector( 'ugb/column', 'Style', 0 )
	cy.adjust( 'Content Width', 94, { viewport, unit: '%' } ).assertComputedStyle( {
		'.ugb-column__content-wrapper': {
			[ `width` ]: '94%',
		},
	} )
	cy.openInspector( 'ugb/column', 'Style', 0 )
	cy.adjust( 'Content Width', 269, { viewport, unit: 'px' } ).assertComputedStyle( {
		'.ugb-column__content-wrapper': {
			[ `width` ]: '269px',
		},
	} )
	const textAligns = [ 'left', 'center', 'right' ]
	textAligns.forEach( align => {
		cy.openInspector( 'ugb/column', 'Style', 0 )
		cy.adjust( 'Align', align, { viewport } ).assertComputedStyle( {
			'.ugb-inner-block': {
				[ `text-align` ]: align,
			},
		} )
	} )

	cy.selectBlock( 'ugb/column', 0 )
	cy.collapse( 'Spacing' )
	cy.adjust( 'Paddings', 20, { viewport, unit: 'px' } ).assertComputedStyle( {
		'.ugb-column__item': {
			[ `padding-top` ]: '20px',
			[ `padding-bottom` ]: '20px',
			[ `padding-right` ]: '20px',
			[ `padding-left` ]: '20px',
		},
	} )
	cy.selectBlock( 'ugb/column', 0 )
	cy.collapse( 'Spacing' )
	cy.adjust( 'Paddings', 5, { viewport, unit: 'em' } ).assertComputedStyle( {
		'.ugb-column__item': {
			[ `padding-top` ]: '5em',
			[ `padding-bottom` ]: '5em',
			[ `padding-right` ]: '5em',
			[ `padding-left` ]: '5em',
		},
	} )
	cy.selectBlock( 'ugb/column', 0 )
	cy.collapse( 'Spacing' )
	cy.adjust( 'Paddings', 10, { viewport, unit: '%' } ).assertComputedStyle( {
		'.ugb-column__item': {
			[ `padding-top` ]: '10%',
			[ `padding-bottom` ]: '10%',
			[ `padding-right` ]: '10%',
			[ `padding-left` ]: '10%',
		},
	} )

	desktopOnly( () => {
		// Add a ugb/card block inside the first column
		cy.addInnerBlock( 'ugb/card' )
		cy.openInspector( 'ugb/card', 'Style', 0 )
		cy.collapse( 'General' )
		cy.adjust( 'Columns', 1 )
		cy.collapse( 'Button' )
		cy.adjust( 'Button Design', {
			label: 'Link',
			value: 'link',
		} )
		// Set the text colors in ugb/column
		cy.openInspector( 'ugb/column', 'Style', 0 )
		cy.collapse( 'Text Colors' )
		cy.adjust( 'Heading Color', '#8e8ee0' )
		cy.adjust( 'Text Color', '#24b267' )
		cy.adjust( 'Link Color', '#642c2c' )
		cy.adjust( 'Link Hover Color', '#ba89df' )
		// Assert the text colors in ugb/card
		cy.selectBlock( 'ugb/card' ).assertComputedStyle( {
			'.ugb-card__title': {
				[ `color` ]: '#8e8ee0',
			},
			'.ugb-card__subtitle': {
				[ `color` ]: '#24b267',
			},
			'.ugb-card__description': {
				[ `color` ]: '#24b267',
			},
			'.ugb-button': {
				[ `color` ]: '#642c2c',
			},
		} )
		// Go back to ugb/column
		cy.selectBlock( 'ugb/column', 0 )
	} )
}
