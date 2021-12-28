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
	it( 'should show the block', assertBlockExist( 'stackable/feature-grid', '.stk-block-feature-grid', { variation: 'Default Layout' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/feature-grid', { variation: 'Default Layout' } ) )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/feature-grid', [
		'.stk-block-image',
		'.stk-block-heading',
		'.stk-block-text',
		'.stk-block-button',
	], { variation: 'Default Layout' } ) )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/feature-grid', { variation: 'Default Layout' } ).asBlock( 'featureGridBlock', { isStatic: true } )
		cy.openInspector( 'stackable/feature-grid', 'Style' )
	} )

	afterEach( () => cy.assertFrontendStyles( '@featureGridBlock' ) )

	it( 'should assert General panel in Style tab', () => {
		cy.collapse( 'General' )

		desktopOnly( () => {
			// Enable column cloning
			cy.getBaseControl( '.components-base-control:contains(Columns)' )
				.find( 'button[aria-label="Settings"]' )
				.click( { force: true } )
			cy.adjust( 'Columns', 4 )

			cy.selectBlock( 'stackable/column', 3 )
			cy.get( '.block-editor-block-list__block.is-selected' ).find( '.stk-block-heading' ).should( 'exist' )
			cy.get( '.block-editor-block-list__block.is-selected' ).find( '.stk-block-text' ).should( 'exist' )

			cy.openInspector( 'stackable/feature-grid', 'Style' )
			cy.collapse( 'General' )
			cy.getBaseControl( '.components-base-control:contains(Columns)' )
				.find( 'button[aria-label="Settings"]' )
				.click( { force: true } )
			cy.adjust( 'Columns', 5 )
			cy.get( '.stk-block-feature-grid' ).find( '.stk-block-column' ).should( 'have.length', 5 )

			cy.get( '.block-editor-block-list__block.is-selected' ).assertClassName( '.stk-block-feature-grid > .stk-inner-blocks', 'alignwide' )
			cy.adjust( 'Content Width', 'alignfull' ).assertClassName( '.stk-block-feature-grid > .stk-inner-blocks', 'alignfull' )
		} )

		cy.adjust( 'Fit all columns to content', true ).assertClassName( '.stk-block-feature-grid > .stk-inner-blocks', 'stk--fit-content' )
		const aligns = [ 'flex-start', 'center', 'flex-end' ]
		aligns.forEach( align => {
			cy.adjust( 'Columns Alignment', align, { viewport } ).assertComputedStyle( {
				'.stk-inner-blocks > .block-editor-inner-blocks > .block-editor-block-list__layout': {
					'justify-content': align,
				},
			}, { assertFrontend: false } )
			cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
				'.stk-block-feature-grid > .stk-inner-blocks': {
					'justify-content': align,
				},
			}, { assertBackend: false } )
		} )
		cy.adjust( 'Column Gap', 41, { viewport } )
		cy.adjust( 'Row Gap', 23, { viewport } ).assertComputedStyle( {
			'.stk-inner-blocks > .block-editor-inner-blocks > .block-editor-block-list__layout': {
				'column-gap': '41px',
				'row-gap': '23px',
			},
		}, { assertFrontend: false } )
		cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
			'.stk-block-feature-grid > .stk-inner-blocks': {
				'column-gap': '41px',
				'row-gap': '23px',
			},
		}, { assertBackend: false } )
	} )
}

const assertBlockTab = Block
	.includes( [
		'Alignment',
		'Background',
		'Size & Spacing',
		'Borders & Shadows',
		'Top Separator',
		'Bottom Separator',
	] )
	.run

function blockTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/feature-grid', { variation: 'Default Layout' } ).asBlock( 'featureGridBlock', { isStatic: true } )
		cy.openInspector( 'stackable/feature-grid', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-feature-grid',
		alignmentSelector: '.stk-block-feature-grid > .stk-inner-blocks',
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@featureGridBlock' )
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
		cy.addBlock( 'stackable/feature-grid', { variation: 'Default Layout' } ).asBlock( 'featureGridBlock', { isStatic: true } )
		cy.openInspector( 'stackable/feature-grid', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-feature-grid',
		blockName: 'stackable/feature-grid',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@featureGridBlock' )
	} )
}
