/**
 * External dependencies
 */
import { uniqueId, lowerCase } from 'lodash'
import {
	responsiveAssertHelper, Block, Advanced, assertLinks,
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
	it( 'should show the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'core/paragraph' )
		cy.typeBlock( 'core/paragraph', '', '/icon-button', 0 )
		cy.get( '.components-popover__content' )
			.contains( 'Icon Button' )
			.click( { force: true } )
		cy.get( '.stk-block-icon-button' ).should( 'exist' )
		cy.savePost()
	} )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'core/paragraph' )
		cy.typeBlock( 'core/paragraph', '', '/icon-button', 0 )
		cy.get( '.components-popover__content' )
			.contains( 'Icon Button' )
			.click( { force: true } )
		cy.savePost()
		cy.reload()
	} )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'core/paragraph' )
		cy.typeBlock( 'core/paragraph', '', '/icon-button', 0 )
		cy.get( '.components-popover__content' )
			.contains( 'Icon Button' )
			.click( { force: true } )
		cy.selectBlock( 'stackable/icon-button' ).then( $block => {
			const clientId = $block.data( 'block' )
			cy.wp().then( wp => {
				const className = wp.data.select( 'core/block-editor' ).getBlock( clientId ).attributes.className
				wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, { className: `${ className ? className + ' ' : '' }e2etest-block-${ uniqueId() }` } )
			} )
		} )
		cy.selectBlock( 'stackable/icon-button' ).asBlock( 'iconButtonBlock', { isStatic: true } )

		cy.openInspector( 'stackable/icon-button', 'Style' )
		cy.savePost()
	} )

	afterEach( () => cy.assertFrontendStyles( '@iconButtonBlock' ) )

	it( 'should assert Styles panel in Style tab', () => {
		desktopOnly( () => {
			const styles = [ 'Ghost', 'Pill', 'Plain' ]
			styles.forEach( style => {
				cy.adjust( 'Block Design', style ).assertClassName( '.stk-block-icon-button', `is-style-${ lowerCase( style ) }` )
			} )
			const hoverEffects = [ 'darken', 'lift', 'scale', 'lift-scale', 'lift-more', 'scale-more', 'lift-scale-more' ]
			hoverEffects.forEach( effect => {
				cy.adjust( 'Hover Effect', effect ).assertClassName( '.stk-block-icon-button > a.stk-button', `stk--hover-effect-${ effect }` )
			} )
		} )
	} )

	it( 'should assert Link panel in Style tab', () => {
		assertLinks( { selector: '.stk-block-icon-button > a.stk-button', viewport } )
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
				'.stk-button:hover': {
					'background': 'linear-gradient(93deg, #63a4e5, #8c2fdd)',
				},
			} )

			// Single
			cy.adjust( 'Color Type', 'single' )
			cy.adjust( 'Button Color', '#a4c01b', { state: 'hover' } ).assertComputedStyle( {
				'.stk-button:hover': {
					'background': '#a4c01b',
				},
			} )
			cy.adjust( 'Button Color', '#d532af', { state: 'normal' } ).assertComputedStyle( {
				'.stk-button': {
					'background': '#d532af',
				},
			} )

			// Icon Color
			cy.adjust( 'Icon Color', '#ff0000', { state: 'hover' } ).assertComputedStyle( {
				'.stk-button .stk--inner-svg > svg:hover': {
					'fill': '#ff0000',
				},
			} )
			cy.adjust( 'Icon Color', '#6a20cb', { state: 'normal' } ).assertComputedStyle( {
				'.stk-button .stk--inner-svg > svg': {
					'fill': '#6a20cb',
				},
			} )
		} )
	} )

	it( 'should assert Icon panel in Style tab', () => {
		cy.collapse( 'Icon' )
		desktopOnly( () => {
			cy.adjust( 'Icon', 'info' )
			cy.adjust( 'Icon Color', '#ff0000', { state: 'hover' } )
			cy.adjust( 'Icon Color', '#6a20cb', { state: 'normal' } )
			cy.adjust( 'Icon Opacity', 0.6, { state: 'hover' } )
			cy.adjust( 'Icon Opacity', 0.8, { state: 'normal' } )
			cy.adjust( 'Icon Rotation', 181, { state: 'hover' } ).assertComputedStyle( {
				'.stk-button .stk--inner-svg > svg:hover': {
					'fill': '#ff0000',
					'opacity': '0.6',
					'transform': 'rotate(181deg)',
				},
			} )

			cy.adjust( 'Icon Rotation', 72, { state: 'normal' } ).assertComputedStyle( {
				'.stk-button .stk--inner-svg > svg': {
					'fill': '#6a20cb',
					'opacity': '0.8',
					'transform': 'rotate(72deg)',
				},
			} )
		} )

		cy.adjust( 'Icon Size', 58, { viewport } ).assertComputedStyle( {
			'.stk-button .stk--inner-svg svg': {
				'height': '58px',
				'width': '58px',
			},
		} )
	} )

	it( 'should assert Button Size & Spacing panel in Style tab', () => {
		cy.collapse( 'Button Size & Spacing' )
		cy.adjust( 'Min. Button Height', 79, { viewport } )
		cy.adjust( 'Button Width', 83, { viewport } ).assertComputedStyle( {
			'.stk-button': {
				'min-height': '79px',
				'width': '83px',
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
		cy.addBlock( 'core/paragraph' )
		cy.typeBlock( 'core/paragraph', '', '/icon-button', 0 )
		cy.get( '.components-popover__content' )
			.contains( 'Icon Button' )
			.click( { force: true } )
		cy.selectBlock( 'stackable/icon-button' ).then( $block => {
			const clientId = $block.data( 'block' )
			cy.wp().then( wp => {
				const className = wp.data.select( 'core/block-editor' ).getBlock( clientId ).attributes.className
				wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, { className: `${ className ? className + ' ' : '' }e2etest-block-${ uniqueId() }` } )
			} )
		} )
		cy.selectBlock( 'stackable/icon-button' ).asBlock( 'iconButtonBlock', { isStatic: true } )

		cy.openInspector( 'stackable/icon-button', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-icon-button',
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@iconButtonBlock' )
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
		cy.addBlock( 'core/paragraph' )
		cy.typeBlock( 'core/paragraph', '', '/icon-button', 0 )
		cy.get( '.components-popover__content' )
			.contains( 'Icon Button' )
			.click( { force: true } )
		cy.selectBlock( 'stackable/icon-button' ).then( $block => {
			const clientId = $block.data( 'block' )
			cy.wp().then( wp => {
				const className = wp.data.select( 'core/block-editor' ).getBlock( clientId ).attributes.className
				wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, { className: `${ className ? className + ' ' : '' }e2etest-block-${ uniqueId() }` } )
			} )
		} )
		cy.selectBlock( 'stackable/icon-button' ).asBlock( 'iconButtonBlock', { isStatic: true } )

		cy.openInspector( 'stackable/icon-button', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-icon-button',
		blockName: 'stackable/icon-button',
		customSelector: '.stk-block-icon-button > a.stk-button',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@iconButtonBlock' )
	} )
}
