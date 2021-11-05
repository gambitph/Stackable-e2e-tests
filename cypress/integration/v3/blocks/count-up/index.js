/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, checkJsFiles, responsiveAssertHelper, Block, Advanced,
} from '~stackable-e2e/helpers'

const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	typeContent,
	loadedFiles,
	desktopBlock,
	tabletBlock,
	mobileBlock,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/count-up', '.stk-block-count-up' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/count-up' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/count-up' ).asBlock( 'countUpBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/count-up', '.stk-block-count-up__text', '145,234.99', 0 )
			.assertBlockContent( '.stk-block-count-up__text', '145,234.99' )
	} )
}

function loadedFiles() {
	it( 'should assert the loaded files in the frontend', checkJsFiles( 'stackable/count-up', '#stk-frontend-count-up-js' ) )
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
		cy.addBlock( 'stackable/count-up' ).asBlock( 'countUpBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/count-up', '.stk-block-count-up__text', '145,234.99', 0 )
		cy.openInspector( 'stackable/count-up', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-count-up',
		alignmentSelector: '.stk-block-count-up__text',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@countUpBlock' )
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
		cy.addBlock( 'stackable/count-up' ).asBlock( 'countUpBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/count-up', '.stk-block-count-up__text', '145,234.99', 0 )
		cy.openInspector( 'stackable/count-up', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-count-up',
		blockName: 'stackable/count-up',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@countUpBlock' )
	} )
}
