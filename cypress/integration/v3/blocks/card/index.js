
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, assertInnerBlocks, responsiveAssertHelper, Block,
} from '~stackable-e2e/helpers'
import { stkBlocks } from '~stackable-e2e/config'

const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	innerBlocks,
	innerBlocksExist,
	addImage,
	desktopBlock,
	tabletBlock,
	mobileBlock,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/card', '.stk-block-card', { variation: 'Default Layout' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/card', { variation: 'Default Layout' } ) )
}
function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/card', { variation: 'Default Layout' } )
		cy.selectBlock( 'stackable/card' )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/card' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/card', blockName ) )

		cy.savePost()
	} )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/card', [
		'.stk-block-heading',
		'.stk-block-subtitle',
		'.stk-block-text',
		'.stk-block-button',
	], { variation: 'Default Layout' } ) )
}

function addImage() {
	it( 'should add an image content and test the image size tooltip', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/card', { variation: 'Default Layout' } ).asBlock( 'cardBlock', { isStatic: true } )
		cy.selectBlock( 'stackable/card' )
		cy.openInspector( 'stackable/card', 'Style' )
		cy.collapse( 'Image' )
		cy.adjust( 'Select Image', 1 )

		// Adjust the Image Size tooltip
		cy.get( '.stk-block-card__image' ).realHover()
		cy.get( '.stk-resizer-tooltip' )
			.click( { force: true } )
			.then( () => {
				cy.get( '.components-popover__content:contains(Image Height)' )
				cy.adjust( 'Image Height', 412, {
					parentSelector: '.stk-resizer-popup__control-wrapper',
				} )
				cy.selectBlock( 'stackable/card' )
					.assertComputedStyle( {
						'img.stk-img': {
							'height': '412px',
						},
					} )
			} )
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
		cy.addBlock( 'stackable/card', { variation: 'Default Layout' } ).asBlock( 'cardBlock', { isStatic: true } )
		cy.openInspector( 'stackable/card', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-card',
		alignmentSelector: '.stk-block-card .stk-inner-blocks',
		enableColumnAlignment: false,
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@cardBlock' )
	} )
}
