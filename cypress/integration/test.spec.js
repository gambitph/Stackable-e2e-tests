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

		// STYLE TAB
		cy.openInspector( 'ugb/accordion', 'Style' )

		cy.adjust( 'Close adjacent on open', true )
		cy.adjust( 'Open at the start', true )
		cy.adjust( 'Reverse arrow', true ).assertComputedStyle( 'flex-direction', '.ugb-accordion__heading', 'row-reverse' )
		cy.adjust( 'Border Radius', 35 ).assertComputedStyle( 'border-radius', '.ugb-accordion__heading', '35px' )
		cy.adjust( 'Shadow / Outline', 5 ).assertClassName( '.ugb-accordion__heading', 'ugb--shadow-5' )
		cy.adjust( 'Align', 'right', { viewport: 'Tablet' } ).assertComputedStyle( 'text-align', '.ugb-inner-block', 'right' )

		cy.collapse( 'Container Background' )

		cy.adjust( 'Background Color Opacity', 0.4 ).assertComputedStyle( 'background-color', '.ugb-accordion__heading', 'rgba(255, 255, 255, 0.4)' )
		cy.adjust( 'Background Color Type', 'gradient' )
		cy.adjust( 'Background Color #1', 2 )
		cy.adjust( 'Background Color #1', '#aeaeae' )
		cy.adjust( 'Background Color #2', 4 )
		cy.adjust( 'Background Color #2', '#ffffff' )
		cy.adjust( 'Adv. Gradient Color Settings', {
			[ `Gradient Direction (degrees)` ]: 110,
			[ `Color 1 Location` ]: 95,
			[ `Color 2 Location` ]: 103,
			[ `Background Gradient Blend Mode` ]: 'normal',
		} )
		// TODO: Upload an image or video

		cy.collapse( 'Title' )

		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Sans-serif',
			[ `Size` ]: 43,
			[ `Weight` ]: '800',
			[ `Transform` ]: 'uppercase',
			[ `Line-Height` ]: 2.8,
			[ `Letter Spacing` ]: 3,
		} )
		cy.adjust( 'Size', 32, { viewport: 'Tablet' } )
		cy.adjust( 'Title HTML Tag', 'h1' )
		cy.adjust( 'Title Color', 2 )
		cy.adjust( 'Title Color', '#808080' )
		cy.adjust( 'Align', 'center' )

		cy.collapse( 'Arrow' )

		cy.adjust( 'Size', 28 )
		cy.adjust( 'Color', 3 )
		cy.adjust( 'Color', '#acacac' )

		cy.collapse( 'Spacing' )

		// TODO: Four Range Control
		cy.adjust( 'Padding', 28 )
		cy.adjust( 'Padding', [ 32, 43, 12, 54 ] )
		cy.adjust( 'Title', 54, { viewport: 'Mobile' } )

		// ADVANCED TAB

		cy.openInspector( 'ugb/accordion', 'Advanced' )

		cy.collapse( 'General' )

		cy.adjust( 'Block HTML Tag', 'main' )
		cy.adjust( 'Opacity', 0.6 )
		cy.adjust( 'Z-Index', 3 )

		cy.collapse( 'Block Spacing' )

		cy.adjust( 'Min. Block Height', 250 )
		cy.adjust( 'Content Vertical Align', 'flex-start' )
		cy.adjust( 'Max. Content Width', 1250 )
		cy.adjust( 'Content Horizontal Align', 'flex-end' )
		cy.adjust( 'Block Margins', [ 43, 54, 65, 13 ], { viewport: 'Tablet', unit: '%' } )
		cy.adjust( 'Block Paddings', [ 32, 34, 56, 43 ] )

		cy.collapse( 'Responsive' )

		cy.adjust( 'Hide on Desktop', true )
		cy.adjust( 'Hide on Tablet', true )
		cy.adjust( 'Hide on Mobile', true )

		cy.collapse( 'Custom CSS' )
		// TODO: Add Custom CSS.
		cy.publish()
	} )
} )

