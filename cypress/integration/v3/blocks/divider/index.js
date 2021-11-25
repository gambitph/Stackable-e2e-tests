/**
 * External dependencies
 */
import { lowerCase } from 'lodash'
import {
	assertBlockExist, blockErrorTest, responsiveAssertHelper, Block, Advanced,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
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
	it( 'should show the block', assertBlockExist( 'stackable/divider', '.stk-block-divider' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/divider' ) )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/divider' ).asBlock( 'dividerBlock', { isStatic: true } )
		cy.openInspector( 'stackable/divider', 'Style' )
		cy.savePost()
	} )

	afterEach( () => cy.assertFrontendStyles( '@dividerBlock' ) )

	it( 'should assert Styles panel in Style tab', () => {
		desktopOnly( () => {
			cy.collapse( 'Styles' )
			const designs = [ 'Bar', 'Dots', 'Asterisks' ]
			designs.forEach( design => {
				cy.adjust( 'Block Design', design ).assertClassName( '.stk-block-divider', `is-style-${ lowerCase( design ) }` )
			} )
		} )
	} )

	it( 'should assert General panel in Style tab', () => {
		cy.collapse( 'General' )
		desktopOnly( () => {
			cy.adjust( 'Color', '#7a7a7a' ).assertComputedStyle( {
				'hr.stk-block-divider__hr': {
					'background': '#7a7a7a',
				},
			} )
		} )
		cy.adjust( 'Height / Size', 27, { viewport } )
		cy.adjust( 'Width (%)', 65, { viewport } ).assertComputedStyle( {
			'hr.stk-block-divider__hr': {
				'height': '27px',
				'width': '65%',
			},
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
		cy.addBlock( 'stackable/divider' ).asBlock( 'dividerBlock', { isStatic: true } )
		cy.openInspector( 'stackable/divider', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-divider',
		alignmentSelector: '.stk-block-divider',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@dividerBlock' )
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
		cy.addBlock( 'stackable/divider' ).asBlock( 'dividerBlock', { isStatic: true } )
		cy.openInspector( 'stackable/divider', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-divider',
		blockName: 'stackable/divider',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@dividerBlock' )
	} )
}
