/**
 * External dependencies
 */
import { containsRegExp, dispatchResolver } from '~common/util'

/**
 * Register functions to Cypress Commands.
 */
Cypress.Commands.add( 'newPage', newPage )
Cypress.Commands.add( 'hideAnyGutenbergTip', hideAnyGutenbergTip )
Cypress.Commands.add( 'getPostUrls', getPostUrls )
Cypress.Commands.add( 'waitUntil', waitUntil )
Cypress.Commands.add( 'waitLoader', waitLoader )
Cypress.Commands.add( 'changePreviewMode', changePreviewMode )
Cypress.Commands.add( 'getPreviewMode', getPreviewMode )
Cypress.Commands.add( 'publish', publish )
Cypress.Commands.add( 'savePost', savePost )
Cypress.Commands.add( 'wp', wp )

/**
 * Command for opening a new page in gutenberg editor.
 */
export function newPage() {
	cy.visit( '/wp-admin/post-new.php?post_type=page' )
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
		const previewUrl = `/?${ ( new URLSearchParams( { 'page_id': postID, 'preview': true } ) ).toString() }`
		const editorUrl = `/post.php?${ ( new URLSearchParams( { 'post': postID, 'action': 'edit' } ) ).toString() }`
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
 * Stackable Command for waiting a spinner button to disappear.
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

					cy.waitLoader( '.editor-post-publish-button.is-busy', { initialDelay: 500 } )
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

