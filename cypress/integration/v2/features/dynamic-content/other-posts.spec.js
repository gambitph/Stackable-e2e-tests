/**
 * External dependencies
 */
import {
	first, range, uniqueId,
} from 'lodash'
import { registerTests } from '~stackable-e2e/helpers'

describe( 'Dynamic Content Other Posts', registerTests( [
	matchPostFieldValues,
	adjustFieldOptions,
	assertEmptyValues,
	assertPostsExist,
] ) )

// Always use this adjustField in this spec.
const adjustField = ( fieldName, fieldOptions = {} ) => {
	cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
		source: 'Other Posts',
		post: 'First Post',
		fieldName,
		fieldOptions,
	} )
}

/**
 * Setup function.
 *
 * This is where we populate `@fieldsToAssert` for
 * assertions.
 *
 * Prefetch field values and store it as alias.
 *
 * @example `@fieldsToAssert` structure
 * ```
 * [
 * 		{
 * 			name: <fieldName>
 * 			value: <will assert value>,
 * 			options: { ...<`adjustDynamicContent` command options> }
 * 		}
 * ]
 * ```
 */
function setupMatchPostFieldValues() {
	cy.setupWP()
	cy.newPost()

	// Define the alias.
	cy.wrap( [] ).as( 'fieldsToAssert' )

	// Populate Post Title.
	cy.typePostTitle( 'First Post' )
	addToTest( { name: 'Post Title', value: 'First Post' } )

	// Populate Post Slug.
	const slug = `post-slug-${ ( new Date().getTime() * uniqueId() ) % 1000 }`
	cy.addPostSlug( slug )
	addToTest( { name: 'Post Slug', value: slug } )

	// Populate Post Excerpt.
	cy.addPostExcerpt( 'Excerpt content.' )
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
}

/**
 * Helper function for adding a new entry
 * in `fieldsToAssert`
 *
 * @param {Object} item
 */
function addToTest( item ) {
	cy.get( '@fieldsToAssert' ).then( $fta => cy.wrap( [ ...$fta, item ] ).as( 'fieldsToAssert' ) )
}

function matchPostFieldValues() {
	it( 'should test dynamic content to match all field values', () => {
		// Setup function
		setupMatchPostFieldValues()
		// Create a new page to assert the Other Posts / created post's field values.
		cy.newPage()
		cy.get( '@fieldsToAssert' ).then( fieldsToAssert => {
			fieldsToAssert.forEach( ( {
				name: fieldName, value, options: fieldOptions = {},
			} ) => {
				cy.addBlock( 'ugb/cta' )

				// Adjust the dynamic content popover.
				adjustField( fieldName, fieldOptions )

				// Assert the value.
				cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', value )
				cy.deleteBlock( 'ugb/cta' )
			} )
		} )
		cy.savePost()
	} )
}

function adjustFieldOptions() {
	it( 'should adjust all field options of each field in other post', () => {
		cy.setupWP()
		// Add a post and populate the fields.
		cy.newPost()
		cy.addBlock( 'core/paragraph' )
		cy.typePostTitle( 'First Post' )
		cy.addFeaturedImage()
		cy.addPostExcerpt( 'Hello World! Sample excerpt here. Lorem ipsum' )
		cy.addPostSlug( 'my-first-post' )
		cy.publish()

		// Retrieve the data of the created post for assertion.
		cy.getPostData().then( postData => {
			// Create a new page to assert the Other Posts source.
			cy.newPage()

			/**
			 * Fields to test for this assertion:
			 * - Post Title
			 * - Post URL
			 * - Post Excerpt
			 * - Post Date
			 * - Date GMT
			 * - Modified Date
			 * - Modified GMT
			 * - Author Posts URL
			 */

			// Post Title options
			cy.addBlock( 'ugb/cta' )
			adjustField( 'Post Title', {
				'Show as link': true,
				'Open in new tab': true,
			} )
			cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', 'First Post' )
			cy.selectBlock( 'ugb/cta' ).assertHtmlAttribute( '.ugb-cta__title a', 'href', postData.link, { assertBackend: false } )
			cy.selectBlock( 'ugb/cta' ).assertHtmlAttribute( '.ugb-cta__title a', 'rel', 'noreferrer noopener', { assertBackend: false } )
			cy.deleteBlock( 'ugb/cta' )

			// Post URL options
			cy.addBlock( 'ugb/cta' )
			adjustField( 'Post URL', {
				'Show as link': true,
				'Custom Text': 'This post',
				'Open in new tab': true,
			} )
			cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', 'This post' )
			cy.selectBlock( 'ugb/cta' ).assertHtmlAttribute( '.ugb-cta__title a', 'href', postData.link, { assertBackend: false } )
			cy.selectBlock( 'ugb/cta' ).assertHtmlAttribute( '.ugb-cta__title a', 'rel', 'noreferrer noopener', { assertBackend: false } )
			cy.deleteBlock( 'ugb/cta' )

			// Post Excerpt options
			cy.addBlock( 'ugb/cta' )
			adjustField( 'Post Excerpt', {
				'Excerpt Length': 5,
			} )
			cy.document().then( doc => {
				const text = doc.querySelector( '.ugb-cta__title' ).innerText
				assert.isTrue(
					text.split( ' ' ).length === 5,
					`Expected Excerpt length to equal '5'. Found: '${ text.split( ' ' ).length }'`
				)
			} )

			cy.deleteBlock( 'ugb/cta' )

			// For Post Date, Date GMT, Modified & Modified GMT options
			const dateFields = [ 'Post Date', 'Post Date GMT', 'Post Modified', 'Post Modified GMT' ]
			const dateFormats = [ 'Y-m-d H:i:s', 'F j, Y', 'F j, Y g:i a', 'd/m/y' ]
			dateFields.forEach( dateField => {
				cy.wrap( [] ).as( 'dateFormatValues' )

				dateFormats.forEach( dateFormat => {
					cy.addBlock( 'ugb/cta' )
					adjustField( dateField, {
						'Date Format': dateFormat,
					} )
					cy.document().then( doc => {
						cy.get( '@dateFormatValues' ).then( dateFormatValues => {
							// Store the values to be compared in this alias.
							cy.wrap( [ ...dateFormatValues, doc.querySelector( '.ugb-cta__title' ).innerText ] ).as( 'dateFormatValues' )
						} )
					} )
					cy.deleteBlock( 'ugb/cta' )
				} )

				cy.get( '@dateFormatValues' ).then( dateFormatValues => {
					// Assert that the values are not equal. This means that the formats changed.
					assert.isTrue(
						! dateFormatValues.some( ( value, idx ) => dateFormatValues.indexOf( value ) !== idx ), // Returns true if values are unique
						`Expected all date format values to be unique. Values: "${ dateFormatValues.join( ', ' ) }"`
					)
				} )
			} )

			// Author Posts URL options.
			cy.addBlock( 'ugb/cta' )
			adjustField( 'Author Posts URL', {
				'Show as link': true,
				'Custom Text': 'This author',
				'Open in new tab': true,
			} )
			cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', 'This author' )
			cy.selectBlock( 'ugb/cta' ).assertHtmlAttribute( '.ugb-cta__title a', 'href', postData.author_info.url, { assertBackend: false } )
			cy.selectBlock( 'ugb/cta' ).assertHtmlAttribute( '.ugb-cta__title a', 'rel', 'noreferrer noopener', { assertBackend: false } )
			cy.deleteBlock( 'ugb/cta' )
		} )
	} )
}

function assertEmptyValues() {
	it( 'should assert empty values in the frontend', () => {
		cy.setupWP()
		cy.newPost()
		cy.typePostTitle( 'First Post' )

		const emptyFields = [
			'Author First Name',
			'Author Last Name',
			'Featured Image URL',
		]

		cy.newPage()
		emptyFields.forEach( fieldName => {
			cy.addBlock( 'ugb/cta' )
			adjustField( fieldName )
			cy
				.selectBlock( 'ugb/cta' )
				.assertBlockContent( '.ugb-cta__title', '', { assertBackend: false } )
		} )
	} )
}

function assertPostsExist() {
	it( 'should assert the list of posts and pages created in Other Posts source', () => {
		cy.wrap( [] ).as( 'postsList' )

		cy.setupWP()

		cy.newPage()
		cy.typePostTitle( 'My Homepage' )
		cy.get( '@postsList' ).then( postsList => cy.wrap( [ ...postsList, 'My Homepage' ] ).as( 'postsList' ) )
		cy.publish()

		cy.newPage()
		cy.typePostTitle( 'Test page' )
		cy.get( '@postsList' ).then( postsList => cy.wrap( [ ...postsList, 'Test page' ] ).as( 'postsList' ) )
		cy.publish()

		cy.registerPosts( { numberOfPosts: 2 } ) // Creates 2 posts.
		cy.fixture( 'posts' ).then( posts => {
			// Save the post title of the registered posts to postsList
			range( 1, 3 ).forEach( idx => {
				cy.get( '@postsList' ).then( postsList => cy.wrap( [ ...postsList, `${ posts.post_title }${ idx - 1 }` ] ).as( 'postsList' ) )
			} )
		} )

		cy.newPage()
		cy.get( '@postsList' ).then( postsList => {
			postsList.forEach( post => {
				cy.addBlock( 'ugb/cta' )
				// Should not throw an error. All posts should be visible in the suggestions.
				cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__description', {
					source: 'Other Posts',
					post,
					fieldName: 'Post Title',
				} )
				cy.deleteBlock( 'ugb/cta' )
			} )
		} )
	} )
}
