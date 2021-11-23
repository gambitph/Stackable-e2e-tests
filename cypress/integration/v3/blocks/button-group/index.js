
/**
 * External dependencies
 */
import { lowerCase } from 'lodash'
import {
	assertBlockExist, blockErrorTest, responsiveAssertHelper, Block, Advanced,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	addColumn,
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
	it( 'should show the block', assertBlockExist( 'stackable/button-group', '.stk-block-button-group' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/button-group' ) )
}

function addColumn() {
	it( 'should allow adding more buttons using the appender', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/button-group' ).asBlock( 'buttonGroupBlock', { isStatic: true } )

		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Button', 0 )
		// Add 3 more buttons
		cy.selectBlock( 'stackable/button-group' ).addNewColumn( { blockToAdd: 'Button' } )
		cy.selectBlock( 'stackable/button-group' ).addNewColumn( { blockToAdd: 'Button' } )
		cy.selectBlock( 'stackable/button-group' ).addNewColumn( { blockToAdd: 'Button' } )
		cy.savePost()

		const assertAddedButtons = assertType => cy
			.get( '.stk-block-button' ).its( 'length' ).then( len => {
				assert.isTrue(
					len === 4,
					`Expected number of buttons to be '4' in ${ assertType }. Found: '${ len }'`
				)
			} )

		assertAddedButtons( 'Editor' )
		cy.getPostUrls().then( ( { previewUrl } ) => {
			cy.visit( previewUrl )
			assertAddedButtons( 'Frontend' )
		} )
	} )
}

function styleTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/button-group' ).asBlock( 'buttonGroupBlock', { isStatic: true } )
		// Add 3 more buttons
		cy.selectBlock( 'stackable/button-group' ).addNewColumn( { blockToAdd: 'Button' } )
		cy.selectBlock( 'stackable/button-group' ).addNewColumn( { blockToAdd: 'Button' } )
		cy.selectBlock( 'stackable/button-group' ).addNewColumn( { blockToAdd: 'Button' } )
		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Button 1', 0 )
		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Button 2', 1 )
		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Button 3', 2 )
		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Button 4', 3 )
		cy.openInspector( 'stackable/button-group', 'Style' )
	} )

	afterEach( () => cy.assertFrontendStyles( '@buttonGroupBlock' ) )

	it( 'should assert General panel in Style tab', () => {
		cy.collapse( 'General' )
		cy.adjust( 'Collapse Buttons On', lowerCase( viewport ) ).assertClassName( '.stk-block-button-group > .stk-inner-blocks', `stk--collapse-on-${ lowerCase( viewport ) }` )
		cy.adjust( 'Row Gap', 54, { viewport } )

		cy.adjust( 'Flex Wrap', 'wrap', { viewport } ).assertComputedStyle( {
			'.stk-block-button-group .block-editor-block-list__layout': {
				'flex-direction': 'column',
				'row-gap': '54px',
				'flex-wrap': 'wrap',
			},
		}, { assertFrontend: false } )
		cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
			'.stk-block-button-group .stk-inner-blocks': {
				'flex-direction': 'column',
				'row-gap': '54px',
				'flex-wrap': 'wrap',
			},
		}, { assertBackend: false } )
		cy.adjust( 'Column Gap', 43, { viewport } ).assertComputedStyle( {
			'.stk-block-button-group .block-editor-block-list__layout': {
				'column-gap': '43px',
			},
		}, { assertFrontend: false } )
		cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
			'.stk-block-button-group .stk-inner-blocks': {
				'column-gap': '43px',
			},
		}, { assertBackend: false } )
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
		cy.addBlock( 'stackable/button-group' ).asBlock( 'buttonGroupBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Button', 0 )
		cy.openInspector( 'stackable/button-group', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-button-group',
		alignmentSelector: '.stk-block-button-group > .stk-inner-blocks',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@buttonGroupBlock' )
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
		cy.addBlock( 'stackable/button-group' ).asBlock( 'buttonGroupBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/button', '.stk-button__inner-text', 'Button', 0 )
		cy.openInspector( 'stackable/button-group', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-button-group',
		blockName: 'stackable/button-group',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@buttonGroupBlock' )
	} )
}
