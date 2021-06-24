
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'

describe( 'Dynamic Content Current Post', registerTests( [
	currentPostSource,
] ) )

const fields = {
	'Post Title': 'title',
	'Post URL': 'link',
	// 'Post ID': 'id',
	// 'Post Slug': 'slug',
	// 'Post Excerpt': 'excerpt',
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
	// 'Featured Image URL': 'featured_image_urls',
}

function currentPostSource() {
	it( 'should assert current post fields of the dynamic content feature', () => {
		cy.setupWP()

		Object.keys( fields ).forEach( fieldName => {
			cy.newPost()
			cy.typePostTitle( `${ fieldName } test` )
			cy.addBlock( 'ugb/cta' )
			if ( ! Array( 'date', 'date_gmt', 'modified', 'modified_gmt' ).includes( fields[ fieldName ] ) ) {
				cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
					source: 'Current Post',
					fieldName,
				} )
			} else {
				cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
					source: 'Current Post',
					fieldName,
					fieldOptions: {
						'Date Format': 'custom',
						'Custom Format': 'Y-m-d',
					},
				} )
			}
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

				cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
					cy.get( '.ugb-cta__title' ).contains( `${ fields[ fieldName ] === 'comments_num' ? value.replace( ' comments', '' ) : value }` ).should( 'exist' )
					cy.visit( previewUrl )
					cy.get( '.ugb-cta__title' ).contains( `${ fields[ fieldName ] === 'comments_num' ? value.replace( ' comments', '' ) : value }` ).should( 'exist' )
					cy.visit( editorUrl )
				} )
			} )
		} )
	} )
}
