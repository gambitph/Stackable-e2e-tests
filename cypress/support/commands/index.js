/**
 * Overwrite Cypress Commands
 */
Cypress.Commands.overwrite( 'get', modifyLogFunc() )
Cypress.Commands.overwrite( 'click', modifyLogFunc() )
Cypress.Commands.overwrite( 'type', modifyLogFunc() )
Cypress.Commands.overwrite( 'visit', modifyLogFunc() )
Cypress.Commands.overwrite( 'reload', modifyLogFunc() )
Cypress.Commands.overwrite( 'document', modifyLogFunc() )
Cypress.Commands.overwrite( 'window', modifyLogFunc() )
Cypress.Commands.overwrite( 'trigger', modifyLogFunc() )
Cypress.Commands.overwrite( 'parent', modifyLogFunc() )
Cypress.Commands.overwrite( 'parentsUntil', modifyLogFunc() )
Cypress.Commands.overwrite( 'invoke', modifyLogFunc( { position: 'first' } ) )
Cypress.Commands.overwrite( 'eq', modifyLogFunc() )
Cypress.Commands.overwrite( 'first', modifyLogFunc() )
Cypress.Commands.overwrite( 'wait', modifyLogFunc() )
Cypress.Commands.overwrite( 'contains', modifyLogFunc() )
Cypress.Commands.overwrite( 'last', modifyLogFunc() )
Cypress.Commands.overwrite( 'wrap', modifyLogFunc( { argumentLength: 2 } ) )

/**
 * Register functions to Cypress Commands.
 */
Cypress.Commands.add( 'addBlock', addBlock )
Cypress.Commands.add( 'selectBlock', selectBlock )
Cypress.Commands.add( 'typeBlock', typeBlock )
Cypress.Commands.add( 'changePreviewMode', changePreviewMode )
Cypress.Commands.add( 'deleteBlock', deleteBlock )
Cypress.Commands.add( 'publish', publish )
Cypress.Commands.add( 'addInnerBlock', addInnerBlock )
Cypress.Commands.add( 'wp', wp )

import './styles'
import './global-settings'
import './setup'
import './inspector'
import './attributes'

/**
 * Internal dependencies
 */
import {
	containsRegExp, getBlocksRecursive, dispatchResolver, modifyLogFunc,
} from '../util'
import { last, first } from 'lodash'

/**
 * Command for adding a specific block in the inserter button.
 *
 * @param {string} blockName
 */
export function addBlock( blockName = 'ugb/accordion' ) {
	cy.wp().then( wp => {
		return new Cypress.Promise( resolve => {
			const block = wp.blocks.createBlock( blockName )
			wp.data.dispatch( 'core/editor' ).insertBlock( block )
				.then( dispatchResolver( () => resolve( last( wp.data.select( 'core/block-editor' ).getBlocks() ) ) ) )
		} )
	} )
}

/**
 * Command for selecting a specific block.
 *
 * @param {string} subject
 * @param {*} selector
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
 * @param {string} customSelector
 */
export function typeBlock( subject, contentSelector = '', content = '', customSelector = '' ) {
	( contentSelector
		? cy.selectBlock( subject, customSelector ).find( contentSelector )
		: cy.selectBlock( subject, customSelector )
	)
		.click( { force: true } )
		.type( `{selectall}${ content }`, { force: true } )
		.then( $element => {
			return expect( $element ).to.contain( content )
		} )

	if ( content[ 0 ] !== '/' ) {
		cy.selectBlock( subject, customSelector )
	}
}

/**
 * Command for changing the preview mode.
 *
 * @param {string} mode
 */
export function changePreviewMode( mode = 'Desktop' ) {
	return cy.wp().then( wp => {
		return new Cypress.Promise( ( resolve, reject ) => {
			const { __experimentalSetPreviewDeviceType } = wp.data.dispatch( 'core/edit-post' )
			const { __experimentalGetPreviewDeviceType } = wp.data.select( 'core/edit-post' )
			if ( __experimentalSetPreviewDeviceType && __experimentalGetPreviewDeviceType ) {
				if ( __experimentalGetPreviewDeviceType() !== mode ) {
					__experimentalSetPreviewDeviceType( mode )
						.then( dispatchResolver( resolve ) )
						.catch( reject )
				} else {
					resolve( null )
				}
			} else {
				// Handle WP 5.4 preview mode.
				// TODO: Handle WP 5.4 editor
				dispatchResolver( resolve )()
			}
		} )
	} )
}

/**
 * Command for deleting a specific block.
 *
 * @param {*} subject
 * @param {string} selector
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
 * Command for publishing a page.
 */
export function publish() {
	const selector = () => cy
		.get( 'button.editor-post-publish-button__button' )

	selector()
		.invoke( 'attr', 'aria-disabled' )
		.then( ariaDisabled => {
			if ( ariaDisabled === 'false' ) {
				selector()
					.click( { force: true } )
			}

			cy
				.get( '.interface-interface-skeleton__actions' )
				.then( $actions => {
					// Click the publish button in publish panel
					// when necessary.
					if ( $actions.find( '.editor-post-publish-panel' ).length ) {
						cy
							.get( '.editor-post-publish-panel' )
							.contains( containsRegExp( 'Publish' ) )
							.click( { force: true } )

						if ( $actions.find( 'button[aria-label="Close panel"]' ).length ) {
							cy
								.get( 'button[aria-label="Close panel"]' )
								.click( { force: true } )
						}
					}

					cy.waitLoader( '.editor-post-publish-button.is-busy' )
				} )
		} )
}

/**
 * Command for adding inner block using block appender
 *
 * @param {string} blockName
 * @param {string} blockToAdd
 * @param {string} customSelector
 */
export function addInnerBlock( blockName = 'ugb/accordion', blockToAdd = 'ugb/accordion', customSelector ) {
	cy.selectBlock( blockName, customSelector )
	cy.wp().then( wp => {
		return new Cypress.Promise( resolve => {
			const selectedBlockClientId = wp.data.select( 'core/block-editor' ).getSelectedBlockClientId()
			const newBlock = wp.blocks.createBlock( blockToAdd )
			wp.data.dispatch( 'core/editor' ).insertBlock( newBlock, 0, selectedBlockClientId ).then( dispatchResolver( resolve ) )
		} )
	} )
}

/*
* Command for getting the gutenberg `wp` object.
*
*/
export function wp() {
	cy.wait( 1 )
	return cy.window().then( win => win.wp )
}

