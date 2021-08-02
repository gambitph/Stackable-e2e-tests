
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'
import {
	first, uniqueId,
} from 'lodash'

describe( 'Dynamic Content - Latest Post', registerTests( [
	matchPostData,
	adjustFieldOptions,
	adjustFieldValues,
] ) )

const adjustPostField = ( fieldName, fieldOptions = {} ) => {
	cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
		source: 'Latest Post',
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
function setFieldValues() {
	it( 'should populate fields for Latest Post', () => {
		cy.setupWP()
		cy.newPost()
		// Define the alias.
		cy.wrap( [] ).as( 'fieldsToAssert' )

		// Populate Post Title.
		cy.typePostTitle( 'Latest Post test' )
		addToTest( { name: 'Post Title', value: 'Latest Post test' } )

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
function matchPostData() {
	it( 'should match dynamic content in latest post fields', () => {
		setFieldValues()
		cy.get( '@fieldsToAssert' ).then( fieldsToAssert => {
			fieldsToAssert.forEach( ( {
				name: fieldName, value, options: fieldOptions = {},
			} ) => {
				cy.addBlock( 'ugb/cta' )

				// Adjusting dynamic content
				adjustPostField( fieldName, fieldOptions )

				// Assert the value.
				cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', value )
				cy.deleteBlock( 'ugb/cta' )
			} )
			cy.savePost()
		} )
	} )
}

function adjustFieldOptions() {
	it( 'should adjust all fields with options', () => {
		cy.setupWP()
	} )
}

function adjustFieldValues() {
	it( 'should assert changes to the field values', () => {
		cy.setupWP()
	} )
}

/*
    testing flow:
    1. add populated posts for latest posts (1st to 3rd)
       /**
	 * Populate the following fields:
	 * - Post Title
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
    2. display and assert dynamic content function
    3. publish pages
    4. test latest post DC function per nth post
*/
