
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, responsiveAssertHelper, Block, Advanced, assertLinks,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	selectIcon,
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

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/icon' ).asBlock( 'iconBlock', { isStatic: true } )
		cy.openInspector( 'stackable/icon', 'Style' )
		cy.savePost()
	} )

	afterEach( () => cy.assertFrontendStyles( '@iconBlock' ) )

	it( 'should assert Icon panel in Style tab', () => {
		cy.collapse( 'Icon' )
		cy.get( '.block-editor-block-list__block.is-selected [data-block-id].stk-block' )
			.invoke( 'attr', 'data-block-id' )
			.then( blockId => {
				desktopOnly( () => {
					cy.adjust( 'Icon', 'phone' )
					cy.adjust( 'Color Type', 'gradient' )
					cy.adjust( 'Icon Color #1', '#2daca7' )
					cy.adjust( 'Icon Color #2', '#b885f6' )
					cy.adjust( 'Gradient Direction (degrees)', 110 ).assertComputedStyle( {
						'.stk--svg-wrapper .stk--inner-svg .svg-inline--fa': {
							'fill': `url(#linear-gradient-${ blockId })`,
						},
						[ `.stk--svg-wrapper #linear-gradient-${ blockId }` ]: {
							'transform': 'rotate(110deg)',
						},
					} )

					cy.adjust( 'Color Type', 'single' )
					cy.adjust( 'Icon Color', '#179025', { state: 'hover' } )
					cy.adjust( 'Icon Color', '#2a7997', { state: 'normal' } )
					cy.adjust( 'Icon Opacity', 0.7, { state: 'hover' } )
					cy.adjust( 'Icon Opacity', 0.9, { state: 'normal' } )
					cy.adjust( 'Icon Rotation', 82, { state: 'hover' } ).assertComputedStyle( {
						'.stk--svg-wrapper .stk--inner-svg .svg-inline--fa:hover': {
							'opacity': '0.7',
							'transform': 'rotate(82deg)',
						},
					} )
					cy.adjust( 'Icon Rotation', 179, { state: 'normal' } ).assertComputedStyle( {
						'.stk--svg-wrapper .stk--inner-svg .svg-inline--fa': {
							'opacity': '0.9',
							'transform': 'rotate(179deg)',
						},
					} )
				} )
				cy.adjust( 'Icon Size', 65, { viewport } ).assertComputedStyle( {
					'.stk--svg-wrapper .stk--inner-svg .svg-inline--fa': {
						'height': '65px',
						'width': '65px',
					},
				} )
			} )
	} )

	it( 'should assert Icon Shape panel in Style tab', () => {
		cy.collapse( 'Icon Shape' )
		cy.adjust( 'Shape Outline Width', [ 3, 4, 5, 6 ], { viewport } ).assertComputedStyle( {
			'.stk--svg-wrapper .stk--inner-svg': {
				'border-top-width': '3px',
				'border-right-width': '4px',
				'border-bottom-width': '5px',
				'border-left-width': '6px',
			},
		} )
		desktopOnly( () => {
			cy.adjust( 'Color Type', 'gradient' )
			cy.adjust( 'Icon Color #1', '#6bcdb5' )
			cy.adjust( 'Icon Color #2', '#5172dd' )
			cy.adjust( 'Gradient Direction (degrees)', 162 ).assertComputedStyle( {
				'.stk--svg-wrapper .stk--inner-svg': {
					'background-image': 'linear-gradient(162deg, #6bcdb5, #5172dd)',
				},
			} )
			cy.adjust( 'Color Type', 'single' )
			cy.adjust( 'Shape Padding', 21 )
			cy.adjust( 'Shape Color', '#02876f', { state: 'hover' } )
			cy.adjust( 'Shape Color', '#b3cd63', { state: 'normal' } )
			cy.adjust( 'Shape Border Radius', 17, { state: 'hover' } )
			cy.adjust( 'Shape Border Radius', 43, { state: 'normal' } )
			cy.adjust( 'Shape Outline Color', '#b3b3b3', { state: 'hover' } ).assertComputedStyle( {
				'.stk--svg-wrapper .stk--inner-svg:hover': {
					'background-color': '#02876f',
					'border-radius': '17%',
					'border-color': '#b3b3b3',
				},
			} )
			cy.adjust( 'Shape Outline Color', '#303030', { state: 'normal' } ).assertComputedStyle( {
				'.stk--svg-wrapper .stk--inner-svg': {
					'background-color': '#b3cd63',
					'border-radius': '43%',
					'padding': '21px',
					'border-color': '#303030',
				},
			} )
		} )
	} )

	it( 'should assert Background Shape panel in Style tab', () => {
		desktopOnly( () => {
			cy.toggleStyle( 'Background Shape' )
			cy.adjust( 'Shape', { label: 'Circle', value: 'circle' } )
			cy.adjust( 'Shape Color', '#2680bc', { state: 'hover' } )
			cy.adjust( 'Shape Opacity', 0.8, { state: 'hover' } ).assertComputedStyle( {
				'.stk--svg-wrapper .stk--shape-icon:hover': {
					'fill': '#2680bc',
					'opacity': '0.8',
				},
			} )
			cy.adjust( 'Shape Color', '#672d99', { state: 'normal' } )
			cy.adjust( 'Shape Opacity', 0.6, { state: 'normal' } ).assertComputedStyle( {
				'.stk--svg-wrapper .stk--shape-icon': {
					'fill': '#672d99',
					'opacity': '0.6',
				},
			} )
			cy.adjust( 'Shape Size', 2.8 )
			cy.adjust( 'Horizontal Offset', 4 )
			cy.adjust( 'Vertical Offset', '-5' ).assertComputedStyle( {
				'.stk--svg-wrapper .stk--shape-icon': {
					'transform': 'translateX(-50%) translateY(-50%) scale(2.8) translateX(4px) translateY(-5px)',
				},
			} )
		} )
	} )

	it( 'should assert Link panel in Style tab', () => {
		cy.toggleStyle( 'Link' )
		assertLinks( { selector: '.stk-block-icon > a.stk-link', viewport } )
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
		generalEditorSelectorIsSelected: true, // .is-selected element
		positionEditorSelectorIsSelected: true, // .is-selected element
		transformTransitionEditorSelectorIsSelected: true, // .is-selected element
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
