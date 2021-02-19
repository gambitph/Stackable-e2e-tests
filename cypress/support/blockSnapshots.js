/**
 * `wp.blocks.getBlockContent` can be used to generate
 * save block HTML content. With this, we can overwrite
 *`getComputedStyle` to stub all generated HTML contents and
 * CSS objects for future assertions.
 */

/**
 * Internal dependencies
 */
import { createElementFromHTMLString, parseClassList } from './util'
import { _assertComputedStyle } from './commands/styles'
import config from '../../cypress.json'

/**
 * External dependencies
 */
import {
	first, keys, last,
} from 'lodash'

class BlockSnapshots {
	constructor() {
		// Set Cypress Alias
		this.alias = null
	}

	/**
	 * Asynchronously initialize contentSnapshots and stubbedStyles
	 * using Cypress alias.
	 *
	 * @param {string} alias
	 * @see https://docs.cypress.io/guides/core-concepts/variables-and-aliases.html
	 */
	registerAlias( alias ) {
		this.alias = alias
		cy.wrap( [] ).as( `${ alias }.contentSnapshots` )
		cy.wrap( [] ).as( `${ alias }.stubbedStyles` )
	}

	/**
	 * Asynchronously stub the current block snapshot and save its
	 * stringified HTML content using `wp.blocks.getBlockContent`.
	 */
	createContentSnapshot() {
		const self = this
		cy.wp().then( wp => {
			cy.get( `@${ self.alias }` ).then( _block => {
				const block = wp.data.select( 'core/block-editor' ).getBlock( _block.clientId )
				const blockContent = wp.blocks.getBlockContent( block )
				cy.get( `@${ self.alias }.contentSnapshots` ).then( $snapShots => {
					cy.wrap( [ ...$snapShots, blockContent ] ).as( `${ self.alias }.contentSnapshots` )
				} )
			} )
		} )
	}

	/**
	 * Asynchronously stub the current cssObject.
	 *
	 * @param {Object} style
	 * @param {string} viewport
	 */
	stubStyles( style, viewport ) {
		const self = this
		cy.get( `@${ self.alias }.stubbedStyles` ).then( $stubbedStyles => {
			$stubbedStyles.push( { style, viewport } )
			cy.wrap( $stubbedStyles ).as( `${ self.alias }.stubbedStyles` ).then( () => {
			} )
		} )
	}

	/**
	 * Enqueue all stubbed html content to the frontend.
	 * Individually assert its computed style.
	 */
	assertFrontendStyles() {
		const self = this
		cy.get( `@${ self.alias }.stubbedStyles` ).then( $stubbedStyles => {
			cy.get( `@${ self.alias }.contentSnapshots` ).then( $contentSnapshots => {
				// Combine all stubbed styles and content snapshots into one array.
				const combinedStubbed = $contentSnapshots.map( ( htmlContent, index ) => {
					return {
						htmlContent,
						viewport: $stubbedStyles[ index ].viewport,
						style: $stubbedStyles[ index ].style,
					}
				} )

				cy.publish()
				cy.getPostUrls().then( ( { previewUrl } ) => {
					cy.visit( previewUrl )
					combinedStubbed.forEach( combinedStubbedContent => {
						cy.document().then( doc => {
							const {
								viewport, htmlContent, style,
							} = combinedStubbedContent

							// Create a DOMElement based on the HTML string.
							const blockElement = createElementFromHTMLString( htmlContent )
							// Get the class selector.
							const classList = parseClassList( Array.from( blockElement.classList ).join( ' ' ) )
							// Remove all blocks inside .entry-content.
							doc.querySelector( '.entry-content' ).innerHTML = ''

							// Change the viewport.
							if ( viewport !== 'Desktop' ) {
								cy.viewport( config[ `viewport${ viewport }Width` ] || config.viewportWidth, config.viewportHeight )
							}

							// Append the stubbed block in .entry-content
							doc.querySelector( '.entry-content' ).appendChild( blockElement )

							keys( style ).forEach( _selector => {
								const selector = _selector.split( ':' )
								const selectorWithSpace = first( selector ).split( ' ' )
								const [ , ...restOfTheSelectors ] = [ ...selectorWithSpace ]

								const documentSelector = `${ classList }${ first( selectorWithSpace ).match( /\./ )
									?	( classList.match( first( selectorWithSpace ) )
										? ` ${ restOfTheSelectors.join( ' ' ) }`
										: ` ${ first( selector ) }` )
									: ` ${ first( selector ) }` }`.trim()

								// Assert computed style.
								_assertComputedStyle(
									documentSelector,
									selector.length && last( selector ),
									style[ _selector ],
									'Frontend',
									viewport )
							} )

							// Revert the viewport
							cy.viewport( config.viewportWidth, config.viewportHeight )
						} )
					} )
				} )
			} )
		} )
	}
}

/**
 * Function used to register block snapshots in
 * block tests. It also overwrites assertion commands.
 *
 * @param {string} alias
 */
export const registerBlockSnapshots = alias => {
	const blockSnapshots = new BlockSnapshots()
	blockSnapshots.registerAlias( alias )

	const overwriteAssertionCommand = ( name, argCount ) => {
		Cypress.Commands.overwrite( name, ( originalFn, ...args ) => {
			if ( args.length === argCount ) {
				const options = args.pop()
				options.blockSnapshots = blockSnapshots
				return originalFn( ...[ ...args, options ] )
			}
			return originalFn( ...[ ...args, { blockSnapshots } ] )
		} )
	}

	/**
	 * Overwrite `assertComputedStyle` by passing `blockSnapshots` option
	 */
	overwriteAssertionCommand( 'assertComputedStyle', 3 )

	return blockSnapshots
}

export default BlockSnapshots