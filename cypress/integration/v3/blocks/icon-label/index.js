
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, assertInnerBlocks, responsiveAssertHelper, Block, Advanced,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	innerBlocksExist,
	desktopStyle,
	tabletStyle,
	mobileStyle,
	desktopBlock,
	tabletBlock,
	mobileBlock,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/icon-label', '.stk-block-icon-label' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/icon-label' ) )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/icon-label', [
		'.stk-block-heading',
		'.stk-block-icon',
	] ) )
}

function styleTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/icon-label' ).asBlock( 'iconLabelBlock', { isStatic: true } )
		cy.openInspector( 'stackable/icon-label', 'Style' )
		cy.savePost()
	} )

	afterEach( () => cy.assertFrontendStyles( '@iconLabelBlock' ) )

	it( 'should assert General panel in Style tab', () => {
		cy.collapse( 'General' )
		cy.adjust( 'Icon Gap', 163, { viewport } ).assertComputedStyle( {
			'.stk-inner-blocks .stk-block-icon': {
				'flex-basis': '163px',
			},
		}, { assertBackend: false } )
		cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
			'.stk-inner-blocks [data-type="stackable/icon"]': {
				'flex-basis': '163px',
			},
		}, { assertFrontend: false } )
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
		cy.addBlock( 'stackable/icon-label' ).asBlock( 'iconLabelBlock', { isStatic: true } )
		cy.openInspector( 'stackable/icon-label', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-icon-label',
		alignmentSelector: '.stk-block-icon-label > .stk-inner-blocks',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@iconLabelBlock' )
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
		cy.addBlock( 'stackable/icon-label' ).asBlock( 'iconLabelBlock', { isStatic: true } )
		cy.openInspector( 'stackable/icon-label', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-icon-label',
		blockName: 'stackable/icon-label',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@iconLabelBlock' )
	} )
}
