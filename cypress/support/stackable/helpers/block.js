/**
 * Internal dependencies
 */
import { Module } from './internals'

class BlockModule extends Module {
	constructor() {
		super()
		this.registerTest( 'Alignment', this.assertAlignment )
		this.setModuleName( 'Block Tab' )
	}

	assertAlignment( { viewport } ) {
		cy.adjust( 'Content Alignment', 'left', { viewport } )
		cy.adjust( 'Content Alignment', 'center', { viewport } )
		cy.adjust( 'Content Alignment', 'right', { viewport } )
	}
}

export const Block = new BlockModule()
