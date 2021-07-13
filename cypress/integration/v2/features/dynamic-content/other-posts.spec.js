/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'

describe( 'Dynamic Content Other Posts', registerTests( [
	matchPostDataValues,
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
		} )
	} )
}

