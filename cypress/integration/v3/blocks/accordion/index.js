
/**
 * External dependencies
 */
import { range } from 'lodash'
import {
	assertBlockExist, blockErrorTest, checkJsFiles, assertInnerBlocks, responsiveAssertHelper, Block,
} from '~stackable-e2e/helpers'
import { stkBlocks } from '~stackable-e2e/config'

const [ desktopStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	innerBlocks,
	innerBlocksExist,
	loadedFiles,
	assertIcon,
	desktopStyle,
	desktopBlock,
	tabletBlock,
	mobileBlock,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/accordion', '.stk-block-accordion', { variation: 'Default Layout' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/accordion', { variation: 'Default Layout' } ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/accordion', { variation: 'Default Layout' } )

		stkBlocks
			.filter( blockName => blockName !== 'stackable/accordion' )
			.forEach( blockName => cy.addInnerBlock( 'stackable/column', blockName, 1 ) )

		cy.savePost()
	} )
}

function innerBlocksExist() {
	it( 'should assert presence of inner blocks when the block is added', assertInnerBlocks( 'stackable/accordion', [
		'.stk-block-icon-label',
		'.stk-block-text',
	], { variation: 'Default Layout' } ) )
}

function loadedFiles() {
	it( 'should assert the loaded files in the frontend', checkJsFiles( 'stackable/accordion', '#stk-frontend-accordion-js', { variation: 'Default Layout' } ) )
}

function assertIcon() {
	it( 'should assert the correct icon is added for the accordion', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/accordion', { variation: 'Default Layout' } )
		cy.get( '.stk-block-accordion .fa-chevron-down' ).should( 'exist' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/accordion', { variation: 'Default Layout' } ).asBlock( 'accordionBlock', { isStatic: true } )
		cy.openInspector( 'stackable/accordion', 'Style' )
		cy.savePost()
	} )

	it( `should assert General options in ${ viewport }`, () => {
		desktopOnly( () => {
			cy.collapse( 'General' )
			cy.adjust( 'Open at the start', true ).assertClassName( '.stk-block-accordion', 'stk--is-open', { assertBackend: false } )
			cy.deleteBlock( 'stackable/accordion' )

			range( 1, 4 ).forEach( idx => {
				// Test Close adjacent on open
				cy.addBlock( 'stackable/accordion', { variation: 'Default Layout' } )
				cy.typeBlock( 'stackable/accordion', '.stk-block-heading__text', `Accordion ${ idx }`, idx - 1 )
				cy.openInspector( 'stackable/accordion', 'Style', `Accordion ${ idx }` )
				cy.collapse( 'General' )
				cy.adjust( 'Close adjacent on open', true )
			} )

			cy.savePost()
			cy.getPostUrls().then( ( { previewUrl } ) => {
				cy.visit( previewUrl )
				range( 0, 3 ).forEach( idx1 => {
					cy
						.get( '.stk-block-accordion' )
						.eq( idx1 )
						.find( '.stk-block-heading__text' )
						.click( { force: true } )
						.then( () => {
							range( 0, 3 ).forEach( idx2 => {
								if ( idx1 !== idx2 ) {
									cy
										.get( '.stk-block-accordion' )
										.eq( idx2 )
										.invoke( 'attr', 'class' )
										.then( classNames => {
											assert.isTrue(
												! classNames.includes( 'stk--is-open' ),
												`Expected that Accordion ${ idx2 + 1 } does not have the 'stk--is-open' classname.`
											)
										} )
								}
							} )
						} )
				} )
			} )
		} )
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@accordionBlock' )
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
		cy.addBlock( 'stackable/accordion', { variation: 'Default Layout' } ).asBlock( 'accordionBlock', { isStatic: true } )
		cy.openInspector( 'stackable/accordion', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-accordion',
		alignmentSelector: '.stk-block-accordion',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )

	afterEach( () => {
		cy.assertFrontendStyles( '@accordionBlock' )
	} )
}
