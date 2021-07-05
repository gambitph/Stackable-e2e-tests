
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'

/**
 * Internal dependencies
 */
import { containsRegExp } from '~common/util'

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
}

/*
 * Fields TODO:
 * Author Profile Picture URL
 * Author Posts
 * Author First Name
 * Author Last Name
 */

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

			cy.savePost()
			// Sometimes the first save does not register and the test fails.
			cy.savePost()

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
		} )
	} )
}

function adjustFieldOptions() {
	it( 'should adjust all field options of each field in current post', () => {
		cy.setupWP()

		const selector = () => cy.get( '.ugb-cta__title' )
		const createNewPostWithCTA = () => {
			cy.newPost()
			cy.addBlock( 'ugb/cta' )
		}
		const save = () => {
			cy.savePost()
			// Sometimes the first save does not register and the test fails.
			cy.savePost()
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
				const assertValues = () => {
					callback()
				}
				assertValues()
				cy.visit( previewUrl )
				assertValues()
			} )
		}

		// Test only the fields with field options.
		// Post Title options
		createNewPostWithCTA()
		cy.typePostTitle( 'Dynamic Content test' )
		adjustField( 'Post Title', {
			'Show as link': true,
			'Open in new tab': true,
		} )
		save()
		assertInBackendAndFrontend( () => {
			cy.document().then( doc => {
				const url = doc.URL
				// Check if the url matches the editor, and new page URL
				if ( url.match( /(post|post-new)\.php/g ) && url.match( /wp-admin/g ) ) {
					cy.getPostData().then( data => {
						selector().contains( 'Dynamic Content test' ).should( 'exist' )
						selector().find( `a[href="${ data.link }"]` ).should( 'exist' )
						selector().find( 'a[rel="noreferrer noopener"]' ).should( 'exist' )
					} )
				} else {
					selector().contains( 'Dynamic Content test' ).should( 'exist' )
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
		save()
		assertInBackendAndFrontend( () => {
			cy.document().then( doc => {
				const url = doc.URL
				// Check if the url matches the editor, and new page URL
				if ( url.match( /(post|post-new)\.php/g ) && url.match( /wp-admin/g ) ) {
					cy.getPostData().then( data => {
						selector().contains( 'This post' ).should( 'exist' )
						selector().find( `a[href="${ data.link }"]` ).should( 'exist' )
						selector().find( 'a[rel="noreferrer noopener"]' ).should( 'exist' )
					} )
				} else {
					selector().contains( 'This post' ).should( 'exist' )
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
		save()
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
				save()
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
		save()
		assertInBackendAndFrontend( () => {
			selector().contains( 'This author' ).should( 'exist' )
			selector().find( 'a[rel="noreferrer noopener"]' ).should( 'exist' )
		} )
	} )
}

function adjustFieldValues() {
	it( 'should assert the correct value in frontend after changing post data values', () => {
		cy.setupWP()
		cy.newPost()
		cy.typePostTitle( 'Dynamic Content Test' )
		cy.addBlock( 'ugb/cta' )

		const fieldsToUpdate = {
			'Post Title': 'title',
			'Post URL': 'link',
			'Post Slug': 'slug',
			'Post Excerpt': 'excerpt',
			'Post Status': 'status',
			'Comment Number': 'comments_num',
			'Comment Status': 'comment_status',
			'Featured Image URL': 'featured_image_urls',
		}

		Object.keys( fieldsToUpdate ).forEach( fieldName => {
			// cy.addPostSlug( 'my-new-post' )
			cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
				source: 'Current Post',
				fieldName,
			} )
			cy.getPostUrls().then( ( { previewUrl } ) => {
				cy.visit( previewUrl )
				cy.get( '.ugb-cta__title' ).contains( containsRegExp( 'Dynamic Content Test' ) ).should( 'exist' )
			} )
		} )
	} )
}

function assertEmptyValues() {

}
