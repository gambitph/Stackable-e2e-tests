
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, responsiveAssertHelper, Block, Advanced, assertImageModule, assertLinks,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	addImage,
	desktopStyle,
	tabletStyle,
	mobileStyle,
	desktopBlock,
	tabletBlock,
	mobileBlock,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
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

function styleTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/image' ).asBlock( 'imageBlock', { isStatic: true } )
		cy.openInspector( 'stackable/image', 'Style' )
		cy.savePost()
	} )

	afterEach( () => cy.assertFrontendStyles( '@imageBlock' ) )

	it( 'should assert Image panel in Style tab', () => {
		assertImageModule( {
			selector: '.stk-block-image .stk-img-wrapper',
			viewport,
			enableWidth: true,
			enableShadowOutline: true,
			enableBorderRadius: true,
			enableImageShape: true,
			shadowEditorSelector: '.stk-block-image .stk-img-wrapper .stk-img-resizer-wrapper',
			shadowFrontendSelector: '.stk-block-image .stk-img-wrapper',
		} )
	} )

	it( 'should assert Link panel in Style tab', () => {
		cy.collapse( 'Image' )
		cy.adjust( 'Select Image', 1 )
		assertLinks( { selector: '.stk-block-image > a.stk-link', viewport } )
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
		cy.addBlock( 'stackable/image' ).asBlock( 'imageBlock', { isStatic: true } )
		cy.openInspector( 'stackable/image', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-image',
		alignmentSelector: '.stk-block-image',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@imageBlock' )
	} )
}

const assertAdvancedTab = Advanced
	.includes( [
		'General',
		'Position',
		'Transform & Transition',
		'Motion Effects',
		'Custom Attributes',
		'Custom CSS',
		'Responsive',
		'Conditional Display',
		'Advanced',
	] )
	.run

function advancedTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/image' ).asBlock( 'imageBlock', { isStatic: true } )
		cy.openInspector( 'stackable/image', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-image',
		blockName: 'stackable/image',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@imageBlock' )
	} )
}
