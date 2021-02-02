/**
 * External dependencies
 */
import { blocks } from '~stackable-e2e/config'
import {
	assertBlockExist, blockErrorTest, switchLayouts, registerTests,
} from '~stackable-e2e/helpers'

describe( 'Container Block', registerTests( [
	blockExist,
	blockError,
	innerBlocks,
	switchLayout,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/container', '.ugb-container' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/container' ) )
}

function innerBlocks() {
	it( 'should allow adding inner blocks inside Advanced Columns and Grid', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/container' )

		blocks
			.filter( blockName => blockName !== 'ugb/container' )
			.forEach( blockName => cy.appendBlock( blockName ) )
	} )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/container', [
		'Basic',
		'Plain',
		'Image',
		{
			value: 'image2',
		},
		{
			value: 'image3',
		},
	] ) )
}

