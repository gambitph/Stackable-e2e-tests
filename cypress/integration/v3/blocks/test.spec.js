/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'

describe( 'Other Tests', registerTests( [ testV3Commands ] ) )

function testV3Commands() {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
	} )
	afterEach( () => {
		cy.savePost()
	} )
	it( 'should test addNewColumn', () => {
		cy.addBlock( 'stackable/button-group' )
		// addNewColumn
		cy.selectBlock( 'stackable/button-group' ).addNewColumn()
		cy.selectBlock( 'stackable/button-group' ).addNewColumn()
		cy.addBlock( 'stackable/columns' )
		cy.selectBlock( 'stackable/columns' ).addNewColumn()
	} )

	it( 'should test adjustBlockStyle', () => {
		cy.addBlock( 'stackable/button-group' )
		cy.openInspector( 'stackable/button', 'Style' )
		cy.collapse( 'Styles' )
		// adjustBlockStyle
		cy.adjustBlockStyle( 'Ghost' )
	} )

	it( 'should test toggleBlockLinking', () => {
		cy.addBlock( 'stackable/columns' )
		cy.selectBlock( 'stackable/columns' ).addNewColumn()
		// toggleBlockLinking
		cy.selectBlock( 'stackable/column', 1 ).toggleBlockLinking( false )
		cy.selectBlock( 'stackable/column', 2 ).toggleBlockLinking( false )
	} )

	it( 'should test resizeWidth', () => {
		cy.addBlock( 'stackable/columns' )
		cy.selectBlock( 'stackable/columns' ).addNewColumn()
		// resizeWidth
		cy.selectBlock( 'stackable/column', 2 ).resizeWidth( 25 )
	} )

	it( 'should test formTokenControl', () => {
		// formTokenControl
		cy.addBlock( 'stackable/heading' )
		cy.openInspector( 'stackable/heading', 'Advanced' )
		cy.collapse( 'Conditional Display' )
		cy.get( '.ugb-panel--conditional-display button:contains(Add New Condition)' ).click( { force: true } )
		cy.adjust( 'Condition Type', 'conditional-tag', {
			parentSelector: '.stk-condition-component',
		} )
		cy.adjust( 'Enter Conditional Tag', [ 'Home', 'Front Page' ], {
			parentSelector: '.stk-condition-component',
			mainComponentSelector: '.components-form-token-field',
		} )
	} )

	it( 'should test textControl & adjustDynamicContent', () => {
		cy.addBlock( 'stackable/heading' )
		cy.openInspector( 'stackable/heading', 'Style' )
		cy.collapse( 'Typography' )
		// Enter text
		cy.adjust( 'Content', 'Plain text only' )
		// adjustDynamicContent
		cy.adjust( 'Content', {
			source: 'Current Post',
			fieldName: 'Post Date',
		}, {
			isDynamicContent: true,
		} )
	} )

	it( 'should test checkboxControl', () => {
		// checkboxControl
		cy.addBlock( 'stackable/text' )
		cy.openInspector( 'stackable/text', 'Advanced' )
		cy.collapse( 'Conditional Display' )
		cy.get( '.ugb-panel--conditional-display button:contains(Add New Condition)' ).click( { force: true } )

		cy.adjust( 'Condition Type', 'date-time', {
			parentSelector: '.stk-condition-component',
		} )

		cy.adjust( 'Sunday', true, {
			parentSelector: '.stk-days-checkbox > div',
		} )
		cy.adjust( 'Tuesday', true, {
			parentSelector: '.stk-days-checkbox > div',
		} )
		cy.adjust( 'Thursday', true, {
			parentSelector: '.stk-days-checkbox > div',
		} )
		cy.adjust( 'Saturday', true, {
			parentSelector: '.stk-days-checkbox > div',
		} )
		cy.adjust( 'Thursday', false, {
			parentSelector: '.stk-days-checkbox > div',
		} )
	} )

	it( 'should test dateTimeControl and stkDateTimeControl + Reset', () => {
		// dateTimeControl
		cy.addBlock( 'stackable/text' )
		cy.openInspector( 'stackable/text', 'Advanced' )
		cy.collapse( 'Conditional Display' )
		cy.get( '.ugb-panel--conditional-display button:contains(Add New Condition)' ).click( { force: true } )

		cy.adjust( 'Condition Type', 'date-time', {
			parentSelector: '.stk-condition-component',
		} )
		cy.adjust( 'Start Date', {
			day: '18',
			month: 'January',
			year: '2022',
		}, {
			parentSelector: '.stk-condition-component',
		} )
		cy.adjust( 'End Date', {
			day: '22',
			month: 'February',
			year: '2022',
		}, {
			parentSelector: '.stk-condition-component',
		} )
		cy.resetStyle( 'End Date', {
			parentSelector: '.stk-condition-component',
		} )
	} )

	it( 'should test focalPointControl', () => {
		// focalPointControl
		cy.addBlock( 'stackable/image' )
		cy.openInspector( 'stackable/image', 'Style' )
		cy.collapse( 'Image' )
		cy.adjust( 'Focal point', [ 70, 27 ] )
		cy.resetStyle( 'Focal point' )
	} )
}
