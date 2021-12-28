
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
	it( 'should show the block', assertBlockExist( 'stackable/icon-list', '.stk-block-icon-list' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/icon-list' ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/icon-list' )
		cy.typeBlock( 'stackable/icon-list', '.stk-block-icon-list ul', 'Icon list', 0 )
		cy.get( '.stk-block-icon-list' ).find( 'ul[role="textbox"]' ).type( '{enter}', { force: true } )
			.type( 'Icon list 2', { force: true } )
		cy.get( '.stk-block-icon-list' ).find( 'ul[role="textbox"]' ).type( '{enter}', { force: true } )
			.type( 'Icon list 3', { force: true } )
		cy.savePost()
		cy.selectBlock( 'stackable/icon-list' )
			.assertBlockContent( '.stk-block-icon-list ul', 'Icon listIcon list 2Icon list 3' )
	} )
}

// TODO: Temporarily commenting this out as we're experiencing issues.
// Uncomment when feature is readded to v3 Icon List block
//
// function indentList() {
// 	it( 'should allow indenting and outdenting the list item', () => {
// 		cy.setupWP()
// 		cy.newPage()
// 		cy.addBlock( 'stackable/icon-list' )
// 		cy.typeBlock( 'stackable/icon-list', '.stk-block-icon-list ul', 'August', 0 )
// 		cy.get( '.stk-block-icon-list' ).find( 'ul[role="textbox"]' ).type( '{enter}', { force: true } )
// 			.type( 'September', { force: true } )
// 		cy.adjustToolbar( 'Indent' )
// 		cy.get( '.stk-block-icon-list' ).contains( 'August' ).find( 'ul li' ).invoke( 'text' ).then( item => {
// 			assert.isTrue(
// 				item === 'September',
// 				'Expected list item 2 to be indented'
// 			)
// 		} )
// 		cy.adjustToolbar( 'Outdent' )
// 		cy.get( '.stk-block-icon-list ul > li' ).eq( 1 ).invoke( 'text' ).then( item => {
// 			assert.isTrue(
// 				item === 'September',
// 				'Expected list item 2 to be outdented'
// 			)
// 		} )
// 	} )
// }

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/icon-list' ).asBlock( 'iconListBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/icon-list', '.stk-block-icon-list ul', 'Icon list 1', 0 )
		cy.get( '.stk-block-icon-list' ).find( 'ul[role="textbox"]' ).type( '{enter}', { force: true } )
			.type( 'Icon list 2', { force: true } )
		cy.get( '.stk-block-icon-list' ).find( 'ul[role="textbox"]' ).type( '{enter}', { force: true } )
			.type( 'Icon list 3', { force: true } )
		cy.openInspector( 'stackable/icon-list', 'Style' )
		cy.savePost()
	} )

	afterEach( () => cy.assertFrontendStyles( '@iconListBlock' ) )

	it( 'should assert General panel in Style tab', () => {
		cy.collapse( 'General' )
		cy.adjust( 'Columns', 3, { viewport } )
		cy.adjust( 'Column Gap', 24, { viewport } )
		cy.adjust( 'Icon Gap', 13, { viewport } )
		cy.adjust( 'Indentation', 37, { viewport } ).assertComputedStyle( {
			'.stk-block-icon-list': {
				'column-count': '3',
				'column-gap': '24px',
			},
			'.stk-block-icon-list li': {
				'padding-inline-start': '13px',
			},
			'.stk-block-icon-list ul': {
				'padding-left': '37px',
			},
		} )
		const aligns = [ 'left', 'center', 'right' ]
		aligns.forEach( align => {
			cy.adjust( 'List Alignment', align, { viewport } ).assertComputedStyle( {
				'.stk-block-icon-list li': {
					'margin-inline': `${ align === 'left' ? '0 ' : '' }auto${ align === 'right' ? ' 0' : '' }`,
				},
			} )
		} )
	} )

	it( 'should assert Icons & Numbers panel in Style tab', () => {
		cy.collapse( 'Icons & Numbers' )
		desktopOnly( () => {
			cy.adjust( 'Icon', 'info' )
			cy.adjustToolbar( 'Ordered' )
			cy.adjust( 'List Type', 'lower-roman' ).assertComputedStyle( {
				'.stk-block-icon-list ol': {
					'list-style-type': 'lower-roman',
				},
			} )
			cy.adjust( 'Color', '#009cb8', { state: 'hover' } ).assertComputedStyle( {
				'.stk-block-icon-list li:marker:hover': {
					'color': '#009cb8',
				},
			} )
			cy.adjust( 'Color', '#34a400', { state: 'normal' } ).assertComputedStyle( {
				'.stk-block-icon-list li:marker': {
					'color': '#34a400',
				},
			} )

			// TODO: Add assertion for Icon Opacity, Icon Rotation.
			cy.adjust( 'Icon Opacity', 0.9, { state: 'hover' } )
			cy.adjust( 'Icon Opacity', 0.5, { state: 'normal' } )
			cy.adjustToolbar( 'Unordered' )
			cy.adjust( 'Icon Rotation', 158 )
		} )
		cy.adjust( 'Icon / Number Size', 1.6, { viewport } ).assertComputedStyle( {
			'.stk-block-icon-list li:marker': {
				'font-size': '1.6em',
			},
		} )
	} )

	it( 'should assert Typography panel in Style tab', () => {
		assertTypographyModule( {
			selector: '.stk-block-icon-list ul li',
			viewport,
			enableContent: false,
			enableTextColor: true,
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
		cy.addBlock( 'stackable/icon-list' ).asBlock( 'iconListBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/icon-list', '.stk-block-icon-list ul', 'Icon list', 0 )
		cy.openInspector( 'stackable/icon-list', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-icon-list',
		alignmentSelector: '.stk-block-icon-list',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@iconListBlock' )
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
		cy.addBlock( 'stackable/icon-list' ).asBlock( 'iconListBlock', { isStatic: true } )
		cy.typeBlock( 'stackable/icon-list', '.stk-block-icon-list ul', 'Icon list', 0 )
		cy.openInspector( 'stackable/icon-list', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-icon-list',
		blockName: 'stackable/icon-list',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@iconListBlock' )
	} )
}
