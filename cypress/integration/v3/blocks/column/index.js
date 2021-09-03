
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest,
} from '~stackable-e2e/helpers'
import { stkBlocks } from '~stackable-e2e/config'

export {
	blockExist,
	blockError,
	innerBlocks,
	assertLinking,
	assertWidth,
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

function assertLinking() {
	it( 'should toggle the linking of the column block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/columns', { variation: 'Two columns; equal split' } )
		cy.selectBlock( 'stackable/column', 0 ).toggleBlockLinking( true )
		cy.selectBlock( 'stackable/column', 1 ).toggleBlockLinking( false )
		cy.selectBlock( 'stackable/column', 1 ).find( '.stk-linking-wrapper > .stk--is-unlinked' ).should( 'exist' )
		cy.savePost()
	} )
}

function assertWidth() {
	it( 'should test the adjustment of width using the tooltip', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/columns', { variation: 'Two columns; equal split' } )
		cy.selectBlock( 'stackable/column', 1 ).resizeWidth( 25 )
		cy.selectBlock( 'stackable/column', 1 ).assertComputedStyle( {
			'': { // Assert the `.is-selected` element
				'flex-basis': '25%',
			},
		}, { assertFrontend: false } )
	} )
}
