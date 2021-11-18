/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'
import { containsRegExp, compareVersions } from '~common/util'
import { stkBlocks } from '~stackable-e2e/config'

describe( 'Other Tests', registerTests( [ addInnerBlocksToQueryLoop ] ) )

function addInnerBlocksToQueryLoop() {
	it( 'should add stackable as inner blocks in query loop', () => {
		cy.setupWP()
		cy.get( 'body' ).then( () => {
			if ( compareVersions( Cypress.env( 'WORDPRESS_VERSION' ), '5.8.0', '<' ) ) {
				return
			}
			cy.registerPosts( { numOfPosts: 2 } )

			cy.newPage()
			cy.addBlock( 'core/query' )
			cy.get( '.block-editor-block-list__block.is-selected' )
				.find( '.block-editor-block-pattern-setup__actions' )
				.contains( containsRegExp( 'Choose' ) )
				.click( { force: true } )

			// Filter out button & icon button when adding inner blocks.
			// We'll add button group instead.
			stkBlocks
				.filter( blockName => ! Array( 'stackable/button', 'stackable/icon-button' ).includes( blockName ) )
				.forEach( blockName => {
					cy.addInnerBlock( 'core/post-template', blockName )
				} )

			cy.assertBlockError()
			cy.publish()
			cy.reload()
			cy.assertBlockError()
			cy.publish()
		} )
	} )
}
