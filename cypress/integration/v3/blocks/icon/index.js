
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, responsiveAssertHelper, Block, Advanced,
} from '~stackable-e2e/helpers'

const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	selectIcon,
	desktopBlock,
	tabletBlock,
	mobileBlock,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/icon', '.stk-block-icon' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/icon' ) )
}

function selectIcon() {
	it( 'should assert selected icon', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/icon' ).asBlock( 'iconBlock', { isStatic: true } )
		cy.selectBlock( 'stackable/icon' )
		cy.changeIcon( 1, 'facebook', 'ugb-icon--facebook' )
		cy.selectBlock( 'stackable/icon' ).assertHtmlAttribute( '.stk--inner-svg .svg-inline--fa', 'data-icon', 'facebook' )
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
		cy.addBlock( 'stackable/icon' ).asBlock( 'iconBlock', { isStatic: true } )
		cy.openInspector( 'stackable/icon', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-icon',
		alignmentSelector: '.stk-block-icon',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@iconBlock' )
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
		cy.addBlock( 'stackable/icon' ).asBlock( 'iconBlock', { isStatic: true } )
		cy.openInspector( 'stackable/icon', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-icon',
		blockName: 'stackable/icon',
	} )

	it( 'should assert Accessibility inside the Advanced Tab', () => {
		if ( viewport === 'Desktop' ) {
			cy.collapse( 'Accessibility' )
			cy.adjust( 'Icon Label', 'my Icon block' ).assertHtmlAttribute( '.stk-block-icon .stk--inner-svg > .svg-inline--fa', 'aria-label', 'my Icon block' )
		}
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@iconBlock' )
	} )
}
