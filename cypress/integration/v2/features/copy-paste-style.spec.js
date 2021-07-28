/**
 * External dependencies
 */
import {
	isEqual, omit, omitBy,
} from 'lodash'
import { registerTests } from '~stackable-e2e/helpers'
import { blocks } from '~stackable-e2e/config'

describe( 'Copy Paste Styles', registerTests( [
	stackableBlocks,
	coreBlocks,
] ) )

function stackableBlocks() {
	it( 'should assert copy paste styles in stackable blocks', () => {
		cy.setupWP()
		cy.registerPosts( { numOfPosts: 1 } )
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
							cy.setBlockAttribute( {
								'lessLabel': 'show less text-',
								'moreLabel': 'show more text-',
								'text': '<p>Read me im the shorter version</p>',
								'moreText': '<p>Read me im the longer version</p>',
								'title': 'Title Expand copy',
							} )
						}

						const imageAttributes = [
							'imageUrl',
							'image1Url',
							'image2Url',
							'image3Url',
							'image4Url',
							'imageId',
							'image1Id',
							'image2Id',
							'image3Id',
							'image4Id',
						]
						// Set a different image URL for the 2nd block created for content assertion. Also set imageIds.
						imageAttributes.forEach( imageAttribute => {
							if ( block.attributes.hasOwnProperty( imageAttribute ) ) {
								if ( imageAttribute.match( /Id/ ) ) {
									cy.setBlockAttribute( {
										[ imageAttribute ]: 1010,
									} )
								} else {
									cy.setBlockAttribute( {
										[ imageAttribute ]: Cypress.env( 'DUMMY_IMAGE_URL2' ),
									} )
								}
							}
						 } )

						// Get the clientId of the blocks to be used as a selector in copy paste command
						cy.wp().then( wp => {
							const clientIds = wp.data.select( 'core/block-editor' ).getBlocks().filter( ( { name } ) => name === blockName ).map( ( { clientId } ) => clientId )
							cy.copyStyle( blockName, { clientId: clientIds[ 0 ] } )
							cy.pasteStyle( blockName, { clientId: clientIds[ 1 ] } )
						} )

						const attrToExclude = Object.keys( block.attrToExclude )
						cy.selectBlock( blockName, 1 )
						cy.getBlockAttributes().then( attributes2 => {
							const attributes1WithOmittedValues = omit( attributes1, attrToExclude )
							const attributes2WithOmittedValues = omit( attributes2, attrToExclude )

							// For debugging.
							const attributesThatAreNotEqual = Object.keys( omitBy( attributes1WithOmittedValues, ( v, k ) => attributes2WithOmittedValues[ k ] === v ) )

							// This displays the attributes that did not match.
							// Displays only if there is a bug in our copy paste styles.
							// Ideal behavior: this should not be shown in Cypress logs.
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
							assert.isTrue(
								isEqual( attributes1WithOmittedValues, attributes2WithOmittedValues ),
								`Expected the first ${ blockName } attributes to equal the second ${ blockName } attributes.`
							)

							if ( block.attrContent ) {
								const attrContent = Object.keys( block.attrContent )
								attrContent
									.forEach( attr => {
										assert.notEqual(
											attributes1[ attr ],
											attributes2[ attr ],
											`'${ attr }' of ${ blockName } expected to not equal '${ attr }' of second ${ blockName }.`
										)
									} )
							}
						} )
					} )
				} )
				cy.savePost()
			} )
	} )
}

function coreBlocks() {
	it( 'should assert copy paste styles in native blocks', () => {
		cy.setupWP()
		cy.newPage()

		const nativeBlocks = [
			'core/paragraph',
			'core/heading',
			'core/buttons',
			'core/cover',
		]

		nativeBlocks.forEach( blockName => {
			const name = blockName.split( '/' ).pop()
			cy.addBlock( blockName )
			cy.addBlock( blockName )
			cy.fixture( `core/${ name }` ).then( block => {
				cy.wp().then( wp => {
					let clientIds = []

					if ( blockName !== 'core/buttons' ) {
						clientIds = wp.data.select( 'core/block-editor' ).getBlocks().filter( ( { name } ) => name === blockName ).map( ( { clientId } ) => clientId )
					} else {
						const innerButtons = wp.data.select( 'core/block-editor' ).getBlocks().filter( ( { name } ) => name === blockName ).map( ( { innerBlocks } ) => innerBlocks )
						clientIds.push( innerButtons[ 0 ][ 0 ].clientId, innerButtons[ 1 ][ 0 ].clientId )
					}

					cy.setBlockAttribute( block.attributes, clientIds[ 0 ] )
					cy.getBlockAttributes( clientIds[ 0 ] ).then( attributes1 => {
						cy.copyStyle( name === 'buttons' ? 'core/button' : blockName, 0 )
						cy.pasteStyle( name === 'buttons' ? 'core/button' : blockName, 1 )

						cy.selectBlock( blockName, clientIds[ 1 ] )
						cy.getBlockAttributes( clientIds[ 1 ] ).then( attributes2 => {
							if ( block.attrToExclude ) {
								const attrToExclude = Object.keys( block.attrToExclude )
								const attributes1WithOmittedValues = omit( attributes1, attrToExclude )
								const attributes2WithOmittedValues = omit( attributes2, attrToExclude )
								assert.isTrue(
									isEqual( attributes1WithOmittedValues, attributes2WithOmittedValues ),
									`Expected the first ${ blockName } attributes to equal the second ${ blockName } attributes.`
								)
							}

							if ( block.attrContent ) {
								const attrContent = Object.keys( block.attrContent )
								attrContent
									.forEach( attr => {
										assert.notEqual(
											attributes1[ attr ],
											attributes2[ attr ],
											`'${ attr }' of ${ blockName } expected to not equal '${ attr }' of second ${ blockName }.`
										)
									} )
							}
						} )
					} )
				} )
			} )
			cy.savePost()
		} )
	} )
}
