
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, responsiveAssertHelper, assertBlockTab,
} from '~stackable-e2e/helpers'

const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block' } )

export {
	blockExist,
	blockError,
	typeContent,
	desktopBlock,
	tabletBlock,
	mobileBlock,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/heading', '.stk-block-heading' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/heading' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/heading' ).asBlock( 'headingBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'V3 Heading' )
			.assertBlockContent( '.stk-block-heading__text', 'V3 Heading' )
	} )
}

function blockTab( viewport ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'stackable/heading' ).asBlock( 'headingBlock', { isStatic: true } )

	cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Title here' )
	cy.openInspector( 'stackable/heading', 'Block' )

	assertBlockTab( '.stk-block-heading', {
		viewport,
		alignmentSelector: '.stk-block-heading__text',
	} )
	// stk-card__content
	cy.assertFrontendStyles( '@headingBlock' )
}
