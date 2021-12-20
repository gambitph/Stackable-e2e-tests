
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, responsiveAssertHelper, Block, Advanced, assertTypographyModule,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	typeContent,
	pressEnterKey,
	pressBackspace,
	addBlocks,
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

function pressBackspace() {
	it( 'should test pressing the backspace in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/card', { variation: 'Default Layout' } )
		cy.addBlock( 'stackable/text' )

		cy.typeBlock( 'stackable/text', '.stk-block-text__text', 'Hello World!', 1 )
		cy.get( '.stk-block-text__text' ).eq( 1 ).type( '{selectall}{backspace}{backspace}', { force: true } )

		cy.get( '.block-editor-block-list__block.is-selected' ).invoke( 'attr', 'data-type' ).then( block => {
			assert.isTrue(
				block === 'stackable/card',
				`Expected that the block is deleted and focus is on 'stackable/card'. Found: '${ block }'`
			)
		} )
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

function styleTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/text' ).asBlock( 'textBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/text', '.stk-block-text__text', 'Powering the next generation of web design. Have the confidence to easily build the fastest websites using a new page building experience for Gutenberg.', 0 )
		cy.openInspector( 'stackable/text', 'Style' )
	} )

	afterEach( () => cy.assertFrontendStyles( '@textBlock' ) )

	it( 'should assert General panel in Style tab', () => {
		cy.collapse( 'General' )
		cy.adjust( 'Columns', 3, { viewport } )
		cy.adjust( 'Column Gap', 37, { viewport } ).assertComputedStyle( {
			'.stk-block-text': {
				'column-count': '3',
				'column-gap': '37px',
			},
		} )
	} )

	it( 'should assert Typography panel in Style tab', () => {
		assertTypographyModule( {
			selector: '.stk-block-text__text',
			viewport,
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
		cy.addBlock( 'stackable/text' ).asBlock( 'textBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/text', '.stk-block-text__text', 'Text block', 0 )
		cy.openInspector( 'stackable/text', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-text',
		alignmentSelector: '.stk-block-text__text',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@textBlock' )
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
		cy.addBlock( 'stackable/text' ).asBlock( 'textBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/text', '.stk-block-text__text', 'Text block', 0 )
		cy.openInspector( 'stackable/text', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-text',
		blockName: 'stackable/text',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@textBlock' )
	} )
}
