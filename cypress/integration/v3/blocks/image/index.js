
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest,
} from '~stackable-e2e/helpers'

export {
	blockExist,
	blockError,
	addImage,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/image', '.stk-block-image' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/image' ) )
}

function addImage() {
	it( 'should add an image content and test the image size tooltip', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/image' ).asBlock( 'imageBlock', { isStatic: true } )
		cy.selectBlock( 'stackable/image' )
			.find( '.stk-img-placeholder' )
			.click( { force: true } )
		cy.selectFromMediaLibrary( 1 )
		cy.savePost()
		cy.reload()

		// Adjust the Image Size tooltip
		cy.get( '.stk-img-wrapper' ).realHover()
		cy.get( '.stk-resizer-tooltip' )
			.click( { force: true } )
			.then( () => {
				cy.get( '.components-popover__content:contains(Image Size)' )
				cy.adjust( 'Width', 78, {
					unit: '%',
					parentSelector: '.stk-resizer-popup__control-wrapper',
				} )
				cy.adjust( 'Height', 390, {
					unit: 'px',
					parentSelector: '.stk-resizer-popup__control-wrapper',
				} )
				cy.selectBlock( 'stackable/image' )
					.assertComputedStyle( {
						'img.stk-img': {
							'height': '390px',
							'width': '78%',
						},
					} )
			} )

		// Test the other units.
		cy.get( '.stk-img-wrapper' ).realHover()
		cy.get( '.stk-resizer-tooltip' )
			.click( { force: true } )
			.then( () => {
				cy.get( '.components-popover__content:contains(Image Size)' )
				cy.adjust( 'Width', 548, {
					unit: 'px',
					parentSelector: '.stk-resizer-popup__control-wrapper',
				} )
				cy.adjust( 'Height', 51, {
					unit: 'vh',
					parentSelector: '.stk-resizer-popup__control-wrapper',
				} )
				cy.selectBlock( 'stackable/image' )
					.assertComputedStyle( {
						'img.stk-img': {
							'height': '51vh',
							'width': '548px',
						},
					} )
			} )
	} )
}
