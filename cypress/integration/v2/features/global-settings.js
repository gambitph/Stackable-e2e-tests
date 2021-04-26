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

		// Add Global colors
		cy.addGlobalColor( {
			name: 'Custom Color Red',
			color: '#ff0000',
		} )
		cy.addGlobalColor( {
			name: 'Aqua',
			color: '#3fcee8',
		} )
		cy.addGlobalColor( {
			name: 'Yellow Sun',
			color: '#f2e374',
		} )
		cy.addGlobalColor( {
			name: 'Stackable Pink',
			color: '#f00069',
		} )
		cy.adjust( 'Use only Stackable colors', true )

		// Check if the Global colors are added in blocks
		cy.openInspector( 'ugb/card', 'Style' )
		cy.collapse( 'Title' )

		// const colors = [ 'Custom Color Red', 'Aqua', 'Yellow Sun', 'Stackable Pink' ]

		cy
			.get( '.components-circular-option-picker__swatches' )
			.find( '.components-circular-option-picker__option-wrapper' )
			.its( 'length' )
			.should( 'equal', 4 )
			// .then( $el => {
			// 	$el.its( 'length' ).should( 'be', 4 )
			// 	cy
			// 		.get( 'button.components-circular-option-picker__option' )
			// 		.invoke( 'attr', 'aria-label' )
			// 		.then( label => {
			// 			expect( label ).toBe( `Color: ${ colors[ idx ] }` )
			// 		} )
			// } )

		cardBlock.assertFrontendStyles()
	} )
} )
