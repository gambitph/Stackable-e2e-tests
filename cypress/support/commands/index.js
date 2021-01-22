import './styles'
import './global-settings'
import './setup'
import './inspector'

/**
 * Internal dependencies
 */
import {
	containsRegExp, waitLoader,
} from '../util'

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

/**
 * Command for clicking the block inserter button
 */
export function toggleBlockInserterButton() {
	// Click the adder button located at the upper left part of the screen.
	cy.get( '.edit-post-header-toolbar__inserter-toggle' ).click( { force: true } )
}

/**
 * Command for adding a specific block in the inserter button.
 *
 * @param {string} blockname
 */
export function addBlock( blockname = 'ugb/accordion' ) {
	toggleBlockInserterButton()
	const [ plugin, block ] = blockname.split( '/' )
	if ( plugin === 'core' ) {
		// core blocks have different selector buttons.
		cy.get( `.block-editor-block-types-list>.block-editor-block-types-list__list-item>.editor-block-list-item-${ block }:first` ).click( { force: true } )
	} else {
		cy.get( `.block-editor-block-types-list>.block-editor-block-types-list__list-item>.editor-block-list-item-${ plugin }-${ block }:first` ).click( { force: true } )
	}
	return cy.get( `[data-type="${ blockname }"]` ).last()
}

/**
 * Command for selecting a specific block.
 *
 * @param {*} subject
 * @param {string} selector
 */
export function selectBlock( subject, selector ) {
	if ( selector && typeof selector === 'number' ) {
		// Select a specific block based on nth position (base zero).
		return cy.get( `.block-editor-block-list__layout>[data-type="${ subject }"]` ).eq( selector ).click( { force: true } )
	} else if ( selector && typeof selector === 'string' ) {
		// Select a selector based on text input inside
		return cy.get( `.block-editor-block-list__layout>[data-type="${ subject }"]` ).contains( containsRegExp( selector ) ).click( { force: true } )
	}
	// Otherwise, just select the last matched block.
	return cy.get( `.block-editor-block-list__layout>[data-type="${ subject }"]` ).last().click( { force: true } )
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
	const block = selectBlock( subject, customSelector )
	if ( contentSelector ) {
		block
			.find( contentSelector )
			.click( { force: true } )
			.type( `{selectall}${ content }`, { force: true } )
			.then( $element => {
				expect( $element ).to.contain( content )
			} )
	} else {
		block
			.click( { force: true } )
			.type( `{selectall}${ content }`, { force: true } )
			.then( $element => {
				if ( content[ 0 ] !== '/' ) {
					expect( $element ).to.contain( content )
				}
			} )
	}
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
	cy
		.get( 'button' )
		.contains( containsRegExp( 'Preview' ) )
		.invoke( 'attr', 'aria-expanded' )
		.then( $ariaExpanded => {
			if ( $ariaExpanded === 'false' ) {
				cy
					.get( 'button' )
					.contains( containsRegExp( 'Preview' ) )
					.click( { force: true } )
			}

			cy
				.get( 'button.block-editor-post-preview__button-resize' )
				.contains( containsRegExp( mode ) )
				.click( { force: true } )
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
 * Command for scrolling the editor panel to
 * a specific selector.
 *
 * @param {string} selector
 */
export function scrollEditorToView( selector ) {
	cy.document().then( doc => {
		const selectedEl = doc.querySelector( selector )
		if ( selectedEl ) {
			const { y } = selectedEl.getBoundingClientRect()
			if ( y ) {
				cy.get( '.interface-interface-skeleton__content' ).scrollTo( 0, y )
			}
		}
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
					//
					/**
					 * Click the publish button in publish panel
					 * when necessary.
					 */
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
 * @param {string} selector
 * @param {number} index
 * @param {string} keyword
 * @param {string} icon
 */
export function changeIcon( selector, index = 1, keyword = '', icon ) {
	selectBlock( 'ugb/icon', selector )
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
	waitLoader( '.ugb-icon-popover__iconlist>span.components-spinner' )

	if ( icon ) {
		cy
			.get( `.ugb-icon-popover__iconlist>button.${ icon }` )
			.first()
			.click( { force: true } )
	} else {
		cy
			.get( `.ugb-icon-popover__iconlist>button` )
			.first()
			.click( { force: true } )
	}
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
