// const blockList = [
// 'accordion',
// 'blockquote',
// 'blog-posts',
// 'button',
// 'cta',
// 'card',
// 'columns',
// 'container',
// 'count-up',
// 'design-library',
// 'divider',
// 'expand',
// 'feature-grid',
// 'feature',
// 'header',
// 'heading',
// 'icon-list',
// 'icon',
// 'image-box',
// 'notification',
// 'number-box',
// 'pricing-box',
// 'separator',
// 'spacer',
// 'team-member',
// 'testimonial',
// 'text',
// 'video-popup',
// ]

describe( 'New Page', () => {
	it( 'should do something', () => {
		cy.newPage()
		cy.addBlock( 'ugb/accordion' )

		// // STYLE TAB
		// cy.openInspector( 'ugb/accordion', 'Style' )

		// cy.adjustStyle( 'Close adjacent on open', true )
		// cy.adjustStyle( 'Open at the start', true )
		// cy.adjustStyle( 'Reverse arrow', true )
		// cy.adjustStyle( 'Border Radius', 35 )
		// cy.adjustStyle( 'Shadow / Outline', 5 )
		// cy.adjustStyle( 'Align', 'right', { viewport: 'Tablet' } )

		// cy.collapse(  'Container Background' )

		// cy.adjustStyle( 'Background Color Opacity', 0.4 )
		// cy.adjustStyle( 'Background Color Type', 'gradient' )
		// cy.adjustStyle( 'Background Color #1', 2 )
		// cy.adjustStyle( 'Background Color #1', '#aeaeae' )
		// cy.adjustStyle( 'Background Color #2', 4 )
		// cy.adjustStyle( 'Background Color #2', '#ffffff' )
		// cy.adjustStyle( 'Adv. Gradient Color Settings', {
		// 	[ `Gradient Direction (degrees)` ]: 110,
		// 	[ `Color 1 Location` ]: 95,
		// 	[ `Color 2 Location` ]: 103,
		// 	[ `Background Gradient Blend Mode` ]: 'normal',
		// } )
		// // TODO: Upload an image or video

		// cy.collapse( 'Title' )

		// cy.adjustStyle( 'Typography', {
		// 	[ `Font Family` ]: 'Sans-serif',
		// 	[ `Size` ]: 43,
		// 	[ `Weight` ]: '800',
		// 	[ `Transform` ]: 'uppercase',
		// 	[ `Line-Height` ]: 2.8,
		// 	[ `Letter Spacing` ]: 3,
		// } )
		// cy.adjustStyle( 'Size', 32, { viewport: 'Tablet' } )
		// cy.adjustStyle( 'Title HTML Tag', 'h1' )
		// cy.adjustStyle( 'Title Color', 2 )
		// cy.adjustStyle( 'Title Color', '#808080' )
		// cy.adjustStyle( 'Align', 'center' )

		// cy.collapse(  'Arrow' )

		// cy.adjustStyle( 'Size', 28 )
		// cy.adjustStyle( 'Color', 3 )
		// cy.adjustStyle( 'Color', '#acacac' )

		// cy.collapse( 'Spacing' )

		// // TODO: Four Range Control
		// cy.adjustStyle( 'Padding', 28 )
		// cy.adjustStyle( 'Padding', [ 32, 43, 12, 54 ] )
		// cy.adjustStyle( 'Title', 54, { viewport: 'Mobile' } )

		// ADVANCED TAB

		cy.openInspector( 'ugb/accordion', 'Advanced' )

		// cy.collapse( 'General' )

		// cy.adjustStyle( 'Block HTML Tag', 'main' )
		// cy.adjustStyle( 'Opacity', 0.6 )
		// cy.adjustStyle( 'Z-Index', 3 )

		cy.collapse( 'Block Spacing' )

		// cy.adjustStyle( 'Min. Block Height', 250 )
		// cy.adjustStyle( 'Content Vertical Align', 'flex-start' )
		// cy.adjustStyle( 'Max. Content Width', 1250 )
		// cy.adjustStyle( 'Content Horizontal Align', 'flex-end' )
		cy.adjustStyle( 'Block Margins', [ 43, 54, 65, 13 ], { viewport: 'Tablet', unit: '%' } )
		// cy.adjustStyle( 'Block Paddings', [ 32, 34, 56, 43 ] )

		// cy.collapse( 'Responsive' )

		// cy.adjustStyle( 'Hide on Desktop', true )
		// cy.adjustStyle( 'Hide on Tablet', true )
		// cy.adjustStyle( 'Hide on Mobile', true )

		// cy.collapse( 'Custom CSS' )
		// // TODO: Add Custom CSS.
	} )
} )

