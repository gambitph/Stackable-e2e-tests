
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
	adjustFieldValues,
] ) )

const adjustPostField = ( fieldName, fieldOptions = {}, idx ) => {
	cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
		source: 'Latest Post',
		post: `${ idx }${ nth( idx ) } Latest Post`,
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
 *
 * @param {number} idx
 */
function setFieldValues( idx ) {
	cy.newPost()
	// Define the alias.
	cy.wrap( [] ).as( `fieldsToAssert${ idx }` )

	// Populate Post Title.
	cy.typePostTitle( `Latest Post #${ idx }` )
	addToTest( { name: 'Post Title', value: `Latest Post #${ idx }` }, idx )

	// Populate Post Slug.
	addToTest( { name: 'Post Slug', value: `latest-post-${ idx }` }, idx )

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
		// Populating Comment Number
		cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
			cy.editPostDiscussion( { 'Allow comments': true } )
			cy.visit( previewUrl )
			range( 1, 5 ).forEach( num => {
				cy
					.get( '.comment-form-comment' )
					.find( 'textarea#comment' )
					.click( { force: true } )
					.type( `{selectall}{backspace}Test ${ num }` )
				cy.get( 'input[value="Post Comment"]' ).click( { force: true } )
			} )

			cy.visit( editorUrl )
		} )
		addToTest( { name: 'Comment Number', value: parseInt( data.comments_num ).toString() }, idx )
		addToTest( { name: 'Comment Status', value: data.comment_status }, idx )
	} )

	cy.getPostUrls().then( ( { editorUrl } ) => {
		// Set Author first & last name in profile settings
		cy.visit( '/wp-admin/profile.php' )

		cy.get( 'tr.user-first-name-wrap input#first_name' ).click( { force: true } ).type( '{selectall}{backspace}Juan' )
		addToTest( { name: 'Author First Name', value: 'Juan' }, idx )

		cy.get( 'tr.user-last-name-wrap input#last_name' ).click( { force: true } ).type( '{selectall}{backspace}Dela Cruz' )
		addToTest( { name: 'Author Last Name', value: 'Dela Cruz' }, idx )

		cy.get( 'input[value="Update Profile"]' ).click( { force: true } )

		// Author Posts default value to 10 since there are 10 posts to assert
		addToTest( { name: 'Author Posts', value: '10' }, idx )

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
 * This is used to select the nth Latest Page in dynamic content popover.
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
	it( 'should match dynamic content in latest posts', () => {
		cy.setupWP()
		//Populating 10 posts
		range( 10, 0 ).forEach( id => {
			setFieldValues( id )
		} )
		range( 10, 0 ).forEach( idx => {
			cy.newPage()
			// assertions
			cy.get( `@fieldsToAssert${ idx }` ).then( fieldsToAssert => {
				fieldsToAssert.forEach( ( {
					name: fieldName, value, options: fieldOptions = {},
				} ) => {
					cy.addBlock( 'ugb/cta' )
					adjustPostField( fieldName, fieldOptions, idx )
					cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', value )
					cy.deleteBlock( 'ugb/cta' )
				} )
			} )
			cy.savePost()
		} )
	} )
}

function adjustFieldOptions() {
	it( 'should adjust all options for each field in a post', () => {
		cy.setupWP()
		cy.newPage()
		// adjusting all fields for each latest post
		// adjusting Post Title
		cy.typePostTitle( 'Adjusting Latest Post 1' )
		cy.addBlock( 'ugb/cta' )
		adjustPostField( 'Post Title', {
			'Show as link': true,
			'Open in new tab': true,
		}, 1 )

		// assert changes
		cy.selectBlock( 'ugb/cta' ).assertHtmlAttribute( '.ugb-cta__title a', 'rel', 'noreferrer noopener', { assertBackend: false } )
		cy.deleteBlock( 'ugb/cta' )

		// adjusting Post URL options
		cy.addBlock( 'ugb/cta' )
		adjustPostField( 'Post URL', {
			'Show as link': true,
			'Custom Text': 'This post',
			'Open in new tab': true,
		}, 1 )
		// asserting changes
		cy.selectBlock( 'ugb/cta' ).assertHtmlAttribute( '.ugb-cta__title a', 'rel', 'noreferrer noopener', { assertBackend: false } )
		cy.deleteBlock( 'ugb/cta' )

		// adjusting Post excerpt options
		cy.addBlock( 'ugb/cta' )
		adjustPostField( 'Post Excerpt', {
			'Excerpt Length': 5,
		}, 1 )

		cy.publish()
		// asserting changes
		cy.getPostUrls().then( ( { previewUrl } ) => {
			cy.visit( previewUrl )
			// Excerpt length should be 5.
			cy.document().then( doc => {
				assert.isTrue(
					[ ...doc.querySelector( '.ugb-cta__title' ).innerText.split( ' ' ) ].length === 5,
					'Expected excerpt text length to equal \'5\''
				)
			} )
		} )
		cy.deleteBlock( 'ugb/cta' )
		// For Post Date, Date GMT, Modified & Modified GMT options
		const dateFields = [ 'Post Date', 'Post Date GMT', 'Post Modified', 'Post Modified GMT' ]
		const dateFormats = [ 'Y-m-d H:i:s', 'F j, Y', 'F j, Y g:i a', 'd/m/y' ]
		dateFields.forEach( dateField => {
			cy.wrap( [] ).as( 'dateFormatValues' )

			dateFormats.forEach( dateFormat => {
				cy.addBlock( 'ugb/cta' )
				adjustPostField( dateField, {
					'Date Format': dateFormat,
				}, 1 )
				cy.document().then( doc => {
					cy.get( '@dateFormatValues' ).then( dateFormatValues => {
						// Store the values to be compared in this alias.
						cy.wrap( [ ...dateFormatValues, doc.querySelector( '.ugb-cta__title' ).innerText ] ).as( 'dateFormatValues' )
					} )
				} )
			} )

			cy.get( '@dateFormatValues' ).then( dateFormatValues => {
				// Assert that the values are not equal. This means that the formats changed.
				assert.isTrue(
					! dateFormatValues.some( ( value, idx ) => dateFormatValues.indexOf( value ) !== idx ), // Returns true if values are unique
					`Expected all date format values to be unique. Values: "${ dateFormatValues.join( ', ' ) }"`
				)
			} )
		} )
		cy.addBlock( 'ugb/cta' )
		// asserting Author-field-related options
		adjustPostField( 'Author Posts URL', {
			'Show as link': true,
			'Custom text': 'Author #1',
			'Open in new tab': true,
		}, 1 )

		cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', 'Author #1' )
		cy.selectBlock( 'ugb/cta' ).assertHtmlAttribute( '.ugb-cta__title a', 'rel', 'noreferrer noopener', { assertBackend: false } )
		cy.deleteBlock( 'ugb/cta' )
	} )
}

function adjustFieldValues() {
	it( 'should assert in the front-end the adjusted field values', () => {
		cy.setupWP()
		// initial loop for adjusting

		cy.newPost()
		cy.wrap( [] ).as( 'fieldsToAssert1' )

		// Post Title
		cy.typePostTitle( 'New Post Title' )
		addToTest( { name: 'Post Title', value: 'New Post Title' }, 1 )

		// Post Slug
		addToTest( { name: 'Post Slug', value: 'new-post-slug' }, 1 )

		// Post Excerpt
		cy.addPostExcerpt( 'New post excerpt' )
		addToTest( { name: 'Post Excerpt', value: 'New post excerpt' }, 1 )

		// Post status
		cy.publish()
		// Comment Number
		cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
			cy.editPostDiscussion( { 'Allow comments': true } )
			cy.publish()
			cy.visit( previewUrl )
			range( 1, 5 ).forEach( num => {
				cy
					.get( '.comment-form-comment' )
					.find( 'textarea#comment' )
					.click( { force: true } )
					.type( `{selectall}{backspace}Test ${ num }` )
				cy.get( 'input[value="Post Comment"]' ).click( { force: true } )
			} )

			cy.visit( editorUrl )
		} )
		//Comment Status
		cy.editPostDiscussion( { 'Allow comments': false } )

		//Adding to Test
		cy.getPostData().then( data => {
			addToTest( { name: 'Post Status', value: data.status }, 1 )
			addToTest( { name: 'Comment Number', value: parseInt( data.comments_num ).toString() }, 1 )
			addToTest( { name: 'Comment Status', value: data.comment_status }, 1 )
		} )
		// second loop for asserting
		cy.get( '@fieldsToAssert1' ).then( fieldsToAssert => {
			fieldsToAssert.forEach( ( {
				name: fieldName, value, options: fieldOptions = {},
			} ) => {
				cy.addBlock( 'ugb/cta' )
				adjustPostField( fieldName, fieldOptions, 1 )
				cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', value )
				cy.deleteBlock( 'ugb/cta' )
			} )
		} )
		cy.savePost()
	} )
}

/**
 * Bugs:
 * 	MatchPostData:
 * 		- addFeaturedImage() creates an additional post.
 *  	- post ID and comment number placeholder string instead of value
 *  	- Author Posts does not match number of posts`
 * 		- line 149 error on fieldstoAssert
 */
