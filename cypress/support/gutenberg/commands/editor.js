/**
 * External dependencies
 */
import {
	containsRegExp, dispatchResolver,
} from '~common/util'
import { setBaseAndExtent } from '../util'
import { isArray } from 'lodash'

// In WordPress 5.9, previewing Gutenberg in tablet/mobile now replaces the
// editor area with an iframe. This produces an error because the Cypress get
// command doesn't include the contents of an iframe.
//
// This overwrites the get command to also include the contents of the iframe.
// If the normal get command fails, we try again within the iframe.
Cypress.Commands.overwrite( 'get', ( originalFn, selector, options ) => {
	// Turn off logging to help speed up tests.
	const newOptions = Object.assign( options || {}, { log: false } )

	if ( selector === 'iframe[name="editor-canvas"]' || selector === 'body' ) {
		return originalFn( selector, newOptions )
	}

	return originalFn( 'body', { log: false } ).then( $body => {
		try {
			if ( $body.find( selector ).length > 0 ) {
				return originalFn( selector, newOptions )
			}
		} catch ( $err ) {
			return originalFn( selector, newOptions )
		}

		if ( $body.find( 'iframe[name="editor-canvas"]' ).length > 0 ) {
			return new Cypress.Promise( resolve => {
				originalFn( 'iframe[name="editor-canvas"]' ).then( $iframe => {
					const body = $iframe[ 0 ].contentDocument.body
					if ( body && body.querySelector( '.block-editor-block-list__layout' ) ) {
						const jQueryObj = Cypress.$( body.querySelector( selector ) )
						resolve( jQueryObj )
					} else {
						setTimeout( () => {
							const body = $iframe[ 0 ].contentDocument.body
							const jQueryObj = Cypress.$( body.querySelector( selector ) )
							resolve( jQueryObj )
						}, 200 )
					}
				} )
			} )
		}

		return originalFn( selector, newOptions )
	} )
} );

// In connection to the above fix, we also need to override the jQuery find
// command since it also doesn't handle iframes. So when the jQuery find command
// looks for an element that doesn't exist, also retry whether it's found inside
// the editor iframe.
( function( $ ) {
	const oldFind = $.fn.find
	$.fn.find = function() {
		const findResults = oldFind.apply( this, arguments )

		if ( ! findResults.length ) {
			const iframe = oldFind.apply( this, [ 'iframe[name="editor-canvas"]' ] )
			if ( iframe.length ) {
				const iframeBody = $( iframe[ 0 ].contentDocument.body )
				return iframeBody.find( arguments[ 0 ] )
			}
		}

		return findResults
	}
}( Cypress.$ ) )

/**
 * Register functions to Cypress Commands.
 */
Cypress.Commands.add( 'newPage', newPage )
Cypress.Commands.add( 'newPost', newPost )
Cypress.Commands.add( 'hideAnyGutenbergTip', hideAnyGutenbergTip )
Cypress.Commands.add( 'getPostUrls', getPostUrls )
Cypress.Commands.add( 'waitUntil', waitUntil )
Cypress.Commands.add( 'waitLoader', waitLoader )
Cypress.Commands.add( 'changePreviewMode', changePreviewMode )
Cypress.Commands.add( 'getPreviewMode', getPreviewMode )
Cypress.Commands.add( 'publish', publish )
Cypress.Commands.add( 'savePost', savePost )
Cypress.Commands.add( 'wp', wp )
Cypress.Commands.add( 'typePostTitle', typePostTitle )
Cypress.Commands.add( 'getPostData', getPostData )
Cypress.Commands.add( 'addPostExcerpt', addPostExcerpt )
Cypress.Commands.add( 'addCategory', addCategory )
Cypress.Commands.add( 'addTags', addTags )
Cypress.Commands.add( 'addPostSlug', addPostSlug )
Cypress.Commands.add( 'editPostDiscussion', editPostDiscussion )
Cypress.Commands.add( 'selectFromMediaLibrary', selectFromMediaLibrary )
Cypress.Commands.add( 'addFeaturedImage', addFeaturedImage )
Cypress.Commands.add( 'setSelection', { prevSubject: true }, setSelection )
Cypress.Commands.add( 'selection', { prevSubject: true }, selection )

/**
 * Command for opening a new page in gutenberg editor.
 */
export function newPage() {
	cy.visit( '/wp-admin/post-new.php?post_type=page' )
	hideAnyGutenbergTip()
}

/**
 * Command for opening a new post in gutenberg editor.
 */
export function newPost() {
	cy.visit( '/wp-admin/post-new.php' )
	hideAnyGutenbergTip()
}

/**
 * Command for closing the gutenberg tip popup.
 */
export function hideAnyGutenbergTip() {
	cy.get( 'body' ).then( $body => {
		if ( $body.find( '.edit-post-welcome-guide' ).length ) {
			cy.get( '.edit-post-welcome-guide button:eq(0)' ).click()
		}
	} )
}

/**
 * Command that returns the original link address and preview address
 */
export function getPostUrls() {
	return cy.wp().then( wp => {
		const postID = wp.data.select( 'core/editor' ).getCurrentPostId()
		const currentPostType = wp.data.select( 'core/editor' ).getCurrentPostType()
		const previewUrl = `/?${ ( new URLSearchParams( { [ currentPostType === 'page' ? 'page_id' : 'p' ]: postID, 'preview': true } ) ).toString() }`
		const editorUrl = `/wp-admin/post.php?${ ( new URLSearchParams( { 'post': postID, 'action': 'edit' } ) ).toString() }`
		return new Cypress.Promise( resolve => {
			resolve( {
				editorUrl, previewUrl, postID,
			} )
		} )
	} )
}

/*
* Command for waiting to resolve anything in cy.window or cy.document.
*/
export function waitUntil( callback = () => true, options = {} ) {
	const {
		initialDelay = 20,
		interval = 300,
		timeout = 60000,
	} = options
	let timer = 0
	const appendTimer = time => {
		timer += time
		if ( timer >= timeout ) {
			throw new Error( '`waitUntil` function timed out.' )
		}
	}
	let done = false
	cy.wait( initialDelay, { log: false } )
	appendTimer( initialDelay )

	const check = () => {
		if ( done ) {
			return done
		}

		cy.wait( interval, { log: false } ).then( () => {
			appendTimer( interval )
			callback( toggle => done = toggle )
			check()
		} )
	}

	return check()
}

/**
 * Command for waiting a spinner button to disappear.
 *
 * @param {string} selector
 * @param {Object} options
 */

export function waitLoader( selector = '', options = {} ) {
	const {
		interval = 100,
		initialDelay = 20,
	} = options
	return cy.waitUntil( done => cy.document().then( doc => {
		done( ! doc.querySelector( selector ) )
	} ), { interval, initialDelay } )
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
 * Command that returns the current editor's preview mode.
 *
 */
export function getPreviewMode() {
	return cy.wp().then( wp => {
		return new Cypress.Promise( resolve => {
			const previewMode = wp.data.select( 'core/edit-post' ).__experimentalGetPreviewDeviceType
				?	wp.data.select( 'core/edit-post' ).__experimentalGetPreviewDeviceType()
				: 'Desktop'
			resolve( previewMode )
		} )
	} )
}

/**
 * Command for saving a page or post.
 */
export function savePost() {
	cy.wp().then( wp => {
		wp.data.dispatch( 'core/editor' ).savePost()
		cy.waitUntil( done => done( Cypress.$( '.components-snackbar__content:contains(Page Updated)' ) ) )
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
					if ( $actions.find( '.editor-post-publish-panel:contains(Publish)' ).length ) {
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

					cy.waitLoader( '.editor-post-publish-button.is-busy', { initialDelay: 500 } )
				} )
		} )
}

/**
 * Command for getting the gutenberg `wp` object.
 */
export function wp() {
	cy.wait( 1 )
	return cy.window().then( win => win.wp )
}

/**
 * Command for typing into the post title in the editor.
 *
 * @param {string} title
 */
export function typePostTitle( title ) {
	cy
		.get( '.edit-post-visual-editor__post-title-wrapper' )
		.find( 'textarea.editor-post-title__input, .editor-post-title__input' ) // In WP 5.9, it's no longer a textarea.
		.type( `{selectall}${ title }`, { force: true } )
	cy.publish()
}

/**
 * Command that returns the current post's data
 */
export function getPostData() {
	cy.wp().then( wp => {
		return new Cypress.Promise( resolve => {
			const data = wp.data.select( 'core/editor' ).getCurrentPost()
			resolve( data )
		} )
	} )
}

/**
 * Command for adding an excerpt to the current post.
 *
 * @param {string} text
 */
export function addPostExcerpt( text ) {
	cy.openSidebar( 'Settings' )
	cy
		.get( '.edit-post-sidebar__panel-tabs' )
		.find( 'li:first-child button.edit-post-sidebar__panel-tab' )
		.click( { force: true } )
	cy.collapse( 'Excerpt' )
	cy
		.get( '.editor-post-excerpt textarea.components-textarea-control__input' )
		.type( `{selectall}${ text }`, { force: true } )
	cy.savePost()
}

/**
 * Command for adding category to a post.
 *
 * @param {string} category
 */
export function addCategory( category ) {
	cy.openSidebar( 'Settings' )
	cy
		.get( '.edit-post-sidebar__panel-tabs' )
		.find( 'li:first-child button.edit-post-sidebar__panel-tab' )
		.click( { force: true } )
	cy.collapse( 'Categories' )
	cy
		.get( '.components-panel__body:contains(Categories)' )
		.contains( containsRegExp( 'Add New Category' ) )
		.click( { force: true } )
	cy.get( 'input.editor-post-taxonomies__hierarchical-terms-input' )
		.click( { force: true } )
		.type( category, { force: true } )
	cy.get( 'button.editor-post-taxonomies__hierarchical-terms-submit' )
		.click( { force: true } )
}

/**
 * Command for adding tags to a post.
 *
 * @param {Array | string} tags
 */
export function addTags( tags ) {
	cy.openSidebar( 'Settings' )
	cy
		.get( '.edit-post-sidebar__panel-tabs' )
		.find( 'li:first-child button.edit-post-sidebar__panel-tab' )
		.click( { force: true } )
	cy.collapse( 'Tags' )

	const selectTheTokenField = () => cy
		.get( '.components-panel__body:contains(Tags)' )
		.find( '.components-form-token-field:contains(Add New Tag)' )
		.find( 'input.components-form-token-field__input' )
		.click( { force: true } )

	if ( isArray( tags ) ) {
		tags.forEach( tag => {
			selectTheTokenField()
				.type( `${ tag },`, { force: true } )
		} )
	} else if ( typeof tags === 'string' ) {
		selectTheTokenField()
			.type( tags, { force: true } )
	}
}

/**
 * Command for adding a slug to a post
 *
 * @param {string} slug
 */
export function addPostSlug( slug ) {
	cy.publish()
	cy.reload()
	cy.openSidebar( 'Settings' )
	cy
		.get( '.edit-post-sidebar__panel-tabs' )
		.find( 'li:first-child button.edit-post-sidebar__panel-tab' )
		.click( { force: true } )
	cy.collapse( 'Permalink' )
	cy
		.get( '.components-base-control:contains(URL Slug)' )
		.find( 'input[class="components-text-control__input"]' )
		.type( `{selectall}${ slug }`, { force: true } )
	cy.publish()
}

/**
 * Command for editing the discussion settings of the current post.
 *
 * @param {Object} options
 */
export function editPostDiscussion( options ) {
	cy.openSidebar( 'Settings' )
	cy
		.get( '.edit-post-sidebar__panel-tabs' )
		.find( 'li:first-child button.edit-post-sidebar__panel-tab' )
		.click( { force: true } )
	cy.collapse( 'Discussion' )

	const selector = name => cy
		.get( '.components-panel__body:contains(Discussion)' )
		.find( `.components-base-control__field:contains(${ name })` )

	Object.keys( options ).forEach( optionName => {
		const optionValue = options[ optionName ]

		selector( optionName )
			.then( $control => {
				const isChecked = !! $control.find( 'svg.components-checkbox-control__checked' ).length
				if ( isChecked !== optionValue ) {
					selector( optionName )
						.find( 'input.components-checkbox-control__input' )
						.click( { force: true } )
				}
			} )
	} )
	cy.savePost()
}

/**
 * Command for selecting an image in the media library
 *
 * @param {number} image
 */
export function selectFromMediaLibrary( image = 1 ) {
	const selector = () => cy
		.get( '.media-modal-content' )

	selector()
		.find( '.media-frame-router' )
		.contains( containsRegExp( 'Media Library' ) )
		.click( { force: true } )

	selector()
		.find( 'ul.attachments li.attachment' )
		.eq( image - 1 )
		.click( { force: true } )

	selector()
		.find( 'button.media-button-select:contains(Set featured image), button.media-button-select:contains(Select)' )
		.click( { force: true } )
}

/**
 * Command for adding a featured image to a post.
 */
export function addFeaturedImage() {
	cy.openSidebar( 'Settings' )
	cy
		.get( '.edit-post-sidebar__panel-tabs' )
		.find( 'li:first-child button.edit-post-sidebar__panel-tab' )
		.click( { force: true } )
	cy.collapse( 'Featured image' )
	cy
		.get( '.editor-post-featured-image' )
		.contains( containsRegExp( 'Set featured image' ) )
		.click( { force: true } )

	cy.selectFromMediaLibrary( 1 )
	cy.savePost()
}

/**
 * Selects a specific part of a text
 *
 * Usage
 * ```
 * // Types "My new text" and selects "new"
 * cy.get( '.wp-block-paragraph' )
 * .type( 'My new text' )
 * .setSelection('new')
 *
 * ```
 *
 * @param {*} subject
 * @param {string} query
 * @param {string} endQuery
 */
export function setSelection( subject, query, endQuery = '' ) {
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
}

/**
 * Command used by `setSelection` to trigger the selecting of text.
 *
 * @param {*} subject
 * @param {Function} fn
 */
export function selection( subject, fn = () => {} ) {
	cy.wrap( subject )
		.trigger( 'mousedown' )
		.then( fn )
		.trigger( 'mouseup' )

	cy.document().trigger( 'selectionchange' )
	return cy.wrap( subject )
}
