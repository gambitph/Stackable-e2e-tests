
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, responsiveAssertHelper, Block, Advanced, assertTypographyModule,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	typeContent,
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
	it( 'should show the block', assertBlockExist( 'stackable/number-box', '.stk-block-number-box' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/number-box' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/number-box' ).asBlock( 'numberBoxBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/number-box', '.stk-block-number-box__text', '21', 0 )
			.assertBlockContent( '.stk-block-number-box__text', '21' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/number-box' ).asBlock( 'numberBoxBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/number-box', '.stk-block-number-box__text', '21', 0 )
		cy.openInspector( 'stackable/number-box', 'Style' )
		cy.savePost()
	} )

	afterEach( () => cy.assertFrontendStyles( '@numberBoxBlock' ) )

	it( 'should assert Shape panel in Style tab', () => {
		cy.collapse( 'Shape' )
		cy.adjust( 'Size', 136, { viewport } ).assertComputedStyle( {
			'.stk-block-number-box__text': {
				'height': '136px',
				'width': '136px',
			},
		} )

		desktopOnly( () => {
			cy.adjust( 'Background Color', '#2299c8', { state: 'hover' } )
			cy.adjust( 'Background Color Opacity', 0.8, { state: 'hover' } ).assertComputedStyle( {
				'.stk-block-number-box__text:hover': {
					'background-color': 'rgba(34, 153, 200, 0.8)',
				},
			} )
			cy.adjust( 'Background Color', '#d04545', { state: 'normal' } )
			cy.adjust( 'Background Color Opacity', 0.6, { state: 'normal' } ).assertComputedStyle( {
				'.stk-block-number-box__text': {
					'background-color': 'rgba(208, 69, 69, 0.6)',
				},
			} )
		} )

		cy.adjust( 'Borders', 'dashed' )
		cy.adjust( 'Border Width', [ 5, 6, 7, 8 ], { viewport, state: 'hover' } ).assertComputedStyle( {
			'.stk-block-number-box__text:hover': {
				'border-top-width': '5px',
				'border-right-width': '6px',
				'border-bottom-width': '7px',
				'border-left-width': '8px',
			},
		} )
		cy.adjust( 'Border Width', [ 1, 2, 3, 4 ], { viewport, state: 'normal' } ).assertComputedStyle( {
			'.stk-block-number-box__text': {
				'border-style': 'dashed',
				'border-top-width': '1px',
				'border-right-width': '2px',
				'border-bottom-width': '3px',
				'border-left-width': '4px',
			},
		} )

		desktopOnly( () => {
			cy.adjust( 'Border Color', '#6a1598', { state: 'hover' } ).assertComputedStyle( {
				'.stk-block-number-box__text:hover': {
					'border-color': '#6a1598',
				},
			} )
			cy.adjust( 'Border Color', '#40dc6f', { state: 'normal' } ).assertComputedStyle( {
				'.stk-block-number-box__text': {
					'border-color': '#40dc6f',
				},
			} )

			cy.adjust( 'Shadow / Outline', 7, { state: 'hover' } ).assertComputedStyle( {
				'.stk-block-number-box__text:hover': {
					'box-shadow': '7px 5px 30px rgba(72, 73, 121, 0.15)',
				},
			} )
			cy.adjust( 'Shadow / Outline', 5, { state: 'normal' } ).assertComputedStyle( {
				'.stk-block-number-box__text': {
					'box-shadow': '0 5px 30px -10px rgba(18, 63, 82, 0.3)',
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
			cy.adjust( 'Shadow Spread', 5, { parentSelector, state: 'normal' } )
			cy.adjust( 'Shadow Color', '#2a8a62', { parentSelector, state: 'normal' } )
			cy.adjust( 'Shadow Opacity', 0.6, { parentSelector, state: 'normal' } ).assertComputedStyle( {
				'.stk-block-number-box__text': {
					'box-shadow': '8px 11px 25px 5px rgba(42, 138, 98, 0.6)',
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
			cy.adjust( 'Shadow Spread', 26, { parentSelector } )
			selectAdvancedShadowHoverState()
			cy.adjust( 'Shadow Color', '#0f9294', { parentSelector } )
			selectAdvancedShadowHoverState()
			cy.adjust( 'Shadow Opacity', 0.4, { parentSelector } ).assertComputedStyle( {
				'.stk-block-number-box__text:hover': {
					'box-shadow': '7px 31px 71px 26px rgba(15, 146, 148, 0.4)',
				},
			} )
		} )

		cy.adjust( 'Border Radius', 48, { viewport } ).assertComputedStyle( {
			'.stk-block-number-box__text': {
				'border-radius': '48px',
			},
		} )
	} )

	it( 'should assert Typography panel in Style tab', () => {
		// Turn off Shape container
		cy.toggleStyle( 'Shape' )
		cy.collapse( 'Typography' )
		assertTypographyModule( {
			selector: '.stk-block-number-box__text',
			viewport,
			enableShadowOutline: false,
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
		cy.addBlock( 'stackable/number-box' ).asBlock( 'numberBoxBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/number-box', '.stk-block-number-box__text', '21', 0 )
		cy.openInspector( 'stackable/number-box', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-number-box',
		alignmentSelector: '.stk-block-number-box',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@numberBoxBlock' )
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
		cy.addBlock( 'stackable/number-box' ).asBlock( 'numberBoxBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/number-box', '.stk-block-number-box__text', '21', 0 )
		cy.openInspector( 'stackable/number-box', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-number-box',
		blockName: 'stackable/number-box',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@numberBoxBlock' )
	} )
}
