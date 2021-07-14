/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'

describe( 'Dynamic Content Other Posts', registerTests( [
	matchPostDataValues,
	adjustFieldOptions,
	adjustFieldValues,
] ) )

const fields = {
	'Post Title': 'title',
	'Post URL': 'link',
	'Post ID': 'id',
	'Post Slug': 'slug',
	'Post Excerpt': 'excerpt',
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
	'Author Profile Picture URL': '', // TODO: fields from here are not in getPostData
	'Author Posts': '', // Retrieve the contents of these fields for assertion
	'Author First Name': '',
	'Author Last Name': '',
}

const selector = () => cy.get( '.ugb-cta__title' )
const adjustField = ( fieldName, fieldOptions = {} ) => {
	cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
		source: 'Other Posts',
		post: 'First Post',
		fieldName,
		fieldOptions,
	} )
}
const assertInBackendAndFrontend = ( callback = () => {} ) => {
	cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
		callback()
		cy.visit( previewUrl )
		callback()
		cy.visit( editorUrl )
		cy.deleteBlock( 'ugb/cta' )
		cy.addBlock( 'ugb/cta' )
	} )
}

function matchPostDataValues() {
	it( 'should test dynamic content to match the selected post data values', () => {
		cy.setupWP()

		// Add a post and set its post data
		cy.newPost()
		cy.addBlock( 'core/paragraph' )
		cy.typePostTitle( 'First Post' )
		cy.addFeaturedImage()
		cy.addPostExcerpt( 'Hello World! Sample excerpt.' )
		cy.addPostSlug( 'my-first-post' )
		cy.publish()

		let postData
		cy.getPostData().then( data => {
			// Save this post's data for Other Posts assertion.
			postData = data
		} )

		// Add a new page to assert the created post in dynamic content
		cy.newPage()

		Object.keys( fields ).forEach( fieldName => {
			const fieldOptions = {}

			if ( Array( 'date', 'date_gmt', 'modified', 'modified_gmt' ).includes( fields[ fieldName ] ) ) {
				fieldOptions[ 'Date Format' ] = 'custom'
				fieldOptions[ 'Custom Format' ] = 'Y-m-d'
			}

			cy.addBlock( 'ugb/cta' )
			cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
				source: 'Other Posts',
				post: 'First Post',
				fieldName,
				fieldOptions,
			} )

			if ( fields[ fieldName ] ) {
				cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
					const value = Array( 'date', 'date_gmt', 'modified', 'modified_gmt' ).includes( fields[ fieldName ] )
						? postData[ fields[ fieldName ] ].split( 'T' ).shift()
						: Array( 'name', 'url' ).includes( fields[ fieldName ] )
							? postData.author_info[ fields[ fieldName ] ]
							: fields[ fieldName ] === 'featured_image_urls'
								? postData[ fields[ fieldName ] ].full[ 0 ]
								: postData[ fields[ fieldName ] ]

					// Assert in backend.
					cy.get( '.ugb-cta__title' ).contains( `${ fields[ fieldName ] === 'comments_num' ? value.replace( ' comments', '' ) : value }` ).should( 'exist' )
					cy.visit( previewUrl )
					// Assert in frontend.
					cy.get( '.ugb-cta__title' ).contains( `${ fields[ fieldName ] === 'comments_num' ? value.replace( ' comments', '' ) : value }` ).should( 'exist' )
					cy.visit( editorUrl )
					cy.deleteBlock( 'ugb/cta' )
				} )
			}
			cy.savePost()
		} )
	} )
}

function adjustFieldOptions() {
	it( 'should adjust all field options of each field in other post', () => {
		cy.setupWP()
		// Add a post and set its post data
		cy.newPost()
		cy.addBlock( 'core/paragraph' )
		cy.typePostTitle( 'First Post' )
		cy.addFeaturedImage()
		cy.addPostExcerpt( 'Hello World! Sample excerpt here. Lorem ipsum' )
		cy.addPostSlug( 'my-first-post' )
		cy.publish()

		let postData
		cy.getPostData().then( data => {
			// Save this post's data for Other Posts assertion.
			postData = data
		} )

		cy.newPage()
		cy.addBlock( 'ugb/cta' )

		// Post Title options
		adjustField( 'Post Title', {
			'Show as link': true,
			'Open in new tab': true,
		} )
		assertInBackendAndFrontend( () => {
			selector().contains( postData.title ).should( 'exist' )
			selector().find( `a[href="${ postData.link }"]` ).should( 'exist' )
			selector().find( 'a[rel="noreferrer noopener"]' ).should( 'exist' )
		} )

		// Post URL options
		adjustField( 'Post URL', {
			'Show as link': true,
			'Custom Text': 'This post',
			'Open in new tab': true,
		} )
		assertInBackendAndFrontend( () => {
			selector().contains( 'This post' ).should( 'exist' )
			selector().find( `a[href="${ postData.link }"]` ).should( 'exist' )
			selector().find( 'a[rel="noreferrer noopener"]' ).should( 'exist' )
		} )

		// Post Excerpt options
		adjustField( 'Post Excerpt', {
			'Excerpt Length': 5,
		} )
		assertInBackendAndFrontend( () => {
			cy.document().then( doc => {
				const text = doc.querySelector( '.ugb-cta__title' ).innerText
				expect( text.split( ' ' ).length ).to.equal( 5 )
			} )
		} )

		// For Post Date, Date GMT, Modified & Modified GMT options
		const dateFields = [ 'Post Date', 'Post Date GMT', 'Post Modified', 'Post Modified GMT' ]
		const dateFormats = [ 'Y-m-d H:i:s', 'F j, Y', 'F j, Y g:i a', 'd/m/y' ]
		dateFields.forEach( dateField => {
			dateFormats.forEach( dateFormat => {
				adjustField( dateField, {
					'Date Format': dateFormat,
				} )
				// TODO: Add assertion of date formats.
				assertInBackendAndFrontend()
			} )
		} )

		// Author Posts URL options.
		adjustField( 'Author Posts URL', {
			'Show as link': true,
			'Custom Text': 'This author',
			'Open in new tab': true,
		} )
		assertInBackendAndFrontend( () => {
			selector().contains( 'This author' ).should( 'exist' )
			selector().find( `a[href="${ postData.author_info.url }"]` ).should( 'exist' )
			selector().find( 'a[rel="noreferrer noopener"]' ).should( 'exist' )
		} )
	} )
}

function adjustFieldValues() {
	it( 'should assert the correct value in frontend after changing the other post data values', () => {
		cy.setupWP()
		// Add a post and set its post data
		cy.newPost()
		cy.addBlock( 'core/paragraph' )
		cy.typePostTitle( 'First Post' )
		cy.addFeaturedImage()
		cy.addPostExcerpt( 'Hello World! Sample excerpt here. Lorem ipsum' )
		cy.addPostSlug( 'my-first-post' )
		cy.publish()

		let postData
		cy.getPostData().then( data => {
			// Save this post's data for Other Posts assertion.
			postData = data
		} )

		if ( postData.title ) {

		}
		cy.newPage()
		cy.addBlock( 'ugb/cta' )
	} )
}
