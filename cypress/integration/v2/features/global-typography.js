/**
 * External dependencies
 */
import { range } from 'lodash'
import {
	responsiveAssertHelper,
	registerTests,
} from '~stackable-e2e/helpers'

const [ desktopGlobal, tabletGlobal, mobileGlobal ] = responsiveAssertHelper( globalTypography, { tab: 'Global Typography' } )

describe( 'Global Settings', registerTests( [
	desktopGlobal,
	tabletGlobal,
	mobileGlobal,
] ) )

function globalTypography( viewport, desktopOnly ) {
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

	cy.addBlock( 'ugb/heading' )
	cy.typeBlock( 'ugb/heading', '.ugb-heading__title', 'Heading' )
	cy.typeBlock( 'ugb/heading', '.ugb-heading__subtitle', 'This is paragraph' )

	// Adjust Global Typography settings
	desktopOnly( () => {
		globalTypo.forEach( val => {
			cy.adjustGlobalTypography( val.tag, {
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

			cy.openInspector( 'ugb/heading', 'Style' )
			cy.collapse( 'Title' )
			cy.adjust( 'Title HTML Tag', val.tag ).assertComputedStyle( {
				'.ugb-heading__title': {
					'font-family': `${ val.font }, sans-serif`,
					'font-size': `${ val.size }px`,
					'font-weight': val.weight,
					'text-transform': val.transform,
					'line-height': `${ val.lineHeight }em`,
					'letter-spacing': `${ val.letterSpacing }px`,
				},
			} )
		} )
	} )

	// Test fontSize px and lineHeight em values for Tablet & Mobile
	const tabletMobileViewports = [ 'Tablet', 'Mobile' ]

	if ( tabletMobileViewports.includes( viewport ) ) {
		range( 1, 8 ).forEach( idx => {
			cy.adjustGlobalTypography( globalTypo[ idx - 1 ].tag, {
				'Size': {
					value: globalTypo[ idx - 1 ].size,
					unit: 'px',
					viewport,
				},
				'Line-Height': {
					value: globalTypo[ idx - 1 ].lineHeight,
					unit: 'em',
					viewport,
				},
			} )

			cy.openInspector( 'ugb/heading', 'Style' )
			cy.collapse( 'Title' )
			cy.adjust( 'Title HTML Tag', globalTypo[ idx - 1 ].tag ).assertComputedStyle( {
				'.ugb-heading__title': {
					'font-size': `${ globalTypo[ idx - 1 ].size }px`,
					'line-height': `${ globalTypo[ idx - 1 ].lineHeight }em`,
				},
			} )
		} )
	}

	// Test fontSize em and lineHeight px values for all viewports
	const emFontSize = [ 4.2, 4.1, 3.9, 3.8, 3.7, 3.6, 3.5 ]
	const pxLineHeight = [ 64, 58, 54, 48, 44, 38, 34 ]

	range( 1, 8 ).forEach( idx => {
		cy.adjustGlobalTypography( globalTypo[ idx - 1 ].tag, {
			'Size': {
				value: emFontSize[ idx - 1 ],
				unit: 'em',
				viewport,
			},
			'Line-Height': {
				value: pxLineHeight[ idx - 1 ],
				unit: 'px',
				viewport,
			},
		} )

		cy.openInspector( 'ugb/heading', 'Style' )
		cy.collapse( 'Title' )
		cy.adjust( 'Title HTML Tag', globalTypo[ idx - 1 ].tag ).assertComputedStyle( {
			'.ugb-heading__title': {
				'font-size': `${ emFontSize[ idx - 1 ] }em`,
				'line-height': `${ pxLineHeight[ idx - 1 ] }px`,
			},
		} )

		// Reset Global Typography settings
		cy.resetGlobalTypography( globalTypo[ idx - 1 ].tag )
	} )
}
