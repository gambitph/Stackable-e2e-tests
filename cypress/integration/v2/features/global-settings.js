/**
 * External dependencies
 */
import { registerBlockSnapshots } from '~gutenberg-e2e/plugins'

describe( 'Global Settings', () => {
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

		cardBlock.assertFrontendStyles()
	} )
} )
