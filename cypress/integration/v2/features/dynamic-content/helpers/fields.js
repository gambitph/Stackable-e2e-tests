/**
 * External dependencies
 */
import { range, first } from 'lodash'

/**
 * Setup function.
 *
 * This is where we populate `@fieldsToAssert` for
 * assertions.
 *
 * Prefetch field values and store it as alias.
 *
 * @param {string} type
 * @example `@fieldsToAssert` structure
 * ```
 * [
 * {
 * name: <fieldName>
 * value: <will assert value>,
 * options: { ...<`adjustDynamicContent` command options> }
 * }
 * ]
 * ```
 *
 */
export function setupMatchPostFieldValues( type ) {
	if ( type === 'post' ) {
		cy.newPost()
	} else {
		// Add 1 post for Author Posts field.
		cy.newPost()
		cy.typePostTitle( 'My sample post' )
		cy.newPage()
		cy.addBlock( 'core/paragraph' )
		// For page assertion, add text content as the excerpt since pages doesn't have post excerpt editor.
		cy.typeBlock( 'core/paragraph', '', 'Excerpt content.', 0 )
	}
	// Define the alias.
	cy.wrap( [] ).as( 'fieldsToAssert' )

	// Populate Post Title.
	cy.typePostTitle( 'Dynamic Content test' )
	addToTest( { name: 'Post Title', value: 'Dynamic Content test' } )

	// Populate Post Slug.
	addToTest( { name: 'Post Slug', value: 'dynamic-content-test' } )

	// Populate Post Excerpt.
	if ( type === 'post' ) {
		cy.addPostExcerpt( 'Excerpt content.' )
	}
	addToTest( { name: 'Post Excerpt', value: 'Excerpt content.' } )

	/**
	 * Populate the following fields:
	 * - Post URL
	 * - Post ID
	 * - Featured Image URL
	 * - Post Date
	 * - Post Date GMT
	 * - Post Modified
	 * - Post Modified GMT
	 * - Post Type
	 * - Post Status
	 * - Author Name
	 * - Author ID
	 * - Author Posts URL
	 * - Comment Number
	 * - Comment Status
	 */

	// Add comments
	cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
		cy.editPostDiscussion( { 'Allow comments': true } )
		cy.visit( previewUrl )
		range( 1, 4 ).forEach( num => {
			cy
				.get( '.comment-form-comment' )
				.find( 'textarea#comment' )
				.click( { force: true } )
				.type( `{selectall}{backspace}Test ${ num }` )
			cy.get( 'input[value="Post Comment"]' ).click( { force: true } )
		} )

		cy.visit( editorUrl )
	} )

	// Add a featured image.
	cy.addFeaturedImage()
	cy.getPostData().then( data => {
		// Post Fields
		addToTest( { name: 'Post URL', value: data.link } )
		addToTest( { name: 'Post ID', value: data.id } )
		addToTest( { name: 'Featured Image URL', value: data.featured_image_urls.full[ 0 ] } )
		addToTest( { name: 'Post Type', value: data.type } )
		addToTest( { name: 'Post Status', value: data.status } )

		/**
		 * Add a custom format for date values.
		 */
		const dateOptions = {
			'Date Format': 'custom',
			'Custom Format': 'Y-m-d',
		}

		addToTest( {
			name: 'Post Date', value: first( data.date.split( 'T' ) ), options: dateOptions,
		} )
		addToTest( {
			name: 'Post Date GMT', value: first( data.date_gmt.split( 'T' ) ), options: dateOptions,
		} )
		addToTest( {
			name: 'Post Modified', value: first( data.modified.split( 'T' ) ), options: dateOptions,
		} )
		addToTest( {
			name: 'Post Modified GMT', value: first( data.modified_gmt.split( 'T' ) ), options: dateOptions,
		} )

		// Author Fields
		addToTest( { name: 'Author Name', value: data.author_info.name } )
		addToTest( { name: 'Author ID', value: data.author } )
		addToTest( { name: 'Author Posts URL', value: data.author_info.url } )

		// Misc. Fields
		addToTest( { name: 'Comment Number', value: parseInt( data.comments_num ).toString() } )
		addToTest( { name: 'Comment Status', value: data.comment_status } )
	} )

	// Get the author's profile picture URL
	cy.wp().then( wp => {
		addToTest( { name: 'Author Profile Picture URL', value: wp.data.select( 'core' ).getAuthors()[ 0 ].avatar_urls[ 96 ] } )
	} )

	/**
	 * Populate the following fields:
	 *
	 * - Author First Name
	 * - Author Last Name
	 * - Author Posts
	 */
	cy.getPostUrls().then( ( { editorUrl } ) => {
		// Set Author first & last name in profile settings
		cy.visit( '/wp-admin/profile.php' )

		cy.get( 'tr.user-first-name-wrap input#first_name' ).click( { force: true } ).type( '{selectall}{backspace}Juan' )
		addToTest( { name: 'Author First Name', value: 'Juan' } )

		cy.get( 'tr.user-last-name-wrap input#last_name' ).click( { force: true } ).type( '{selectall}{backspace}Dela Cruz' )
		addToTest( { name: 'Author Last Name', value: 'Dela Cruz' } )

		cy.get( 'input[value="Update Profile"]' ).click( { force: true } )

		cy.visit( '/wp-admin/users.php' )
		cy.get( '[data-colname="Posts"] span[aria-hidden="true"]' ).invoke( 'text' ).then( numberOfPosts => {
			addToTest( { name: 'Author Posts', value: numberOfPosts } )
		} )
		// Go back to the editor.
		cy.visit( editorUrl )
	} )
}

/**
 * Helper function for adding a new entry
 * in `fieldsToAssert`
 *
 * @param {Object} item
 */
export function addToTest( item ) {
	cy.get( '@fieldsToAssert' ).then( $fta => cy.wrap( [ ...$fta, item ] ).as( 'fieldsToAssert' ) )
}
