
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
	addBlocks,
	desktopBlock,
	tabletBlock,
	mobileBlock,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/text', '.stk-block-text' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/text' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/text' ).asBlock( 'textBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/text', '.stk-block-text__text', 'Lorem ipsum dolor sit amet.', 0 )
			.assertBlockContent( '.stk-block-text__text', 'Lorem ipsum dolor sit amet.' )
	} )
}

function pressEnterKey() {
	it( 'should test pressing the enter key in text block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/text' )

		cy.typeBlock( 'stackable/text', '.stk-block-text__text', 'Test text block', 0 )
		cy.get( '.stk-block-text__text' ).type( '{enter}', { force: true } )

		cy.get( '.block-editor-block-list__block.is-selected' ).invoke( 'attr', 'data-type' ).then( blockName => {
			assert.isTrue(
				blockName === 'stackable/text',
				'Expected text block to be added upon pressing enter key in Text.'
			)
		} )
		cy.savePost()
		// Reloading should not cause a block error
		cy.reload()
	} )
}

function addBlocks() {
	it( 'should test adding stackable blocks using the / command', () => {
		const selectSkip = () => cy
			.get( '.block-editor-block-variation-picker' )
			.find( '.block-editor-block-variation-picker__skip button' )
			.click( { force: true } )

		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/text' )
		cy.typeBlock( 'stackable/text', '.stk-block-text__text', '/accordion', 0 )
		cy.get( '.components-popover__content' )
			.contains( 'Accordion' )
			.first()
			.click( { force: true } )

		selectSkip()
		cy.get( '.stk-block-accordion' ).should( 'exist' )

		cy.addBlock( 'stackable/text' )
		cy.typeBlock( 'stackable/text', '.stk-block-text__text', '/feature-grid', 0 )
		cy.get( '.components-popover__content' )
			.contains( 'Feature Grid' )
			.first()
			.click( { force: true } )
		selectSkip()
		cy.get( '.stk-block-feature-grid' ).should( 'exist' )
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
		cy.addBlock( 'stackable/text' )
		cy.selectBlock( 'stackable/text' ).asBlock( 'textBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/text', '.stk-block-text__text', 'Text block', 0 )
		cy.openInspector( 'stackable/text', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-text',
		alignmentSelector: '.stk-block-text__text',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@textBlock' )
	} )
}
