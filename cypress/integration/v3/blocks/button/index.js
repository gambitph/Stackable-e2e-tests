
/**
 * External dependencies
 */
import { uniqueId } from 'lodash'
import {
	assertBlockExist, blockErrorTest, responsiveAssertHelper, Block, Advanced,
} from '~stackable-e2e/helpers'

const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	typeContent,
	pressEnterKey,
	desktopBlock,
	tabletBlock,
	mobileBlock,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/button-group', '.stk-block-button' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/button-group' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/button-group' )
		cy.selectBlock( 'stackable/button-group' ).addNewColumn( { blockToAdd: 'Button' } )

		// Add a unique e2e className for the 2nd button added
		// TODO: Find a better way to add this directly when calling `.addNewColumn`
		cy.selectBlock( 'stackable/button', 1 ).then( $block => {
			const clientId = $block.data( 'block' )
			cy.wp().then( wp => {
				const className = wp.data.select( 'core/block-editor' ).getBlock( clientId ).attributes.className
				wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, { className: `${ className ? className + ' ' : '' }e2etest-block-${ uniqueId() }` } )
			} )
		} )

		cy.selectBlock( 'stackable/button', 0 ).asBlock( 'buttonBlock1', { isStatic: true } )
		cy.selectBlock( 'stackable/button', 1 ).asBlock( 'buttonBlock2', { isStatic: true } )

		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Button 1', 0 )
			.assertBlockContent( '.stk-button__inner-text', 'Button 1' )
		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Click here', 1 )
			.assertBlockContent( '.stk-button__inner-text', 'Click here' )
	} )
}

function pressEnterKey() {
	it( 'should test pressing the enter key in button block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/button-group' )

		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Click me', 0 )
		cy.get( '.stk-button__inner-text' ).type( '{enter}', { force: true } )

		cy.selectBlock( 'stackable/button-group' )
			.find( '.stk-block-button' )
			.its( 'length' )
			.should( 'eq', 2 )

		cy.savePost()
		// Reloading should not cause a block error
		cy.reload()
	} )
}

const assertBlockTab = Block
	.includes( [
		'Background',
		'Size & Spacing',
		'Borders & Shadows',
	] )
	.run

function blockTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/button-group' )
		cy.selectBlock( 'stackable/button', 0 ).asBlock( 'buttonBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Button 1', 0 )
		cy.openInspector( 'stackable/button', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-button',
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@buttonBlock' )
	} )
}

const assertAdvancedTab = Advanced
	.includes( [
		'General',
		'Position',
		'Transform & Transition',
		'Motion Effects',
		'Custom Attributes',
		'Custom CSS',
		'Responsive',
		'Conditional Display',
		'Advanced',
	] )
	.run

function advancedTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/button-group' )
		cy.selectBlock( 'stackable/button', 0 ).asBlock( 'buttonBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Button 1', 0 )
		cy.openInspector( 'stackable/button', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-button',
		blockName: 'stackable/button',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@buttonBlock' )
	} )
}
