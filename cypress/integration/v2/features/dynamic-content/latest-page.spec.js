/**
 * External dependencies
 */
import { range } from 'lodash'
import { registerTests } from '~stackable-e2e/helpers'
import { setupMatchPostFieldValues } from './helpers/index'

describe( 'Dynamic Content - Latest Page', registerTests( [
	matchPostData,
	adjustFieldOptions,
	assertEmptyValues,
] ) )

const adjustPostField = ( fieldName, fieldOptions = {}, nth ) => {
	cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
		source: 'Latest Post',
		post: `${ nth } Latest Page`,
		fieldName,
		fieldOptions,
	} )
}

function matchPostData() {
	it( 'should test dynamic content to match all field values in latest page #10', () => {
		cy.setupWP()
		range( 10, 0 ).forEach( id => {
			if ( id === 10 ) {
				// Setup field values of the page we're testing.
				setupMatchPostFieldValues( 'page' )
			} else {
				cy.newPage()
				cy.typePostTitle( `Page ${ id }` )
				cy.publish()
			}
		} )

		// Create a new post since we're asserting the latest pages.
		cy.newPost()

		cy.get( '@fieldsToAssert' ).then( fieldsToAssert => {
			fieldsToAssert.forEach( ( {
				name: fieldName, value, options: fieldOptions = {},
			} ) => {
				cy.addBlock( 'ugb/cta' )

				// Adjust the dynamic content popover.
				cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
					source: 'Latest Post',
					post: '10th Latest Page',
					fieldName,
					fieldOptions,
				} )

				// Assert the value.
				cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', value )
				cy.deleteBlock( 'ugb/cta' )
			} )
		} )
		cy.savePost()
	} )
}

function adjustFieldOptions() {
	it( 'should adjust all options for each field in a post', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'core/paragraph' )
		cy.typeBlock( 'core/paragraph', '', 'Excerpt content here. Lorem ipsum dolor sit amet.' )
		// Adjusting Post Title
		cy.typePostTitle( 'Latest Page 1' )
		cy.addBlock( 'ugb/cta' )
		adjustPostField( 'Post Title', {
			'Show as link': true,
			'Open in new tab': true,
		}, '1st' )

		cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', 'Latest Page 1' )
		cy.selectBlock( 'ugb/cta' ).assertHtmlTag( '.ugb-cta__title > *', 'a', { assertBackend: false } )
		cy.selectBlock( 'ugb/cta' ).assertHtmlAttribute( '.ugb-cta__title a', 'rel', 'noreferrer noopener', { assertBackend: false } )
		cy.deleteBlock( 'ugb/cta' )

		// Adjusting Post URL options
		cy.addBlock( 'ugb/cta' )
		adjustPostField( 'Post URL', {
			'Show as link': true,
			'Custom Text': 'This post',
			'Open in new tab': true,
		}, '1st' )
		cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', 'This post' )
		cy.selectBlock( 'ugb/cta' ).assertHtmlTag( '.ugb-cta__title > *', 'a', { assertBackend: false } )
		cy.selectBlock( 'ugb/cta' ).assertHtmlAttribute( '.ugb-cta__title a', 'rel', 'noreferrer noopener', { assertBackend: false } )
		cy.deleteBlock( 'ugb/cta' )

		// Adjusting Post excerpt options
		cy.addBlock( 'ugb/cta' )
		adjustPostField( 'Post Excerpt', {
			'Excerpt Length': 5,
		}, '1st' )

		cy.getPostUrls().then( ( { editorUrl, previewUrl } ) => {
			cy.visit( previewUrl )
			// Excerpt length should be 5.
			cy.document().then( doc => {
				assert.isTrue(
					[ ...doc.querySelector( '.ugb-cta__title' ).innerText.split( ' ' ) ].length === 5,
					'Expected excerpt text length to equal \'5\''
				)
			} )
			cy.visit( editorUrl )
		} )
		cy.deleteBlock( 'ugb/cta' )
		// For Post Date, Date GMT, Modified & Modified GMT options
		const dateFields = [ 'Post Date', 'Post Date GMT', 'Post Modified', 'Post Modified GMT' ]
		const dateFormats = [ 'Y-m-d H:i:s', 'F j, Y', 'F j, Y g:i a', 'd/m/y' ]
		dateFields.forEach( dateField => {
			cy.wrap( [] ).as( 'dateFormatValues' )

			dateFormats.forEach( dateFormat => {
				cy.addBlock( 'ugb/cta' )
				adjustPostField( dateField, {
					'Date Format': dateFormat,
				}, '1st' )
				cy.document().then( doc => {
					cy.get( '@dateFormatValues' ).then( dateFormatValues => {
						// Store the values to be compared in this alias.
						cy.wrap( [ ...dateFormatValues, doc.querySelector( '.ugb-cta__title' ).innerText ] ).as( 'dateFormatValues' )
					} )
				} )
				cy.deleteBlock( 'ugb/cta' )
			} )

			cy.get( '@dateFormatValues' ).then( dateFormatValues => {
				// Assert that the values are not equal. This means that the formats changed.
				assert.isTrue(
					! dateFormatValues.some( ( value, idx ) => dateFormatValues.indexOf( value ) !== idx ), // Returns true if values are unique
					`Expected all date format values to be unique. Values: "${ dateFormatValues.join( ', ' ) }"`
				)
			} )
		} )
		cy.addBlock( 'ugb/cta' )
		// Asserting Author options
		adjustPostField( 'Author Posts URL', {
			'Show as link': true,
			'Custom Text': 'Author #1',
			'Open in new tab': true,
		}, '1st' )

		cy.selectBlock( 'ugb/cta' ).assertBlockContent( '.ugb-cta__title', 'Author #1' )
		cy.selectBlock( 'ugb/cta' ).assertHtmlTag( '.ugb-cta__title > *', 'a', { assertBackend: false } )
		cy.selectBlock( 'ugb/cta' ).assertHtmlAttribute( '.ugb-cta__title a', 'rel', 'noreferrer noopener', { assertBackend: false } )
		cy.deleteBlock( 'ugb/cta' )
	} )
}

function assertEmptyValues() {
	it( 'should assert empty values in backend and frontend', () => {
		cy.setupWP()

		const emptyFields = [
			'Author First Name',
			'Author Last Name',
			'Featured Image URL',
		]

		range( 5, 0 ).forEach( id => {
			cy.newPage()
			cy.typePostTitle( `Page ${ id }` )
			cy.publish()
		} )

		cy.newPost()
		emptyFields.forEach( fieldName => {
			cy.addBlock( 'ugb/cta' )

			// Adjust the dynamic content popover.
			cy.adjustDynamicContent( 'ugb/cta', 0, '.ugb-cta__title', {
				source: 'Latest Post',
				post: '5th Latest Page',
				fieldName,
			} )
			cy
				.selectBlock( 'ugb/cta' )
				.assertBlockContent( '.ugb-cta__title', `${ fieldName } Placeholder`, { assertFrontend: false } )

			cy
				.selectBlock( 'ugb/cta' )
				.assertBlockContent( '.ugb-cta__title', '', { assertBackend: false } )

			cy.deleteBlock( 'ugb/cta' )
		} )
		cy.savePost()
	} )
}
