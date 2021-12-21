/**
 * External dependencies
 */
import { kebabCase } from 'lodash'
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

			cy.adjust( 'Shadow / Outline', 5 ).assertComputedStyle( {
				'.stk-block-separator svg': {
					'filter': 'drop-shadow(0px 2px 20px rgba(153, 153, 153, 0.2))',
				},
			} )

			const parentSelector = '.components-popover__content .stk-control-content'

			cy.adjust( 'Shadow / Outline', {
				'Horizontal Offset': { value: 8, parentSelector },
				'Vertical Offset': { value: 11, parentSelector },
				'Blur': { value: 25, parentSelector },
				'Shadow Color': { value: '#2a8a62', parentSelector },
				'Shadow Opacity': { value: 0.6, parentSelector },
			}, { buttonLabel: 'Shadow Settings' } ).assertComputedStyle( {
				'.stk-block-separator svg': {
					'filter': 'drop-shadow(8px 11px 25px rgba(42, 138, 98, 0.6))',
				},
			} )

			cy.adjust( 'Invert Design', true )
			cy.adjust( 'Flip Horizontally', true )
			cy.adjust( 'Flip Vertically', true )
			cy.adjust( 'Bring to Front', true ).assertComputedStyle( {
				'.stk-block-separator': {
					'transform': 'scaleX(-1) scaleY(-1)',
					'z-index': '6',
				},
			} )
		} )

		cy.adjust( 'Height', 281, { viewport } ).assertComputedStyle( {
			'.stk-block-separator__inner': {
				'height': '281px',
			},
		} )
	} )

	const layers = [ 'Layer 2', 'Layer 3' ]

	layers.forEach( layer => {
		it( `should assert ${ layer } panel in Style tab`, () => {
			cy.toggleStyle( layer )
			desktopOnly( () => {
				cy.adjust( 'Color', '#ecf56a' ).assertComputedStyle( {
					[ `.stk-block-separator__inner .stk-separator__${ kebabCase( layer ) }` ]: {
						'fill': '#ecf56a',
					},
				} )
				cy.adjust( 'Layer Width', 2.4 )
				cy.adjust( 'Flip Horizontally', true ).assertComputedStyle( {
					[ `.stk-block-separator__inner .stk-separator__${ kebabCase( layer ) }` ]: {
						'transform': 'scaleX(-1) scaleX(2.4)',
					},
				} )
				cy.resetStyle( 'Layer Width' )
				cy.adjust( 'Flip Horizontally', false )

				cy.adjust( 'Opacity', 0.5 )
				cy.adjust( 'Mix Blend Mode', 'multiply' ).assertComputedStyle( {
					[ `.stk-block-separator__inner .stk-separator__${ kebabCase( layer ) }` ]: {
						'opacity': '0.5',
						'mix-blend-mode': 'multiply',
					},
				} )
			} )

			cy.adjust( 'Layer Height', 1.19, { viewport } ).assertComputedStyle( {
				[ `.stk-block-separator__inner .stk-separator__${ kebabCase( layer ) }` ]: {
					'transform': 'scaleY(1.19)',
				},
			} )
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
