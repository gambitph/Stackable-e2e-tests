const { blocks } = require( '../config' )
const { range } = require( 'lodash' )
const { getAddresses } = require( '../support/util' )
describe( 'Accordion Block', () => {
	// it( 'should show the block', () => {
	// 	cy.setupWP()
	// 	cy.newPage()
	// 	cy.addBlock( 'ugb/accordion' )
	// 	cy.get( '.ugb-accordion' ).should( 'exist' )
	// } )

	// it( 'should not trigger block error when refreshing the page', () => {
	// 	cy.setupWP()
	// 	cy.newPage()
	// 	cy.addBlock( 'ugb/accordion' )
	// 	cy.publish()
	// 	cy.reload()
	// } )

	// it( 'should allow adding inner blocks inside accordion', () => {
	// 	cy.setupWP()
	// 	cy.newPage()
	// 	cy.addBlock( 'ugb/accordion' )
	// 	cy.selectBlock( 'ugb/accordion' )
	// 	cy.get( '.ugb-accordion__heading' ).click( { force: true } )
	// 	cy.deleteBlock( 'core/paragraph' )
	// 	cy.wait( 1000 )

	// 	blocks.forEach( blockName => {
	// 		cy
	// 			.get( 'button.block-editor-button-block-appender' )
	// 			.click( { force: true } )

	// 		cy
	// 			.get( 'button' )
	// 			.contains( 'Browse all' )
	// 			.click( { force: true } )

	// 		cy
	// 			.get( `button.editor-block-list-item-${ blockName.replace( '/', '-' ) }:first` )
	// 			.click( { force: true } )

	// 		cy.deleteBlock( blockName, blockName === 'ugb/accordion' && 1 )
	// 	} )
	// } )

	// it( 'should switch layout', () => {
	// 	const layouts = [ 'Basic', 'Plain', 'Line Colored', 'Colored' ]

	// 	cy.setupWP()
	// 	cy.newPage()
	// 	cy.addBlock( 'ugb/accordion' )
	// 	layouts.forEach( layout => {
	// 		cy.openInspector( 'ugb/accordion', 'Layout' )
	// 		cy.adjustLayout( layout )
	// 		cy.publish()
	// 		cy.reload()
	// 	} )
	// } )

	// it( 'should switch design', () => {
	// 	const designs = [ 'Dim Accordion', 'Elevate Accordion', 'Lounge Accordion' ]

	// 	cy.setupWP()
	// 	cy.newPage()
	// 	cy.addBlock( 'ugb/accordion' )
	// 	designs.forEach( layout => {
	// 		cy.openInspector( 'ugb/accordion', 'Layout' )
	// 		cy.adjustDesign( layout )
	// 		cy.wait( 1000 )
	// 		cy.publish()
	// 		cy.reload()
	// 	} )
	// } )

	it( 'should adjust desktop options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/accordion' ) //remove
		cy.typeBlock( 'ugb/accordion', '.ugb-accordion__title', `Accordion 1`, 0 ) //remove
		// Test 'Close adjacent on open' feature
		// range( 1, 4 ).forEach( idx => {
		// 	cy.addBlock( 'ugb/accordion' )
		// 	cy.typeBlock( 'ugb/accordion', '.ugb-accordion__title', `Accordion ${ idx }`, idx - 1 )
		// 	cy.openInspector( 'ugb/accordion', 'Style', `Accordion ${ idx }` )
		// 	cy.collapse( 'General' )
		// 	cy.adjust( 'Close adjacent on open', true )
		// } )

		// cy.publish()
		// getAddresses( ( { currUrl, previewUrl } ) => {
		// 	cy.visit( previewUrl )
		// 	range( 0, 3 ).forEach( idx1 => {
		// 		cy
		// 			.get( '.ugb-accordion' )
		// 			.eq( idx1 )
		// 			.find( '.ugb-accordion__heading' )
		// 			.click( { force: true } )
		// 			.then( () => {
		// 				range( 0, 3 ).forEach( idx2 => {
		// 					if ( idx1 !== idx2 ) {
		// 						cy
		// 							.get( '.ugb-accordion' )
		// 							.eq( idx2 )
		// 							.invoke( 'attr', 'aria-expanded' )
		// 							.then( ariaExpanded => {
		// 								expect( ariaExpanded ).toBe( 'false' )
		// 							} )
		// 					}
		// 				} )
		// 			} )
		// 	} )
		// 	cy.visit( currUrl )
		// 	cy.deleteBlock( 'ugb/accordion', 'Accordion 2' )
		// 	cy.deleteBlock( 'ugb/accordion', 'Accordion 3' )

		// 	// Test open at start
		// 	cy.openInspector( 'ugb/accordion', 'Style' )
		// 	cy.collapse( 'General' )
		// 	cy.adjust( 'Open at the start', true )
		// 	cy.publish()
		// 	getAddresses( ( { currUrl, previewUrl } ) => {
		// 		cy.visit( previewUrl )
		// 		cy
		// 			.get( '.ugb-accordion' )
		// 			.invoke( 'attr', 'aria-expanded' )
		// 			.then( ariaExpanded => {
		// 				expect( ariaExpanded ).toBe( 'true' )
		// 				cy.visit( currUrl )
		// 			} )
		// 	} )
		// } )

		// cy.openInspector( 'ugb/accordion', 'Style' )
		// cy.collapse( 'General' )
		// cy.adjust( 'Reverse arrow', true ).assertComputedStyle( {
		// 	'.ugb-accordion__heading': {
		// 		[ `flex-direction` ]: 'row-reverse',
		// 	},
		// } )

		// const aligns = [ 'left', 'center', 'right' ]
		// aligns.forEach( align => {
		// 	cy.adjust( 'Align', align ).assertComputedStyle( {
		// 		'.ugb-inner-block': {
		// 			[ `text-align` ]: align,
		// 		},
		// 	} )
		// } )

		//Test Single Background Color
		cy.openInspector( 'ugb/accordion', 'Style' ) //remove
		cy.collapse( 'Container' )
		cy.adjust( 'Background', {
			[ `Color Type` ]: 'single',
			[ `Background Color` ]: '#000000',
			[ `Background Color Opacity` ]: '0.5',
		} ).assertComputedStyle( {
			'.ugb-accordion__heading': {
				[ `background-color` ]: 'rgba(0, 0, 0, 0.5)',
			},
		} )

		// //Test Gradient Background Color
		// cy.adjust( 'Background', {
		// 	[ `Color Type` ]: 'gradient',
		// 	[ `Background Color #1` ]: '#f00069',
		// 	[ `Background Color #2` ]: '#000000',
		// 	[ `Adv. Gradient Color Settings` ]: {
		// 		  [ `Gradient Direction (degrees)` ]: '180deg',
		// 		  [ `Color 1 Location` ]: '11%',
		// 		  [ `Color 2 Location` ]: '80%',
		// 		  [ `Background Gradient Blend Mode` ]: 'hard-light',
		// 	},
		// } ).assertComputedStyle( {
		// 	'.ugb-accordion__heading:before': {
		// 		[ `background-image` ]: 'linear-gradient(#f00069 11%, #000000 80%)',
		// 		[ `mix-blend-mode` ]: 'hard-light',
		// 	},
		// } )

		// cy.adjust( 'Border Radius', 30 ).assertComputedStyle( {
		// 	'.ugb-accordion__heading': {
		// 		[ `border-radius` ]: '30px',
		// 	},
		// } )

		// //Test Border Options
		// cy.adjust( 'Borders', 'solid' )
		// cy.adjust( 'Borders', 'dashed' )
		// cy.adjust( 'Borders', 'dotted' )
		// cy.adjust( 'Border Width', 3 )
		// cy.adjust( 'Border Color', '#f1f1f1' ).assertComputedStyle( {
		// 	'.ugb-accordion__heading': {
		// 		[ `border-style` ]: 'dotted',
		// 		[ `border-color` ]: '#f1f1f1',
		// 		[ `border-top-width` ]: '3px',
		// 		[ `border-bottom-width` ]: '3px',
		// 		[ `border-left-width` ]: '3px',
		// 		[ `border-right-width` ]: '3px',
		// 	},
		// } )

		// cy.adjust( 'Shadow / Outline', 9 )
		// cy.get( 'div.ugb--shadow-9' )

		//Test Spacing options
		// cy.openInspector( 'ugb/accordion', 'Style' ) //remove
		// cy.collapse( 'Spacing' )
		// cy.adjust( 'Padding', 46 ).assertComputedStyle( {
		// 	'.ugb-accordion__heading': {
		// 		[ `padding-top` ]: '46px',
		// 		[ `padding-right` ]: '46px',
		// 		[ `padding-bottom` ]: '46px',
		// 		[ `padding-left` ]: '46px',
		// 	},
		// } )

		// cy.adjust( 'Title', 63 )
		// cy.typeBlock( 'ugb/accordion', '.ugb-accordion__title', `Accordion 1` )
		// 	.assertComputedStyle( {
		// 		'.ugb-accordion--open': {
		// 			[ `margin-bottom` ]: '63px',
		// 		},
		// 	} )
	} )

	// it( 'should adjust tablet options inside style tab', () => {
	// 	cy.setupWP()
	// 	cy.newPage()
	// 	// Test 'Close adjacent on open' feature
	// 	range( 1, 4 ).forEach( idx => {
	// 		cy.addBlock( 'ugb/accordion' )
	// 		cy.typeBlock( 'ugb/accordion', '.ugb-accordion__title', `Accordion ${ idx }`, idx - 1 )
	// 		cy.openInspector( 'ugb/accordion', 'Style', `Accordion ${ idx }` )
	// 		cy.collapse( 'General' )
	// 		cy.adjust( 'Close adjacent on open', true )
	// 	} )

	// 	cy.publish()
	// 	getAddresses( ( { currUrl, previewUrl } ) => {
	// 		cy.visit( previewUrl )
	// 		range( 0, 3 ).forEach( idx1 => {
	// 			cy
	// 				.get( '.ugb-accordion' )
	// 				.eq( idx1 )
	// 				.find( '.ugb-accordion__heading' )
	// 				.click( { force: true } )
	// 				.then( () => {
	// 					range( 0, 3 ).forEach( idx2 => {
	// 						if ( idx1 !== idx2 ) {
	// 							cy
	// 								.get( '.ugb-accordion' )
	// 								.eq( idx2 )
	// 								.invoke( 'attr', 'aria-expanded' )
	// 								.then( ariaExpanded => {
	// 									expect( ariaExpanded ).toBe( 'false' )
	// 								} )
	// 						}
	// 					} )
	// 				} )
	// 		} )
	// 		cy.visit( currUrl )
	// 		cy.deleteBlock( 'ugb/accordion', 'Accordion 2' )
	// 		cy.deleteBlock( 'ugb/accordion', 'Accordion 3' )

	// 		// Test open at start
	// 		cy.openInspector( 'ugb/accordion', 'Style' )
	// 		cy.collapse( 'General' )
	// 		cy.adjust( 'Open at the start', true )
	// 		cy.publish()
	// 		getAddresses( ( { currUrl, previewUrl } ) => {
	// 			cy.visit( previewUrl )
	// 			cy
	// 				.get( '.ugb-accordion' )
	// 				.invoke( 'attr', 'aria-expanded' )
	// 				.then( ariaExpanded => {
	// 					expect( ariaExpanded ).toBe( 'true' )
	// 					cy.visit( currUrl )
	// 				} )
	// 		} )
	// 	} )

	// 	cy.openInspector( 'ugb/accordion', 'Style' )
	// 	cy.collapse( 'General' )
	// 	cy.adjust( 'Reverse arrow', true ).assertComputedStyle( {
	// 		'.ugb-accordion__heading': {
	// 			[ `flex-direction` ]: 'row-reverse',
	// 		},
	// 	} )

	// 	const aligns = [ 'left', 'center', 'right' ]
	// 	aligns.forEach( align => {
	// 		cy.adjust( 'Align', align ).assertComputedStyle( {
	// 			'.ugb-inner-block': {
	// 				[ `text-align` ]: align,
	// 			},
	// 		} )
	// 	} )

	// 	cy.collapse( 'Container' )
	// 	cy.adjust( 'Background', {
	// 		[ `Background Color` ]: '#000000',
	// 		[ `Background Color Opacity` ]: '0.5',
	// 	} ).assertComputedStyle( {
	// 		'.ugb-accordion__heading': {
	// 			[ `background-color` ]: 'rgba(0, 0, 0, 0.5)',
	// 		},
	// 	} )

	// 	cy.adjust( 'Color Type', 'Gradient' )

	// 	cy.adjust( 'Border Radius', 30 ).assertComputedStyle( {
	// 		'.ugb-accordion__heading': {
	// 			[ `border-radius` ]: '30px',
	// 		},
	// 	} )

	// 	cy.adjust( 'Borders', 'solid' )
	// 	cy.adjust( 'Border Width', 3 )
	// 	cy.adjust( 'Border Color', '#f1f1f1' ).assertComputedStyle( {
	// 		'.ugb-accordion__heading': {
	// 			[ `border-style` ]: 'solid',
	// 			[ `border-color` ]: '#f1f1f1',
	// 			[ `border-top-width` ]: '3px',
	// 			[ `border-bottom-width` ]: '3px',
	// 			[ `border-left-width` ]: '3px',
	// 			[ `border-right-width` ]: '3px',
	// 		},
	// 	} )
	// } )

	// it( 'should adjust options inside advanced tab', () => {

	// } )

	// it( 'should write content inside the block', () => {

	// } )
} )
