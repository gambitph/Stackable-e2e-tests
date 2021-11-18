/**
 * External dependencies
 */
import {
	responsiveAssertHelper, Block,
} from '~stackable-e2e/helpers'
import { uniqueId } from 'lodash'

const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	desktopBlock,
	tabletBlock,
	mobileBlock,
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
