/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, responsiveAssertHelper, Block, Advanced,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
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
	it( 'should show the block', assertBlockExist( 'stackable/columns', '.stk-block-columns', { variation: 'Two columns; equal split' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/columns', { variation: 'Two columns; equal split' } ) )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/columns', { variation: 'One column' } ).asBlock( 'columnsBlock', { isStatic: true } )
		cy.openInspector( 'stackable/columns', 'Style' )
	} )

	afterEach( () => cy.assertFrontendStyles( '@columnsBlock' ) )

	it( 'should assert General panel in Style tab', () => {
		cy.collapse( 'General' )

		desktopOnly( () => {
		// Insert heading & text inside the column
			cy.addInnerBlock( 'stackable/column', 'stackable/heading', 0 )
			cy.addInnerBlock( 'stackable/column', 'stackable/text', 0 )
			cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Heading', 0 )
			cy.typeBlock( 'stackable/text', '.stk-block-text__text', 'Text block', 0 )

			cy.openInspector( 'stackable/columns', 'Style' )
			// Enable column cloning
			cy.getBaseControl( '.components-base-control:contains(Columns)' )
				.find( 'button[aria-label="Settings"]' )
				.click( { force: true } )
			cy.adjust( 'Columns', 3 )

			cy.selectBlock( 'stackable/column', 2 )
			cy.get( '.block-editor-block-list__block.is-selected' ).find( '.stk-block-heading' ).should( 'exist' )
			cy.get( '.block-editor-block-list__block.is-selected' ).find( '.stk-block-text' ).should( 'exist' )

			cy.openInspector( 'stackable/columns', 'Style' )
			cy.getBaseControl( '.components-base-control:contains(Columns)' )
				.find( 'button[aria-label="Settings"]' )
				.click( { force: true } )
			cy.adjust( 'Columns', 5 )
			cy.get( '.stk-block-columns' ).find( '.stk-block-column' ).should( 'have.length', 5 )

			cy.adjust( 'Content Width', 'alignwide' ).assertClassName( '.stk-block-columns > .stk-inner-blocks', 'alignwide' )
			cy.adjust( 'Content Width', 'alignfull' ).assertClassName( '.stk-block-columns > .stk-inner-blocks', 'alignfull' )
		} )

		cy.adjust( 'Fit all columns to content', true ).assertClassName( '.stk-block-columns > .stk-inner-blocks', 'stk--fit-content' )
		const aligns = [ 'flex-start', 'center', 'flex-end' ]
		aligns.forEach( align => {
			cy.adjust( 'Columns Alignment', align, { viewport } ).assertComputedStyle( {
				'.stk-inner-blocks > .block-editor-inner-blocks > .block-editor-block-list__layout': {
					'justify-content': align,
				},
			}, { assertFrontend: false } )
			cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
				'.stk-block-columns > .stk-inner-blocks': {
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
			'.stk-block-columns > .stk-inner-blocks': {
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
		cy.addBlock( 'stackable/columns', { variation: 'Two columns; equal split' } ).asBlock( 'columnsBlock', { isStatic: true } )
		cy.openInspector( 'stackable/columns', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-columns',
		alignmentSelector: '.stk-block-columns > .stk-inner-blocks',
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
		columnAlignmentEditorExtendedSelector: ' > .block-editor-inner-blocks > .block-editor-block-list__layout',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@columnsBlock' )
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
		cy.addBlock( 'stackable/columns', { variation: 'Two columns; equal split' } ).asBlock( 'columnsBlock', { isStatic: true } )
		cy.openInspector( 'stackable/columns', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-columns',
		blockName: 'stackable/columns',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@columnsBlock' )
	} )
}

// TODO: Add test for column collapsing in Desktop, Tablet, Mobile - Block snapshots
