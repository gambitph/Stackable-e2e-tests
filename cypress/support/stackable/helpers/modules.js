/**
 * Internal dependencies
 */
import {
	assertAligns, responsiveAssertHelper, assertTypography,
} from './index'

/**
 * External dependencies
 */
import { lowerCase } from 'lodash'

/**
 * Assertion function for Block Title and Block Description.
 *
 * @param {Object} options
 * @param {Object} assertOptions
 */
export const assertBlockTitleDescription = ( options = {}, assertOptions = {} ) => {
	const {
		viewport = 'Desktop',
		enableSpacing = true,
	} = options

	const _assertBlockTitleDescription = ( viewport, desktopOnly ) => {
		const typographyAssertions = [ 'Title', 'Description' ]

		typographyAssertions.forEach( typographyAssertion => {
			const typographySelector = `.ugb-block-${ lowerCase( typographyAssertion ) }`
			cy.collapse( `Block ${ typographyAssertion }` )
			cy.toggleStyle( `Block ${ typographyAssertion }` )
			desktopOnly( () => {
				if ( typographyAssertion === 'Title' ) {
					cy.adjust( 'Title HTML Tag', 'h2' )
						.assertHtmlTag( typographySelector, 'h2', assertOptions )
				}
				cy.adjust( `${ typographyAssertion } Color`, '#636363' ).assertComputedStyle( {
					[ typographySelector ]: {
						'color': '#636363',
					},
				}, assertOptions )
			} )
			cy.adjust( 'Max Width', 300, { viewport } ).assertComputedStyle( {
				[ typographySelector ]: {
					'max-width': '300px',
				},
			}, assertOptions )
			desktopOnly( () => {
				cy.adjust( 'Horizontal Align', 'flex-start' ).assertComputedStyle( {
					[ typographySelector ]: {
						'margin-left': '0px',
						'margin-right': 'auto',
					},
				}, assertOptions )
				cy.adjust( 'Horizontal Align', 'center' ).assertComputedStyle( {
					[ typographySelector ]: {
						'margin-left': 'auto',
						'margin-right': 'auto',
					},
				}, assertOptions )
				cy.adjust( 'Horizontal Align', 'flex-end' ).assertComputedStyle( {
					[ typographySelector ]: {
						'margin-right': '0px',
						'margin-left': 'auto',
					},
				}, assertOptions )
			} )
			assertTypography( typographySelector, { viewport } )
			assertAligns( 'Text Align', typographySelector, { viewport } )
		} )

		if ( enableSpacing ) {
			cy.collapse( 'Spacing' )
			cy.adjust( 'Block Title', 41, { viewport } )
			cy.adjust( 'Block Description', 65, { viewport } ).assertComputedStyle( {
				'.ugb-block-title': {
					'margin-bottom': '41px',
				},
				'.ugb-block-description': {
					'margin-bottom': '65px',
				},
			}, assertOptions )
		}
	}

	const [ Desktop, Tablet, Mobile ] = responsiveAssertHelper( _assertBlockTitleDescription, { disableItAssertion: true } )
	const assertFunctions = {
		Desktop, Tablet, Mobile,
	}
	assertFunctions[ viewport ]()
}

/**
 * Assertion function for typing content into Block Title and Block Description.
 *
 * @param {string} subject
 * @param {Object} assertOptions
 */
export const assertBlockTitleDescriptionContent = ( subject, assertOptions = {} ) => {
	const typographyAssertions = [ 'Title', 'Description' ]

	typographyAssertions.forEach( typographyAssertion => {
		const typographySelector = `.ugb-block-${ lowerCase( typographyAssertion ) }`
		cy.collapse( `Block ${ typographyAssertion }` )
		cy.toggleStyle( `Block ${ typographyAssertion }` )

		cy.typeBlock( subject, typographySelector, 'Hello World! 1234' )
			.assertBlockContent( typographySelector, 'Hello World! 1234', assertOptions )
	} )
}

/**
 * Assertion function for Block Background.
 *
 * @param {string} selector
 * @param {Object} options
 * @param {Object} assertOptions
 */
export const assertBlockBackground = ( selector, options = {}, assertOptions = {} ) => {
	const {
		viewport = 'Desktop',
	} = options

	const _assertBlockBackground = ( viewport, desktopOnly ) => {
		cy.collapse( 'Block Background' )
		cy.toggleStyle( 'Block Background' )
		desktopOnly( () => {
			cy.adjust( 'Background Color', '#ffffff' )
			cy.adjust( 'Background Color Opacity', 0.7 ).assertComputedStyle( {
				[ selector ]: {
					'background-color': 'rgba(255, 255, 255, 0.7)',
				},
			}, assertOptions )
		} )
		cy.setBlockAttribute( { [ `blockBackground${ viewport === 'Desktop' ? '' : viewport }BackgroundMediaUrl` ]: Cypress.env( 'DUMMY_IMAGE_URL' ) } )
		desktopOnly( () => {
			cy.adjust( 'No Paddings', true )
			cy.adjust( 'Color Type', 'gradient' )
			cy.adjust( 'Background Color #1', '#6d6d6d' )
			cy.adjust( 'Background Color #2', '#cd2653' )
			cy.adjust( 'Adv. Gradient Color Settings', {
				'Gradient Direction (degrees)': '180deg',
				'Color 1 Location': '11',
				'Color 2 Location': '80',
				'Background Gradient Blend Mode': 'multiply',
			} )
			cy.adjust( 'Background Media Tint Strength', 7 )
			cy.adjust( 'Fixed Background', true )
			cy.adjust( 'Adv. Background Image Settings', {
				'Image Blend Mode': 'multiply',
			} ).assertComputedStyle( {
				[ `${ selector }:before` ]: {
					'background-image': 'linear-gradient(#6d6d6d 11%, #cd2653 80%)',
					'mix-blend-mode': 'multiply',
					'opacity': '0.7',
				},
				[ selector ]: {
					'background-attachment': 'fixed',
					'background-blend-mode': 'multiply',
				},
			}, assertOptions )
		} )
		cy.adjust( 'Adv. Background Image Settings', {
			'Image Position': {
				viewport,
				value: 'center center',
			},
			'Image Repeat': {
				viewport,
				value: 'repeat-x',
			},
			'Image Size': {
				viewport,
				value: 'custom',
			},
			'Custom Size': {
				viewport,
				value: 19,
				unit: '%',
			},
		} ).assertComputedStyle( {
			[ selector ]: {
				'background-position': '50% 50%',
				'background-repeat': 'repeat-x',
				'background-size': '19%',
			},
		}, assertOptions )
	}

	const [ Desktop, Tablet, Mobile ] = responsiveAssertHelper( _assertBlockBackground, { disableItAssertion: true } )
	const assertFunctions = {
		Desktop, Tablet, Mobile,
	}
	assertFunctions[ viewport ]()
}

/**
 * Assertion function for Top and Bottom Separator.
 *
 * @param {Object} options
 * @param {Object} assertOptions
 */
export const assertSeparators = ( options = {}, assertOptions = {} ) => {
	const {
		viewport = 'Desktop',
	} = options

	const _adjust = ( adjustName, value, options = {}, assertionFunc, args = [] ) => {
		cy.get( '.ugb-toggle-panel-body.is-opened', { log: false } )
			.then( $panel => {
				if ( $panel.text().includes( adjustName ) ) {
					if ( args.length ) {
						cy.adjust( adjustName, value, options )[ assertionFunc ]( ...args )
					} else {
						cy.adjust( adjustName, value, options )
					}
				}
			} )
	}

	const _assertSeparators = ( viewport, desktopOnly ) => {
		cy.collapse( 'Top Separator' )
		cy.toggleStyle( 'Top Separator' )
		cy.adjust( 'Height', 191, { viewport } ).assertComputedStyle( {
			'.ugb-top-separator>.ugb-separator-wrapper': {
				'height': '191px',
			},
		}, assertOptions )
		desktopOnly( () => {
			cy.adjust( 'Design', 'wave-2' )
			cy.adjust( 'Color', '#000000' )
			cy.adjust( 'Width', 1.7 ).assertComputedStyle( {
				'.ugb-top-separator svg': {
					'fill': '#000000',
				},
			} )
			cy.adjust( 'Flip Horizontally', true )
			cy.adjust( 'Flip Vertically', true )
			cy.adjust( 'Shadow', false )
			_adjust( 'Bring to Front', true, {}, 'assertComputedStyle', [ {
				'.ugb-top-separator': {
					'z-index': '6',
				},
			}, assertOptions ] )
			cy.adjust( 'Separator Layer 2', {
				'Color': '#ffffff',
				'Layer Height': '1.16',
				'Layer Width': '1.9',
				'Flip Horizontally': true,
				'Opacity': '0.3',
				'Mix Blend Mode': 'overlay',
			} ).assertComputedStyle( {
				'.ugb-top-separator .ugb-separator__layer-2': {
					'fill': '#ffffff',
					'transform': 'matrix(-1.9, 0, 0, 1.16, 0, 0)',
					'opacity': '0.3',
					'mix-blend-mode': 'overlay',
				},
			}, assertOptions )

			cy.adjust( 'Separator Layer 3', {
				'Color': '#6d6d6d',
				'Layer Height': '1.03',
				'Layer Width': '1.2',
				'Flip Horizontally': true,
				'Opacity': '0.8',
			} ).assertComputedStyle( {
				'.ugb-top-separator .ugb-separator__layer-3': {
					'fill': '#6d6d6d',
					'transform': 'matrix(-1.2, 0, 0, 1.03, 0, 0)',
					'opacity': '0.8',
				},
			}, assertOptions )
		} )
		cy.collapse( 'Bottom Separator' )
		cy.toggleStyle( 'Bottom Separator' )
		cy.adjust( 'Height', 150, { viewport } ).assertComputedStyle( {
			'.ugb-bottom-separator>.ugb-separator-wrapper': {
				'height': '150px',
			},
		}, assertOptions )
		desktopOnly( () => {
			cy.adjust( 'Design', 'curve-3' )
			cy.adjust( 'Color', '#f00069' )
			cy.adjust( 'Width', 1.7 ).assertComputedStyle( {
				'.ugb-bottom-separator svg': {
					'fill': '#f00069',
				},
			} )
			cy.adjust( 'Flip Horizontally', true )
			cy.adjust( 'Flip Vertically', true )
			cy.adjust( 'Shadow', false )
			_adjust( 'Bring to Front', true, {}, 'assertComputedStyle', [ {
				'.ugb-top-separator': {
					'z-index': '6',
				},
			}, assertOptions ] )
			cy.adjust( 'Separator Layer 2', {
				'Color': '#ffffff',
				'Layer Height': '1.16',
				'Layer Width': '1.9',
				'Flip Horizontally': true,
				'Opacity': '0.3',
				'Mix Blend Mode': 'saturation',
			} ).assertComputedStyle( {
				'.ugb-bottom-separator .ugb-separator__layer-2': {
					'fill': '#ffffff',
					'transform': 'matrix(-1.9, 0, 0, 1.16, 0, 0)',
					'opacity': '0.3',
					'mix-blend-mode': 'saturation',
				},
			}, assertOptions )

			cy.adjust( 'Separator Layer 3', {
				'Color': '#6d6d6d',
				'Layer Height': '1.03',
				'Layer Width': '1.2',
				'Flip Horizontally': true,
				'Opacity': '0.8',
			} ).assertComputedStyle( {
				'.ugb-bottom-separator .ugb-separator__layer-3': {
					'fill': '#6d6d6d',
					'transform': 'matrix(-1.2, 0, 0, 1.03, 0, 0)',
					'opacity': '0.8',
				},
			}, assertOptions )
		} )
	}

	const [ Desktop, Tablet, Mobile ] = responsiveAssertHelper( _assertSeparators, { disableItAssertion: true } )
	const assertFunctions = {
		Desktop, Tablet, Mobile,
	}
	assertFunctions[ viewport ]()
}
