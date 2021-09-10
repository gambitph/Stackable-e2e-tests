
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, assertInnerBlocks,
} from '~stackable-e2e/helpers'
import { stkBlocks } from '~stackable-e2e/config'

export {
	blockExist,
	blockError,
	innerBlocks,
	innerBlocksExist,
	addImage,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/card', '.stk-block-card' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/card' ) )
}
function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/card' )
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
	] ) )
}

function addImage() {
	it( 'should add an image content and test the image size tooltip', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/card' )
		cy.selectBlock( 'stackable/card' )
			.find( '.stk-img-placeholder' )
			.click( { force: true } )
		cy.selectFromMediaLibrary( 1 )
		cy.savePost()
		cy.reload()

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
