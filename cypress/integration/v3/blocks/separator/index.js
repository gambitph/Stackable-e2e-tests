/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, responsiveAssertHelper, Block,
} from '~stackable-e2e/helpers'

const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	desktopBlock,
	tabletBlock,
	mobileBlock,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/separator', '.stk-block-separator' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/separator' ) )
}

const assertBlockTab = Block
	.includes( [
		'Background',
		'Size & Spacing',
		'Borders & Shadows',
	] )
	.run

function blockTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/separator' )
		cy.selectBlock( 'stackable/separator' ).asBlock( 'separatorBlock', { isStatic: true } )
		cy.openInspector( 'stackable/separator', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-separator',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@separatorBlock' )
	} )
}
