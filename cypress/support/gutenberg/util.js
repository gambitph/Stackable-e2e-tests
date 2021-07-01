import {
	last, startCase, toPairs,
} from 'lodash'

// Temporary overwrite fix @see stackable/util.js
/**
 * Function for overwriting assertions
 * Stackable command for selecting the block, current tab and panel.
 *
 * @param {Object} options
 */
export function withInspectorTabMemory( options = {} ) {
	const {
		argumentLength = 1,
	} = options

	return function( originalFn, ...args ) {
		cy.wp().then( wp => {
			const subject = args[ 0 ]
			const blockName = wp.data.select( 'core/block-editor' ).getBlock( subject.data( 'block' ) ).name
			const blockPlugin = blockName.split( '/' )[ 0 ]

			if ( ! Array( 'ugb', 'stk' ).includes( blockPlugin ) ) {
				return originalFn( ...args )
			}

			cy.getActiveTab().then( tab => {
				cy.document().then( doc => {
					const optionsToPass = args.length === argumentLength ? args.pop() : {}
					const activePanel = doc.querySelector( 'button.components-panel__body-toggle[aria-expanded="true"]' ).innerText
					// This is for stackable only.
					// After asserting the frontend, go back to the previous state.

					if ( ( args.length === argumentLength &&
							( last( args ).assertFrontend === undefined ||
							last( args ).assertFrontend ) ) || args.length === ( argumentLength - 1 ) ) {
						optionsToPass.afterFrontendAssert = () => {
							cy.openSidebar( 'Settings' )
							cy.get( `button[aria-label="${ startCase( tab ) } Tab"]` ).click( { force: true } )
							cy.collapse( activePanel )
						}
					}
					return originalFn( ...args, optionsToPass )
				} )
			} )
		} )
	}
}

/**
 * Create a DOM Element based on HTML string
 *
 * @param {string} htmlString
 *
 * @return {*} DOM Element
 */
export function createElementFromHTMLString( htmlString ) {
	const parentElement = document.createElement( 'div' )
	parentElement.innerHTML = htmlString

	return parentElement.firstElementChild
}

/**
 * Function for returning a stringified path location of the block from
 * `wp.data.select('core/block-editor').getBlocks()` by clientId
 *
 * e.g. [0].innerBlocks[2]
 *
 * @param {Array} blocks
 * @param {string} clientId
 *
 * @return {string} stringified path
 */
export function getBlockStringPath( blocks = [], clientId = '' ) {
	const paths = []
	let found = false

	function getBlockStringPathRecursive( _blocks, clientId ) {
		_blocks.forEach( ( _block, index ) => {
			if ( ! found ) {
				paths.push( `[${ index }]` )
				if ( _block.clientId === clientId ) {
					found = true
				}
			}
			if ( ! found && _block.innerBlocks.length ) {
				paths.push( '.innerBlocks' )
				getBlockStringPathRecursive( _block.innerBlocks, clientId )
				if ( ! found ) {
					paths.pop()
				}
			}
			if ( ! found ) {
				paths.pop()
			}
		} )
	}

	getBlockStringPathRecursive( blocks, clientId )
	return paths.join( '' )
}

/**
 * Function for removing transitions from CSS globally
 */
export function removeGlobalCssTransitions() {
	const styles = {
		'.editor-styles-wrapper .wp-block, .editor-styles-wrapper .wp-block *': {
			'-webkit-transition': 'none !important',
			'-moz-transition': 'none !important',
			'-o-transition': 'none !important',
			'transition': 'none !important',
			'transition-duration': '0s !important',
			'-o-transition-property': 'none !important',
			'-moz-transition-property': 'none !important',
			'-ms-transition-property': 'none !important',
			'-webkit-transition-property': 'none !important',
			'transition-property': 'none !important',
			'-webkit-animation': 'none !important',
			'-moz-animation': 'none !important',
			'-o-animation': 'none !important',
			'-ms-animation': 'none !important',
			'animation': 'none !important',
		},
		'.notransition': {
			'-webkit-transition': 'none !important',
			'-moz-transition': 'none !important',
			'-o-transition': 'none !important',
			'transition': 'none !important',
			'transition-duration': '0s !important',
			'-o-transition-property': 'none !important',
			'-moz-transition-property': 'none !important',
			'-ms-transition-property': 'none !important',
			'-webkit-transition-property': 'none !important',
			'transition-property': 'none !important',
			'-webkit-animation': 'none !important',
			'-moz-animation': 'none !important',
			'-o-animation': 'none !important',
			'-ms-animation': 'none !important',
			'animation': 'none !important',
		},
	}

	const styleText = toPairs( styles )
		.map( ( [ selector, cssRule ] ) =>
			`${ selector } { ${ toPairs( cssRule )
				.map( ( [ key, value ] ) => `${ key } : ${ value };` )
				.join( ' ' ) } }` )
		.join( ' ' )

	Cypress.$( 'body' ).prepend( `<style id="e2e-test-inline-styles">${ styleText }</style>` )
}
