describe( 'Block Test', () => {
	it( 'should manipulate block contents and attributes', () => {
		cy.newPage()
		cy.addBlock( 'ugb/header' )
		cy.openInspector( 'ugb/header', 'Layout' )
		cy.adjustLayout( 'Plain' )
		cy.adjustLayout( 'Center Overlay' )
		cy.adjustLayout( 'Basic' )
		cy.adjustDesign( 'Header 3' )

		cy.openInspector( 'ugb/header', 'Style' )
		cy.toggleStyle( 'Top Separator' )

		cy.adjust( 'Design', 'Slant 1' )
		cy.adjust( 'Separator Layer 2', true )
		cy.adjust( 'Separator Layer 2', {
			[ `Color` ]: '#aeaeae',
			[ `Layer Height` ]: 1.67,
			[ `Layer Width` ]: 1.11,
			[ `Flip Horizontally` ]: true,
			[ `Opacity` ]: 0.3,
			[ `Mix Blend Mode` ]: 'screen',
		} )

		cy.addGlobalColor( { name: 'Test', color: '#fff' } )
		cy.resetGlobalColor()
		cy.adjust( 'Use only Stackable colors', true )

		cy.addGlobalColor( { name: 'Test', color: '#fff' } )
		cy.deleteGlobalColor( 0 )

		cy.adjustGlobalTypography( 'h1', {
			[ `Size` ]: {
				value: 42,
				viewport: 'Tablet',
			},
			[ `Line-Height` ]: 2.9,
		} )
		cy.adjust( 'Apply Typography Styles to', 'blocks-all' )
		cy.resetGlobalTypography( 'h1' )

		cy.typeBlock( 'ugb/header', '.ugb-header__title', 'This is a header1' )
		cy.typeBlock( 'ugb/header', '.ugb-header__subtitle', 'This is a subtitle for header1' )
		cy.typeBlock( 'ugb/header', '.ugb-button--inner', 'Button text1' )

		cy.addBlock( 'ugb/header' )

		cy.typeBlock( 'ugb/header', '.ugb-header__title', 'This is a header2' )
		cy.typeBlock( 'ugb/header', '.ugb-header__subtitle', 'This is a subtitle for header2' )
		cy.typeBlock( 'ugb/header', '.ugb-button--inner', 'Button text2' )

		cy.deleteBlock( 'ugb/header', 'This is a header1' )
		cy.publish()
		cy.reload()

		cy.addBlock( 'core/heading' )

		cy.addBlock( 'ugb/card' )

		cy.typeBlock( 'ugb/card', '.ugb-card__item1>.ugb-card__content>.ugb-card__title', 'Card Title 1' )
		cy.typeBlock( 'ugb/card', '.ugb-card__item2>.ugb-card__content>.ugb-card__title', 'Card Title 2' )

		cy.openInspector( 'ugb/card', 'Style' )

		cy.collapse( 'General' )

		cy.adjust( 'Columns', 3 )
		cy.adjust( 'Border Radius', 15 )
		cy.adjust( 'Shadow / Outline', 5 )

		cy.openSidebar( 'Stackable Settings' )
		cy.openSidebar( 'Stackable Settings' )

		// Test the catching of errors
		cy.window().then( win => {
			win.console.error( 'It should throw an error in Cypress.' )
		} )
	} )
} )
