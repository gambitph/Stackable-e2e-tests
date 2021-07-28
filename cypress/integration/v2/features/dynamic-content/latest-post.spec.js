
/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'
import { range, uniqueId } from 'lodash'

describe( 'Dynamic Content - Latest Post', registerTests( [
	setFieldValues,
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

//utilize addtoTest

const adjustField = ( fieldName, fieldOptions = {} ) => {
	cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
		source: 'Latest Post',
		fieldName,
		fieldOptions,
	} )
}

function setFieldValues() {
	it( 'should populate WP with 10 test posts', () => {
		cy.setupWP()

		range( 10, 0 ).forEach( idx => {
			cy.newPost()
			cy.typePostTitle( `Latest Post # ${ idx }` )

			cy.addPostExcerpt( `This is excerpt # ${ idx }` )

			const slug = `post-slug-${ ( new Date().getTime() * uniqueId() ) % 1000 }`
			cy.addPostSlug( slug )

			cy.addFeaturedImage()
			//Post Fields
			//Post Dates
			//Author Fields
			//Comment Fields

			cy.savePost()
			//may also assert
		} )
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
    1. add populated posts for latest posts (1st to 3rd)
       /**
	 * Populate the following fields:
	 * - Post Title
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
    2. display and assert dynamic content function
    3. publish pages
    4. test latest post DC function per nth post
*/
