
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest,
} from '~stackable-e2e/helpers'

export {
	blockExist,
	blockError,
	addColumn,
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
