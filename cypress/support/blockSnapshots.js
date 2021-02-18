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

	registerAlias( alias ) {
		this.alias = alias
		cy.wrap( [] ).as( `${ alias }.contentSnapshots` )
		cy.wrap( [] ).as( `${ alias }.stubbedStyles` )
	}

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

	stubStyles( style, viewport ) {
		const self = this
		cy.get( `@${ self.alias }.stubbedStyles` ).then( $stubbedStyles => {
			$stubbedStyles.push( { style, viewport } )
			cy.wrap( $stubbedStyles ).as( `${ self.alias }.stubbedStyles` ).then( () => {
			} )
		} )
	}

	assertFrontendStyles() {
		const self = this
		cy.get( `@${ self.alias }.stubbedStyles` ).then( $stubbedStyles => {
			cy.get( `@${ self.alias }.contentSnapshots` ).then( $contentSnapshots => {
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

							const blockElement = createElementFromHTMLString( htmlContent )
							const classList = parseClassList( Array.from( blockElement.classList ).join( ' ' ) )
							doc.querySelector( '.entry-content' ).innerHTML = ''

							if ( viewport !== 'Desktop' ) {
								cy.viewport( config[ `viewport${ viewport }Width` ] || config.viewportWidth, config.viewportHeight )
							}

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

								_assertComputedStyle(
									documentSelector,
									selector.length && last( selector ),
									style[ _selector ],
									'Frontend',
									viewport )
							} )

							cy.viewport( config.viewportWidth, config.viewportHeight )
						} )
					} )
				} )
			} )
		} )
	}
}

export const registerBlockSnapshots = alias => {
	const blockSnapshot = new BlockSnapshots()
	blockSnapshot.registerAlias( alias )

	const overwriteAssertionCommands = ( name, argCount ) => {
		Cypress.Commands.overwrite( name, ( originalFn, ...args ) => {
			if ( args.length === argCount ) {
				const options = args.pop()
				options.__experimentalBlockSnapshots = blockSnapshot
				return originalFn( ...[ ...args, options ] )
			}
			return originalFn( ...[ ...args, { __experimentalBlockSnapshots: blockSnapshot } ] )
		} )
	}

	/**
	 * Overwrite `assertComputedStyle` by passing `__experimentalBlockSnapshots` option
	 */
	overwriteAssertionCommands( 'assertComputedStyle', 3 )

	/**
	 * Overwrite `asserHtmlTag` by passing `__experimentalBlockSnapshots` option
	 */
	overwriteAssertionCommands( 'assertHtmlTag', 4 )

	/**
	 * Overwrite `assertClassName` by passing `__experimentalBlockSnapshots` option
	 */
	overwriteAssertionCommands( 'assertClassName', 4 )

	/**
	 * Overwrite `assertHtmlAttribute` by passing `__experimentalBlockSnapshots` option
	 */
	overwriteAssertionCommands( 'assertHtmlAttribute', 4 )

	return blockSnapshot
}

export default BlockSnapshots
