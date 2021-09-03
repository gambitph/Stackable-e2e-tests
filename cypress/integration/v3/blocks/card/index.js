
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest,
} from '~stackable-e2e/helpers'
import { stkBlocks } from '~stackable-e2e/config'

export {
	blockExist,
	blockError,
	innerBlocks,
	typeContent,
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

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/card' ).asBlock( 'cardBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/card', '.stk-block-heading__text', 'Test Card block', 0 )
			.assertBlockContent( '.stk-block-heading__text', 'Test Card block' )
		cy.typeBlock( 'stackable/card', '.stk-block-text__text', 'Lorem ipsum dolor sit amet.', 0 )
			.assertBlockContent( '.stk-block-text__text', 'Lorem ipsum dolor sit amet.' )
		cy.typeBlock( 'stackable/card', '.stk-button__inner-text', 'Click here', 0 )
			.assertBlockContent( '.stk-button__inner-text', 'Click here' )
	} )
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
		cy.selectBlock( 'stackable/card' )
			.find( '.stk-img-resizer-tooltip' )
			.click( { force: true } )
			.then( () => {
				cy.get( '.components-popover__content:contains(Image Height)' )
				cy.adjust( 'Image Height', 412, {
					parentSelector: '.stk-image-size-popup__control-wrapper',
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
