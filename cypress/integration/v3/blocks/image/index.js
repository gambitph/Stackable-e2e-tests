
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
	addImage,
	desktopBlock,
	tabletBlock,
	mobileBlock,
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
		cy.addBlock( 'stackable/image' )
		cy.selectBlock( 'stackable/image' ).asBlock( 'imageBlock', { isStatic: true } )
		cy.selectBlock( 'stackable/image' )
		cy.openInspector( 'stackable/image', 'Style' )
		cy.collapse( 'Image' )
		cy.adjust( 'Select Image', 1 )

		// Adjust the Image Size tooltip
		cy.get( '.stk-img-wrapper' ).realHover()
		cy.get( '.stk-resizer-tooltip' )
			.click( { force: true } )
			.then( () => {
				cy.adjust( 'Width', 78, {
					unit: '%',
					parentSelector: '.stk-resizer-popup__control-wrapper',
				} ).assertHtmlAttribute( 'img.stk-img', 'width', '78', { assertFrontend: false } )

				cy.adjust( 'Height', 390, {
					unit: 'px',
					parentSelector: '.stk-resizer-popup__control-wrapper',
				} ).assertHtmlAttribute( 'img.stk-img', 'height', '390', { assertFrontend: false } )

				cy.selectBlock( 'stackable/image' ).assertComputedStyle( {
					'.stk-img-wrapper': {
						'width': '78%',
						'height': '390px',
					},
				}, { assertBackend: false } )
			} )

		cy.savePost()
		cy.reload()

		// Test the other units.
		cy.get( '.stk-img-wrapper' ).realHover()
		cy.get( '.stk-resizer-tooltip' )
			.click( { force: true } )
			.then( () => {
				cy.adjust( 'Width', 548, {
					unit: 'px',
					parentSelector: '.stk-resizer-popup__control-wrapper',
				} ).assertHtmlAttribute( 'img.stk-img', 'width', '548', { assertFrontend: false } )

				cy.adjust( 'Height', 51, {
					unit: 'vh',
					parentSelector: '.stk-resizer-popup__control-wrapper',
				} ).assertHtmlAttribute( 'img.stk-img', 'height', '51', { assertFrontend: false } )

				cy.selectBlock( 'stackable/image' ).assertComputedStyle( {
					'.stk-img-wrapper': {
						'width': '548px',
						'height': '51vh',
					},
				}, { assertBackend: false } )
			} )

		cy.savePost()
		cy.reload()

		cy.get( '.stk-img-wrapper' ).realHover()
		cy.get( '.stk-resizer-tooltip' )
			.click( { force: true } )
			.then( () => {
				cy.get( '.components-popover__content:contains(Image Size)' )
				cy.adjust( 'Height', 65, {
					unit: '%',
					parentSelector: '.stk-resizer-popup__control-wrapper',
				} ).assertHtmlAttribute( 'img.stk-img', 'height', '65', { assertFrontend: false } )

				cy.selectBlock( 'stackable/image' ).assertComputedStyle( {
					'.stk-img-wrapper': {
						'height': '65%',
					},
				}, { assertBackend: false } )
			} )
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
		cy.addBlock( 'stackable/image' )
		cy.selectBlock( 'stackable/image' ).asBlock( 'imageBlock', { isStatic: true } )
		cy.openInspector( 'stackable/image', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-image',
		alignmentSelector: '.stk-block-image',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@imageBlock' )
	} )
}
