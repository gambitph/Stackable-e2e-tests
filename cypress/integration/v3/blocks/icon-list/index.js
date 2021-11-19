
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, responsiveAssertHelper, Block, Advanced,
} from '~stackable-e2e/helpers'

const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	typeContent,
	desktopBlock,
	tabletBlock,
	mobileBlock,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
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

// TODO: Temporarily commenting this out as we're experiencing issues.
// Uncomment when feature is readded to v3 Icon List block
//
// function indentList() {
// 	it( 'should allow indenting and outdenting the list item', () => {
// 		cy.setupWP()
// 		cy.newPage()
// 		cy.addBlock( 'stackable/icon-list' )
// 		cy.typeBlock( 'stackable/icon-list', '.stk-block-icon-list ul', 'August', 0 )
// 		cy.get( '.stk-block-icon-list' ).find( 'ul[role="textbox"]' ).type( '{enter}', { force: true } )
// 			.type( 'September', { force: true } )
// 		cy.adjustToolbar( 'Indent' )
// 		cy.get( '.stk-block-icon-list' ).contains( 'August' ).find( 'ul li' ).invoke( 'text' ).then( item => {
// 			assert.isTrue(
// 				item === 'September',
// 				'Expected list item 2 to be indented'
// 			)
// 		} )
// 		cy.adjustToolbar( 'Outdent' )
// 		cy.get( '.stk-block-icon-list ul > li' ).eq( 1 ).invoke( 'text' ).then( item => {
// 			assert.isTrue(
// 				item === 'September',
// 				'Expected list item 2 to be outdented'
// 			)
// 		} )
// 	} )
// }

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
		cy.addBlock( 'stackable/icon-list' ).asBlock( 'iconListBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/icon-list', '.stk-block-icon-list ul', 'Icon list', 0 )
		cy.openInspector( 'stackable/icon-list', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-icon-list',
		alignmentSelector: '.stk-block-icon-list',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@iconListBlock' )
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
		cy.addBlock( 'stackable/icon-list' ).asBlock( 'iconListBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/icon-list', '.stk-block-icon-list ul', 'Icon list', 0 )
		cy.openInspector( 'stackable/icon-list', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-icon-list',
		blockName: 'stackable/icon-list',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@iconListBlock' )
	} )
}
