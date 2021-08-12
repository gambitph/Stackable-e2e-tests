/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'
import {
	first, range, escape,
} from 'lodash'

describe( 'Dynamic Content Current Post', registerTests( [
	matchPostFieldValues,
	adjustFieldOptions,
	adjustFieldValues,
	assertEmptyValues,
	otherTests,
] ) )

const createNewPostWithCTA = () => {
	cy.newPost()
	cy.addBlock( 'ugb/cta' )
}
const adjustField = ( fieldName, fieldOptions = {} ) => {
	cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
		source: 'Current Post',
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
	cy.typePostTitle( 'Dynamic Content test' )
	addToTest( { name: 'Post Title', value: 'Dynamic Content test' } )

	// Populate Post Slug.
	addToTest( { name: 'Post Slug', value: 'dynamic-content-test' } )

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
		cy.get( '@fieldsToAssert' ).then( fieldsToAssert => {
			fieldsToAssert.forEach( ( {
				name: fieldName, value, options: fieldOptions = {},
			} ) => {
				cy.addBlock( 'ugb/cta' )

				// Adjust the dynamic content popover.
				cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
					source: 'Current Post',
					fieldName,
					fieldOptions,
				} )

				// Assert the value.
				cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', escape( value ), { assertFrontend: false } )
				cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', value, { assertBackend: false } )

				cy.deleteBlock( 'ugb/cta' )
			} )
			cy.savePost()
		} )
	} )
}

function adjustFieldOptions() {
	it( 'should adjust all field options of each field in current post', () => {
		cy.setupWP()
		// Test only the fields with field options.
		// Post Title options
		createNewPostWithCTA()
		cy.typePostTitle( 'Dynamic Content test' )
		adjustField( 'Post Title', {
			'Show as link': true,
			'Open in new tab': true,
		} )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'Dynamic Content test' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertHtmlAttribute( '.ugb-cta__title a', 'rel', 'noreferrer noopener', { assertBackend: false } )

		// Post URL options
		createNewPostWithCTA()
		adjustField( 'Post URL', {
			'Show as link': true,
			'Custom Text': 'This post',
			'Open in new tab': true,
		} )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'This post' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertHtmlAttribute( '.ugb-cta__title a', 'rel', 'noreferrer noopener', { assertBackend: false } )

		// Post Excerpt options
		createNewPostWithCTA()
		cy.addPostExcerpt( 'This is a sample excerpt... Lorem ipsum dolor sit amet.' )
		adjustField( 'Post Excerpt', {
			'Excerpt Length': 5,
		} )
		cy.publish()
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

		// For Post Date, Date GMT, Modified & Modified GMT options
		const dateFields = [ 'Post Date', 'Post Date GMT', 'Post Modified', 'Post Modified GMT' ]
		const dateFormats = [ 'Y-m-d H:i:s', 'F j, Y', 'F j, Y g:i a', 'd/m/y' ]
		dateFields.forEach( dateField => {
			cy.wrap( [] ).as( 'dateFormatValues' )

			dateFormats.forEach( dateFormat => {
				createNewPostWithCTA()
				adjustField( dateField, {
					'Date Format': dateFormat,
				} )
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

		// Author Posts URL options
		createNewPostWithCTA()
		adjustField( 'Author Posts URL', {
			'Show as link': true,
			'Custom Text': 'This author',
			'Open in new tab': true,
		} )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'This author' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertHtmlAttribute( '.ugb-cta__title a', 'rel', 'noreferrer noopener', { assertBackend: false } )
	} )
}

function adjustFieldValues() {
	it( 'should assert the correct value in frontend after changing post data values', () => {
		cy.setupWP()

		// Assert changing the Post Title
		createNewPostWithCTA()
		adjustField( 'Post Title' )
		cy.typePostTitle( 'My New Post' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'My New Post', { assertBackend: false } )

		// Assert changing the Post Slug
		createNewPostWithCTA()
		cy.typePostTitle( 'Hello World' )
		cy.publish() // Publishing creates a post slug
		adjustField( 'Post Slug' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'hello-world', { assertBackend: false } )

		// Assert changing the Post Excerpt
		createNewPostWithCTA()
		adjustField( 'Post Excerpt' )
		cy.addPostExcerpt( 'Lorem ipsum dolor sit amet.' )
		cy.savePost()
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'Lorem ipsum dolor sit amet.', { assertBackend: false } )

		// Assert changing the Post Status
		createNewPostWithCTA()
		adjustField( 'Post Status' )
		cy.publish()
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'publish', { assertBackend: false } )

		// Assert changing the Comment Status
		createNewPostWithCTA()
		adjustField( 'Comment Status' )
		cy.editPostDiscussion( { 'Allow comments': false } )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'closed', { assertBackend: false } )

		// Assert changing the Comment Number
		createNewPostWithCTA()
		adjustField( 'Comment Number' )
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
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', '4', { assertBackend: false } )
	} )
}

function assertEmptyValues() {
	it( 'should assert empty values in the frontend', () => {
		cy.setupWP()

		const emptyFields = [
			'Post Slug',
			'Author First Name',
			'Author Last Name',
			'Featured Image URL',
		]

		emptyFields.forEach( fieldName => {
			createNewPostWithCTA()
			adjustField( fieldName )
			cy
				.selectBlock( 'ugb/cta' )
				.assertBlockContent( '.ugb-cta__title', '', { assertBackend: false } )
		} )
	} )
}

function otherTests() {
	it( 'should assert handling field values with tags', () => {
		const textWithTag = [
			'my <span>title</span> here',
			'my <p>title</p> here',
		]

		cy.setupWP()
		cy.newPost()

		// Test Post Title field.
		textWithTag.forEach( text => {
			cy.typePostTitle( text )
			cy.addBlock( 'ugb/cta' )
			adjustField( 'Post Title' )
			cy
				.selectBlock( 'ugb/cta' )
				.assertBlockContent( '.ugb-cta__title', 'my title here', { assertBackend: false } )

			// Should not show block error.
			cy.savePost()
			cy.reload()
			cy.deleteBlock( 'ugb/cta' )
		} )
	} )
}
