/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'
import { setupMatchPostFieldValues } from './helpers'
import { range, escape } from 'lodash'

describe( 'Dynamic Content Current Post', registerTests( [
	matchPostFieldValues,
	adjustFieldOptions,
	adjustFieldValues,
	assertEmptyValues,
	otherTests,
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
		cy.setupWP()
		// Setup function
		setupMatchPostFieldValues( 'post' )
		cy.get( '@fieldsToAssert' ).then( fieldsToAssert => {
			fieldsToAssert.forEach( ( {
				name: fieldName, value, options: fieldOptions = {}, willEscape,
			} ) => {
				cy.addBlock( 'ugb/cta' )

				// Adjust the dynamic content popover.
				cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
					source: 'Current Post',
					fieldName,
					fieldOptions,
				} )

				// Assert the value.
				cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', willEscape ? escape( value ) : value, { assertFrontend: false } )
				cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', value, { assertBackend: false } )

				cy.deleteBlock( 'ugb/cta' )
			} )
			cy.savePost()
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
		cy.publish()
		cy.getPostUrls().then( ( { previewUrl } ) => {
			cy.visit( previewUrl )
			// Excerpt length should be 5.
			cy.document().then( doc => {
				assert.isTrue(
					[ ...doc.querySelector( '.ugb-cta__title' ).innerText.split( ' ' ) ].length === 5,
					'Expected excerpt text length to equal \'5\''
				)
			} )
		} )

		// For Post Date, Date GMT, Modified & Modified GMT options
		const dateFields = [ 'Post Date', 'Post Date GMT', 'Post Modified', 'Post Modified GMT' ]
		const dateFormats = [ 'Y-m-d H:i:s', 'F j, Y', 'F j, Y g:i a', 'd/m/y' ]
		dateFields.forEach( dateField => {
			cy.wrap( [] ).as( 'dateFormatValues' )

			dateFormats.forEach( dateFormat => {
				createNewPostWithCTA()
				adjustField( dateField, {
					'Date Format': dateFormat,
				} )
				cy.document().then( doc => {
					cy.get( '@dateFormatValues' ).then( dateFormatValues => {
						// Store the values to be compared in this alias.
						cy.wrap( [ ...dateFormatValues, doc.querySelector( '.ugb-cta__title' ).innerText ] ).as( 'dateFormatValues' )
					} )
				} )
			} )

			cy.get( '@dateFormatValues' ).then( dateFormatValues => {
				// Assert that the values are not equal. This means that the formats changed.
				assert.isTrue(
					! dateFormatValues.some( ( value, idx ) => dateFormatValues.indexOf( value ) !== idx ), // Returns true if values are unique
					`Expected all date format values to be unique. Values: "${ dateFormatValues.join( ', ' ) }"`
				)
			} )
		} )

		// Author Posts URL options
		createNewPostWithCTA()
		adjustField( 'Author Posts URL', {
			'Show as link': true,
			'Custom Text': 'This author',
			'Open in new tab': true,
		} )
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
		adjustField( 'Post Title' )
		cy.typePostTitle( 'My New Post' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'My New Post', { assertBackend: false } )

		// Assert changing the Post Slug
		createNewPostWithCTA()
		cy.typePostTitle( 'Hello World' )
		cy.publish() // Publishing creates a post slug
		adjustField( 'Post Slug' )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'hello-world', { assertBackend: false } )

		// Assert changing the Post Excerpt
		createNewPostWithCTA()
		adjustField( 'Post Excerpt' )
		cy.addPostExcerpt( 'Lorem ipsum dolor sit amet.' )
		cy.savePost()
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'Lorem ipsum dolor sit amet.', { assertBackend: false } )

		// Assert changing the Post Status
		createNewPostWithCTA()
		adjustField( 'Post Status' )
		cy.publish()
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'publish', { assertBackend: false } )

		// Assert changing the Comment Status
		createNewPostWithCTA()
		adjustField( 'Comment Status' )
		cy.editPostDiscussion( { 'Allow comments': false } )
		cy
			.selectBlock( 'ugb/cta' )
			.assertBlockContent( '.ugb-cta__title', 'closed', { assertBackend: false } )

		// Assert changing the Comment Number
		createNewPostWithCTA()
		adjustField( 'Comment Number' )
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
			cy
				.selectBlock( 'ugb/cta' )
				.assertBlockContent( '.ugb-cta__title', '', { assertBackend: false } )
		} )
	} )
}

function otherTests() {
	it( 'should assert handling field values with tags', () => {
		const textWithTag = [
			'my <span>title</span> here',
			'my <p>title</p> here',
		]

		cy.setupWP()
		cy.newPost()

		// Test Post Title field.
		textWithTag.forEach( text => {
			cy.typePostTitle( text )
			cy.addBlock( 'ugb/cta' )
			adjustField( 'Post Title' )
			cy
				.selectBlock( 'ugb/cta' )
				.assertBlockContent( '.ugb-cta__title', 'my title here', { assertBackend: false } )

			// Should not show block error.
			cy.savePost()
			cy.reload()
			cy.deleteBlock( 'ugb/cta' )
		} )
	} )
}
