
/**
 * External dependencies
 */
import { uniqueId, lowerCase } from 'lodash'
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
				cy.adjust( 'Block Design', style ).assertClassName( '.stk-block-button', `is-style-${ lowerCase( style ) }`, assertOptions )
			} )
			const hoverEffects = [ 'darken', 'lift', 'scale', 'lift-scale', 'lift-more', 'scale-more', 'lift-scale-more' ]
			hoverEffects.forEach( effect => {
				cy.adjust( 'Hover Effect', effect ).assertClassName( '.stk-block-button > a.stk-button', `stk--hover-effect-${ effect }` )
			} )
		} )
	} )

	it( 'should assert Link panel in Style tab', () => {
		desktopOnly( () => {
			cy.collapse( 'Link' )
			cy.adjust( 'Link / URL', 'https://wpstackable.com/' ).assertHtmlAttribute( '.stk-block-button > a.stk-button', 'href', 'https://wpstackable.com/', { assertBackend: false } )
			cy.resetStyle( 'Link / URL' )
			// The dynamic content for Link / URL should exist
			cy.getBaseControl( '.stk-link-control:contains(Link / URL)' ).find( 'button[aria-label="Dynamic Fields"]' ).should( 'exist' )

			cy.adjust( 'Open in new tab', true ).assertHtmlAttribute( '.stk-block-button > a.stk-button', 'rel', /noreferrer noopener/, { assertBackend: false } )
			cy.get( '.block-editor-block-list__block.is-selected' ).assertHtmlAttribute( '.stk-block-button > a.stk-button', 'target', '_blank', { assertBackend: false } )
			cy.adjust( 'Link rel', 'ugc sponsored' ).assertHtmlAttribute( '.stk-block-button > a.stk-button', 'rel', /ugc sponsored/, { assertBackend: false } )

			cy.adjust( 'Link Title', 'Stackable site' ).assertHtmlAttribute( '.stk-block-button > a.stk-button', 'title', 'Stackable site', { assertBackend: false } )
			cy.resetStyle( 'Link Title' )
			// The dynamic content for Link Title should exist
			cy.getBaseControl( '.components-base-control:contains(Link Title)' ).find( 'button[aria-label="Dynamic Fields"]' ).should( 'exist' )
			cy.savePost()
		} )
	} )

	it( 'should assert Button Colors panel in Style tab', () => {
		desktopOnly( () => {
			// Gradient - Normal state
			cy.collapse( 'Button Colors' )
			cy.adjust( 'Color Type', 'gradient' )
			cy.adjust( 'Button Color #1', '#2c8b4c' )
			cy.adjust( 'Button Color #2', '#3891bd' )
			cy.adjust( 'Gradient Direction (degrees)', 210 ).assertComputedStyle( {
				'.stk-button': {
					'background': 'linear-gradient(210deg, #2c8b4c, #3891bd)',
				},
			} )

			// Gradient - Hover state
			cy.adjust( 'Button Color #1', '#63a4e5', { state: 'hover' } )
			cy.adjust( 'Button Color #2', '#8c2fdd', { state: 'hover' } )
			cy.adjust( 'Gradient Direction (degrees)', 93, { state: 'hover' } ).assertComputedStyle( {
				'.stk-button:after:hover': {
					'background': 'linear-gradient(93deg, #63a4e5, #8c2fdd)',
				},
			} )

			cy.adjust( 'Text Color', '#fbfbfb', { state: 'normal' } ).assertComputedStyle( {
				'.stk-button__inner-text': {
					'color': '#fbfbfb',
				},
			} )
			cy.adjust( 'Text Color', '#fef1f1', { state: 'hover' } ).assertComputedStyle( {
				'.stk-button .stk-button__inner-text:hover': {
					'color': '#fef1f1',
				},
			} )

			// Single
			cy.adjust( 'Color Type', 'single' )
			cy.adjust( 'Button Color', '#a4c01b', { state: 'hover' } ).assertComputedStyle( {
				'.stk-button:after:hover': {
					'background': '#a4c01b',
				},
			} )
			cy.adjust( 'Button Color', '#d532af', { state: 'normal' } ).assertComputedStyle( {
				'.stk-button': {
					'background': '#d532af',
				},
			} )
		} )
	} )

	it( 'should assert Button Size & Spacing panel in Style tab', () => {
		cy.collapse( 'Button Size & Spacing' )
		desktopOnly( () => {
			cy.adjust( 'Full Width', true ).assertComputedStyle( {
				'.stk-block-button': {
					'width': '100%',
				},
				'.stk-block-button .stk-button': {
					'width': '100%',
				},
			} )
			cy.adjust( 'Full Width', false )
		} )
		cy.adjust( 'Min. Button Height', 79, { viewport } ).assertComputedStyle( {
			'.stk-button': {
				'min-height': '79px',
			},
		} )
		cy.adjust( 'Vertical Padding', [ 53, 54 ], { viewport, unit: 'px' } )
		cy.adjust( 'Horizontal Padding', [ 34, 35 ], { viewport, unit: 'px' } ).assertComputedStyle( {
			'.stk-button': {
				'padding-top': '53px',
				'padding-bottom': '54px',
				'padding-right': '34px',
				'padding-left': '35px',
			},
		} )

		cy.adjust( 'Vertical Padding', [ 71, 72 ], { viewport, unit: '%' } )
		cy.adjust( 'Horizontal Padding', [ 66, 67 ], { viewport, unit: '%' } ).assertComputedStyle( {
			'.stk-button': {
				'padding-top': '71%',
				'padding-bottom': '72%',
				'padding-right': '66%',
				'padding-left': '67%',
			},
		} )
	} )

	it( 'should assert Button Borders & Shadows panel in Style tab', () => {
		cy.collapse( 'Button Borders & Shadows' )
		desktopOnly( () => {
			const styles = [ 'solid', 'dashed', 'dotted' ]
			styles.forEach( style => {
				cy.adjust( 'Borders', style ).assertComputedStyle( {
					'.stk-button:before': {
						'border-style': style,
					},
				} )
			} )

			cy.adjust( 'Border Color', '#3930ab', { state: 'normal' } ).assertComputedStyle( {
				'.stk-button:before': {
					'border-color': '#3930ab',
				},
			} )
			cy.adjust( 'Border Color', '#ff42fc', { state: 'hover' } ).assertComputedStyle( {
				'.stk-button:before:hover': {
					'border-color': '#ff42fc',
				},
			} )

			cy.adjust( 'Shadow / Outline', 7, { state: 'hover' } ).assertComputedStyle( {
				'.stk-button:before:hover': {
					'box-shadow': '7px 5px 30px rgba(72, 73, 121, 0.15)',
				},
			} )
			cy.adjust( 'Shadow / Outline', 5, { state: 'normal' } ).assertComputedStyle( {
				'.stk-button:before': {
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
				'.stk-button:before': {
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
				'.stk-button:before:hover': {
					'box-shadow': '7px 31px 71px 26px rgba(15, 146, 148, 0.4)',
				},
			} )
		} )
		cy.adjust( 'Borders', 'solid' )
		cy.adjust( 'Border Width', [ 6, 5, 4, 3 ], { viewport, state: 'normal' } ).assertComputedStyle( {
			'.stk-button:before': {
				'border-top-width': '6px',
				'border-right-width': '5px',
				'border-bottom-width': '4px',
				'border-left-width': '3px',
			},
		} )

		cy.adjust( 'Border Width', [ 1, 2, 3, 4 ], { viewport, state: 'hover' } ).assertComputedStyle( {
			'.stk-button:before:hover': {
				'border-top-width': '1px',
				'border-right-width': '2px',
				'border-bottom-width': '3px',
				'border-left-width': '4px',
			},
		} )
		cy.adjust( 'Border Radius', 37, { viewport } ).assertComputedStyle( {
			'.stk-button': {
				'border-radius': '37px',
			},
		} )
	} )

	it( 'should assert Icon panel in Style tab', () => {
		cy.collapse( 'Icon' )
		cy.adjust( 'Icon', 'info' )
		desktopOnly( () => {
			cy.get( '.block-editor-block-list__block.is-selected' ).assertHtmlAttribute( '.stk-button .stk--inner-svg svg:last-child', 'data-icon', 'info' )
			cy.adjust( 'Icon Color', '#33f1ff', { state: 'hover' } ).assertComputedStyle( {
				'.stk-button:hover .stk--inner-svg svg:last-child': {
					'fill': '#33f1ff',
				},
			} )
			cy.adjust( 'Icon Color', '#c1c46c', { state: 'normal' } ).assertComputedStyle( {
				'.stk-button .stk--inner-svg svg:last-child': {
					'fill': '#c1c46c',
				},
			} )
			cy.adjust( 'Icon Opacity', 0.7, { state: 'hover' } )
			cy.adjust( 'Icon Rotation', 57, { state: 'hover' } ).assertComputedStyle( {
				'.stk-button:hover .stk--inner-svg svg:last-child': {
					'opacity': '0.7',
					'transform': 'rotate(57deg)',
				},
			} )
			cy.adjust( 'Icon Opacity', 0.9, { state: 'normal' } )
			cy.adjust( 'Icon Rotation', 76, { state: 'normal' } ).assertComputedStyle( {
				'.stk-button .stk--inner-svg svg:last-child': {
					'opacity': '0.9',
					'transform': 'rotate(76deg)',
				},
			} )

			cy.adjust( 'Icon Position', 'right' ).assertClassName( '.stk-button > span:last-child', 'stk--svg-wrapper' )
			cy.adjust( 'Icon Gap', 23 ).assertComputedStyle( {
				'.stk-button .stk--inner-svg svg:last-child': {
					'margin-inline-start': '23px',
				},
			} )
		} )

		cy.adjust( 'Icon Size', 59, { viewport } ).assertComputedStyle( {
			'.stk-button .stk--inner-svg svg:last-child': {
				'height': '59px',
				'width': '59px',
			},
		} )
	} )

	it( 'should assert Typography panel in Style tab', () => {
		assertTypographyModule( {
			selector: '.stk-button__inner-text',
			viewport,
			enableTextColor: false,
			enableShadowOutline: false,
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
