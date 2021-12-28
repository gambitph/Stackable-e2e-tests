
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, responsiveAssertHelper, Block, Advanced, assertContainerBackground, assertContainerSizeSpacing, assertContainerBordersShadow,
} from '~stackable-e2e/helpers'
import { stkBlocks } from '~stackable-e2e/config'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	innerBlocks,
	assertWidth,
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
	it( 'should show the block', assertBlockExist( 'stackable/columns', '.stk-block-column', { variation: 'Two columns; equal split' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/columns', { variation: 'Two columns; equal split' } ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/columns', { variation: 'Two columns; equal split' } )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/column' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/column', blockName, 0 ) )

		cy.savePost()
	} )
}

function assertWidth() {
	it( 'should test the adjustment of width using the tooltip', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/columns', { variation: 'Two columns; equal split' } )
		cy.selectBlock( 'stackable/column', 0 ).asBlock( 'columnBlock1', { isStatic: true } )
		cy.selectBlock( 'stackable/column', 1 ).asBlock( 'columnBlock2', { isStatic: true } )
		cy.selectBlock( 'stackable/column', 0 ).resizeWidth( 25 )
		cy.selectBlock( 'stackable/column', 0 )
		cy.selectBlock( 'stackable/column', 0 ).assertComputedStyle( {
			'': { // Assert the `.is-selected` element
				'max-width': '25%',
				'flex': '1 1 25%',
			},
		}, { assertFrontend: false } )
		cy.selectBlock( 'stackable/column', 0 ).assertComputedStyle( {
			'.stk-block-column': {
				'flex': '1 1 25%',
			},
		}, { assertBackend: false } )

		// Revert back to 50% 50% for Tablet & Mobile assertion
		cy.selectBlock( 'stackable/column', 0 ).resizeWidth( 50 )

		/**
		 * Tablet: 30% 70%
		 * Mobile: 70% 30%
		 */
		const viewports = [ 'Tablet', 'Mobile' ]

		viewports.forEach( viewport => {
			cy.changePreviewMode( viewport )
			cy.selectBlock( 'stackable/column', 0 ).resizeWidth( viewport === 'Tablet' ? 30 : 70 )
			cy.selectBlock( 'stackable/column', 0 ).assertComputedStyle( {
				'': { // Assert the `.is-selected` element
					'flex-basis': `${ viewport === 'Tablet' ? '30' : '70' }%`,
				},
			}, { assertFrontend: false } )
			cy.selectBlock( 'stackable/column', 0 ).assertComputedStyle( {
				'.stk-block-column': {
					'flex-basis': `${ viewport === 'Tablet' ? '30' : '70' }%`,
				},
			}, { assertBackend: false } )
			cy.changePreviewMode( viewport )
			cy.selectBlock( 'stackable/column', 1 ).resizeWidth( viewport === 'Tablet' ? 70 : 30 )
			cy.selectBlock( 'stackable/column', 1 ).assertComputedStyle( {
				'': { // Assert the `.is-selected` element
					'flex-basis': `${ viewport === 'Tablet' ? '70' : '30' }%`,
				},
			}, { assertFrontend: false } )
			cy.selectBlock( 'stackable/column', 1 ).assertComputedStyle( {
				'.stk-block-column': {
					'flex-basis': `${ viewport === 'Tablet' ? '70' : '30' }%`,
				},
			}, { assertBackend: false } )
		} )
	} )
}

function styleTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/columns', { variation: 'Two columns; equal split' } )
		cy.selectBlock( 'stackable/column', 0 ).asBlock( 'columnBlock', { isStatic: true } )
		cy.openInspector( 'stackable/column', 'Style', 0 )
		cy.savePost()
	} )

	afterEach( () => cy.assertFrontendStyles( '@columnBlock' ) )

	it( 'should assert Column Spacing panel in Style tab', () => {
		cy.collapse( 'Column Spacing' )
		cy.adjust( 'Spacing', [ 39, 40, 41, 42 ], { viewport, unit: 'px' } ).assertComputedStyle( {
			'.stk-block-column__content': {
				'margin-top': '39px',
				'margin-right': '40px',
				'margin-bottom': '41px',
				'margin-left': '42px',
			},
		} )
		cy.adjust( 'Spacing', [ 11, 12, 13, 14 ], { viewport, unit: 'em' } ).assertComputedStyle( {
			'.stk-block-column__content': {
				'margin-top': '11em',
				'margin-right': '12em',
				'margin-bottom': '13em',
				'margin-left': '14em',
			},
		} )
	} )

	it( 'should assert Container Background panel in Style tab', () => {
		cy.toggleStyle( 'Container Background' )
		assertContainerBackground( { viewport } )
	} )

	it( 'should assert Container Size & Spacing panel in Style tab', () => {
		assertContainerSizeSpacing( {
			viewport,
			selector: '.stk-block-column__content',
		} )
	} )

	it( 'should assert Container Borders & Shadow panel in Style tab', () => {
		assertContainerBordersShadow( { viewport } )
	} )
}

const assertBlockTab = Block
	.includes( [
		'Alignment',
		'Background',
		'Size & Spacing',
		'Borders & Shadows',
		'Link',
	] )
	.run

function blockTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/columns', { variation: 'Two columns; equal split' } )
		cy.selectBlock( 'stackable/column', 0 ).asBlock( 'columnBlock', { isStatic: true } )
		cy.openInspector( 'stackable/column', 'Block', 0 )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-column',
		alignmentSelector: '.stk-block-column .stk-inner-blocks',
		columnAlignmentEditorMainSelector: true, // `.is-selected` element if true
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@columnBlock' )
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
		cy.addBlock( 'stackable/columns', { variation: 'One column' } )
		cy.selectBlock( 'stackable/column', 0 ).asBlock( 'columnBlock', { isStatic: true } )
		cy.openInspector( 'stackable/column', 'Advanced', 0 )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-column',
		blockName: 'stackable/column',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@columnBlock' )
	} )
}
