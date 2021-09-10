
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
