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

		const colors = [ '#ff0000', '#3fcee8', '#f2e374', '#f00069' ]

		// Add Global colors
		cy.addGlobalColor( {
			name: 'Custom Color Red',
			color: colors[ 0 ],
		} )
		cy.addGlobalColor( {
			name: 'Aqua',
			color: colors[ 1 ],
		} )
		cy.addGlobalColor( {
			name: 'Yellow Sun',
			color: colors[ 2 ],
		} )
		cy.addGlobalColor( {
			name: 'Stackable Pink',
			color: colors[ 3 ],
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
						'color': val,
					},
				} )
		} )

		cardBlock.assertFrontendStyles()
	} )
} )
