
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
	typeContent,
	desktopBlock,
	tabletBlock,
	mobileBlock,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/number-box', '.stk-block-number-box' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/number-box' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/number-box' ).asBlock( 'numberBoxBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/number-box', '.stk-block-number-box__text', '21', 0 )
			.assertBlockContent( '.stk-block-number-box__text', '21' )
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
		cy.addBlock( 'stackable/number-box' ).asBlock( 'numberBoxBlock', { isStatic: true } )
		cy.openInspector( 'stackable/number-box', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-number-box',
		alignmentSelector: '.stk-block-number-box',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		enableInnerBlockVerticalAlignment: false,
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@numberBoxBlock' )
	} )
}
