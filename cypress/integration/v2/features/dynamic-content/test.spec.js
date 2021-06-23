describe( 'Dynamic Content', () => {
	it( 'should run test', () => {
		cy.setupWP()
		// Create a new post
		cy.registerPosts( { numOfPosts: 1 } )
		cy.newPage()
		cy.addBlock( 'ugb/cta' )
		cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
			source: 'Current Post',
			fieldName: 'Post Date',
			fieldOptions: {
				'Date Format': 'd/m/y',
			},
		} )
	} )
} )
