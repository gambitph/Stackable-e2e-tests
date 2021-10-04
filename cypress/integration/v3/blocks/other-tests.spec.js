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
		cy.registerPosts( { numOfPosts: 2 } )
		// Only for WP 5.8 and above. Query Loop was introduced in 5.8
		if ( compareVersions( Cypress.env( 'WORDPRESS_VERSION' ), '5.7.3', '>' ) ) {
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
					cy.addInnerBlock( 'core/query', blockName )
					cy.assertBlockError()
					cy.publish()
					cy.reload()
					cy.waitLoader( '.components-spinner' )
					cy.deleteBlock( blockName )
					cy.assertBlockError()
					cy.publish()
					cy.reload()
					cy.waitLoader( '.components-spinner' )
				} )

			stkBlocks
				.filter( blockName => ! Array( 'stackable/button', 'stackable/icon-button' ).includes( blockName ) )
				.forEach( blockName => {
					cy.addInnerBlock( 'core/post-template', blockName )
					cy.assertBlockError()
					cy.publish()
					cy.reload()
					cy.waitLoader( '.components-spinner' )
					cy.selectBlock( blockName )
					cy.adjustToolbar( 'Options', () => {
						cy.get( '.components-popover__content' )
							.contains( 'Remove block' )
							.click( { force: true } )
					} )
					cy.assertBlockError()
					cy.publish()
					cy.reload()
					cy.waitLoader( '.components-spinner' )
				} )
		}
	} )
}
