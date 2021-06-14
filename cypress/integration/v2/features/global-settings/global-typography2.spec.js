/**
 * External dependencies
 */
/*
import { range } from 'lodash'
import { registerBlockSnapshots } from '~gutenberg-e2e/plugins'
import {
	 responsiveAssertHelper,
	 registerTests,
} from '~stackable-e2e/helpers'

import { blocks } from '~stackable-e2e/config'

const [ desktopGlobal, tabletGlobal, mobileGlobal ] = responsiveAssertHelper( globalTypoNativeBlocks, { tab: 'Global Typography on Native Blocks' } )

describe( 'Global Settings', registerTests( [
	 desktopGlobal,
	 tabletGlobal,
	 mobileGlobal,
] ) ) //Viewports

function globalTypoNativeBlocks( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()

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
	desktopOnly( () => {
		cy.addBlock( 'core/paragraph' )

		globalTypo.forEach( val => {
			cy.adjustGlobalTypography( val.tag, { //study this assertion in commands
				'Font Family': val.font,
				'Size': {
					value: val.size,
					unit: 'px',
				},
				'Weight': val.weight,
				'Transform': val.transform,
				'Line-Height': {
					value: val.lineHeight,
					unit: 'em',
				},
				'Letter Spacing': val.letterSpacing,
			} )
		} )
		blocks
			.forEach( blockName => {

			} )
	} )
}
*/
