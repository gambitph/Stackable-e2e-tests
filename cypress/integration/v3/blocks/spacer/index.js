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
	resizeHeight,
	desktopBlock,
	tabletBlock,
	mobileBlock,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/spacer', '.stk-block-spacer' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/spacer' ) )
}

function resizeHeight() {
	it( 'should resize the height using the tooltip', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/spacer' ).asBlock( 'spacerBlock', { isStatic: true } )

		// Adjust the Height tooltip
		cy.get( '.stk-block-spacer' ).realHover()
		cy.get( '.stk-resizer-tooltip' )
			.click( { force: true } )
			.then( () => {
				cy.get( '.components-popover__content:contains(Spacer Height)' )
				cy.adjust( 'Spacer Height', 121, {
					parentSelector: '.stk-resizer-popup__control-wrapper',
				} )
				cy.selectBlock( 'stackable/spacer' )
					.assertComputedStyle( {
						'.stk-block-spacer': {
							'height': '121px',
						},
					} )
			} )
	} )
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
		cy.addBlock( 'stackable/spacer' ).asBlock( 'spacerBlock', { isStatic: true } )
		cy.openInspector( 'stackable/spacer', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-spacer',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@spacerBlock' )
	} )
}
