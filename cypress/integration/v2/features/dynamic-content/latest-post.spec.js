
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'
import {
	first, range,
} from 'lodash'

describe( 'Dynamic Content - Latest Post', registerTests( [
	matchPostData,
	adjustFieldOptions,
] ) )

const adjustPostField = ( fieldName, fieldOptions = {}, idx ) => {
	cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
		source: 'Latest Post',
		post: `${ idx }${ nth( idx ) } Latest Post`,
		fieldName,
		fieldOptions,
	} )
}
function nth( n ) {
	// eslint-disable-next-line no-mixed-operators
	return [ 'st', 'nd', 'rd' ][ ( ( n + 90 ) % 100 - 10 ) % 10 - 1 ] || 'th'
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
/**
 * idx as an indicator for Nth Post
 *
 * @param {number} idx
 */
function setFieldValues( idx ) {
	cy.newPost()
	// Define the alias.
	cy.wrap( [] ).as( `fieldsToAssert${ idx }` )

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

	// Populate Post Title.
	cy.typePostTitle( `Latest Post #${ idx }` )
	addToTest( { name: 'Post Title', value: `Latest Post #${ idx }` }, idx )

	// Populate Post Slug.
	addToTest( { name: 'Post Slug', value: `latest-post-test-${ idx }` }, idx )

	// Populate Post Excerpt.
	cy.addPostExcerpt( `Test excerpt #${ idx }` )
	addToTest( { name: 'Post Excerpt', value: `Test excerpt #${ idx }` }, idx )

	// Add a featured image.
	cy.addFeaturedImage()

	// Get the author's profile picture URL
	cy.wp().then( wp => {
		addToTest( { name: 'Author Profile Picture URL', value: wp.data.select( 'core' ).getAuthors()[ 0 ].avatar_urls[ 96 ] }, idx )
	} )

	cy.getPostData().then( data => {
		// Post Fields
		addToTest( { name: 'Post URL', value: data.link }, idx )
		addToTest( { name: 'Post ID', value: data.id }, idx )
		addToTest( { name: 'Featured Image URL', value: data.featured_image_urls.full[ 0 ] }, idx )
		addToTest( { name: 'Post Type', value: data.type }, idx )
		addToTest( { name: 'Post Status', value: data.status }, idx )

		/**
		 * Add a custom format for date values.
		 */
		const dateOptions = {
			'Date Format': 'custom',
			'Custom Format': 'Y-m-d',
		}

		addToTest( {
			name: 'Post Date', value: first( data.date.split( 'T' ) ), options: dateOptions,
		}, idx )
		addToTest( {
			name: 'Post Date GMT', value: first( data.date_gmt.split( 'T' ) ), options: dateOptions,
		}, idx )
		addToTest( {
			name: 'Post Modified', value: first( data.modified.split( 'T' ) ), options: dateOptions,
		}, idx )
		addToTest( {
			name: 'Post Modified GMT', value: first( data.modified_gmt.split( 'T' ) ), options: dateOptions,
		}, idx )

		// Author Fields
		addToTest( { name: 'Author Name', value: data.author_info.name }, idx )
		addToTest( { name: 'Author ID', value: data.author }, idx )
		addToTest( { name: 'Author Posts URL', value: data.author_info.url }, idx )

		// Misc. Fields
		addToTest( { name: 'Comment Number', value: parseInt( data.comments_num ).toString() }, idx )
		addToTest( { name: 'Comment Status', value: data.comment_status }, idx )
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
		addToTest( { name: 'Author First Name', value: 'Juan' }, idx )

		cy.get( 'tr.user-last-name-wrap input#last_name' ).click( { force: true } ).type( '{selectall}{backspace}Dela Cruz' )
		addToTest( { name: 'Author Last Name', value: 'Dela Cruz' }, idx )

		cy.get( 'input[value="Update Profile"]' ).click( { force: true } )

		cy.visit( '/wp-admin/users.php' )
		cy.get( '[data-colname="Posts"] span[aria-hidden="true"]' ).invoke( 'text' ).then( numberOfPosts => {
			addToTest( { name: 'Author Posts', value: numberOfPosts }, idx )
		} )
		// Go back to the editor.
		cy.visit( editorUrl )
	} )
	cy.publish()
}

/**
 * Helper function for adding a new entry
 * in `fieldsToAssert`
 *
 * @param {Object} item
 */

function addToTest( item, idx ) {
	cy.get( `@fieldsToAssert${ idx }` ).then( $fta => cy.wrap( [ ...$fta, item ] ).as( `fieldsToAssert${ idx }` ) )
}
function populatePosts() {
	range( 3, 0 ).forEach( idx => {
		setFieldValues( idx )
	} )
}
function matchPostData() {
	it( 'should match dynamic content in latest posts', () => {
		cy.setupWP()
		populatePosts()

		cy.newPost()
		range( 3, 0 ).forEach( idx => {
			// assertions
			cy.get( `@fieldsToAssert${ idx }` ).then( fieldsToAssert => {
				fieldsToAssert.forEach( ( {
					name: fieldName, value, options: fieldOptions = {},
				} ) => {
					cy.addBlock( 'ugb/cta' )

					// Adjusting dynamic content
					adjustPostField( fieldName, fieldOptions, idx )

					// Assert the value.
					cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', value )
					cy.deleteBlock( 'ugb/cta' )
				} )
				//cy.savePost()
			} )
		} )
	} )
}

/**
 * fix sample post issue, look into commands used in setFieldValues
 */

function adjustFieldOptions() {
	it( 'should adjust all options for each field in all latest posts', () => {
		cy.setupWP()
		cy.newPost() //check if it gets added to list of posts
		// adjusting all fields for each latest post
		range( 3, 0 ).forEach( idx => {
			// adjusting Post Title
			cy.typePostTitle( `Adjusting Post ${ idx }` )
			cy.addBlock( 'ugb/cta' )
			adjustPostField( 'Post Title', {
				'Show as link': true,
				'Open in new tab': true,
			}, idx )

			// assert changes
			cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', `Adjusting Post ${ idx }` )
			cy.selectBlock( 'ugb/cta' ).assertHtmlAttribute( '.ugb-cta__title a', 'rel', 'noreferrer noopener', { assertBackend: false } )
			cy.deleteBlock( 'ugb/cta' )

			// adjusting Post URL options
			cy.addBlock( 'ugb/cta' )
			adjustPostField( 'Post URL', {
				'Show as link': true,
				'Custom Text': 'This post',
				'Open in new tab': true,
			}, idx )
			// asserting changes
			cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', 'This post' )
			cy.selectBlock( 'ugb/cta' ).assertHtmlAttribute( '.ugb-cta__title a', 'rel', 'noreferrer noopener', { assertBackend: false } )
			cy.deleteBlock( 'ugb/cta' )

			// adjusting Post excerpt options
			cy.addBlock( 'ugb/cta' )
			cy.addPostExcerpt( 'This is a sample excerpt... Lorem ipsum dolor sit amet.' )
			adjustPostField( 'Post Excerpt', {
				'Excerpt Length': 5,
			}, idx )
			// asserting changes
		} )
	} )
}
