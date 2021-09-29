
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
				cy.get( '.components-popover__content:contains(Image Size)' )
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
		enableInnerBlockVerticalAlignment: false,
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@imageBlock' )
	} )
}
