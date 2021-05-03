/**
 * External dependencies
 */
import { range } from 'lodash'
import { registerBlockSnapshots } from '~gutenberg-e2e/plugins'
import {
	responsiveAssertHelper,
	registerTests,
} from '~stackable-e2e/helpers'

const [ desktopGlobal, tabletGlobal, mobileGlobal ] = responsiveAssertHelper( globalTypography )

describe( 'Global Settings', registerTests( [
	globalColors,
	desktopGlobal,
	tabletGlobal,
	mobileGlobal,
] ) )

function globalColors() {
	it( 'should adjust Stackable Global Colors', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/card' ).as( 'cardBlock' )
		const cardBlock = registerBlockSnapshots( 'cardBlock' )

		const colors = [
			{
				name: 'Custom Color Red',
				color: '#ff0000',
			},
			{
				name: 'Aqua',
				color: '#3fcee8',
			},
			{
				name: 'Yellow Sun',
				color: '#f2e374',
			},
			{
				name: 'Stackable Pink',
				color: '#f00069',
			} ]

		// Add Global colors
		colors.forEach( val => {
			cy.addGlobalColor( {
				name: val.name,
				color: val.color,
			} )
		} )
		cy.adjust( 'Use only Stackable colors', true )

		// Check if the Global colors are added in blocks
		cy.openInspector( 'ugb/card', 'Style' )
		cy.collapse( 'Title' )

		colors.forEach( ( val, idx ) => {
			cy
				.get( '.editor-color-palette-control__color-palette' )
				.find( '.components-circular-option-picker__option-wrapper' )
				.eq( idx )
				.find( 'button' )
				.click( { force: true } )

			cy
				.selectBlock( 'ugb/card' )
				.assertComputedStyle( {
					'.ugb-card__title': {
						'color': val.color,
					},
				} )
		} )

		// Delete Global colors
		colors.forEach( val => {
			cy.deleteGlobalColor( val.name )
		} )

		cardBlock.assertFrontendStyles()
	} )
}

function globalTypography( viewport ) {
	it( 'should adjust Stackable Global Typography', () => {
		cy.setupWP()
		cy.newPage()
		range( 1, 7 ).forEach( idx => {
			cy.addBlock( 'ugb/heading' )
			cy.typeBlock( 'ugb/heading', '.ugb-heading__title', `Heading ${ idx }`, idx - 1 )
			cy.typeBlock( 'ugb/heading', '.ugb-heading__subtitle', `This is paragraph ${ idx }`, idx - 1 )
			cy.openInspector( 'ugb/heading', 'Style', `Heading ${ idx }` )
			cy.collapse( 'Title' )
			cy.adjust( 'Title HTML Tag', `h${ idx }` )
		} )

		// Adjust Global Typography settings
		cy.adjustGlobalTypography( 'h1', {
			'Font Family': 'Abel',
			'Size': {
				value: 92,
				unit: 'px',
				viewport,
			},
			'Weight': 'bold',
			'Transform': 'uppercase',
			'Line-Height': {
				value: 1.3,
				unit: 'em',
				viewport,
			},
			'Letter Spacing': 2.1,
		} )

		cy.adjustGlobalTypography( 'h2', {
			'Font Family': 'Aclonica',
			'Size': {
				value: 66,
				unit: 'px',
				viewport,
			},
			'Weight': '900',
			'Transform': 'capitalize',
			'Line-Height': {
				value: 1.2,
				unit: 'em',
				viewport,
			},
			'Letter Spacing': 1.1,
		} )

		cy.adjustGlobalTypography( 'h3', {
			'Font Family': 'ABeeZee',
			'Size': {
				value: 50,
				unit: 'px',
				viewport,
			},
			'Weight': '100',
			'Transform': 'lowercase',
			'Line-Height': {
				value: 1.1,
				unit: 'em',
				viewport,
			},
			'Letter Spacing': 1.5,
		} )

		cy.adjustGlobalTypography( 'h4', {
			'Font Family': 'ABeeZee',
			'Size': {
				value: 38,
				unit: 'px',
				viewport,
			},
			'Weight': '300',
			'Transform': 'uppercase',
			'Line-Height': {
				value: 2.7,
				unit: 'em',
				viewport,
			},
			'Letter Spacing': 1.8,
		} )
	} )
}
