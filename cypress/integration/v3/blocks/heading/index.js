/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, responsiveAssertHelper, Block,
} from '~stackable-e2e/helpers'

const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	typeContent,
	pressEnterKey,
	pressBackspace,
	desktopBlock,
	tabletBlock,
	mobileBlock,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/heading', '.stk-block-heading' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/heading' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/heading' ).asBlock( 'headingBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Heading block', 0 )
			.assertBlockContent( '.stk-block-heading__text', 'Heading block' )
	} )
}

function pressEnterKey() {
	it( 'should test pressing the enter key in heading block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/heading' )

		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Heading', 0 )
		cy.get( '.stk-block-heading__text' ).type( '{enter}', { force: true } )

		cy.get( '.block-editor-block-list__block.is-selected' ).invoke( 'attr', 'data-type' ).then( blockName => {
			assert.isTrue(
				blockName === 'stackable/text',
				'Expected text block to be added upon pressing enter key in Heading.'
			)
		} )
		cy.savePost()
		// Reloading should not cause a block error
		cy.reload()
	} )
}

function pressBackspace() {
	it( 'should test pressing the backspace in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/card' )
		cy.addBlock( 'stackable/heading' )

		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Hello World!', 1 )
		cy.get( '.stk-block-heading__text' ).eq( 1 ).type( '{selectall}{backspace}{backspace}', { force: true } )

		cy.get( '.block-editor-block-list__block.is-selected' ).invoke( 'attr', 'data-type' ).then( block => {
			assert.isTrue(
				block === 'stackable/card',
				`Expected that the block is deleted and focus is on 'stackable/card'. Found: '${ block }'`
			)
		} )
	} )
}

const assertBlockTab = Block
	.includes( [
		'Alignment',
		'Background',
		'Size & Spacing',
		'Borders & Shadows',
	] )
	.run

function blockTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/heading' ).asBlock( 'headingBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Heading', 0 )
		cy.openInspector( 'stackable/heading', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-heading',
		alignmentSelector: '.stk-block-heading__text',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@headingBlock' )
	} )
}
