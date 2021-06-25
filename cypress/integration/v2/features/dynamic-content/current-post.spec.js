
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'

describe( 'Dynamic Content Current Post', registerTests( [
	matchPostDataValues,
	adjustFieldOptions,
] ) )

const fields = {
	'Post Title': 'title',
	'Post URL': 'link',
	// 'Post ID': 'id',
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
	// 'Author Profile Picture URL',
	// 'Author Posts',
	// 'Author First Name',
	// 'Author Last Name',
	'Comment Number': 'comments_num',
	'Comment Status': 'comment_status',
	'Featured Image URL': 'featured_image_urls',
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

		Object.keys( fields ).forEach( fieldName => {
			cy.newPost()
			cy.addBlock( 'ugb/cta' )
			const fieldOptions = {}

			if ( Array( 'title', 'link', 'url' ).includes( fields[ fieldName ] ) ) {
				fieldOptions[ 'Show as link' ] = true
				fieldOptions[ 'Open in new tab' ] = true
				if ( fields[ fieldName ] !== 'title' ) {
					fieldOptions[ 'Custom Text' ] = 'Link Title'
				}
			}

			if ( fields[ fieldName ] === 'excerpt' ) {
				fieldOptions[ 'Excerpt Length' ] = 5
			}

			if ( Array( 'date', 'date_gmt', 'modified', 'modified_gmt' ).includes( fields[ fieldName ] ) ) {
				fieldOptions[ 'Date Format' ] = 'Y-m-d H:i:s'

				/*
				* Options for Date Format:
				* Y-m-d H:i:s
				* F j, Y
				* F j, Y g:i a
				* d/m/y
				* custom
				*/
			}

			cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
				source: 'Current Post',
				fieldName,
				fieldOptions,
			} )
			cy.savePost()
			cy.savePost()

			cy.getPostUrls().then( ( { previewUrl } ) => {
				// Assert in backend.
				cy.visit( previewUrl )
				// Assert in frontend.
			} )
		} )
	} )
}
