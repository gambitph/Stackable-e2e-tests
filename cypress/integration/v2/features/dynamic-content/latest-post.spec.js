
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'

describe( 'Dynamic Content - Latest Post', registerTests( [
	matchSiteData,
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
}

//const nthLatest = [ '' ]

const adjustField = ( fieldName, fieldOptions = {} ) => {
	cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
		source: 'Latest Post',
		fieldName,
		fieldOptions,
	} )
}

function matchSiteData() {
	it( 'should match dynamic content in site fields', () => {
		cy.setupWP()
		Object.keys( fields ).forEach( fieldName => {
			cy.newPost()
			cy.typePostTitle( `${ fieldName } test` )

			cy.addBlock( 'ugb/cta' )
			adjustField( fieldName ) //add fieldoptions
		} )
	} )
}

function adjustFieldOptions() {
	it( 'should adjust all fields with options', () => {
		cy.setupWP()
	} )
}

function adjustFieldValues() {
	it( 'should assert changes to the field values', () => {
		cy.setupWP()
	} )
}

/*
    testing flow:
    1. add placeholder posts for latest posts (1st to 3rd)
        must have:
        - post title
        - post URL,
        - post id,
        - post slug
        - post excerpt,
        - post date,
        - post date GMT,
        - post modified
        - post modified GMT,
        - post type,
        - post status
    2. display and assert dynamic content function
    3. publish pages
    4. test latest post DC function per nth post
*/
