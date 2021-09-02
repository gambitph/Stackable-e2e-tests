
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest,
} from '~stackable-e2e/helpers'

export {
	blockExist,
	blockError,
	selectIcon,
	typeContent,
	pressEnterKey,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/icon-label', '.stk-block-icon-label' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/icon-label' ) )
}

function selectIcon() {
	it( 'should assert selected icon', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/icon-label' )
		cy.selectBlock( 'stackable/icon-label' )
		cy.changeIcon( 1, 'facebook', 'ugb-icon--facebook' )
		cy.selectBlock( 'stackable/icon-label' )
			.find( 'svg[data-icon="facebook"]' )
			.should( 'exist' )
		cy.savePost()
		cy.getPostUrls().then( ( { previewUrl } ) => {
			cy.visit( previewUrl )
			cy.get( '.stk-block-icon-label' )
				.find( 'svg[data-icon="facebook"]' )
				.should( 'exist' )
		} )
	} )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/icon-label' )

		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Icon label', 0 )
			.assertBlockContent( '.stk-block-heading__text', 'Icon label' )
	} )
}

function pressEnterKey() {
	it( 'should test clicking the enter key in heading block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/icon-label' )

		cy.typeBlock( 'stackable/heading', '.stk-block-heading__text', 'Icon label', 0 )
		cy.get( '.stk-block-heading__text' ).type( '{enter}', { force: true } )

		cy.savePost()
		// Reloading should not cause a block error
		cy.reload()
	} )
}
