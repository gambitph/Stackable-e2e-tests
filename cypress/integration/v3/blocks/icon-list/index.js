
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
	desktopBlock,
	tabletBlock,
	mobileBlock,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/icon-list', '.stk-block-icon-list' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/icon-list' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/icon-list' )
		cy.typeBlock( 'stackable/icon-list', '.stk-block-icon-list ul', 'Icon list', 0 )
		cy.get( '.stk-block-icon-list' ).find( 'ul[role="textbox"]' ).type( '{enter}', { force: true } )
			.type( 'Icon list 2', { force: true } )
		cy.get( '.stk-block-icon-list' ).find( 'ul[role="textbox"]' ).type( '{enter}', { force: true } )
			.type( 'Icon list 3', { force: true } )
		cy.savePost()
		cy.selectBlock( 'stackable/icon-list' )
			.assertBlockContent( '.stk-block-icon-list ul', 'Icon listIcon list 2Icon list 3' )
	} )
}
// TODO: Add indentation / outdent tests

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
		cy.addBlock( 'stackable/icon-list' )
		cy.selectBlock( 'stackable/icon-list' ).asBlock( 'iconListBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/icon-list', '.stk-block-icon-list ul', 'Icon list', 0 )
		cy.openInspector( 'stackable/icon-list', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-icon-list',
		alignmentSelector: '.stk-block-icon-list',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		enableInnerBlockVerticalAlignment: false,
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@iconListBlock' )
	} )
}
