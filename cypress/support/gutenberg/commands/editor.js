/**
 * External dependencies
 */
import { containsRegExp, dispatchResolver } from '~common/util'

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
Cypress.Commands.add( 'addFeaturedImage', addFeaturedImage )
Cypress.Commands.add( 'addPostExcerpt', addPostExcerpt )

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
	} = options
	let done = false
	cy.wait( initialDelay, { log: false } )

	const check = () => {
		if ( done ) {
			return done
		}

		cy.wait( interval, { log: false } ).then( () => {
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
		return new Cypress.Promise( resolve => {
			wp.data.dispatch( 'core/editor' ).savePost().then( dispatchResolver( resolve ) )
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
		.find( 'textarea.editor-post-title__input' )
		.type( `{selectall}${ title }`, { force: true } )
	cy.savePost()
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
 * Command for adding a featured image to a post.
 */
export function addFeaturedImage() {
	cy.getPostUrls().then( ( { editorUrl } ) => {
		// Save the current post as we're going to register a post.
		cy.savePost()
		// Register one post to be able to add an image to media library.
		cy.registerPosts( { numOfPosts: 1 } )
		cy.visit( editorUrl )
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

		const selector = () => cy
			.get( '.media-modal-content' )

		selector()
			.find( '.media-frame-router' )
			.contains( containsRegExp( 'Media Library' ) )
			.click( { force: true } )

		selector()
			.find( 'ul.attachments li.attachment' )
			.eq( 0 )
			.click( { force: true } )

		selector()
			.find( 'button.media-button-select:contains(Set featured image)' )
			.click( { force: true } )
		cy.savePost()
	} )
}

/**
 * Command for adding an excerpt to a post.
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
