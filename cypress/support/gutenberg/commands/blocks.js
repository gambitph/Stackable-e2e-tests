
/**
 * External dependencies
 */
import {
	last, first, uniqueId,
} from 'lodash'

/**
 * Internal dependencies
 */
import { getBlocksRecursive, dispatchResolver } from '~common/util'

/**
 * Register functions to Cypress Commands.
 */
Cypress.Commands.add( 'assertBlockError', assertBlockError )
Cypress.Commands.add( 'addBlock', addBlock )
Cypress.Commands.add( 'selectBlock', selectBlock )
Cypress.Commands.add( 'typeBlock', typeBlock )
Cypress.Commands.add( 'deleteBlock', deleteBlock )
Cypress.Commands.add( 'addInnerBlock', addInnerBlock )

/**
 * Command for asserting block error.
 */
export function assertBlockError() {
	cy.get( '.block-editor-warning' ).should( 'not.exist' )
}

/**
 * Command for adding a specific block in the inserter button.
 *
 * @param {string} blockName
 */
export function addBlock( blockName = 'ugb/accordion' ) {
	cy.wp().then( wp => {
		return new Cypress.Promise( resolve => {
			const block = wp.blocks.createBlock( blockName, { className: `e2etest-block-${ uniqueId() }` } )
			wp.data.dispatch( 'core/editor' ).insertBlock( block )
				.then( dispatchResolver( () => resolve( last( wp.data.select( 'core/block-editor' ).getBlocks() ) ) ) )
		} )
	} )
}

/**
 * Command for selecting a specific block.
 *
 * @param {string} subject
 * @param {string | number | Object} selector
 */
export function selectBlock( subject, selector ) {
	if ( selector === '' ) {
		selector = undefined
	}
	cy.wp().then( wp => {
		cy.get( 'body' ).then( $body => {
			return new Cypress.Promise( resolve => {
				const willSelectBlock = getBlocksRecursive( wp.data.select( 'core/block-editor' ).getBlocks() ).filter( block => block.name === subject )

				if ( typeof selector === 'string' ) {
					let foundClientId = null
					let resolveCallback = null

					if ( selector.startsWith( '@' ) ) {
						return cy.get( selector ).then( $block => {
							const classNames = $block.attributes.className.split( ' ' ).map( c => `.${ c }` ).join( '' )
							const blockElement = $body.find( classNames ).parent()
							const clientId = blockElement.data( 'block' )
							wp.data.dispatch( 'core/block-editor' )
								.selectBlock( clientId )
								.then( dispatchResolver( () => resolve( resolveCallback ) ) )
						} )
					}

					willSelectBlock.forEach( ( { clientId } ) => {
						if ( ! foundClientId && $body.find( `.wp-block[data-block="${ clientId }"]:contains(${ selector })` ).length ) {
							foundClientId = clientId
							resolveCallback = $body.find( `.wp-block[data-block="${ clientId }"]:contains(${ selector })` )
						}
					} )

					wp.data.dispatch( 'core/block-editor' )
						.selectBlock( foundClientId )
						.then( dispatchResolver( () => resolve( resolveCallback ) ) )
				} else if ( typeof selector === 'number' ) {
					wp.data.dispatch( 'core/block-editor' )
						.selectBlock( willSelectBlock[ selector ].clientId )
						.then( dispatchResolver( () => resolve( $body.find( `.wp-block[data-block="${ willSelectBlock[ selector ].clientId }"]` ) ) ) )
				} else if ( typeof selector === 'object' ) {
					const {
						clientId,
					} = selector
					const resolveCallback = $body.find( `[data-block="${ clientId }"]` )
					wp.data.dispatch( 'core/block-editor' )
						.selectBlock( clientId )
						.then( dispatchResolver( () => resolve( resolveCallback ) ) )
				} else {
					wp.data.dispatch( 'core/block-editor' )
						.selectBlock( ( first( willSelectBlock ) || {} ).clientId )
						.then( dispatchResolver( () => resolve( $body.find( `.wp-block[data-block="${ ( first( willSelectBlock ) || {} ).clientId }"]` ) ) ) )
				}
			} )
		} )
	} )
}

/**
 * Command for typing in blocks
 *
 * @param {string} subject
 * @param {string} contentSelector
 * @param {string} content
 * @param {string | number | Object} customSelector
 */
export function typeBlock( subject, contentSelector = '', content = '', customSelector = '' ) {
	( contentSelector
		? cy.selectBlock( subject, customSelector ).find( contentSelector )
		: cy.selectBlock( subject, customSelector )
	)
		.first()
		.click( { force: true } )
		.type( `{selectall}${ content }`, { force: true } )

	if ( content[ 0 ] !== '/' ) {
		cy.selectBlock( subject, customSelector )
	}
}

/**
 * Command for deleting a specific block.
 *
 * @param {string} subject
 * @param {string | number | Object} selector
 */
export function deleteBlock( subject, selector ) {
	cy.selectBlock( subject, selector )
		.then( $block => {
			const clientId = $block.data( 'block' )
			cy.wp().then( wp => {
				return new Cypress.Promise( resolve => {
					wp.data.dispatch( 'core/block-editor' ).removeBlock( clientId ).then( dispatchResolver( resolve ) )
				} )
			} )
		} )
}

/**
 * Command for adding inner block using block appender
 *
 * @param {string} blockName
 * @param {string} blockToAdd
 * @param {string | number | Object} customSelector
 */
export function addInnerBlock( blockName = 'ugb/accordion', blockToAdd = 'ugb/accordion', customSelector ) {
	cy.selectBlock( blockName, customSelector )
	cy.wp().then( wp => {
		return new Cypress.Promise( resolve => {
			const selectedBlockClientId = wp.data.select( 'core/block-editor' ).getSelectedBlockClientId()
			const newBlock = wp.blocks.createBlock( blockToAdd, { className: `e2etest-block-${ uniqueId() }` } )
			wp.data.dispatch( 'core/editor' ).insertBlock( newBlock, 0, selectedBlockClientId ).then( dispatchResolver( resolve ) )
		} )
	} )
}
