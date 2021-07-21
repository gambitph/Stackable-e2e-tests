
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'
import { containsRegExp } from '~common/util'
import { range } from 'lodash'

describe( 'Dynamic Content Current Post', registerTests( [
	matchPostDataValues,
	adjustFieldOptions,
	adjustFieldValues,
	assertEmptyValues,
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
	'Author Profile Picture URL': '', // TODO: fields from here are not in getCurrentPostData
	'Author Posts': '', // Retrieve the contents of these fields for assertion
	'Author First Name': '',
	'Author Last Name': '',
}

const selector = () => cy.get( '.ugb-cta__title' )
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
const assertInBackendAndFrontend = ( callback = () => {} ) => {
	cy.getPostUrls().then( ( { previewUrl } ) => {
		callback()
		cy.visit( previewUrl )
		callback()
	} )
}

function matchPostDataValues() {
	it( 'should test dynamic content to match the current post data values', () => {
		cy.setupWP()

		Object.keys( fields ).forEach( fieldName => {
			cy.newPost()
			cy.typePostTitle( `${ fieldName } test` )
			cy.addBlock( 'ugb/cta' )

			if ( fields[ fieldName ] === 'slug' ) {
				// Publishing automatically creates a slug for the post.
				cy.publish()
			}

			if ( fields[ fieldName ] === 'featured_image_urls' ) {
				cy.addFeaturedImage()
				cy.savePost()
			}

			if ( fields[ fieldName ] === 'excerpt' ) {
				cy.addPostExcerpt( 'This is a sample excerpt.' )
				cy.savePost()
			}

			const fieldOptions = {}

			if ( Array( 'date', 'date_gmt', 'modified', 'modified_gmt' ).includes( fields[ fieldName ] ) ) {
				fieldOptions[ 'Date Format' ] = 'custom'
				fieldOptions[ 'Custom Format' ] = 'Y-m-d'
			}

			cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
				source: 'Current Post',
				fieldName,
				fieldOptions,
			} )

			if ( fields[ fieldName ] ) {
				cy.getPostData().then( data => {
					const value = Array( 'date', 'date_gmt', 'modified', 'modified_gmt' ).includes( fields[ fieldName ] )
						? data[ fields[ fieldName ] ].split( 'T' ).shift()
						: Array( 'name', 'url' ).includes( fields[ fieldName ] )
							? data.author_info[ fields[ fieldName ] ]
							: fields[ fieldName ] === 'featured_image_urls'
								? data[ fields[ fieldName ] ].full[ 0 ]
								: data[ fields[ fieldName ] ]

					cy.getPostUrls().then( ( { previewUrl } ) => {
						// Assert in backend.
						cy.get( '.ugb-cta__title' ).contains( `${ fields[ fieldName ] === 'comments_num' ? value.replace( ' comments', '' ) : value }` ).should( 'exist' )
						cy.visit( previewUrl )
						// Assert in frontend.
						cy.get( '.ugb-cta__title' ).contains( `${ fields[ fieldName ] === 'comments_num' ? value.replace( ' comments', '' ) : value }` ).should( 'exist' )
					} )
				} )
			}
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
		assertInBackendAndFrontend( () => {
			cy.document().then( doc => {
				const url = doc.URL
				// Check if the url matches the editor, and new page URL
				if ( url.match( /(post|post-new)\.php/g ) && url.match( /wp-admin/g ) ) {
					cy.getPostData().then( data => {
						selector().contains( containsRegExp( 'Dynamic Content test' ) ).should( 'exist' )
						selector().find( `a[href="${ data.link }"]` ).should( 'exist' )
						selector().find( 'a[rel="noreferrer noopener"]' ).should( 'exist' )
					} )
				} else {
					selector().contains( containsRegExp( 'Dynamic Content test' ) ).should( 'exist' )
					selector().find( `a[href="${ url.replace( '&preview=true', '' ) }"]` ).should( 'exist' )
					selector().find( 'a[rel="noreferrer noopener"]' ).should( 'exist' )
				}
			} )
		} )

		// Post URL options
		createNewPostWithCTA()
		adjustField( 'Post URL', {
			'Show as link': true,
			'Custom Text': 'This post',
			'Open in new tab': true,
		} )
		assertInBackendAndFrontend( () => {
			cy.document().then( doc => {
				const url = doc.URL
				// Check if the url matches the editor, and new page URL
				if ( url.match( /(post|post-new)\.php/g ) && url.match( /wp-admin/g ) ) {
					cy.getPostData().then( data => {
						selector().contains( containsRegExp( 'This post' ) ).should( 'exist' )
						selector().find( `a[href="${ data.link }"]` ).should( 'exist' )
						selector().find( 'a[rel="noreferrer noopener"]' ).should( 'exist' )
					} )
				} else {
					selector().contains( containsRegExp( 'This post' ) ).should( 'exist' )
					selector().find( `a[href="${ url.replace( '&preview=true', '' ) }"]` ).should( 'exist' )
					selector().find( 'a[rel="noreferrer noopener"]' ).should( 'exist' )
				}
			} )
		} )

		// Post Excerpt options
		createNewPostWithCTA()
		cy.addPostExcerpt( 'This is a sample excerpt... Lorem ipsum dolor sit amet.' )
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
		assertInBackendAndFrontend( () => {
			selector().contains( containsRegExp( 'This author' ) ).should( 'exist' )
			selector().find( 'a[rel="noreferrer noopener"]' ).should( 'exist' )
		} )
	} )
}

function adjustFieldValues() {
	it( 'should assert the correct value in frontend after changing post data values', () => {
		cy.setupWP()

		const assertValue = value => selector().contains( containsRegExp( value ) ).should( 'exist' )

		// Assert changing the Post Title
		createNewPostWithCTA()
		cy.typePostTitle( 'Dynamic Content Test' )
		adjustField( 'Post Title' )
		cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
			assertValue( 'Dynamic Content Test' )
			cy.visit( previewUrl )
			assertValue( 'Dynamic Content Test' )
			cy.visit( editorUrl )
			// Change the value of the Post Title
			cy.typePostTitle( 'My Post' )
			cy.visit( previewUrl )
			// Assert the new value in the frontend.
			assertValue( 'My Post' )
		} )

		// Assert changing the Post URL
		createNewPostWithCTA()
		adjustField( 'Post URL' )
		cy.getPostUrls().then( ( { previewUrl } ) => {
			cy.typePostTitle( 'My Post' )
			cy.publish() // Publishing creates a new URL slug
			cy.visit( previewUrl )
			assertValue( `${ Cypress.config( 'baseUrl' ) }my-post/` )
		} )

		// Assert changing the Post Slug
		createNewPostWithCTA()
		cy.publish() // Publishing creates a post slug
		adjustField( 'Post Slug' )
		cy.getPostUrls().then( ( { previewUrl } ) => {
			cy.addPostSlug( 'my-post-slug' )
			cy.publish()
			cy.visit( previewUrl )
			assertValue( 'my-post-slug' )
		} )

		// Assert changing the Post Excerpt
		createNewPostWithCTA()
		cy.addPostExcerpt( 'Sample excerpt for this post.' )
		adjustField( 'Post Excerpt' )
		selector().contains( 'Sample excerpt for this post.' ).should( 'exist' )
		cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
			cy.visit( previewUrl )
			selector().contains( 'Sample excerpt for this post.' ).should( 'exist' )
			cy.visit( editorUrl )
			cy.addPostExcerpt( 'Lorem ipsum dolor sit amet.' )
			cy.visit( previewUrl )
			selector().contains( 'Lorem ipsum dolor sit amet.' ).should( 'exist' )
		} )

		// Assert changing the Post Status
		createNewPostWithCTA()
		adjustField( 'Post Status' )
		cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
			cy.visit( previewUrl )
			assertValue( 'draft' )
			cy.visit( editorUrl )
			cy.publish()
			cy.visit( previewUrl )
			assertValue( 'publish' )
		} )

		// Assert changing the Comment Status
		createNewPostWithCTA()
		adjustField( 'Comment Status' )
		assertValue( 'open' )
		cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
			cy.visit( previewUrl )
			assertValue( 'open' )
			cy.visit( editorUrl )
			cy.editPostDiscussion( { 'Allow comments': false } )
			cy.visit( previewUrl )
			assertValue( 'closed' )
		} )

		// Assert changing the Comment Number
		createNewPostWithCTA()
		adjustField( 'Comment Number' )
		assertValue( '0' )
		cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
			cy.visit( previewUrl )
			assertValue( '0' )
			cy.visit( editorUrl )
			cy.editPostDiscussion( { 'Allow comments': true } )
			cy.publish()
			cy.visit( previewUrl )
			range( 1, 5 ).forEach( num => {
				cy
					.get( '.comment-form-comment' )
					.find( 'textarea#comment' )
					.click( { force: true } )
					.type( `{selectall}{backspace}Test ${ num }` )
			} )
			assertValue( '4' )
		} )
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
			cy.getPostUrls().then( ( { previewUrl } ) => {
				cy.visit( previewUrl )
				selector()
					.should( $element => {
						expect( $element.text().trim() ).equal( '' )
					} )
			} )
		} )
	} )
}
