/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, assertInnerBlocks, responsiveAssertHelper, Block,
} from '~stackable-e2e/helpers'

const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	innerBlocksExist,
	desktopBlock,
	tabletBlock,
	mobileBlock,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/team-member', '.stk-block-team-member', { variation: 'Default Layout' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/team-member', { variation: 'Default Layout' } ) )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/team-member', [
		'.stk-block-image',
		'.stk-block-heading',
		'.stk-block-subtitle',
		'.stk-block-text',
		'.stk-block-button-group',
	], { variation: 'Default Layout' } ) )
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
		cy.addBlock( 'stackable/team-member', { variation: 'Default Layout' } )
		cy.selectBlock( 'stackable/team-member' ).asBlock( 'teamMemberBlock', { isStatic: true } )
		cy.openInspector( 'stackable/team-member', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-team-member',
		alignmentSelector: '.stk-block-team-member > .stk-inner-blocks',
		enableColumnAlignment: false,
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@teamMemberBlock' )
	} )
}
