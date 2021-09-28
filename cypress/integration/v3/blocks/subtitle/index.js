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
	it( 'should show the block', assertBlockExist( 'stackable/subtitle', '.stk-block-subtitle' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/subtitle' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/subtitle' ).asBlock( 'subtitleBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/subtitle', '.stk-block-subtitle__text', 'Subtitle block', 0 )
			.assertBlockContent( '.stk-block-subtitle__text', 'Subtitle block' )
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
		cy.addBlock( 'stackable/subtitle' ).asBlock( 'subtitleBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/subtitle', '.stk-block-subtitle__text', 'Subtitle', 0 )
		cy.openInspector( 'stackable/subtitle', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-subtitle',
		alignmentSelector: '.stk-block-subtitle__text',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		enableInnerBlockVerticalAlignment: false,
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@subtitleBlock' )
	} )
}
