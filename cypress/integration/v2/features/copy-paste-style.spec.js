
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
						// Enter some text into these blocks first
						if ( name === 'text' ) {
							cy.setBlockAttribute( {
								'showTitle': true,
								'showSubtitle': true,
								'title': 'Text copy',
								'subtitle': 'Text subtitle copy',
								'text1': 'Lorem ipsum dolor',
							} )
						}
						if ( name === 'heading' ) {
							cy.typeBlock( blockName, `.ugb-${ name }__subtitle`, 'Subtitle', 1 )
						}
						if ( name === 'expand' ) {
							cy.typeBlock( blockName, `.ugb-${ name }__title`, 'Title', 1 )
						}

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

							const attributesThatAreNotEqual = []
							// For debugging. Checks which key values are not equal and stores them into attributesThatAreNotEqual.
							Object.keys( attributes1WithOmittedValues ).forEach( key1 => {
								Object.keys( attributes2WithOmittedValues ).forEach( () => {
									if ( attributes1WithOmittedValues[ key1 ] !== attributes2WithOmittedValues[ key1 ] ) {
										if ( attributesThatAreNotEqual.indexOf( key1 ) === -1 ) {
											attributesThatAreNotEqual.push( key1 )
										}
									}
								} )
							} )
							if ( attributesThatAreNotEqual.length ) {
								attributesThatAreNotEqual.forEach( attr => {
									Cypress.log( {
										name: 'checkAttribute',
										displayName: 'checkAttribute',
										message: attr,
										consoleProps: () => {
											return {
												checkAttribute: attr,
											}
										},
									} )
								} )
							}
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
				cy.savePost()
			} )
	} )
}
