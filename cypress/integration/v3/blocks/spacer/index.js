/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, responsiveAssertHelper, Block, Advanced,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	resizeHeight,
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

function styleTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/spacer' ).asBlock( 'spacerBlock', { isStatic: true } )
		cy.openInspector( 'stackable/spacer', 'Style' )
		cy.savePost()
	} )

	afterEach( () => cy.assertFrontendStyles( '@spacerBlock' ) )

	it( 'should assert General panel in Style tab', () => {
		cy.collapse( 'General' )
		cy.adjust( 'Height', 678, { viewport } ).assertComputedStyle( {
			'.stk-block-spacer': {
				'height': '678px',
			},
		} )
	} )
}

const assertBlockTab = Block
	.includes( [
		'Background',
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
		cy.addBlock( 'stackable/spacer' ).asBlock( 'spacerBlock', { isStatic: true } )
		cy.openInspector( 'stackable/spacer', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-spacer',
		blockName: 'stackable/spacer',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@spacerBlock' )
	} )
}
