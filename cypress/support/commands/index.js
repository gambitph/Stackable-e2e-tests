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
Cypress.Commands.overwrite( 'invoke', modifyLogFunc( 'first' ) )
Cypress.Commands.overwrite( 'eq', modifyLogFunc() )
Cypress.Commands.overwrite( 'first', modifyLogFunc() )
Cypress.Commands.overwrite( 'wait', modifyLogFunc() )
Cypress.Commands.overwrite( 'contains', modifyLogFunc() )
Cypress.Commands.overwrite( 'last', modifyLogFunc() )

/**
 * Register functions to Cypress Commands.
 */
Cypress.Commands.add( 'addBlock', addBlock )
Cypress.Commands.add( 'selectBlock', selectBlock )
Cypress.Commands.add( 'typeBlock', typeBlock )
Cypress.Commands.add( 'changePreviewMode', changePreviewMode )
Cypress.Commands.add( 'deleteBlock', deleteBlock )
Cypress.Commands.add( 'publish', publish )
Cypress.Commands.add( 'changeIcon', changeIcon )
Cypress.Commands.add( 'assertPluginError', assertPluginError )
Cypress.Commands.add( 'appendBlock', appendBlock )
Cypress.Commands.add( 'assertBlockError', assertBlockError )
Cypress.Commands.add( 'addInnerBlock', addInnerBlock )

import './styles'
import './global-settings'
import './setup'
import './inspector'
import './attributes'

/**
 * Internal dependencies
 */
import {
	containsRegExp, waitLoader,
} from '../util'
import { last, first } from 'lodash'

/**
 * Function for overwriting log argument.
 *
 * @param {string} position
 */
function modifyLogFunc( position = 'last' ) {
	return function( originalFn, ...args ) {
		const firstOrLast = position === 'last' ? last : first
		if ( typeof firstOrLast( args ) === 'object' && ! Array.isArray( firstOrLast( args ) ) ) {
			const options = args[ position === 'last' ? 'pop' : 'shift' ]()
			options.log = Cypress.env( 'DEBUG' ) === 'true'
			return position === 'last' ? originalFn( ...args, options ) : originalFn( options, ...args )
		}
		return position === 'last'
			? 			originalFn( ...args, { log: Cypress.env( 'DEBUG' ) === 'true' } )
			: 			originalFn( { log: Cypress.env( 'DEBUG' ) === 'true' }, ...args )
	}
}

/**
 * Command for adding a specific block in the inserter button.
 *
 * @param {string} blockname
 */
export function addBlock( blockname = 'ugb/accordion' ) {
	const [ plugin, block ] = blockname.split( '/' )
	// Click the adder button located at the upper left part of the screen.
	cy.get( '.edit-post-header-toolbar__inserter-toggle' ).click( { force: true } )
	// core blocks have different selector buttons.
	cy.get( `.block-editor-block-types-list>.block-editor-block-types-list__list-item>.editor-block-list-item-${ plugin !== 'core' ? `${ plugin }-` : '' }${ block }:first` ).click( { force: true } )
}

/**
 * Command for selecting a specific block.
 *
 * @param {*} subject
 * @param {string} selector
 */
export function selectBlock( subject, selector ) {
// Initialize chained command based on selector type.
	if ( selector === '' ) {
		selector = undefined
	}

	const chainedCommand = {
		number: { func: 'eq', arg: [ selector ] },
		string: { func: 'contains', arg: [ containsRegExp( selector ) ] },
	}

	const _selector = () => {
		const initialSelector = cy.get( `.block-editor-block-list__layout>[data-type="${ subject }"]` )
			[ ( chainedCommand[ typeof selector ] || {} ).func || 'last' ]( ...( ( chainedCommand[ typeof selector ] || {} ).arg || [] ) )
		if ( typeof selector === 'string' ) {
			return initialSelector.parentsUntil( `.block-editor-block-list__layout>[data-type="${ subject }"]` ).parent()
		}
		return initialSelector
	}

	_selector()
		.invoke( 'attr', 'data-block' )
		.then( dataBlock => {
			cy.window().then( win => {
				if ( win.wp.data.select( 'core/block-editor' ).getSelectedBlockClientId() !== dataBlock ) {
					win.wp.data.dispatch( 'core/block-editor' ).selectBlock( dataBlock )
					cy.wait( 100 )
				}
			} )
		} )

	return _selector()
}

/**
 * Command for typing in blocks
 *
 * @param {*} subject
 * @param {string} contentSelector
 * @param {string} content
 * @param {string} customSelector
 */
export function typeBlock( subject, contentSelector = '', content = '', customSelector = '' ) {
	( contentSelector
		? 		selectBlock( subject, customSelector ).find( contentSelector )
		: 		selectBlock( subject, customSelector )
	)
		.click( { force: true } )
		.type( `{selectall}${ content }`, { force: true } )
		.then( $element => {
			return expect( $element ).to.contain( content )
		} )

	if ( content[ 0 ] !== '/' ) {
		selectBlock( subject, customSelector )
	}
}

/**
 * Command for changing the preview mode.
 *
 * @param {string} mode
 */
export function changePreviewMode( mode = 'Desktop' ) {
	cy.window( { log: false } ).then( win => {
		const { __experimentalSetPreviewDeviceType } = win.wp.data.dispatch( 'core/edit-post' )
		const { __experimentalGetPreviewDeviceType } = win.wp.data.select( 'core/edit-post' )
		if ( __experimentalSetPreviewDeviceType && __experimentalGetPreviewDeviceType ) {
			if ( __experimentalGetPreviewDeviceType() !== mode ) {
				__experimentalSetPreviewDeviceType( mode )
				cy.wait( 100 )
			}
		} else {
			// Handle WP 5.4 preview mode.
			// TODO: Handle WP 5.4 editor
		}
	} )
}

/**
 * Command for deleting a specific block.
 *
 * @param {*} subject
 * @param {string} selector
 */
export function deleteBlock( subject, selector ) {
	selectBlock( subject, selector )
	cy.get( 'button[aria-label="More options"]' ).first().click( { force: true } )
	cy.get( 'button' ).contains( 'Remove block' ).click( { force: true } )
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

					waitLoader( '.editor-post-publish-button.is-busy' )
				} )
		} )
}

/**
 * Command for changing the icon in icon block.
 *
 * @param {string} subject
 * @param {string} selector
 * @param {number} index
 * @param {string} keyword
 * @param {string} icon
 */
export function changeIcon( subject, selector, index = 1, keyword = '', icon ) {
	cy
		.get( '.block-editor-block-list__block.is-selected' )
		.find( '.ugb-svg-icon-placeholder__button' )
		.eq( index - 1 )
		.click( { force: true } )

	cy
		.get( 'input[placeholder="Type to search icon"]' )
		.click( { force: true } )
		.type( keyword )

	// Wait until the loader disappears.
	cy.wait( 1000 )
	waitLoader( '.ugb-icon-popover__iconlist>span.components-spinner' )

	cy
		.get( `.ugb-icon-popover__iconlist>button${ icon ? `.${ icon }` : '' }` )
		.first()
		.click( { force: true } )
}

/**
 * Command for asserting an error due to
 * plugin activation.
 */
export function assertPluginError() {
	cy.get( '.xdebug-error' ).should( 'not.exist' )
}

/**
 * Command for appending inner block using block appender
 *
 * @param {string} blockName
 * @param {string} parentSelector
 */
export function appendBlock( blockName = 'ugb/accordion', parentSelector ) {
	cy
		.get( `${ parentSelector ? `${ parentSelector } ` : '' }button.block-editor-button-block-appender` )
		.first()
		.click( { force: true } )

	cy
		.get( 'button' )
		.contains( 'Browse all' )
		.click( { force: true } )

	cy
		.get( `button.editor-block-list-item-${ blockName.replace( '/', '-' ) }:first` )
		.click( { force: true } )

	cy.deleteBlock( blockName )
}

/**
 * Command for adding inner block using block appender
 *
 * @param {string} blockName
 * @param {string} parentSelector
 */
export function addInnerBlock( blockName = 'ugb/accordion', parentSelector ) {
	cy
		.get( `${ parentSelector ? `${ parentSelector } ` : '' }button.block-editor-button-block-appender` )
		.first()
		.click( { force: true } )

	cy
		.get( 'button' )
		.contains( 'Browse all' )
		.click( { force: true } )

	cy
		.get( `button.editor-block-list-item-${ blockName.replace( '/', '-' ) }:first` )
		.click( { force: true } )
}

/**
 * Command for asserting block error.
 */
export function assertBlockError() {
	cy.get( '.block-editor-warning' ).should( 'not.exist' )
}
