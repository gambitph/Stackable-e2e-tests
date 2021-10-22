
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, checkJsFiles, assertInnerBlocks, responsiveAssertHelper, Block,
} from '~stackable-e2e/helpers'
import { stkBlocks } from '~stackable-e2e/config'

const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	innerBlocks,
	innerBlocksExist,
	loadedFiles,
	desktopBlock,
	tabletBlock,
	mobileBlock,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/accordion', '.stk-block-accordion', { variation: 'Default Layout' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/accordion', { variation: 'Default Layout' } ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/accordion', { variation: 'Default Layout' } )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/accordion' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/column', blockName, 1 ) )

		cy.savePost()
	} )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/accordion', [
		'.stk-block-icon-label',
		'.stk-block-text',
	], { variation: 'Default Layout' } ) )
}

function loadedFiles() {
	it( 'should assert the loaded files in the frontend', checkJsFiles( 'stackable/accordion', '#stk-frontend-accordion-js', { variation: 'Default Layout' } ) )
}

// TODO: Assert down arrow icon

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
		cy.addBlock( 'stackable/accordion', { variation: 'Default Layout' } ).asBlock( 'accordionBlock', { isStatic: true } )
		cy.openInspector( 'stackable/accordion', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-accordion',
		alignmentSelector: '.stk-block-accordion',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@accordionBlock' )
	} )
}
