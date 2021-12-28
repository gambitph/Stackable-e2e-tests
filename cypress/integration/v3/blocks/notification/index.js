
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, checkJsFiles, assertInnerBlocks, responsiveAssertHelper, Block, Advanced, assertContainerBackground, assertContainerSizeSpacing, assertContainerBordersShadow,
} from '~stackable-e2e/helpers'
import { stkBlocks } from '~stackable-e2e/config'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	innerBlocks,
	innerBlocksExist,
	loadedFiles,
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
	it( 'should show the block', assertBlockExist( 'stackable/notification', '.stk-block-notification', { variation: 'Default Layout' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/notification', { variation: 'Default Layout' } ) )
}
function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/notification', { variation: 'Default Layout' } )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/notification' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/notification', blockName ) )

		cy.savePost()
	} )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/notification', [
		'.stk-block-heading',
		'.stk-block-text',
		'.stk-block-button',
	], { variation: 'Default Layout' } ) )
}

function loadedFiles() {
	it( 'should assert the loaded files in the frontend', checkJsFiles( 'stackable/notification', '#stk-frontend-notification-js', { variation: 'Default Layout' } ) )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/notification', { variation: 'Default Layout' } ).asBlock( 'notificationBlock', { isStatic: true } )
		cy.openInspector( 'stackable/notification', 'Style' )
		cy.savePost()
	} )

	afterEach( () => cy.assertFrontendStyles( '@notificationBlock' ) )

	it( 'should assert General panel in Style tab', () => {
		desktopOnly( () => {
			cy.collapse( 'General' )
			cy.adjust( 'Content Width', 'alignwide' ).assertClassName( '.stk-block-notification > .stk-content-align', 'alignwide' )
			cy.adjust( 'Content Width', 'alignfull' ).assertClassName( '.stk-block-notification > .stk-content-align', 'alignfull' )
			const types = [ 'error', 'warning', 'info' ]
			types.forEach( type => {
				cy.adjust( 'Notification Type', type ).assertClassName( '.stk-block-notification', `stk--is-${ type }` )
			} )
		} )
	} )

	it( 'should assert Dismissible panel in Style tab', () => {
		desktopOnly( () => {
			cy.collapse( 'Dismissible' )
			cy.adjust( 'Icon Size', 35 )
			cy.adjust( 'Icon Color', '#b4d3ff' ).assertComputedStyle( {
				'.stk-block-notification__close-button svg': {
					'height': '35px',
					'width': '35px',
					'fill': '#b4d3ff',
				},
			} )
		} )
	} )

	it( 'should assert Container Background panel in Style tab', () => {
		assertContainerBackground( { viewport } )
	} )

	it( 'should assert Container Size & Spacing panel in Style tab', () => {
		assertContainerSizeSpacing( { viewport, selector: '.stk-block-notification__content' } )
	} )

	it( 'should assert Container Borders & Shadow panel in Style tab', () => {
		assertContainerBordersShadow( { viewport } )
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
		cy.addBlock( 'stackable/notification', { variation: 'Default Layout' } ).asBlock( 'notificationBlock', { isStatic: true } )
		cy.openInspector( 'stackable/notification', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-notification',
		alignmentSelector: '.stk-block-notification .stk-inner-blocks',
		enableColumnAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@notificationBlock' )
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
		cy.addBlock( 'stackable/notification', { variation: 'Default Layout' } ).asBlock( 'notificationBlock', { isStatic: true } )
		cy.openInspector( 'stackable/notification', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-notification',
		blockName: 'stackable/notification',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@notificationBlock' )
	} )
}
