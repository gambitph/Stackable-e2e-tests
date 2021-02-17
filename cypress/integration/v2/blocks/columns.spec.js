/**
 * External dependencies
 */
import { range } from 'lodash'
import { blocks } from '~stackable-e2e/config'
import {
	assertBlockExist, blockErrorTest, switchLayouts, registerTests,
} from '~stackable-e2e/helpers'
import config from 'root/cypress.json'

describe( 'Advanced Columns and Grid Block', registerTests( [
	blockExist,
	blockError,
	innerBlocks,
	switchLayout,
	desktopStyle,
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

function desktopStyle() {
	it( 'should adjust desktop options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/columns' )

		cy.openInspector( 'ugb/columns', 'Style' )
		cy.collapse( 'General' )
		range( 2, 7 ).forEach( idx => {
			cy.adjust( 'Columns', idx )
			cy
				.get( '.ugb-columns' )
				.find( '.ugb-column' )
				.should( 'have.length', idx )
		} )

		// TODO: Column Arrangement

		cy.adjust( 'Columns', 2 )
		cy.adjust( 'Column Widths', [ 20 ] ).assertComputedStyle( {
			[ `.ugb-columns__item` ]: {
				[ `grid-template-columns` ]: '0.4fr 1fr',
			},
		}, {
			assertFrontend: false,
		} )

		cy.adjust( 'Column Gap', 115 ).assertComputedStyle( {
			[ `.ugb-columns__item` ]: {
				[ `grid-column-gap` ]: '115px',
			},
		} )

		cy.adjust( 'Height', 'half' ).assertComputedStyle( {
			[ `.ugb-columns__item` ]: {
				[ `min-height` ]: `${ config.viewportHeight / 2 }px`,
			},
		} )

		cy.adjust( 'Height', 'full' ).assertComputedStyle( {
			[ `.ugb-columns__item` ]: {
				[ `min-height` ]: `${ config.viewportHeight }px`,
			},
		} )

		cy.adjust( 'Height', 'custom' )
		cy.adjust( 'Custom Height', 220 ).assertComputedStyle( {
			[ `.ugb-columns__item` ]: {
				[ `min-height` ]: '220px',
			},
		} )

		cy.adjust( 'Column Vertical Align', 'center' ).assertComputedStyle( {
			[ `.ugb-column` ]: {
				[ `justify-content` ]: 'center',
			},
		} )

		cy.toggleStyle( 'Block Title' )
		cy.collapse( 'Block Title' )
		cy.adjust( 'Title HTML Tag', 'h5' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Monospace',
			[ `Size` ]: 75,
			[ `Weight` ]: 600,
			[ `Transform` ]: 'uppercase',
			[ `Line-Height` ]: 1.9,
			[ `Letter Spacing` ]: 7.1,
		} )
	} )
}
