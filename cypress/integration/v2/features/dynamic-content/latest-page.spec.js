
/**
 * External dependencies
 */
import { first, range } from 'lodash'
import { registerTests } from '~stackable-e2e/helpers'

describe( 'Dynamic Content - Latest Page', registerTests( [
	matchPostData,
] ) )

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
 *
 * @param {number} idx
 */
function setupMatchPostFieldValues( idx ) {
	cy.newPage()
	// Define the alias.
	cy.wrap( [] ).as( `fieldsToAssert${ idx }` )

	// Populate Post Title.
	cy.typePostTitle( `Latest Page test ${ idx }` )
	addToTest( { name: 'Post Title', value: `Latest Page test ${ idx }` }, idx )

	// Populate Post Slug.
	addToTest( { name: 'Post Slug', value: `latest-page-test-${ idx }` }, idx )

	// Populate Post Excerpt
	cy.addBlock( 'core/paragraph' )
	cy.typeBlock( 'core/paragraph', '', `My sample excerpt text here ${ idx }` )
	cy.savePost()
	addToTest( { name: 'Post Excerpt', value: `My sample excerpt text here ${ idx }` }, idx )

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

	// Get the author's profile picture URL
	cy.wp().then( wp => {
		addToTest( { name: 'Author Profile Picture URL', value: wp.data.select( 'core' ).getAuthors()[ 0 ].avatar_urls[ 96 ] }, idx )
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
 * @param {number} idx
 */
function addToTest( item, idx ) {
	cy.get( `@fieldsToAssert${ idx }` ).then( $fta => cy.wrap( [ ...$fta, item ] ).as( `fieldsToAssert${ idx }` ) )
}

/**
 * Function that returns the nth of a given number.
 *
 * @param {number} n
 *
 * @return {string} the nth of a number. 1 returns st.
 */
function nth( n ) {
	// eslint-disable-next-line no-mixed-operators
	return [ 'st', 'nd', 'rd' ][ ( ( n + 90 ) % 100 - 10 ) % 10 - 1 ] || 'th'
}

function matchPostData() {
	it( 'should test dynamic content to match all field values in latest posts', () => {
		cy.setupWP()

		range( 10, 0 ).forEach( idx => {
			// Setup 10 latest pages for assertion.
			setupMatchPostFieldValues( idx )
		} )

		// Create a new post since we're asserting the latest pages.
		cy.newPost()

		range( 10, 0 ).forEach( idx => {
			cy.get( `@fieldsToAssert${ idx }` ).then( fieldsToAssert => {
				fieldsToAssert.forEach( ( {
					name: fieldName, value, options: fieldOptions = {},
				} ) => {
					cy.addBlock( 'ugb/cta' )

					// Adjust the dynamic content popover.
					cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
						source: 'Latest Post',
						post: `${ idx }${ nth( idx ) } Latest Page`,
						fieldName,
						fieldOptions,
					} )

					// Assert the value.
					cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', value )
					cy.deleteBlock( 'ugb/cta' )
				} )
				cy.savePost()
			} )
		} )
	} )
}
