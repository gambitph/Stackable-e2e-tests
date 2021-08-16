/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'

describe( 'Other Tests', registerTests( [ testV3Commands ] ) )

function testV3Commands() {
	it( 'should test all v3 commands', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/button-group' )
		// addNewColumn
		cy.selectBlock( 'stackable/button-group' ).addNewColumn()
		cy.selectBlock( 'stackable/button-group' ).addNewColumn()
		cy.selectBlock( 'stackable/button' )
		cy.openInspector( 'stackable/button', 'Style' )
		cy.collapse( 'Styles' )
		// adjustBlockStyle
		cy.adjustBlockStyle( 'Ghost' )
		cy.addBlock( 'stackable/columns' )
		cy.selectBlock( 'stackable/columns' ).addNewColumn()
		// toggleBlockLinking
		cy.selectBlock( 'stackable/column', 1 ).toggleBlockLinking( false )
		cy.selectBlock( 'stackable/column', 2 ).toggleBlockLinking( false )
		// resizeWidth
		cy.selectBlock( 'stackable/column', 2 ).resizeWidth( 25 )

		// formTokenControl
		cy.addBlock( 'stackable/heading' )
		cy.openInspector( 'stackable/heading', 'Advanced' )
		// cy.collapse( 'Conditional Display' )
		// cy.get( '.ugb-panel--conditional-display button:contains(Add New Condition)' ).click( { force: true } )
		// cy.adjust( 'Condition Type', 'conditional-tag', {
		// 	parentSelector: '.stk-condition-component',
		// } )
		// cy.adjust( 'Enter Conditional Tag', [ 'Home - is_home', 'Front Page - is_front_page' ], {
		// 	parentSelector: '.stk-condition-component',
		// } )

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

		// checkboxControl
		cy.addBlock( 'stackable/text' )
		cy.openInspector( 'stackable/text', 'Advanced' )
		cy.collapse( 'Conditional Display' )
		cy.get( '.ugb-panel--conditional-display button:contains(Add New Condition)' ).click( { force: true } )
		const parentSelector = '.stk-condition-component'
		cy.adjust( 'Condition Type', 'date-time', {
			parentSelector,
		} )
		cy.adjust( 'Sunday', true, {
			parentSelector,
		}, {
			parentSelector: '.stk-days-checkbox > .components-base-control__field',
		} )
		cy.adjust( 'Tuesday', true, {
			parentSelector,
		}, {
			parentSelector: '.stk-days-checkbox > .components-base-control__field',
		} )
		cy.adjust( 'Thursday', true, {
			parentSelector,
		}, {
			parentSelector: '.stk-days-checkbox > .components-base-control__field',
		} )
		cy.adjust( 'Saturday', true, {
			parentSelector,
		}, {
			parentSelector: '.stk-days-checkbox > .components-base-control__field',
		} )

		// dateTimeControl
		cy.adjust( 'Start Date', {
			day: '18',
			month: 'January',
			year: '2022',
		}, {
			parentSelector,
		} )
		cy.adjust( 'End Date', {
			day: '22',
			month: 'February',
			year: '2022',
		}, {
			parentSelector,
		} )
		cy.resetStyle( 'End Date', {
			parentSelector,
		} )

		// focalPointControl
		cy.addBlock( 'stackable/image' )
		cy.openInspector( 'stackable/image', 'Style' )
		cy.collapse( 'Image' )
		cy.adjust( 'Focal point', [ 70, 27 ] )
		cy.resetStyle( 'Focal point' )
	} )
}
