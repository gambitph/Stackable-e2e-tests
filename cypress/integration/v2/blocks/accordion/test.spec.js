describe( 'test', () => {
	it( 'test', () => {
		cy.wrap( [] ).as( 'blockSnapshotBlocks' )
		cy.setupWP()
		cy.newPage()

		cy.addBlock( 'ugb/button' )
		cy.openInspector( 'ugb/button', 'Style' )
		cy.collapse( 'Button #1' )

		cy.adjust( 'Hover Colors', {
			'Button Color': '#f63636',
		} ).assertComputedStyle( {
			'.ugb-button1:hover': {
				'background-color': '#f63636',
			},
		} )
	} )
} )
