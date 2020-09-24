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
			const addedBlock = cy.addUgbBlockInInserterTextarea( block )
			addedBlock.openInspector( 'style' )
			addedBlock.adjustOptions( {
				general: {
					closeAdjacentOnOpen: true,
					openAtTheStart: true,
					reverseArrow: true,
					borderRadius: 35,
					shadowOutline: 2,
					align: 'left',
				},
			} )

			addedBlock.adjustOptions( {
				columnBackground: {
					backgroundType: 'gradient',
					backgroundColor1: '1', // Selecting the first entry in the color picker.
					backgroundColor2: '#eaeaea', // Picking a custon color.
					gradientSettings: {
						gradientDirection: 110,
						color1Location: 55,
						color2Location: 43,
						backgroundBlendMode: 'normal',
					},
				},
			} )

			addedBlock.adjustOptions( {
				title: {
					typography: {
						fontFamily: 'Sans-serif',
						fontSize: 48,
						fontWeight: '900',
						fontTransform: 'uppercase',
						lineHeight: 4.7,
						letterSpacing: 4.3,
					},
					fontSize: 55,
					htmlTag: 'h1',
					titleColor: '#a3a3a3',
				},
			} )

			addedBlock.adjustOptions( {
				arrow: {
					size: 31,
					color: '#643eee',
				},
			} )

			addedBlock.adjustOptions( {
				spacing: {
					padding: 126,
					title: 43,
				},
			} )
		} )
	} )
} )
