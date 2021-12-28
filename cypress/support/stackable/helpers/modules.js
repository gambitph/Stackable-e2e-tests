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

		cy.typeBlock( subject, typographySelector, 'Hello World! 1234', 0 )
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
				'Gradient Direction (degrees)': '180',
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
				value: 'bottom left',
			},
		} ).assertComputedStyle( {
			[ selector ]: {
				'background-position': '0% 100%',
			},
		}, assertOptions )
		cy.adjust( 'Adv. Background Image Settings', {
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

/**
 * Assertion function for Container Background in Style tab (V3)
 *
 * @param {Object} options
 * @param {Object} assertOptions
 */
export const assertContainerBackground = ( options = {}, assertOptions = {} ) => {
	const {
		viewport = 'Desktop',
	} = options

	cy.collapse( 'Container Background' )
	cy.get( '.block-editor-block-list__block.is-selected [data-block-id].stk-block' )
		.invoke( 'attr', 'data-block-id' )
		.then( blockId => {
			if ( viewport === 'Desktop' ) {
				cy.adjust( 'Trigger hover state on nested blocks', true )
				cy.adjust( 'Color Type', 'gradient' )
				cy.adjust( 'Background Color #1', '#cfe5f7' )
				cy.adjust( 'Background Color #2', '#a0dda9' )
				cy.adjust( 'Adv. Gradient Color Settings', {
					'Gradient Direction (degrees)': 164,
					'Color 1 Location': 41,
					'Color 2 Location': 88,
					'Background Gradient Blend Mode': 'darken',
				} ).assertComputedStyle( {
					[ `.stk-${ blockId }-container:before` ]: {
						'mix-blend-mode': 'darken',
						'background-image': 'linear-gradient(164deg, #cfe5f7 41%, #a0dda9 88%)',
					},
				}, assertOptions )

				cy.adjust( 'Color Type', 'single' )
				cy.adjust( 'Background Color', '#f3daa3', { state: 'normal' } )
				cy.adjust( 'Background Color', '#f6c3f9', { state: 'hover' } )
				cy.adjust( 'Background Color Opacity', 0.8, { state: 'hover' } ).assertComputedStyle( {
					[ `.stk-${ blockId }-container:hover` ]: {
						'background-color': 'rgba(246, 195, 249, 0.8)',
					},
				}, assertOptions )
				cy.adjust( 'Background Color Opacity', 0.6, { state: 'normal' } ).assertComputedStyle( {
					[ `.stk-${ blockId }-container` ]: {
						'background-color': 'rgba(243, 218, 163, 0.6)',
					},
				}, assertOptions )
			}

			cy.adjust( 'Background Image or Video', 1, { viewport } )
			if ( viewport === 'Desktop' ) {
				cy.adjust( 'Background Media Tint Strength', 7, { state: 'normal' } ).assertComputedStyle( {
					[ `.stk-${ blockId }-container:before` ]: {
						'opacity': '0.7',
					},
				}, assertOptions )
				cy.adjust( 'Background Media Tint Strength', 4, { state: 'hover' } ).assertComputedStyle( {
					[ `.stk-${ blockId }-container:before:hover` ]: {
						'opacity': '0.4',
					},
				}, assertOptions )
				cy.adjust( 'Fixed Background', true )
				cy.adjust( 'Adv. Background Image Settings', {
					'Image Blend Mode': 'exclusion',
				} ).assertComputedStyle( {
					[ `.stk-${ blockId }-container` ]: {
						'background-attachment': 'fixed',
						'background-blend-mode': 'exclusion',
					},
				}, assertOptions )
			}

			// Test Custom size px unit
			cy.adjust( 'Adv. Background Image Settings', {
				'Image Position': {
					viewport,
					value: 'top right',
				},
				'Image Repeat': {
					viewport,
					value: 'no-repeat',
				},
				'Image Size': {
					viewport,
					value: 'custom',
				},
				'Custom Size': {
					viewport,
					value: 872,
					unit: 'px',
				},
			} ).assertComputedStyle( {
				[ `.stk-${ blockId }-container` ]: {
					'background-position': '100% 0%',
					'background-repeat': 'no-repeat',
					'background-size': '872px',
				},
			}, assertOptions )
			// Test Custom size vw unit
			cy.adjust( 'Adv. Background Image Settings', {
				'Image Size': {
					viewport,
					value: 'custom',
				},
				'Custom Size': {
					viewport,
					value: 58,
					unit: 'vw',
				},
			} ).assertComputedStyle( {
				[ `.stk-${ blockId }-container` ]: {
					'background-size': '58vw',
				},
			}, assertOptions )
			// Test Custom size % unit
			cy.adjust( 'Adv. Background Image Settings', {
				'Image Size': {
					viewport,
					value: 'custom',
				},
				'Custom Size': {
					viewport,
					value: 43,
					unit: '%',
				},
			} ).assertComputedStyle( {
				[ `.stk-${ blockId }-container` ]: {
					'background-size': '43%',
				},
			}, assertOptions )
		} )
}

/**
 * Assertion function for Container Size & Spacing in Style tab (V3)
 *
 * @param {Object} options
 * @param {Object} assertOptions
 */
export const assertContainerSizeSpacing = ( options = {}, assertOptions = {} ) => {
	const {
		viewport = 'Desktop',
		selector = '',
		contentWidthSelector = null,
	} = options

	cy.collapse( 'Container Size & Spacing' )
	cy.adjust( 'Min. Height', 498, { viewport, unit: 'px' } ).assertComputedStyle( {
		[ selector ]: {
			'min-height': '498px',
		},
	}, assertOptions )
	cy.adjust( 'Min. Height', 62, { viewport, unit: 'vh' } ).assertComputedStyle( {
		[ selector ]: {
			'min-height': '62vh',
		},
	}, assertOptions )

	const aligns = [ 'flex-start', 'center', 'flex-end' ]
	aligns.forEach( align => {
		cy.adjust( 'Content Vertical Align', align, { viewport } ).assertComputedStyle( {
			[ selector ]: {
				'justify-content': align,
			},
		}, { assertFrontend: false } )
		cy.get( '.block-editor-block-list__block.is-selected' ).assertComputedStyle( {
			[ selector ]: {
				'align-items': align,
			},
		}, { assertBackend: false } )
	} )

	cy.adjust( 'Max. Content Width', 555, { viewport, unit: 'px' } ).assertComputedStyle( {
		[ `${ contentWidthSelector ? contentWidthSelector : selector }` ]: {
			'max-width': '555px',
		},
	}, assertOptions )
	cy.adjust( 'Max. Content Width', 74, { viewport, unit: '%' } ).assertComputedStyle( {
		[ `${ contentWidthSelector ? contentWidthSelector : selector }` ]: {
			'max-width': '74%',
		},
	}, assertOptions )

	aligns.forEach( align => {
		cy.adjust( 'Max. Content Width', 555, { viewport, unit: 'px' } )
		cy.adjust( 'Content Horizontal Align', align, { viewport } ).assertComputedStyle( {
			[ `${ contentWidthSelector ? contentWidthSelector : selector }` ]: {
				'margin-right': `${ align === 'flex-end' ? '0px' : 'auto' }`,
				'margin-left': `${ align === 'flex-start' ? '0px' : 'auto' }`,
			},
		}, assertOptions )
	} )

	// Unit - px
	cy.adjust( 'Paddings', [ 129, 19, 64, 31 ], {
		viewport, state: 'normal', unit: 'px',
	} ).assertComputedStyle( {
		[ selector ]: {
			'padding-top': '129px',
			'padding-right': '19px',
			'padding-bottom': '64px',
			'padding-left': '31px',
		},
	}, assertOptions )
	cy.adjust( 'Paddings', [ 130, 20, 65, 32 ], {
		viewport, state: 'hover', unit: 'px',
	} ).assertComputedStyle( {
		[ `${ selector }:hover` ]: {
			'padding-top': '130px',
			'padding-right': '20px',
			'padding-bottom': '65px',
			'padding-left': '32px',
		},
	}, assertOptions )

	cy.resetStyle( 'Paddings', { viewport, state: 'hover' } )
	cy.resetStyle( 'Paddings', { viewport, state: 'normal' } )

	// Unit - em
	cy.adjust( 'Paddings', [ 6, 14, 24, 3 ], {
		viewport, state: 'normal', unit: 'em',
	} ).assertComputedStyle( {
		[ selector ]: {
			'padding-top': '6em',
			'padding-right': '14em',
			'padding-bottom': '24em',
			'padding-left': '3em',
		},
	}, assertOptions )
	cy.adjust( 'Paddings', [ 7, 15, 25, 4 ], {
		viewport, state: 'hover', unit: 'em',
	} ).assertComputedStyle( {
		[ `${ selector }:hover` ]: {
			'padding-top': '7em',
			'padding-right': '15em',
			'padding-bottom': '25em',
			'padding-left': '4em',
		},
	}, assertOptions )

	cy.resetStyle( 'Paddings', { viewport, state: 'hover' } )
	cy.resetStyle( 'Paddings', { viewport, state: 'normal' } )

	// Unit - %
	cy.adjust( 'Paddings', [ 38, 26, 45, 8 ], {
		viewport, state: 'normal', unit: '%',
	} ).assertComputedStyle( {
		[ selector ]: {
			'padding-top': '38%',
			'padding-right': '26%',
			'padding-bottom': '45%',
			'padding-left': '8%',
		},
	}, assertOptions )
	cy.adjust( 'Paddings', [ 39, 27, 46, 9 ], {
		viewport, state: 'hover', unit: '%',
	} ).assertComputedStyle( {
		[ `${ selector }:hover` ]: {
			'padding-top': '39%',
			'padding-right': '27%',
			'padding-bottom': '46%',
			'padding-left': '9%',
		},
	}, assertOptions )
}

/**
 * Assertion function for Container Borders & Shadow in Style tab (V3)
 *
 * @param {Object} options
 * @param {Object} assertOptions
 */
export const assertContainerBordersShadow = ( options = {}, assertOptions = {} ) => {
	const {
		viewport = 'Desktop',
	} = options

	cy.collapse( 'Container Borders & Shadow' )
	cy.get( '.block-editor-block-list__block.is-selected [data-block-id].stk-block' )
		.invoke( 'attr', 'data-block-id' )
		.then( blockId => {
			if ( viewport === 'Desktop' ) {
				const borders = [ 'solid', 'dashed', 'dotted' ]
				borders.forEach( border => {
					cy.adjust( 'Borders', border ).assertComputedStyle( {
						[ `.stk-${ blockId }-container` ]: {
							'border-style': border,
						},
					}, assertOptions )
				} )

				cy.adjust( 'Border Color', '#3930ab', { state: 'normal' } ).assertComputedStyle( {
					[ `.stk-${ blockId }-container` ]: {
						'border-color': '#3930ab',
					},
				}, assertOptions )
				cy.adjust( 'Border Color', '#ff42fc', { state: 'hover' } ).assertComputedStyle( {
					[ `.stk-${ blockId }-container:hover` ]: {
						'border-color': '#ff42fc',
					},
				}, assertOptions )

				cy.adjust( 'Shadow / Outline', 7, { state: 'hover' } ).assertComputedStyle( {
					[ `.stk-${ blockId }-container:hover` ]: {
						'box-shadow': '7px 5px 30px rgba(72, 73, 121, 0.15)',
					},
				}, assertOptions )
				cy.adjust( 'Shadow / Outline', 5, { state: 'normal' } ).assertComputedStyle( {
					[ `.stk-${ blockId }-container` ]: {
						'box-shadow': '0 5px 30px -10px rgba(18, 63, 82, 0.3)',
					},
				}, assertOptions )
				cy.resetStyle( 'Shadow / Outline', { state: 'normal' } )
				cy.resetStyle( 'Shadow / Outline', { state: 'hover' } )

				const parentSelector = '.components-popover__content .stk-control-content'

				cy.adjust( 'Shadow / Outline', {
					'Horizontal Offset': { value: 8, parentSelector },
					'Vertical Offset': { value: 11, parentSelector },
					'Blur': { value: 25, parentSelector },
					'Shadow Spread': { value: 5, parentSelector },
					'Shadow Color': { value: '#2a8a62', parentSelector },
					'Shadow Opacity': { value: 0.6, parentSelector },
				}, { buttonLabel: 'Shadow Settings' } ).assertComputedStyle( {
					[ `.stk-${ blockId }-container` ]: {
						'box-shadow': '8px 11px 25px 5px rgba(42, 138, 98, 0.6)',
					},
				} )

				cy.resetStyle( 'Shadow / Outline', { state: 'normal' } )
				cy.resetStyle( 'Shadow / Outline', { state: 'hover' } )

				cy.adjust( 'Shadow / Outline', {
					'Advanced Shadow Options': { value: null, state: 'hover' },
					'Horizontal Offset': { value: 7, parentSelector },
				}, { buttonLabel: 'Shadow Settings' } )
				cy.adjust( 'Shadow / Outline', {
					'Advanced Shadow Options': { value: null, state: 'hover' },
					'Vertical Offset': { value: 31, parentSelector },
				}, { buttonLabel: 'Shadow Settings' } )
				cy.adjust( 'Shadow / Outline', {
					'Advanced Shadow Options': { value: null, state: 'hover' },
					'Blur': { value: 71, parentSelector },
				}, { buttonLabel: 'Shadow Settings' } )
				cy.adjust( 'Shadow / Outline', {
					'Advanced Shadow Options': { value: null, state: 'hover' },
					'Shadow Spread': { value: 26, parentSelector },
				}, { buttonLabel: 'Shadow Settings' } )
				cy.adjust( 'Shadow / Outline', {
					'Advanced Shadow Options': { value: null, state: 'hover' },
					'Shadow Color': { value: '#0f9294', parentSelector },
				}, { buttonLabel: 'Shadow Settings' } )
				cy.adjust( 'Shadow / Outline', {
					'Advanced Shadow Options': { value: null, state: 'hover' },
					'Shadow Opacity': { value: 0.4, parentSelector },
				}, { buttonLabel: 'Shadow Settings' } )
					.assertComputedStyle( {
						[ `.stk-${ blockId }-container:hover` ]: {
							'box-shadow': '7px 31px 71px 26px rgba(15, 146, 148, 0.4)',
						},
					} )
			}

			cy.adjust( 'Borders', 'solid' )
			cy.adjust( 'Border Width', [ 3, 6, 9, 12 ], { viewport, state: 'normal' } ).assertComputedStyle( {
				[ `.stk-${ blockId }-container` ]: {
					'border-style': 'solid',
					'border-top-width': '3px',
					'border-right-width': '6px',
					'border-bottom-width': '9px',
					'border-left-width': '12px',
				},
			} )
			cy.adjust( 'Border Width', [ 1, 2, 3, 4 ], { viewport, state: 'hover' } ).assertComputedStyle( {
				[ `.stk-${ blockId }-container:hover` ]: {
					'border-style': 'solid',
					'border-top-width': '1px',
					'border-right-width': '2px',
					'border-bottom-width': '3px',
					'border-left-width': '4px',
				},
			} )
			cy.adjust( 'Border Radius', 37, { viewport } ).assertComputedStyle( {
				[ `.stk-${ blockId }-container` ]: {
					'border-radius': '37px',
				},
			} )
		} )
}
