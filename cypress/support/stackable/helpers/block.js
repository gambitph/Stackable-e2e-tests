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

	assertAlignment( {
		viewport,
		blockName,
		blockSelector,
		mainSelector = null,
		alignmentSelector,
	} ) {
		const MAIN_SELECTOR = mainSelector || '.stk-block'

		const textAligns = [ 'left', 'center', 'right' ]
		textAligns.forEach( align => {
			cy.adjust( 'Content Alignment', align, { viewport, isOptional: true } )
				.assertComputedStyle( { [ alignmentSelector ]: { 'text-align': align } } )
			cy.selectBlock( blockName, blockSelector )
				.assertClassName( alignmentSelector, `has-text-align-${ align }` )
		} )

		const columnAligns = [ 'flex-start', 'center', 'flex-end', 'stretch' ]
		columnAligns.forEach( align => {
			cy.adjust( 'Column Alignment', align, { viewport, isOptional: true } )
				.assertComputedStyle( { [ MAIN_SELECTOR ]: { 'align-self': align } } )
		} )

		if ( viewport === 'Desktop' ) {
			cy.adjust( 'Inner Block Alignment', 'horizontal', { isOptional: true } )
				.assertClassName( alignmentSelector, 'stk--block-orientation-horizontal' )
		}

		const verticalAligns = [ 'flex-start', 'center', 'flex-end' ]
		verticalAligns.forEach( align => {
			cy.adjust( 'Inner Block Vertical Alignment', align, { viewport, isOptional: true } )
				.assertComputedStyle( {
					'.block-editor-block-list__layout': {
						'align-items': align,
					},
				}, { assertFrontend: false } )

			// If option is not present in the inspector, cy.adjust can handle it by using `isOptional`
			// We need to detect if the option is present and if assertComputedStyle needs to be called.
			// Right now, assertComputedStyle will fail if the adjusted option is not in the inspector.

			cy.adjust( 'Inner Block Vertical Alignment', align, { viewport, isOptional: true } )
				.assertComputedStyle( {
					[ alignmentSelector ]: {
						'align-items': align,
					},
				}, { assertBackend: false } )
		} )
	}
}

export const Block = new BlockModule()
