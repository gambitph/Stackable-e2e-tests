
/**
 * External dependencies
 */
import {
	isEqual, omit,
} from 'lodash'
import { registerTests } from '~stackable-e2e/helpers'
import { blocks } from '~stackable-e2e/config'

describe( 'Copy Paste Styles', registerTests( [
	allBlocks,
] ) )

function allBlocks() {
	it( 'should copy & paste the attributes of the blocks', () => {
		cy.setupWP()
		cy.newPage()

		blocks
			.forEach( blockName => {
				const name = blockName.split( '/' ).pop()

				cy.addBlock( blockName )
				cy.fixture( `stackable/${ name }` ).then( block => {
					cy.setBlockAttribute( block.attributes )
					cy.getBlockAttributes().then( attributes1 => {
						cy.addBlock( blockName )

						// Get the clientId of the blocks to be used as a selector in copy paste command
						cy.wp().then( wp => {
							const blocksInEditor = wp.data.select( 'core/block-editor' ).getBlocks()
							const clientIds = []
							blocksInEditor.forEach( blockObj => {
								if ( blockObj.name === blockName ) {
									clientIds.push( blockObj.clientId )
								}
							} )
							cy.copyPasteStyles( blockName, { clientId: clientIds[ 0 ] }, { clientId: clientIds[ 1 ] } )
						} )

						const attrToExclude = Object.keys( block.attrToExclude )

						cy.selectBlock( blockName, 1 )
						cy.getBlockAttributes().then( attributes2 => {
							const attributes1WithOmittedValues = omit( attributes1, attrToExclude )
							const attributes2WithOmittedValues = omit( attributes2, attrToExclude )

							// For debugging only. Checks which key values are not equal.
							Object.keys( attributes1WithOmittedValues ).forEach( key1 => {
								Object.keys( attributes2WithOmittedValues ).forEach( () => {
									if ( attributes1WithOmittedValues[ key1 ] !== attributes2WithOmittedValues[ key1 ] ) {
										// console.log( key1, attributes1WithOmittedValues[ key1 ] )
									}
								} )
							} )
							expect( isEqual( attributes1WithOmittedValues, attributes2WithOmittedValues ) ).toBeTruthy()

							if ( block.attrContent ) {
								const content = Object.keys( block.attrContent )
								content
									.forEach( attr => {
										assert.notEqual( attributes1[ attr ], attributes2[ attr ], 'Value not equal ☑️' )
									} )
							}
						} )
					} )
				} )
				cy.deleteBlock( blockName, 0 )
				cy.deleteBlock( blockName, 0 )
				cy.savePost()
			} )
	} )
}
