describe( 'Dynamic Content', () => {
	it( 'should run test', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/card' )
		cy.adjustDynamicContent( 'ugb/card', 0, '.ugb-card__title:first', {
			source: 'Current Post',
			fieldName: 'Post Title',
			fieldOptions: {
				'Show as link': true,
			},
		} )
	} )
} )
