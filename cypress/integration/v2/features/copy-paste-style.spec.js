
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

const attrToExclude = [
	'showBlockTitle',
	'showBlockDescription',
	'blockBackgroundBackgroundMediaId',
	'showContainerLink',
	'container1NewTab',
	'container1NoFollow',
	'container1Title',
	'container1Url',
	'container2NewTab',
	'container2NoFollow',
	'container2Title',
	'container2Url',
	'container3NewTab',
	'container3NoFollow',
	'container3Title',
	'container3Url',
	'container4NewTab',
	'container4NoFollow',
	'container4Title',
	'container4Url',
	'anchor',
	'uniqueClass',
	'customAttributes',
	'blockTitle',
	'blockDescription',
	'text',
	'text1',
	'text2',
	'text3',
	'text4',
	'title',
	'title1',
	'title2',
	'title3',
	'title4',
	'title5',
	'title6',
	'title7',
	'title8',
	'subtitle',
	'subtitle1',
	'subtitle2',
	'subtitle3',
	'subtitle4',
	'description',
	'description1',
	'description2',
	'description3',
	'description4',
	'buttonText',
	'button1Text',
	'button2Text',
	'button3Text',
	'button4Text',
	// count-up
	'countText1',
	'countText2',
	'countText3',
	'countText4',
	// icon
	'columns',
	'tabletColumns',
	'mobileColumns',
	'showTitle',
	'icon1',
	'icon2',
	'icon3',
	'icon4',
	'icon5',
	'icon6',
	'icon7',
	'icon8',
	'url1',
	'url2',
	'url3',
	'url4',
	'url5',
	'url6',
	'url7',
	'url8',
	'newTab1',
	'newTab2',
	'newTab3',
	'newTab4',
	'newTab5',
	'newTab6',
	'newTab7',
	'newTab8',
	'noFollow1',
	'noFollow2',
	'noFollow3',
	'noFollow4',
	'noFollow5',
	'noFollow6',
	'noFollow7',
	'noFollow8',
	// number-box
	'num1',
	'num2',
	'num3',
	// expand
	'lessLabel',
	'moreLabel',
	'moreText',
	// container
	'imageUrl',
	// pricing-box
	'pricePrefix1',
	'pricePrefix2',
	'pricePrefix3',
	'price1',
	'price2',
	'price3',
	'priceSuffix1',
	'priceSuffix2',
	'priceSuffix3',
	'subPrice1',
	'subPrice2',
	'subPrice3',
	// team member
	'name1',
	'name2',
	'name3',
	'position1',
	'position2',
	'position3',
	'social1FacebookUrl',
	'social1TwitterUrl',
	'social1InstagramUrl',
	'social1PinterestUrl',
	'social1LinkedinUrl',
	'social1YoutubeUrl',
	'social1EmailUrl',
	'social2FacebookUrl',
	'social2TwitterUrl',
	'social2InstagramUrl',
	'social2PinterestUrl',
	'social2LinkedinUrl',
	'social2YoutubeUrl',
	'social2EmailUrl',
	'social3FacebookUrl',
	'social3TwitterUrl',
	'social3InstagramUrl',
	'social3PinterestUrl',
	'social3LinkedinUrl',
	'social3YoutubeUrl',
	'social3EmailUrl',
	// testimonial
	'testimonial1',
	'testimonial2',
	'testimonial3',
	// blog-posts
	'numberOfItems',
	'order',
	'orderBy',
	'postType',
	'taxonomyType',
	'taxonomy',
	'taxonomyFilterType',
	'postOffset',
	'postExclude',
	'postInclude',
	// button, card, grid
	'button1Url',
	'button1NewTab',
	'button1NoFollow',
	'button2Url',
	'button2NewTab',
	'button2NoFollow',
	'button3Url',
	'button3NewTab',
	'button3NoFollow',
	'button4Url',
	'button4NewTab',
	'button4NoFollow',
	// cta, notif
	'buttonUrl',
	'buttonNewTab',
	'buttonNoFollow',
	// card, feature, grid
	'imageAlt',
	'image1Alt',
	'image2Alt',
	'image3Alt',
	'imageId',
	'image1Id',
	'image2Id',
	'image3Id',
	'image4Id',
	'image1Url',
	'image2Url',
	'image3Url',
	'image4Url',
	// image box
	'link1Url',
	'link2Url',
	'link3Url',
	'link4Url',
	'link1NewTab',
	'link2NewTab',
	'link3NewTab',
	'link4NewTab',
	'link1NoFollow',
	'link2NoFollow',
	'link3NoFollow',
	'link4NoFollow',
	// video popup
	'previewBackgroundMediaUrl',
	'previewBackgroundMediaId',
	'videoLink',
	'videoID',
	'video-popup3',
	// header
	'showButton2',
]

function allBlocks() {
	it( 'should copy & paste the attributes of the blocks', () => {
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
							cy.typeBlock( blockName, `.ugb-${ name }__title`, 'Title', 1 )
						}
						const blockAttributes = Object.keys( block.attributes )
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
						const imageAttrsPresent = blockAttributes.filter( val => imageAttributes.includes( val ) )
						// Set a different image URL for the 2nd block created for content assertion. Also set imageIds.
						if ( imageAttrsPresent ) {
							imageAttrsPresent.forEach( val => {
								if ( val.includes( 'Id' ) ) {
									cy.setBlockAttribute( {
										[ val ]: 1010,
									} )
								} else {
									cy.setBlockAttribute( {
										[ val ]: Cypress.env( 'DUMMY_IMAGE_URL2' ),
									} )
								}
							} )
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
							cy.copyStyle( blockName, { clientId: clientIds[ 0 ] } )
							cy.pasteStyle( blockName, { clientId: clientIds[ 1 ] } )
						} )

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
							expect( isEqual( attributes1WithOmittedValues, attributes2WithOmittedValues ) ).toBeTruthy()

							if ( block.attrContent ) {
								const attrContent = Object.keys( block.attrContent )
								attrContent
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
