
/**
 * External dependencies
 */
import { isEqual, omit } from 'lodash'
import { registerTests } from '~stackable-e2e/helpers'

describe( 'Copy Paste Accordion Styles', registerTests( [
	styleTest,
	contentTest,
] ) )

function styleTest() {
	it( 'should copy and paste accordion styles', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/accordion' )
		cy.typeBlock( 'ugb/accordion', '.ugb-accordion__title', 'Accordion 1', 0 )
		cy.openInspector( 'ugb/accordion', 'Style', 'Accordion 1' )

		cy.collapse( 'General' )
		cy.adjust( 'Close adjacent on open', true )
		cy.adjust( 'Open at the start', true )
		cy.adjust( 'Reverse arrow', true )
		cy.adjust( 'Align', 'left' )
		cy.adjust( 'Align', 'center', { viewport: 'Tablet' } )
		cy.adjust( 'Align', 'right', { viewport: 'Mobile' } )

		cy.collapse( 'Container' )
		cy.adjust( 'Background', {
			'Color Type': 'gradient',
			'Background Color #1': '#a92323',
			'Background Color #2': '#404633',
			'Adv. Gradient Color Settings': {
				'Gradient Direction (degrees)': 180,
				'Color 1 Location': '11%',
				'Color 2 Location': '80%',
				'Background Gradient Blend Mode': 'hard-light',
			},
		} )
		cy.setBlockAttribute( {
			'containerBackgroundMediaUrl': Cypress.env( 'DUMMY_IMAGE_URL' ),
		} )
		cy.adjust( 'Border Radius', 23 )
		cy.adjust( 'Borders', 'solid' )
		cy.adjust( 'Border Width', [ 3, 2, 4, 1 ] )
		cy.adjust( 'Border Width', [ 1, 2, 3, 4 ], { viewport: 'Tablet' } )
		cy.adjust( 'Border Width', [ 4, 3, 2, 1 ], { viewport: 'Mobile' } )
		cy.adjust( 'Border Color', '#f8a2a2' )
		cy.adjust( 'Shadow / Outline', 4 )

		cy.collapse( 'Spacing' )
		cy.adjust( 'Padding', [ 23, 24, 25, 26 ] )
		cy.adjust( 'Title', 19 )
		cy.adjust( 'Title', 20, { viewport: 'Tablet' } )
		cy.adjust( 'Title', 21, { viewport: 'Mobile' } )

		cy.collapse( 'Title' )
		cy.adjust( 'Title HTML Tag', 'h5' )
		cy.adjust( 'Typography', {
			'Font Family': 'Abel',
			'Size': 23,
			'Weight': '600',
			'Transform': 'uppercase',
			'Line-Height': 1.5,
			'Letter Spacing': 1.6,
		} )
		cy.adjust( 'Typography', {
			'Size': {
				value: 22,
				viewport: 'Tablet',
			},
			'Line-Height': {
				value: 1.6,
				viewport: 'Tablet',
			},
		} )
		cy.adjust( 'Typography', {
			'Size': {
				value: 21,
				viewport: 'Mobile',
			},
			'Line-Height': {
				value: 1.7,
				viewport: 'Mobile',
			},
		} )
		cy.adjust( 'Title Color', '#eee3e3' )
		cy.adjust( 'Align', 'left' )
		cy.adjust( 'Align', 'center', { viewport: 'Tablet' } )
		cy.adjust( 'Align', 'right', { viewport: 'Mobile' } )

		cy.collapse( 'Arrow' )
		cy.adjust( 'Size', 28 )
		cy.adjust( 'Color', '#ecfbfb' )

		cy.openInspector( 'ugb/accordion', 'Advanced' )
		cy.collapse( 'General' )
		cy.adjust( 'Block HTML Tag', 'section' )
		cy.adjust( 'Opacity', 0.9 )
		cy.adjust( 'Opacity', 0.8, { viewport: 'Tablet' } )
		cy.adjust( 'Opacity', 0.7, { viewport: 'Mobile' } )
		cy.adjust( 'Z-Index', 3 )
		cy.adjust( 'Z-Index', 6, { viewport: 'Tablet' } )
		cy.adjust( 'Z-Index', 9, { viewport: 'Mobile' } )

		cy.collapse( 'Block Spacing' )
		cy.adjust( 'Min. Block Height', 102 )
		cy.adjust( 'Min. Block Height', 103, { viewport: 'Tablet' } )
		cy.adjust( 'Min. Block Height', 104, { viewport: 'Mobile' } )
		cy.adjust( 'Content Vertical Align', 'flex-start' )
		cy.adjust( 'Content Vertical Align', 'center', { viewport: 'Tablet' } )
		cy.adjust( 'Content Vertical Align', 'flex-end', { viewport: 'Mobile' } )
		cy.adjust( 'Max. Content Width', 1610 )
		cy.adjust( 'Max. Content Width', 1611, { viewport: 'Tablet' } )
		cy.adjust( 'Max. Content Width', 1612, { viewport: 'Mobile' } )
		cy.adjust( 'Content Horizontal Align', 'flex-start' )
		cy.adjust( 'Content Horizontal Align', 'center', { viewport: 'Tablet' } )
		cy.adjust( 'Content Horizontal Align', 'flex-end', { viewport: 'Mobile' } )
		cy.adjust( 'Block Margins', [ 13, 14, 15, 16 ] )
		cy.adjust( 'Block Margins', [ 17, 18, 19, 20 ], { viewport: 'Tablet' } )
		cy.adjust( 'Block Margins', [ 21, 22, 23, 24 ], { viewport: 'Mobile' } )
		cy.adjust( 'Block Paddings', [ 10, 11, 12, 13 ] )
		cy.adjust( 'Block Paddings', [ 14, 15, 16, 17 ], { viewport: 'Tablet' } )
		cy.adjust( 'Block Paddings', [ 18, 19, 20, 21 ], { viewport: 'Mobile' } )

		cy.collapse( 'Responsive' )
		cy.adjust( 'Hide on Tablet', true )
		cy.changePreviewMode( 'Desktop' )

		// Add another accordion block
		cy.addBlock( 'ugb/accordion' )
		cy.typeBlock( 'ugb/accordion', '.ugb-accordion__title', 'Accordion 2', 1 )

		// Copy and then paste the styles to the other block.
		cy.copyPasteStyles( 'ugb/accordion', 'Accordion 1', 'Accordion 2' )

		const attrToExclude = [
			'className',
			'title',
			'uniqueClass',
		]

		cy.selectBlock( 'ugb/accordion', 'Accordion 1' )
		cy.getBlockAttributes().then( attributes1 => {
			cy.selectBlock( 'ugb/accordion', 'Accordion 2' )
			cy.getBlockAttributes().then( attributes2 => {
				const attributes1WithOmittedValues = omit( attributes1, attrToExclude )
				const attributes2WithOmittedValues = omit( attributes2, attrToExclude )
				expect( isEqual( attributes1WithOmittedValues, attributes2WithOmittedValues ) ).toBeTruthy()
				expect( attributes1.title ).toEqual( 'Accordion 1' )
				expect( attributes2.title ).toEqual( 'Accordion 2' )
			} )
		} )
		cy.savePost()
	} )
}

function contentTest() {
	it( 'should not copy the contents of the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/card' )
		cy.setBlockAttribute( {
			'blockDescription': 'This is card section 1',
			'blockTitle': 'Card Section 1',
			'image1Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
			'title1': 'Card Title 1',
			'subtitle1': 'Card Subtitle 1',
			'description1': 'Card Description 1',
			'button1Text': 'Card Button 1',
			'image2Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
			'title2': 'Card Title 1',
			'subtitle2': 'Card Subtitle 1',
			'description2': 'Card Description 1',
			'button2Text': 'Card Button 1',
		} )

		cy.openInspector( 'ugb/card', 'Advanced' )
		cy.collapse( 'General' )
		cy.adjust( 'Block HTML Tag', 'section' )
		cy.adjust( 'Opacity', 0.8 )
		cy.adjust( 'Opacity', 0.7, { viewport: 'Tablet' } )
		cy.adjust( 'Opacity', 0.9, { viewport: 'Mobile' } )
		cy.adjust( 'Z-Index', 3 )
		cy.adjust( 'Z-Index', 6, { viewport: 'Tablet' } )
		cy.adjust( 'Z-Index', 9, { viewport: 'Mobile' } )
		cy.openInspector( 'ugb/card', 'Style' )
		cy.toggleStyle( 'Block Title' )
		cy.toggleStyle( 'Block Description' )
		cy.changePreviewMode( 'Desktop' )

		// Add another card block
		cy.addBlock( 'ugb/card' )
		cy.setBlockAttribute( {
			'blockDescription': 'This is a card copy',
			'blockTitle': 'Card Section 2',
			'image1Url': Cypress.env( 'DUMMY_IMAGE_URL2' ),
			'title1': 'Card Title 2',
			'subtitle1': 'Card Subtitle 2',
			'description1': 'Card Description 2',
			'button1Text': 'Card Button 2',
			'image2Url': Cypress.env( 'DUMMY_IMAGE_URL2' ),
			'title2': 'Card Title 2',
			'subtitle2': 'Card Subtitle 2',
			'description2': 'Card Description 2',
			'button2Text': 'Card Button 2',
		} )
		cy.openInspector( 'ugb/card', 'Style' )
		cy.toggleStyle( 'Block Title' )
		cy.toggleStyle( 'Block Description' )

		// Copy and then paste the styles to the other block.
		cy.copyPasteStyles( 'ugb/card', 'Card Title 1', 'Card Title 2' )

		const attrToExclude = [
			'blockDescription',
			'blockTitle',
			'button1Text',
			'button2Text',
			'description1',
			'description2',
			'image1Url',
			'image2Url',
			'subtitle1',
			'subtitle2',
			'title1',
			'title2',
			'image1Id',
			'image2Id',
			'className',
			'uniqueClass',
		]

		cy.selectBlock( 'ugb/card', 'Card Title 1' )
		cy.getBlockAttributes().then( attributes1 => {
			cy.selectBlock( 'ugb/card', 'Card Title 2' )
			cy.getBlockAttributes().then( attributes2 => {
				const attributes1WithOmittedValues = omit( attributes1, attrToExclude )
				const attributes2WithOmittedValues = omit( attributes2, attrToExclude )
				expect( isEqual( attributes1WithOmittedValues, attributes2WithOmittedValues ) ).toBeTruthy()

				attrToExclude
					.filter( attr => {
						const exclude = [
							'image1Id',
							'image2Id',
							'className',
							'uniqueClass',
						]
						return ! exclude.includes( attr )
					} )
					.forEach( attr => {
						// Assertion fails on image1Url
						// Possibly because the image is just added through setAttributes
						// and not directly uploaded. It copies the image in this test.
						assert.notEqual( attributes1[ attr ], attributes2[ attr ], 'Value not equal ☑️' )
					} )
			} )
		} )
	} )
}
