
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

// const fields = {
// 	'Post Title': 'title',
// 	'Post URL': 'link',
// 	'Post ID': 'id',
// 	'Post Slug': 'slug',
// 	'Post Excerpt': 'excerpt',
// 	'Post Date': 'date',
// 	'Post Date GMT': 'date_gmt',
// 	'Post Modified': 'modified',
// 	'Post Modified GMT': 'modified_gmt',
// 	'Post Type': 'type',
// 	'Post Status': 'status',
// 	'Author Name': 'name',
// 	'Author ID': 'author',
// 	'Author Posts URL': 'url',
// 	'Comment Number': 'comments_num',
// 	'Comment Status': 'comment_status',
// 	'Featured Image URL': 'featured_image_urls',
// 	'Author Profile Picture URL': '', // TODO: fields from here are not in getCurrentPostData
// 	'Author Posts': '', // Retrieve the contents of these fields for assertion
// 	'Author First Name': '',
// 	'Author Last Name': '',
// }

const fields = {
	'Author Posts': '',
	'Post Title': 'Dynamic Content test',
	'Post URL': {
		id: 'link',
		value: '',
	},
	'Post ID': {
		id: 'id',
		value: '',
	},
	'Post Slug': 'my-slug',
	'Post Excerpt': 'This is a sample excerpt.',
	'Post Date': {
		id: 'date',
		value: '',
	},
	'Post Date GMT': {
		id: 'date_gmt',
		value: '',
	},
	'Post Modified': {
		id: 'modified',
		value: '',
	},
	'Post Modified GMT': {
		id: 'modified_gmt',
		value: '',
	},
	'Post Type': {
		id: 'type',
		value: '',
	},
	'Post Status': {
		id: 'status',
		value: '',
	},
	'Author Name': {
		id: 'name',
		value: '',
	},
	'Author ID': {
		id: 'author',
		value: '',
	},
	'Author Posts URL': {
		id: 'url',
		value: '',
	},
	'Comment Number': {
		id: 'comments_num',
		value: '',
	},
	'Comment Status': {
		id: 'comment_status',
		value: '',
	},
	'Featured Image URL': {
		id: 'featured_image_urls',
		value: '',
	},
	'Author Profile Picture URL': '',
	'Author First Name': 'Juan',
	'Author Last Name': 'Dela Cruz',
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
			cy.addBlock( 'ugb/cta' )

			// Populate empty values
			if ( fieldName === 'Post Title' ) {
				cy.typePostTitle( fields[ fieldName ] )
			}

			if ( fieldName === 'Post Slug' ) {
				cy.addPostSlug( fields[ fieldName ] )
			}

			if ( fieldName === 'Featured Image URL' ) {
				cy.addFeaturedImage()
			}

			if ( fieldName === 'Post Excerpt' ) {
				cy.addPostExcerpt( fields[ fieldName ] )
			}

			// Populate author first & last name in profile settings
			if ( Array( 'Author First Name', 'Author Last Name' ).includes( fieldName ) ) {
				cy.getPostUrls().then( ( { editorUrl } ) => {
					cy.visit( '/wp-admin/profile.php' )
					cy
						.get( `tr.user-${ fieldName.includes( 'First' ) ? 'first' : 'last' }-name-wrap` )
						.find( `input#${ fieldName.includes( 'First' ) ? 'first' : 'last' }_name` )
						.click( { force: true } )
						.type( `{selectall}{backspace}${ fields[ fieldName ] }` )
					cy
						.get( 'input[value="Update Profile"]' )
						.click( { force: true } )
					cy.visit( editorUrl )
				} )
			}

			if ( fieldName === 'Author Posts' ) {
				cy.getPostUrls().then( ( { editorUrl } ) => {
					cy.savePost()
					cy.registerPosts( { numOfPosts: 4 } )
					cy.visit( editorUrl )
				} )
				fields[ fieldName ] = '4'
			}

			// Fetch Author Profile Picture URL
			if ( fieldName === 'Author Profile Picture URL' ) {
				cy.wp().then( wp => {
					const author = wp.data.select( 'core' ).getAuthors( { id: 1 } )
					fields[ fieldName ] = author[ 0 ].avatar_urls[ 96 ]
				} )
			}

			// Fetch post data values and store it to fields Object
			if ( typeof fields[ fieldName ] === 'object' && fields[ fieldName ].id ) {
				cy.getPostData().then( data => {
					const value = Array( 'date', 'date_gmt', 'modified', 'modified_gmt' ).includes( fields[ fieldName ].id )
						? data[ fields[ fieldName ].id ].split( 'T' ).shift()
						: Array( 'name', 'url' ).includes( fields[ fieldName ].id )
							? data.author_info[ fields[ fieldName ].id ]
							: fields[ fieldName ].id === 'featured_image_urls'
								? data[ fields[ fieldName ].id ].full[ 0 ]
								: data[ fields[ fieldName ].id ]

					fields[ fieldName ].value = fields[ fieldName ].id === 'comments_num' ? value.replace( ' comments', '' ) : value
				} )
			}

			const fieldOptions = {}

			// Set date formats for assertion
			if ( Array( 'Post Date', 'Post Date GMT', 'Post Modified', 'Post Modified GMT' ).includes( fieldName ) ) {
				fieldOptions[ 'Date Format' ] = 'custom'
				fieldOptions[ 'Custom Format' ] = 'Y-m-d'
			}

			cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
				source: 'Current Post',
				fieldName,
				fieldOptions,
			} )

			const valueToAssert = typeof fields[ fieldName ] === 'object' && fields[ fieldName ].id
				? fields[ fieldName ].value
				: fields[ fieldName ]

			// Assert the content value
			cy.openInspector( 'ugb/cta', 'Style' )
			cy
				.selectBlock( 'ugb/cta' )
				.assertBlockContent( '.ugb-cta__title', valueToAssert )
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
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', `${ Cypress.config( 'baseUrl' ) }my-post/` )

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
