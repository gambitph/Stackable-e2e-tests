
/**
 * External dependencies
 */
import { uniqueId } from 'lodash'
import {
	assertBlockExist, blockErrorTest, assertLinks, responsiveAssertHelper, Block,
} from '~stackable-e2e/helpers'

const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	typeContent,
	pressEnterKey,
	assertLink,
	desktopBlock,
	tabletBlock,
	mobileBlock,
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

function assertLink() {
	it( 'should assert the links in buttons', () => {
		cy.setupWP()
		cy.newPage()
		cy.typePostTitle( 'Test Button Link' )
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

		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Buy', 0 )
		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Learn More', 1 )
		assertLinks( 'stackable/button', {
			editorSelector: '.stk-button__inner-text',
			frontendSelector: '.stk-button',
		} )
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
