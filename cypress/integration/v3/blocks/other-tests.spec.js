/**
 * External dependencies
 */
import { registerTests } from '~stackable-e2e/helpers'
import { containsRegExp } from '~common/util'
import { stkBlocks } from '~stackable-e2e/config'

describe( 'Image Block ( Other Tests )', registerTests( [ addInnerBlocksToQueryLoop ] ) )

function addInnerBlocksToQueryLoop() {
	it( 'should add stackable as inner blocks in query loop', () => {
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
			cy.savePost()
			cy.reload()
			cy.deleteBlock( blockName )
			cy.savePost()
			cy.reload()
		} )

		// TODO refactor / add more
	} )
}
