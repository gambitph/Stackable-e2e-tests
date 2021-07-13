/**
 * Register functions to Cypress Commands
 */
Cypress.Commands.add( 'loginAdmin', loginAdmin )
Cypress.Commands.add( 'setupWP', setupWP )
Cypress.Commands.add( 'registerPosts', registerPosts )
Cypress.Commands.add( 'changeRole', changeRole )
Cypress.Commands.add( 'editSiteTitle', editSiteTitle )
Cypress.Commands.add( 'editSiteTagline', editSiteTagline )

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
			'postType': posts.post_type,
			'postTitle': posts.post_title,
			'postContent': posts.post_content,
			'featuredImage': posts.featured_image,
			'imageName': posts.image_name,
			'numOfPosts': args.numOfPosts,
			'register-posts': 'true',
		} )
		cy.visit( '/?' + params.toString() )
	} )
}

/**
 * Command for changing the role of the current user.
 *
 * @param {Object} args
 */
export function changeRole( args = {} ) {
	const params = new URLSearchParams( {
		'roleTo': args.roleTo,
		'change-role': 'true',
	} )
	cy.visit( '/?' + params.toString() )
}

/**
 * Command for editing the site title in the customizer.
 *
 * @param {string} title
 */
export function editSiteTitle( title ) {
	cy.visit( '/wp-admin/customize.php' )
	cy
		.get( '.customize-pane-parent' )
		.contains( 'Site Identity' )
		.click( { force: true } )
	cy
		.get( '.customize-pane-child #customize-control-blogname' )
		.find( 'input[data-customize-setting-link="blogname"]' )
		.type( `{selectall}${ title }`, { force: true } )
	cy
		.get( '#customize-header-actions' )
		.find( 'input[value="Publish"]' )
		.click( { force: true } )
}

/**
 * Command for editing the site tagline in the customizer.
 *
 * @param {string} tagline
 */
export function editSiteTagline( tagline ) {
	cy.visit( '/wp-admin/customize.php' )
	cy
		.get( '.customize-pane-parent' )
		.contains( 'Site Identity' )
		.click( { force: true } )
	cy
		.get( '.customize-pane-child #customize-control-blogdescription' )
		.find( 'input[data-customize-setting-link="blogdescription"]' )
		.type( `{selectall}${ tagline }`, { force: true } )
	cy
		.get( '#customize-header-actions' )
		.find( 'input[value="Publish"]' )
		.click( { force: true } )
}
