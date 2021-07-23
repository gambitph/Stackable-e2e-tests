
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'
import { range } from 'lodash'

describe( 'Dynamic Content Current Post', registerTests( [
	matchPostFieldValues,
	adjustFieldOptions,
	adjustFieldValues,
	assertEmptyValues,
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

function matchPostFieldValues() {
	it( 'should test dynamic content to match all field values', () => {
		const fieldsToFetch = {
			'Post URL': 'link',
			'Post ID': 'id',
			'Post Date': 'date',
			'Post Date GMT': 'date_gmt',
			'Post Modified': 'modified',
			'Post Modified GMT': 'modified_gmt',
			'Post Type': 'type',
			'Post Status': 'status',
			'Author Name': 'name',
			'Author ID': 'author',
			'Author Posts URL': 'url',
			'Comment Number': 'comments_num',
			'Comment Status': 'comment_status',
			'Featured Image URL': 'featured_image_urls',
		}

		const fieldsToAssert = {
			'Post Title': 'Dynamic Content test',
			'Post Slug': 'my-slug',
			'Post Excerpt': 'This is a sample excerpt.',
			'Author Posts': '6',
			'Author First Name': 'Juan',
			'Author Last Name': 'Dela Cruz',
		}

		cy.setupWP()
		cy.newPost()
		cy.wrap( fieldsToAssert ).as( 'fieldsToAssert' )

		// Populate empty values
		cy.typePostTitle( fieldsToAssert[ 'Post Title' ] )
		cy.addPostSlug( fieldsToAssert[ 'Post Slug' ] ) // Publish this post.
		cy.addFeaturedImage() // Creates 1 post.
		cy.addPostExcerpt( fieldsToAssert[ 'Post Excerpt' ] )

		cy.wp().then( wp => {
			// Fetch the Author Profile Picture URL value and add to fieldsToAssert.
			const author = wp.data.select( 'core' ).getAuthors()
			Object.assign( fieldsToAssert, { 'Author Profile Picture URL': author[ 0 ].avatar_urls[ 96 ] } )

			cy.getPostUrls().then( ( { editorUrl } ) => {
				// Set Author first & last name in profile settings
				cy.visit( '/wp-admin/profile.php' )
				Array( 'first', 'last' ).forEach( name => {
					cy
						.get( `tr.user-${ name }-name-wrap` )
						.find( `input#${ name }_name` )
						.click( { force: true } )
						.type( `{selectall}{backspace}${ name === 'first' ? fieldsToAssert[ 'Author First Name' ] : fieldsToAssert[ 'Author Last Name' ] }` )
				} )
				cy
					.get( 'input[value="Update Profile"]' )
					.click( { force: true } )
				// For Author Posts field.
				cy.registerPosts( { numOfPosts: 4 } ) // Creates 4 posts.
				cy.visit( editorUrl )
			} )
		} )

		cy.getPostData().then( data => {
			// Fetch post data values and add them to fieldsToAssert object.
			cy.get( '@fieldsToAssert' ).then( fields => {
				Object.keys( fieldsToFetch ).forEach( fieldName => {
					const dataId = fieldsToFetch[ fieldName ]
					const value = Array( 'date', 'date_gmt', 'modified', 'modified_gmt' ).includes( dataId )
						? data[ dataId ].split( 'T' ).shift()
						: Array( 'name', 'url' ).includes( dataId )
							? data.author_info[ dataId ]
							: dataId === 'featured_image_urls'
								? data[ dataId ].full[ 0 ]
								: data[ dataId ]

					Object.assign( fields, { [ fieldName ]: dataId === 'comments_num' ? value.replace( ' comments', '' ) : value } )
				} )
			} )

			// Assert all field values
			cy.get( '@fieldsToAssert' ).then( fields => {
				Object.keys( fields ).forEach( fieldName => {
					const fieldOptions = {}

					// Set date formats for assertion
					if ( Array( 'Post Date', 'Post Date GMT', 'Post Modified', 'Post Modified GMT' ).includes( fieldName ) ) {
						fieldOptions[ 'Date Format' ] = 'custom'
						fieldOptions[ 'Custom Format' ] = 'Y-m-d'
					}
					cy.addBlock( 'ugb/cta' )
					cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
						source: 'Current Post',
						fieldName,
						fieldOptions,
					} )
					// Assert the content value
					cy.openInspector( 'ugb/cta', 'Style' )
					cy
						.selectBlock( 'ugb/cta' )
						.assertBlockContent( '.ugb-cta__title', fields[ fieldName ] )
					cy.deleteBlock( 'ugb/cta' )
				} )
			} )
		} )
		cy.savePost()
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
		cy.openInspector( 'ugb/cta', 'Style' )
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
		cy.openInspector( 'ugb/cta', 'Style' )
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
		cy.getPostUrls().then( ( { previewUrl } ) => {
			cy.visit( previewUrl )
			// Excerpt length should be 5.
			cy.document().then( doc => {
				const text = doc.querySelector( '.ugb-cta__title' ).innerText
				assert.equal(
					text.split( ' ' ).length,
					5,
					`Expected Excerpt length to equal '5'. Found '${ text.split( ' ' ).length }'`
				)
			} )
		} )

		// For Post Date, Date GMT, Modified & Modified GMT options
		const dateFields = [ 'Post Date', 'Post Date GMT', 'Post Modified', 'Post Modified GMT' ]
		const dateFormats = [ 'Y-m-d H:i:s', 'F j, Y', 'F j, Y g:i a', 'd/m/y' ]
		dateFields.forEach( dateField => {
			dateFormats.forEach( dateFormat => {
				createNewPostWithCTA()
				adjustField( dateField, {
					'Date Format': dateFormat,
				} )
				// TODO: Add assertion of date formats.
			} )
		} )

		// Author Posts URL options
		createNewPostWithCTA()
		adjustField( 'Author Posts URL', {
			'Show as link': true,
			'Custom Text': 'This author',
			'Open in new tab': true,
		} )
		cy.openInspector( 'ugb/cta', 'Style' )
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
		cy.typePostTitle( 'Dynamic Content Test' )
		adjustField( 'Post Title' )
		cy.openInspector( 'ugb/cta', 'Style' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'Dynamic Content Test' )
		cy.typePostTitle( 'My Post' )
		cy.openInspector( 'ugb/cta', 'Style' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'My Post', { assertBackend: false } )

		// Assert changing the Post URL
		createNewPostWithCTA()
		adjustField( 'Post URL' )
		cy.openInspector( 'ugb/cta', 'Style' )
		cy.typePostTitle( 'My Post' )
		cy.publish() // Publishing creates a new URL slug
		cy.openInspector( 'ugb/cta', 'Style' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', `${ Cypress.config( 'baseUrl' ) }/my-post/`, { assertBackend: false } )

		// Assert changing the Post Slug
		createNewPostWithCTA()
		cy.publish() // Publishing creates a post slug
		adjustField( 'Post Slug' )
		cy.addPostSlug( 'my-post-slug' )
		cy.openInspector( 'ugb/cta', 'Style' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'my-post-slug', { assertBackend: false } )

		// Assert changing the Post Excerpt
		createNewPostWithCTA()
		cy.addPostExcerpt( 'Sample excerpt for this post.' )
		adjustField( 'Post Excerpt' )
		cy.openInspector( 'ugb/cta', 'Style' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'Sample excerpt for this post.' )
		cy.addPostExcerpt( 'Lorem ipsum dolor sit amet.' )
		cy.openInspector( 'ugb/cta', 'Style' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'Lorem ipsum dolor sit amet.', { assertBackend: false } )

		// Assert changing the Post Status
		createNewPostWithCTA()
		adjustField( 'Post Status' )
		cy.openInspector( 'ugb/cta', 'Style' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'draft' )
		cy.publish()
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'publish', { assertBackend: false } )

		// Assert changing the Comment Status
		createNewPostWithCTA()
		adjustField( 'Comment Status' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'open' )
		cy.editPostDiscussion( { 'Allow comments': false } )
		cy.openInspector( 'ugb/cta', 'Style' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'closed', { assertBackend: false } )

		// Assert changing the Comment Number
		createNewPostWithCTA()
		adjustField( 'Comment Number' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', '0' )
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
		cy.openInspector( 'ugb/cta', 'Style' )
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
			cy.openInspector( 'ugb/cta', 'Style' )
			cy
				.selectBlock( 'ugb/cta' )
				.assertBlockContent( '.ugb-cta__title', '', { assertBackend: false } )
		} )
	} )
}
