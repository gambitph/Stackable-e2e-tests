/**
 * External dependencies
 */
import {
	 registerTests,
} from '~stackable-e2e/helpers'

describe( 'Global Settings', registerTests( [
	 globalTypoNativeBlocks,
] ) )

const globalTypo = [
	{
		tag: 'h1',
		font: 'Abel',
		size: 92,
		weight: 'bold',
		transform: 'uppercase',
		lineHeight: 1.3,
		letterSpacing: 2.1,
	},
	{
		tag: 'h2',
		font: 'Aclonica',
		size: 66,
		weight: '900',
		transform: 'capitalize',
		lineHeight: 1.2,
		letterSpacing: 1.1,
	},
	{
		tag: 'h3',
		font: 'ABeeZee',
		size: 50,
		weight: '100',
		transform: 'lowercase',
		lineHeight: 1.1,
		letterSpacing: 1.5,
	},
	{
		tag: 'h4',
		font: 'Acme',
		size: 38,
		weight: '300',
		transform: 'uppercase',
		lineHeight: 2.7,
		letterSpacing: 1.8,
	},
	{
		tag: 'h5',
		font: 'Akronim',
		size: 24,
		weight: '500',
		transform: 'capitalize',
		lineHeight: 2.1,
		letterSpacing: 3.9,
	},
	{
		tag: 'h6',
		font: 'Actor',
		size: 16,
		weight: '600',
		transform: 'uppercase',
		lineHeight: 1.4,
		letterSpacing: 3.5,
	},
	{
		tag: 'p',
		font: 'Alice',
		size: 15,
		weight: '200',
		transform: 'lowercase',
		lineHeight: 1.3,
		letterSpacing: 0.1,
	},
]

const nativeBlocks = [
	'core/paragraph',
	'core/list',
	'core/heading',
]

function globalTypoNativeBlocks() {
	it( 'should assert global typography on native blocks', () => {
		cy.setupWP()
		cy.registerPosts( { numOfPosts: 1 } )
		cy.newPage()

		// add the native blocks
		nativeBlocks.forEach( blockName => {
			cy.addBlock( blockName )
			cy
				.get( `.wp-block[data-type='${ blockName }']` )
				.type( 'Block Title', { force: true } )
				//if
			cy.selectBlock( blockName ).assertComputedStyle( {
				'': {
					'font-family': `${ globalTypo[ 6 ].font }, sans-serif`,
					'font-size': `${ globalTypo[ 6 ].size }px`,
					'font-weight': globalTypo[ 6 ].weight,
					'text-transform': globalTypo[ 6 ].transform,
					'line-height': `${ globalTypo[ 6 ].lineHeight }em`,
					'letter-spacing': `${ globalTypo[ 6 ].letterSpacing }px`,
				},
			} )
		} )
	} )
}
