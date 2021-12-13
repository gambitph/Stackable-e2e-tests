/**
 * External dependencies
 */
import { kebabCase } from 'lodash'
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
	pressBackspace,
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
	it( 'should show the block', assertBlockExist( 'stackable/heading', '.stk-block-heading' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/heading' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/heading' ).asBlock( 'headingBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Heading block', 0 )
			.assertBlockContent( '.stk-block-heading__text', 'Heading block' )
	} )
}

function pressEnterKey() {
	it( 'should test pressing the enter key in heading block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/heading' )

		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Heading', 0 )
		cy.get( '.stk-block-heading__text' ).type( '{enter}', { force: true } )

		cy.get( '.block-editor-block-list__block.is-selected' ).invoke( 'attr', 'data-type' ).then( blockName => {
			assert.isTrue(
				blockName === 'stackable/text',
				'Expected text block to be added upon pressing enter key in Heading.'
			)
		} )
		cy.savePost()
		// Reloading should not cause a block error
		cy.reload()
	} )
}

function pressBackspace() {
	it( 'should test pressing the backspace in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/card', { variation: 'Default Layout' } )
		cy.addBlock( 'stackable/heading' )

		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Hello World!', 1 )
		cy.get( '.stk-block-heading__text' ).eq( 1 ).type( '{selectall}{backspace}{backspace}', { force: true } )

		cy.get( '.block-editor-block-list__block.is-selected' ).invoke( 'attr', 'data-type' ).then( block => {
			assert.isTrue(
				block === 'stackable/card',
				`Expected that the block is deleted and focus is on 'stackable/card'. Found: '${ block }'`
			)
		} )
	} )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/heading' ).asBlock( 'headingBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Heading', 0 )
		cy.openInspector( 'stackable/heading', 'Style' )
	} )

	afterEach( () => cy.assertFrontendStyles( '@headingBlock' ) )

	it( 'should assert Typography panel in Style tab', () => {
		assertTypographyModule( {
			selector: '.stk-block-heading__text',
			viewport,
			enableRemoveMargin: true,
			enableHtmlTag: true,
		} )
	} )

	const lines = [ 'Top Line', 'Bottom Line' ]
	lines.forEach( line => {
		it( `should assert ${ line } panel in Style tab`, () => {
			cy.toggleStyle( line )
			desktopOnly( () => {
				cy.adjust( 'Line Color', '#4963e1', { state: 'hover' } ).assertComputedStyle( {
					[ `.stk-block-heading__${ kebabCase( line ) }:hover` ]: {
						'background-color': '#4963e1',
					},
				} )
				cy.adjust( 'Line Color', '#bf8ad5', { state: 'normal' } ).assertComputedStyle( {
					[ `.stk-block-heading__${ kebabCase( line ) }` ]: {
						'background-color': '#bf8ad5',
					},
				} )
				cy.adjust( 'Width', 87, { unit: 'px', state: 'hover' } ).assertComputedStyle( {
					[ `.stk-block-heading__${ kebabCase( line ) }:hover` ]: {
						'width': '87px',
					},
				} )
				cy.adjust( 'Width', 138, { unit: 'px', state: 'normal' } ).assertComputedStyle( {
					[ `.stk-block-heading__${ kebabCase( line ) }` ]: {
						'width': '138px',
					},
				} )
				cy.adjust( 'Width', 29, { unit: '%', state: 'hover' } ).assertComputedStyle( {
					[ `.stk-block-heading__${ kebabCase( line ) }:hover` ]: {
						'width': '29%',
					},
				} )
				cy.adjust( 'Width', 76, { unit: '%', state: 'normal' } ).assertComputedStyle( {
					[ `.stk-block-heading__${ kebabCase( line ) }` ]: {
						'width': '76%',
					},
				} )
				cy.adjust( 'Height', 32 ).assertComputedStyle( {
					[ `.stk-block-heading__${ kebabCase( line ) }` ]: {
						'height': '32px',
					},
				} )
			} )
			cy.adjust( 'Margin', 77, { viewport } ).assertComputedStyle( {
				[ `.stk-block-heading__${ kebabCase( line ) }` ]: {
					[ `margin-${ line === 'Top Line' ? 'bottom' : 'top' }` ]: '77px',
				},
			} )
			const aligns = [ 'left', 'right' ]
			aligns.forEach( align => {
				cy.adjust( 'Align', align, { viewport } ).assertComputedStyle( {
					[ `.stk-block-heading__${ kebabCase( line ) }` ]: {
						[ `margin-${ align === 'left' ? 'right' : 'left' }` ]: 'auto',
					},
				} )
			} )
			cy.adjust( 'Align', 'center', { viewport } ).assertComputedStyle( {
				[ `.stk-block-heading__${ kebabCase( line ) }` ]: {
					'margin-left': 'auto',
					'margin-right': 'auto',
				},
			} )
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
		cy.addBlock( 'stackable/heading' ).asBlock( 'headingBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Heading', 0 )
		cy.openInspector( 'stackable/heading', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-heading',
		alignmentSelector: '.stk-block-heading__text',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@headingBlock' )
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
		cy.addBlock( 'stackable/heading' ).asBlock( 'headingBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Heading', 0 )
		cy.openInspector( 'stackable/heading', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-heading',
		blockName: 'stackable/heading',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@headingBlock' )
	} )
}
