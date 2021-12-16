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
	it( 'should show the block', assertBlockExist( 'stackable/separator', '.stk-block-separator' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/separator' ) )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/separator' ).asBlock( 'separatorBlock', { isStatic: true } )
		cy.openInspector( 'stackable/separator', 'Style' )
		cy.savePost()
	} )

	afterEach( () => cy.assertFrontendStyles( '@separatorBlock' ) )

	it( 'should assert General panel in Style tab', () => {
		cy.collapse( 'General' )
		cy.adjust( 'Height', 327, { viewport } ).assertComputedStyle( {
			'.stk-block-separator__inner': {
				'height': '327px',
			},
		} )
		desktopOnly( () => {
			cy.adjust( 'Flip Horizontally', true )
			cy.adjust( 'Flip Vertically', true ).assertComputedStyle( {
				'.stk-block-separator': {
					'transform': 'scaleX(-1) scaleY(-1)',
				},
			} )
		} )
	} )

	it( 'should assert Separator panel in Style tab', () => {
		cy.collapse( 'Separator' )
		desktopOnly( () => {
			cy.adjust( 'Design', 'wave-3' ).assertClassName( '.stk-block-separator .stk-separator__layer-1 > path', 'wave-3_svg__st2' )
			cy.adjust( 'Color', '#59a583' ).assertComputedStyle( {
				'.stk-block-separator svg': {
					'fill': '#59a583',
				},
			} )
			cy.adjust( 'Width', 1.8 ).assertComputedStyle( {
				'.stk-block-separator__inner': {
					'transform': 'scaleX(1.8)',
				},
			} )

			cy.adjust( 'Shadow / Outline', 7, { state: 'hover' } ).assertComputedStyle( {
				'.stk-block-separator svg:hover': {
					'filter': 'drop-shadow(0px 10px 30px rgba(0, 0, 0, 0.05))',
				},
			} )
			cy.adjust( 'Shadow / Outline', 5, { state: 'normal' } ).assertComputedStyle( {
				'.stk-block-separator svg': {
					'filter': 'drop-shadow(0px 2px 20px rgba(153, 153, 153, 0.2))',
				},
			} )
			cy.resetStyle( 'Shadow / Outline', { state: 'normal' } )
			cy.resetStyle( 'Shadow / Outline', { state: 'hover' } )

			// Adjust Adv. Shadow Options - normal
			const parentSelector = '.components-popover__content .stk-control-content'
			// Press the cog symbol to open Shadow settings
			cy.get( 'button[aria-label="Shadow Settings"]' ).click( { force: true } )
			cy.adjust( 'Horizontal Offset', 8, { parentSelector, state: 'normal' } )
			cy.adjust( 'Vertical Offset', 11, { parentSelector, state: 'normal' } )
			cy.adjust( 'Blur', 25, { parentSelector, state: 'normal' } )
			cy.adjust( 'Shadow Color', '#2a8a62', { parentSelector, state: 'normal' } )
			cy.adjust( 'Shadow Opacity', 0.6, { parentSelector, state: 'normal' } ).assertComputedStyle( {
				'.stk-block-separator svg': {
					'text-shadow': '8px 11px 25px rgba(42, 138, 98, 0.6)',
				},
			} )

			const selectAdvancedShadowHoverState = () => cy
				.adjust( 'Advanced Shadow Options', null, { state: 'hover', parentSelector: '.components-popover__content .components-panel__body' } )

			cy.resetStyle( 'Shadow / Outline', { state: 'normal' } )
			cy.resetStyle( 'Shadow / Outline', { state: 'hover' } )
			// Adjust Adv. Shadow Options - hover
			selectAdvancedShadowHoverState()
			cy.adjust( 'Horizontal Offset', 7, { parentSelector } )
			selectAdvancedShadowHoverState()
			cy.adjust( 'Vertical Offset', 31, { parentSelector } )
			selectAdvancedShadowHoverState()
			cy.adjust( 'Blur', 71, { parentSelector } )
			selectAdvancedShadowHoverState()
			cy.adjust( 'Shadow Color', '#0f9294', { parentSelector } )
			selectAdvancedShadowHoverState()
			cy.adjust( 'Shadow Opacity', 0.4, { parentSelector } ).assertComputedStyle( {
				'.stk-block-separator svg:hover': {
					'text-shadow': '7px 31px 71px rgba(15, 146, 148, 0.4)',
				},
			} )
		} )

		cy.adjust( 'Height', 281, { viewport } )
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
		cy.addBlock( 'stackable/separator' ).asBlock( 'separatorBlock', { isStatic: true } )
		cy.openInspector( 'stackable/separator', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-separator',
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@separatorBlock' )
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
		cy.addBlock( 'stackable/separator' ).asBlock( 'separatorBlock', { isStatic: true } )
		cy.openInspector( 'stackable/separator', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-separator',
		blockName: 'stackable/separator',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@separatorBlock' )
	} )
}
