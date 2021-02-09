/**
 * Internal dependencies
 */
import { assertAligns, responsiveAssertHelper } from './helpers'

/**
 * Assertion function for Block Title and Block Description.
 *
 * @param {Object} options
 */
export const assertBlockTitleDescription = ( options = {} ) => {
	const {
		viewport = 'Desktop',
	} = options

	const _assertBlockTitleDescription = ( viewport, desktopOnly ) => {
		desktopOnly( () => {
			cy.collapse( 'Block Title' )
			cy.toggleStyle( 'Block Title' )
			cy.adjust( 'Title HTML Tag', 'h2' )
				.assertHtmlTag( '.ugb-block-title', 'h2' )
			cy.adjust( 'Typography', {
				[ `Font Family` ]: 'Sans-Serif',
				[ `Size` ]: 31,
				[ `Weight` ]: '700',
				[ `Transform` ]: 'uppercase',
				[ `Line-Height` ]: {
					value: 46,
					unit: 'px',
				},
				[ `Letter Spacing` ]: 1.3,
			} )
			cy.adjust( 'Size', 46 )
			cy.adjust( 'Title Color', '#636363' )
			cy.adjust( 'Max Width', 748 ).assertComputedStyle( {
				'.ugb-block-title': {
					[ `font-size` ]: '46px',
					[ `font-weight` ]: '700',
					[ `text-transform` ]: 'uppercase',
					[ `letter-spacing` ]: '1.3px',
					[ `color` ]: '#636363',
					[ `max-width` ]: '748px',
					[ `line-height` ]: '46px',
				},
			} )
			cy.adjust( 'Horizontal Align', 'flex-start' ).assertComputedStyle( {
				'.ugb-block-title': {
					[ `margin-left` ]: '0px',
				},
			} )
			cy.adjust( 'Horizontal Align', 'center' )
			cy.adjust( 'Horizontal Align', 'flex-end' ).assertComputedStyle( {
				'.ugb-block-title': {
					[ `margin-right` ]: '0px',
				},
			} )
			assertAligns( 'Text Align', '.ugb-block-title' )

			cy.collapse( 'Block Description' )
			cy.toggleStyle( 'Block Description' )
			cy.adjust( 'Typography', {
				[ `Font Family` ]: 'Serif',
				[ `Size` ]: 25,
				[ `Weight` ]: '300',
				[ `Transform` ]: 'lowercase',
				[ `Line-Height` ]: {
					value: 36,
					unit: 'px',
				},
				[ `Letter Spacing` ]: 1.3,
			} )
			cy.adjust( 'Size', 31 )
			cy.adjust( 'Description Color', '#636363' )
			cy.adjust( 'Max Width', 734 ).assertComputedStyle( {
				'.ugb-block-description': {
					[ `font-size` ]: '31px',
					[ `font-weight` ]: '300',
					[ `text-transform` ]: 'lowercase',
					[ `letter-spacing` ]: '1.3px',
					[ `color` ]: '#636363',
					[ `max-width` ]: '734px',
					[ `line-height` ]: '36px',
				},
			} )
			cy.adjust( 'Horizontal Align', 'flex-start' ).assertComputedStyle( {
				'.ugb-block-description': {
					[ `margin-left` ]: '0px',
				},
			} )
			cy.adjust( 'Horizontal Align', 'center' )
			cy.adjust( 'Horizontal Align', 'flex-end' ).assertComputedStyle( {
				'.ugb-block-description': {
					[ `margin-right` ]: '0px',
				},
			} )

			// Test Block Description Alignment
			assertAligns( 'Text Align', '.ugb-block-description' )
		} )

		const tabletMobileViewports = [ 'Tablet', 'Mobile' ]
		if ( tabletMobileViewports.some( _viewport => _viewport === viewport ) ) {
			cy.collapse( 'Block Title' )
			cy.toggleStyle( 'Block Title' )
			cy.adjust( 'Typography', {
				[ `Font Family` ]: 'Sans-Serif',
				[ `Size` ]: 31,
				[ `Weight` ]: '700',
				[ `Transform` ]: 'uppercase',
				[ `Line-Height` ]: {
					viewport,
					value: 42,
					unit: 'px',
				},
				[ `Letter Spacing` ]: 1.3,
			} )
			cy.adjust( 'Size', 46, { viewport } )
			cy.adjust( 'Title Color', '#636363' )
			cy.adjust( 'Max Width', 748, { viewport } ).assertComputedStyle( {
				'.ugb-block-title': {
					[ `font-size` ]: '46px',
					[ `font-weight` ]: '700',
					[ `text-transform` ]: 'uppercase',
					[ `letter-spacing` ]: '1.3px',
					[ `color` ]: '#636363',
					[ `max-width` ]: '748px',
					[ `line-height` ]: '42px',
				},
			} )

			assertAligns( 'Text Align', '.ugb-block-title', { viewport } )

			cy.collapse( 'Block Description' )
			cy.toggleStyle( 'Block Description' )
			cy.adjust( 'Typography', {
				[ `Font Family` ]: 'Sans-Serif',
				[ `Size` ]: 21,
				[ `Weight` ]: '700',
				[ `Transform` ]: 'uppercase',
				[ `Line-Height` ]: {
					viewport,
					value: 38,
					unit: 'px',
				},
				[ `Letter Spacing` ]: 1.3,
			} )
			cy.adjust( 'Size', 36, { viewport } )
			cy.adjust( 'Description Color', '#636363' )
			cy.adjust( 'Max Width', 748, { viewport } ).assertComputedStyle( {
				'.ugb-block-description': {
					[ `font-size` ]: '36px',
					[ `font-weight` ]: '700',
					[ `text-transform` ]: 'uppercase',
					[ `letter-spacing` ]: '1.3px',
					[ `color` ]: '#636363',
					[ `max-width` ]: '748px',
					[ `line-height` ]: '38px',
				},
			} )

			assertAligns( 'Text Align', '.ugb-block-description', { viewport } )
		}
	}

	const [ Desktop, Tablet, Mobile ] = responsiveAssertHelper( _assertBlockTitleDescription, { disableItAssertion: true } )
	const assertFunctions = {
		Desktop, Tablet, Mobile,
	}
	assertFunctions[ viewport ]()
}

/**
 * Assertion function for Block Background.
 *
 * @param {string} selector
 * @param {Object} options
 */
export const assertBlockBackground = ( selector, options = {} ) => {
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
					[ `background-color` ]: 'rgba(255, 255, 255, 0.7)',
				},
			} )
		} )
		cy.setBlockAttribute( { [ `blockBackground${ viewport === 'Desktop' ? `` : viewport }BackgroundMediaUrl` ]: Cypress.env( 'DUMMY_IMAGE_URL' ) } )
		desktopOnly( () => {
			cy.adjust( 'No Paddings', true )
			cy.adjust( 'Color Type', 'gradient' )
			cy.adjust( 'Background Color #1', '#6d6d6d' )
			cy.adjust( 'Background Color #2', '#cd2653' )
			cy.adjust( 'Adv. Gradient Color Settings', {
				[ `Gradient Direction (degrees)` ]: '180deg',
				[ `Color 1 Location` ]: '11%',
				[ `Color 2 Location` ]: '80%',
				[ `Background Gradient Blend Mode` ]: 'multiply',
			} )
			cy.adjust( 'Background Media Tint Strength', 7 )
			cy.adjust( 'Fixed Background', true )
			cy.adjust( 'Adv. Background Image Settings', {
				[ `Image Blend Mode` ]: 'multiply',
			} ).assertComputedStyle( {
				[ `${ selector }:before` ]: {
					[ `background-image` ]: 'linear-gradient(#6d6d6d 11%, #cd2653 80%)',
					[ `mix-blend-mode` ]: 'multiply',
					[ `opacity` ]: '0.7',
				},
				[ selector ]: {
					[ `background-attachment` ]: 'fixed',
					[ `background-blend-mode` ]: 'multiply',
				},
			} )
		} )
		cy.adjust( 'Adv. Background Image Settings', {
			[ `Image Position` ]: {
				viewport,
				value: 'center center',
			},
			[ `Image Repeat` ]: {
				viewport,
				value: 'repeat-x',
			},
			[ `Image Size` ]: {
				viewport,
				value: 'custom',
			},
			[ `Custom Size` ]: {
				viewport,
				value: 19,
				unit: '%',
			},
		} ).assertComputedStyle( {
			[ selector ]: {
				[ `background-position` ]: '50% 50%',
				[ `background-repeat` ]: 'repeat-x',
				[ `background-size` ]: '19%',
			},
		} )
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
 */
export const assertSeparators = ( options = {} ) => {
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
				[ `height` ]: '191px',
			},
		} )
		desktopOnly( () => {
			cy.adjust( 'Design', 'wave-2' )
			cy.adjust( 'Color', '#000000' )
			cy.adjust( 'Width', 1.7 ).assertComputedStyle( {
				'.ugb-top-separator svg': {
					[ `fill` ]: '#000000',
				},
			} )
			cy.adjust( 'Flip Horizontally', true )
			cy.adjust( 'Flip Vertically', true )
			cy.adjust( 'Shadow', false )
			_adjust( 'Bring to Front', true, {}, 'assertComputedStyle', [ {
				'.ugb-top-separator': {
					'z-index': '6',
				},
			} ] )
			cy.adjust( 'Separator Layer 2', {
				[ `Color` ]: '#ffffff',
				[ `Layer Height` ]: '1.16',
				[ `Layer Width` ]: '1.9',
				[ `Flip Horizontally` ]: true,
				[ `Opacity` ]: '0.3',
				[ `Mix Blend Mode` ]: 'overlay',
			} ).assertComputedStyle( {
				'.ugb-top-separator .ugb-separator__layer-2': {
					[ `fill` ]: '#ffffff',
					[ `transform` ]: 'matrix(-1.9, 0, 0, 1.16, 0, 0)',
					[ `opacity` ]: '0.3',
					[ `mix-blend-mode` ]: 'overlay',
				},
			} )

			cy.adjust( 'Separator Layer 3', {
				[ `Color` ]: '#6d6d6d',
				[ `Layer Height` ]: '1.03',
				[ `Layer Width` ]: '1.2',
				[ `Flip Horizontally` ]: true,
				[ `Opacity` ]: '0.8',
			} ).assertComputedStyle( {
				'.ugb-top-separator .ugb-separator__layer-3': {
					[ `fill` ]: '#6d6d6d',
					[ `transform` ]: 'matrix(-1.2, 0, 0, 1.03, 0, 0)',
					[ `opacity` ]: '0.8',
				},
			} )
		} )
		cy.collapse( 'Bottom Separator' )
		cy.toggleStyle( 'Bottom Separator' )
		cy.adjust( 'Height', 150, { viewport } ).assertComputedStyle( {
			'.ugb-bottom-separator>.ugb-separator-wrapper': {
				[ `height` ]: '150px',
			},
		} )
		desktopOnly( () => {
			cy.adjust( 'Design', 'curve-3' )
			cy.adjust( 'Color', '#f00069' )
			cy.adjust( 'Width', 1.7 ).assertComputedStyle( {
				'.ugb-bottom-separator svg': {
					[ `fill` ]: '#f00069',
				},
			} )
			cy.adjust( 'Flip Horizontally', true )
			cy.adjust( 'Flip Vertically', true )
			cy.adjust( 'Shadow', false )
			_adjust( 'Bring to Front', true, {}, 'assertComputedStyle', [ {
				'.ugb-top-separator': {
					'z-index': '6',
				},
			} ] )
			cy.adjust( 'Separator Layer 2', {
				[ `Color` ]: '#ffffff',
				[ `Layer Height` ]: '1.16',
				[ `Layer Width` ]: '1.9',
				[ `Flip Horizontally` ]: true,
				[ `Opacity` ]: '0.3',
				[ `Mix Blend Mode` ]: 'saturation',
			} ).assertComputedStyle( {
				'.ugb-bottom-separator .ugb-separator__layer-2': {
					[ `fill` ]: '#ffffff',
					[ `transform` ]: 'matrix(-1.9, 0, 0, 1.16, 0, 0)',
					[ `opacity` ]: '0.3',
					[ `mix-blend-mode` ]: 'saturation',
				},
			} )

			cy.adjust( 'Separator Layer 3', {
				[ `Color` ]: '#6d6d6d',
				[ `Layer Height` ]: '1.03',
				[ `Layer Width` ]: '1.2',
				[ `Flip Horizontally` ]: true,
				[ `Opacity` ]: '0.8',
			} ).assertComputedStyle( {
				'.ugb-bottom-separator .ugb-separator__layer-3': {
					[ `fill` ]: '#6d6d6d',
					[ `transform` ]: 'matrix(-1.2, 0, 0, 1.03, 0, 0)',
					[ `opacity` ]: '0.8',
				},
			} )
		} )
	}

	const [ Desktop, Tablet, Mobile ] = responsiveAssertHelper( _assertSeparators, { disableItAssertion: true } )
	const assertFunctions = {
		Desktop, Tablet, Mobile,
	}
	assertFunctions[ viewport ]()
}
