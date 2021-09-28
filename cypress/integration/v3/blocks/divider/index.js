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
	it( 'should show the block', assertBlockExist( 'stackable/divider', '.stk-block-divider' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/divider' ) )
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
		cy.addBlock( 'stackable/divider' )
		cy.selectBlock( 'stackable/divider' ).asBlock( 'dividerBlock', { isStatic: true } )
		cy.openInspector( 'stackable/divider', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-divider',
		alignmentSelector: '.stk-block-divider',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		enableInnerBlockVerticalAlignment: false,
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@dividerBlock' )
	} )
}
