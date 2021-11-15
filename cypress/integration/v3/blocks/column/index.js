
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, responsiveAssertHelper, Block,
} from '~stackable-e2e/helpers'
import { stkBlocks } from '~stackable-e2e/config'

const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	innerBlocks,
	assertWidth,
	desktopBlock,
	tabletBlock,
	mobileBlock,
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
		cy.selectBlock( 'stackable/column', 0 ).asBlock( 'columnBlock2', { isStatic: true } )
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
		const viewports = [ 'Tablet', 'Mobile' ]

		viewports.forEach( viewport => {
			cy.changePreviewMode( viewport )
			cy.selectBlock( 'stackable/column', 0 ).resizeWidth( 30 )
			cy.selectBlock( 'stackable/column', 0 ).assertComputedStyle( {
				'': { // Assert the `.is-selected` element
					'flex-basis': '30%',
				},
			}, { assertFrontend: false } )
			cy.selectBlock( 'stackable/column', 0 ).resizeWidth( 30 )
			cy.selectBlock( 'stackable/column', 0 ).assertComputedStyle( {
				'.stk-block-column': {
					'flex-basis': '30%',
				},
			}, { assertBackend: false } )
			cy.selectBlock( 'stackable/column', 1 ).resizeWidth( 70 )
			cy.selectBlock( 'stackable/column', 1 ).assertComputedStyle( {
				'': { // Assert the `.is-selected` element
					'flex-basis': '70%',
				},
			}, { assertFrontend: false } )
			cy.selectBlock( 'stackable/column', 1 ).assertComputedStyle( {
				'.stk-block-column': {
					'flex-basis': '70%',
				},
			}, { assertBackend: false } )
		} )

		cy.assertFrontendStyles( '@columnBlock1' )
		cy.assertFrontendStyles( '@columnBlock2' )
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
