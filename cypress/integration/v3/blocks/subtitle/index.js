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
	pressBackspace,
	desktopBlock,
	tabletBlock,
	mobileBlock,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/subtitle', '.stk-block-subtitle' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/subtitle' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/subtitle' ).asBlock( 'subtitleBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/subtitle', '.stk-block-subtitle__text', 'Subtitle block', 0 )
			.assertBlockContent( '.stk-block-subtitle__text', 'Subtitle block' )
	} )
}

function pressBackspace() {
	it( 'should test pressing the backspace in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/card', { variation: 'Default Layout' } )
		cy.addBlock( 'stackable/subtitle' )

		cy.typeBlock( 'stackable/subtitle', '.stk-block-subtitle__text', 'Hello World!', 1 )
		cy.get( '.stk-block-subtitle__text' ).eq( 1 ).type( '{selectall}{backspace}{backspace}', { force: true } )

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
		cy.addBlock( 'stackable/subtitle' ).asBlock( 'subtitleBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/subtitle', '.stk-block-subtitle__text', 'Subtitle', 0 )
		cy.openInspector( 'stackable/subtitle', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-subtitle',
		alignmentSelector: '.stk-block-subtitle__text',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@subtitleBlock' )
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
		cy.addBlock( 'stackable/subtitle' ).asBlock( 'subtitleBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/subtitle', '.stk-block-subtitle__text', 'Subtitle', 0 )
		cy.openInspector( 'stackable/subtitle', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-subtitle',
		blockName: 'stackable/subtitle',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@subtitleBlock' )
	} )
}
