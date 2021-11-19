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
	it( 'should show the block', assertBlockExist( 'stackable/posts', '.stk-block-posts', { variation: 'Default Layout' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/posts', { variation: 'Default Layout' } ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.registerPosts( { numOfPosts: 1 } )
		cy.newPage()
		cy.addBlock( 'stackable/posts', { variation: 'Default Layout' } )
		cy.openInspector( 'stackable/posts', 'Style' )
		cy.collapse( 'Read More Link' )

		cy.typeBlock( 'stackable/posts', '.stk-block-posts__readmore', 'Click to read more', 0 )
			.assertBlockContent( '.stk-block-posts__readmore', 'Click to read more' )
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
		cy.registerPosts( { numOfPosts: 3 } )
		cy.newPage()
		cy.addBlock( 'stackable/posts', { variation: 'Default Layout' } )
		cy.openInspector( 'stackable/posts', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-posts',
		alignmentSelector: '.stk-block-posts',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
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
		cy.registerPosts( { numOfPosts: 3 } )
		cy.newPage()
		cy.addBlock( 'stackable/posts', { variation: 'Default Layout' } )
		cy.openInspector( 'stackable/posts', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-posts',
		blockName: 'stackable/posts',
		positionEditorSelector: '.stk-block-posts__item > .stk-container',
		positionFrontendSelector: '.stk-block-posts__item > .stk-container',
	} )
}

// TODO: Add tests for adding the Load more button & Pagination
