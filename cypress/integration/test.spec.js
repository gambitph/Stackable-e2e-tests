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

		cy.openInspector( 'ugb/accordion', 'Style' )

		cy.adjustStyle( 'Close adjacent on open', true )
		cy.adjustStyle( 'Open at the start', true )
		cy.adjustStyle( 'Reverse arrow', true )
		cy.adjustStyle( 'Border Radius', 35 )
		cy.adjustStyle( 'Shadow / Outline', 5 )
		cy.adjustStyle( 'Align', 'right' )

		cy.collapse( 'ugb/accordion', 'Container Background' )

		cy.adjustStyle( 'Background Color Opacity', 0.4 )
		cy.adjustStyle( 'Background Color Type', 'gradient' )
		cy.adjustStyle( 'Background Color #1', 2 )
		cy.adjustStyle( 'Background Color #1', '#aeaeae' )
		cy.adjustStyle( 'Background Color #2', 4 )
		cy.adjustStyle( 'Background Color #2', '#ffffff' )
		cy.adjustStyle( 'Adv. Gradient Color Settings', {
			[ `Gradient Direction (degrees)` ]: 110,
			[ `Color 1 Location` ]: 95,
			[ `Color 2 Location` ]: 103,
			[ `Background Gradient Blend Mode` ]: 'normal',
		} )
		// TODO: Upload an image or video

		cy.collapse( 'ugb/accordion', 'Title' )

		cy.adjustStyle( 'Typography', {
			[ `Font Family` ]: 'Sans-serif',
			[ `Size` ]: 43,
			[ `Weight` ]: '800',
			[ `Transform` ]: 'uppercase',
			[ `Line-Height` ]: 2.8,
			[ `Letter Spacing` ]: 3,
		} )
		cy.adjustStyle( 'Size', 32 )
		cy.adjustStyle( 'Title HTML Tag', 'h1' )
		cy.adjustStyle( 'Title Color', 2 )
		cy.adjustStyle( 'Title Color', '#808080' )
		cy.adjustStyle( 'Align', 'center' )

		cy.collapse( 'ugb/accordion', 'Arrow' )

		cy.adjustStyle( 'Size', 28 )
		cy.adjustStyle( 'Color', 3 )
		cy.adjustStyle( 'Color', '#acacac' )

		cy.collapse( 'ugb/accordion', 'Spacing' )

		// TODO: Four Range Control
		cy.adjustStyle( 'Title', 54 )
	} )
} )

