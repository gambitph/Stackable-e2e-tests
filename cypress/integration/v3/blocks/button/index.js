
/**
 * External dependencies
 */
import { uniqueId, lowerCase } from 'lodash'
import {
	assertBlockExist, blockErrorTest, responsiveAssertHelper, Block, Advanced,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	typeContent,
	pressEnterKey,
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
	it( 'should show the block', assertBlockExist( 'stackable/button-group', '.stk-block-button' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/button-group' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/button-group' )
		cy.selectBlock( 'stackable/button-group' ).addNewColumn( { blockToAdd: 'Button' } )

		// Add a unique e2e className for the 2nd button added
		// TODO: Find a better way to add this directly when calling `.addNewColumn`
		cy.selectBlock( 'stackable/button', 1 ).then( $block => {
			const clientId = $block.data( 'block' )
			cy.wp().then( wp => {
				const className = wp.data.select( 'core/block-editor' ).getBlock( clientId ).attributes.className
				wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, { className: `${ className ? className + ' ' : '' }e2etest-block-${ uniqueId() }` } )
			} )
		} )

		cy.selectBlock( 'stackable/button', 0 ).asBlock( 'buttonBlock1', { isStatic: true } )
		cy.selectBlock( 'stackable/button', 1 ).asBlock( 'buttonBlock2', { isStatic: true } )

		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Button 1', 0 )
			.assertBlockContent( '.stk-button__inner-text', 'Button 1' )
		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Click here', 1 )
			.assertBlockContent( '.stk-button__inner-text', 'Click here' )
	} )
}

function pressEnterKey() {
	it( 'should test pressing the enter key in button block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/button-group' )

		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Click me', 0 )
		cy.get( '.stk-button__inner-text' ).type( '{enter}', { force: true } )

		cy.selectBlock( 'stackable/button-group' )
			.find( '.stk-block-button' )
			.its( 'length' )
			.should( 'eq', 2 )

		cy.savePost()
		// Reloading should not cause a block error
		cy.reload()
	} )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/button-group' )
		cy.selectBlock( 'stackable/button', 0 ).asBlock( 'buttonBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Button 1', 0 )
		cy.openInspector( 'stackable/button', 'Style' )
	} )

	afterEach( () => cy.assertFrontendStyles( '@buttonBlock' ) )

	it( 'should assert Styles panel in Style tab', () => {
		desktopOnly( () => {
			const styles = [ 'Ghost', 'Plain', 'Link', 'Default' ]
			styles.forEach( style => {
				const assertOptions = style === 'Default' ? { assertFrontend: false } : {}
				cy.adjust( '.block-editor-block-styles', style ).assertClassName( '.stk-block-button', `is-style-${ lowerCase( style ) }`, assertOptions )
			} )
			const hoverEffects = [ 'darken', 'lift', 'scale', 'lift-scale', 'lift-more', 'scale-more', 'lift-scale-more' ]
			hoverEffects.forEach( effect => {
				cy.adjust( 'Hover Effect', effect ).assertClassName( '.stk-block-button > a.stk-button', `stk--hover-effect-${ effect }` )
			} )
		} )
	} )

	it( 'should assert Link panel in Style tab', () => {
		desktopOnly( () => {
			cy.adjust( 'Link / URL', 'https://wpstackable.com/' ).assertHtmlAttribute( '.stk-block-button > a.stk-button', 'href', 'https://wpstackable.com/', { assertBackend: false } )
			cy.resetStyle( 'Link / URL' )
			// The dynamic content for Link / URL should exist
			cy.getBaseControl( 'Link / URL' ).find( 'button[aria-label="Dynamic Fields"]' ).should( 'exist' )
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
		cy.addBlock( 'stackable/button-group' )
		cy.selectBlock( 'stackable/button', 0 ).asBlock( 'buttonBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Button 1', 0 )
		cy.openInspector( 'stackable/button', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-button',
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@buttonBlock' )
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
		cy.addBlock( 'stackable/button-group' )
		cy.selectBlock( 'stackable/button', 0 ).asBlock( 'buttonBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Button 1', 0 )
		cy.openInspector( 'stackable/button', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-button',
		blockName: 'stackable/button',
		customSelector: '.stk-block-button > a.stk-button',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@buttonBlock' )
	} )
}
