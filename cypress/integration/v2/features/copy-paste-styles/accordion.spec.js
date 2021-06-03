/**
 * External dependencies
 */

describe( 'Copy Paste Accordion Styles', () => {
	it( 'should adjust accordion styles then copy and paste it to another block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/accordion' )
		cy.typeBlock( 'ugb/accordion', '.ugb-accordion__title', 'Accordion 1', 0 )
		cy.openInspector( 'ugb/accordion', 'Style', 'Accordion 1' )
		cy.collapse( 'General' )
		cy.adjust( 'Reverse arrow', true )
		cy.adjust( 'Align', 'right' )
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
		cy.adjust( 'Border Color', '#f8a2a2' )
		cy.adjust( 'Shadow / Outline', 4 )

		cy.addBlock( 'ugb/accordion' )
		cy.typeBlock( 'ugb/accordion', '.ugb-accordion__title', 'Accordion copy', 1 )

		cy.copyStyles( 'ugb/accordion', 'Accordion 1' )
		cy.pasteStyles( 'ugb/accordion', 'Accordion copy' )

		cy.openInspector( 'ugb/accordion', 'Style', 'Accordion copy' )
		cy
			.selectBlock( 'ugb/accordion', 'Accordion copy' )
			.assertComputedStyle( {
				'.ugb-accordion__heading': {
					'flex-direction': 'row-reverse',
					'border-radius': '23px,',
					'border-style': 'solid',
					'border-top-width': '3px',
					'border-right-width': '2px',
					'border-bottom-width': '4px',
					'border-left-width': '1px',
					'border-color': '#f8a2a2',
					'background-image': `url("${ Cypress.env( 'DUMMY_IMAGE_URL' ) }")`,
				},
				'.ugb-inner-block': {
					'text-align': 'right',
				},
				'.ugb-accordion__heading:before': {
					'background-image': 'linear-gradient(180deg, #a92323 11%, #404633)',
					'mix-blend-mode': 'hard-light',
				},
			} )
		cy
			.selectBlock( 'ugb/accordion', 'Accordion copy' )
			.assertClassName( '.ugb-accordion__heading', 'ugb--shadow-4' )
	} )
} )
