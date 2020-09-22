const blockList = [
	'accordion',
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
]

describe( 'New Page', () => {
	it( 'should do something', () => {
		cy.newPage()
		blockList.forEach( block => {
			const cardBlock = cy.addUgbBlockInInserterTextarea( block )
			cardBlock.openInspector( 'style' )
			cardBlock.collapse( 'Block Title' )
			cardBlock.collapse( 'Title' )
		} )
	} )
} )
