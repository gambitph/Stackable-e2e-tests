/**
 * Register functions to Cypress Commands
 */
Cypress.Commands.add( 'loginAdmin', loginAdmin )
Cypress.Commands.add( 'setupWP', setupWP )
Cypress.Commands.add( 'registerPosts', registerPosts )

/**
 * Command used to enter the login credentials of the admin.
 */
export function loginAdmin() {
	cy.visit( '/wp-login.php' )
	cy.get( '#user_login' ).clear().type( 'admin' )
	cy.get( '#user_pass' ).clear().type( 'admin' )
	cy.get( '#loginform' ).submit()
}

/**
 * Command for running the initial setup for the test.
 *
 * @param {Object} args
 */
export function setupWP( args = {} ) {
	const params = new URLSearchParams( {
		plugins: args.plugins || [],
		setup: true,
	} )
	cy.visit( '/?' + params.toString() )
}

/**
 * Command for creating blog posts.
 *
 * @param {Object} args
 */
export function registerPosts( args = {} ) {
	cy.fixture( 'posts' ).then( posts => {
		const params = new URLSearchParams( {
			postType: posts.post_type,
			postTitle: posts.post_title,
			postContent: posts.post_content,
			featuredImage: posts.featured_image,
			imageName: posts.image_name,
			numOfPosts: args.numOfPosts,
		} )
		cy.visit( '/?register-posts=' + params.toString() )
	} )
}

