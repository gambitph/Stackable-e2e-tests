/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'
import { containsRegExp, compareVersions } from '~common/util'
import { stkBlocks } from '~stackable-e2e/config'

describe( 'Other Tests', registerTests( [ addInnerBlocksToQueryLoop ] ) )

function addInnerBlocksToQueryLoop() {
	it( 'should add stackable as inner blocks in query loop', () => {
		// Only for WP 5.8 and above. Query Loop was introduced in 5.8
		if ( compareVersions( Cypress.env( 'WORDPRESS_VERSION' ), '5.7.3', '>' ) ) {
			cy.setupWP()
			cy.registerPosts( { numOfPosts: 2 } )
			cy.newPage()
			cy.addBlock( 'core/query' )
			cy.get( '.block-editor-block-list__block.is-selected' )
				.find( '.block-editor-block-pattern-setup__actions' )
				.contains( containsRegExp( 'Choose' ) )
				.click( { force: true } )

			stkBlocks.forEach( blockName => {
				cy.addInnerBlock( 'core/query', blockName )
				cy.publish()
				// This should not cause block error
				cy.reload()
				cy.deleteBlock( blockName )
				cy.publish()
				// This should not cause block error
				cy.reload()
			} )
		}
	} )
}
