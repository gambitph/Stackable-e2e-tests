/**
 * Selects a specific part of a text
 *
 * Usage
 * ```
 * // Types "My new text" and selects "new"
 * cy.get( '.wp-block-paragraph' )
 *   .type( 'My new text' )
 *   .setSelection('new')
 *
 * ```
 */
Cypress.Commands.add( 'setSelection', { prevSubject: true }, ( subject, query, endQuery = '' ) => {
	return cy.wrap( subject )
		.selection( $el => {
			cy.document().then( doc => {
				const walk = doc.createTreeWalker( $el[ 0 ], NodeFilter.SHOW_TEXT, null, false )
				if ( query ) {
					const anchorNode = walk.nextNode()
					const focusNode = endQuery ? walk.nextNode : anchorNode
					const anchorOffset = anchorNode.wholeText.indexOf( query )
					const focusOffset = endQuery
						? focusNode.wholeText.indexOf( endQuery ) + endQuery.length
						: anchorOffset + query.length
					setBaseAndExtent( anchorNode, anchorOffset, focusNode, focusOffset )
				}
			} )
		} )
} )

/**
 * Command used by `setSelection` to trigger the selecting of text.
 */
Cypress.Commands.add( 'selection', { prevSubject: true }, ( subject, fn ) => {
	cy.wrap( subject )
		.trigger( 'mousedown' )
		.then( fn )
		.trigger( 'mouseup' )

	cy.document().trigger( 'selectionchange' )
	return cy.wrap( subject )
} )

/**
 * Function used by `setSelection` to remove all ranges from the selection
 * and then sets the selection to be a range.
 *
 * @param {...any} args
 */
function setBaseAndExtent( ...args ) {
	const document = args[ 0 ].ownerDocument
	document.getSelection().removeAllRanges()
	document.getSelection().setBaseAndExtent( ...args )
}

import './wordpress'
import './gutenberg'
import './stackable'

// Use Jest assertions
import 'cypress-jest-adapter'
import 'cypress-real-events/support'
