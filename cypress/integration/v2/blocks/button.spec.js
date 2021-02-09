/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, registerTests, responsiveAssertHelper, assertBlockBackground, assertSeparators,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab )

describe( 'Button Block', registerTests( [
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	desktopStyle,
	tabletStyle,
	mobileStyle,
] ) )

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/button', '.ugb-button' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/button' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/button', [
		'Basic',
		{ value: 'Spread', selector: '.ugb-button--design-spread' },
		{ value: 'fullwidth', selector: '.ugb-button--design-fullwidth' },
		{ value: 'Grouped 1', selector: '.ugb-button--design-grouped-1' },
		{ value: 'Grouped 2', selector: '.ugb-button--design-grouped-2' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/button', [
		'Chic Button',
		'Decora Button',
		'Elevate Button',
		'Glow Button',
		'Heights Button',
		'Lume Button',
	] ) )
}

function styleTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/button' )
	cy.openInspector( 'ugb/button', 'Style' )

	cy.collapse( 'General' )

	desktopOnly( () => {
		cy.adjust( 'Border Radius', 20 ).assertComputedStyle( {
			'.ugb-block-content .ugb-button': {
				[ `border-radius` ]: '20px',
			},
		}, { wait: 300 } )
		cy.adjust( 'Collapse Buttons On', 'tablet' )
			.assertClassName( '.ugb-button-wrapper', 'ugb-button--collapse-tablet' )
	} )

	cy.adjust( 'Align', 'left', { viewport } ).assertComputedStyle( {
		'.ugb-block-content': {
			[ `justify-content` ]: 'flex-start',
		},
		'.ugb-inner-block': {
			[ `text-align` ]: 'left',
		},
	} )
	cy.adjust( 'Align', 'center', { viewport } ).assertComputedStyle( {
		'.ugb-block-content': {
			[ `justify-content` ]: 'center',
		},
		'.ugb-inner-block': {
			[ `text-align` ]: 'center',
		},
	} )
	cy.adjust( 'Align', 'right', { viewport } ).assertComputedStyle( {
		'.ugb-block-content': {
			[ `justify-content` ]: 'flex-end',
		},
		'.ugb-inner-block': {
			[ `text-align` ]: 'right',
		},
	} )

	cy.collapse( 'Button #1' )
	desktopOnly( () => {
		cy.adjust( 'Button Color Type', 'gradient' )
		cy.adjust( 'Button Color #1', '#a13939' )
		cy.adjust( 'Button Color #2', '#4e59d4' )
		cy.adjust( 'Gradient Direction (degrees)', 138 )
		cy.adjust( 'Text Color', '#ffa03b' )
		cy.adjust( 'Hover Effect', 'scale' )
			.assertClassName( '.ugb-button1', 'ugb--hover-effect-scale' )
		cy.adjust( 'Hover Opacity', 0.6 )
		cy.adjust( 'Hover Colors', {
			[ `Button Color #1` ]: '#bd8b8b',
			[ `Button Color #2` ]: '#3fa35b',
			[ `Gradient Direction (degrees)` ]: 72,
			[ `Text Color` ]: '#80194d',
		} )
		cy.adjust( 'Typography', {
			[ `Size` ]: 31,
			[ `Weight` ]: '700',
			[ `Transform` ]: 'lowercase',
			[ `Letter Spacing` ]: 2.9,
		} )
		cy.adjust( 'Button Size', 'small' )
			.assertClassName( '.ugb-button1', 'ugb-button--size-small' )
		cy.adjust( 'Border Radius', 40 )
		cy.adjust( 'Vertical Padding', 15 )
		cy.adjust( 'Horizontal Padding', 43 )
		cy.adjust( 'Shadow', 4 )
		cy.adjust( 'Opacity', 0.6 ).assertComputedStyle( {
			'.ugb-button1 .ugb-button--inner': {
				[ `font-size` ]: '31px',
				[ `font-weight` ]: '700',
				[ `text-transform` ]: 'lowercase',
				[ `letter-spacing` ]: '2.9px',
				[ `color` ]: '#ffa03b',
			},
			'.ugb-button1': {
				[ `background-color` ]: '#a13939',
				[ `background-image` ]: 'linear-gradient(138deg, #a13939, #4e59d4)',
				[ `padding-top` ]: '15px',
				[ `padding-right` ]: '43px',
				[ `padding-bottom` ]: '15px',
				[ `padding-left` ]: '43px',
				[ `opacity` ]: '0.6',
				[ `border-radius` ]: '40px',
			},
		} )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				unit: 'em',
				value: 2,
			},
		} ).assertComputedStyle( {
			'.ugb-button1 .ugb-button--inner': {
				[ `font-size` ]: '2em',
			},
		} )
		cy.waitFA()
		cy.adjust( 'Icon', 'info' )
		cy.adjust( 'Adv. Icon Settings', {
			[ `Icon Size` ]: 41,
			[ `Icon Spacing` ]: 25,
		} ).assertComputedStyle( {
			'.ugb-button1 svg': {
				[ `height` ]: '41px',
				[ `width` ]: '41px',
				[ `margin-right` ]: '25px',
			},
		} )
	} )

	const tabletMobileViewports = [ 'Tablet', 'Mobile' ]
	if ( tabletMobileViewports.some( _viewport => _viewport === viewport ) ) {
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport,
				value: 31,
			},
		} ).assertComputedStyle( {
			'.ugb-button1 .ugb-button--inner': {
				[ `font-size` ]: '31px',
			},
		}, { wait: 300 } )

		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport,
				unit: 'em',
				value: 7,
			},
		} ).assertComputedStyle( {
			'.ugb-button1 .ugb-button--inner': {
				[ `font-size` ]: '7em',
			},
		}, { wait: 300 } )
	}

	cy.collapse( 'Button #2' )
	cy.toggleStyle( 'Button #2' )
	desktopOnly( () => {
		cy.adjust( 'Button Color Type', 'gradient' )
		cy.adjust( 'Button Color #1', '#a13939' )
		cy.adjust( 'Button Color #2', '#4e59d4' )
		cy.adjust( 'Gradient Direction (degrees)', 138 )
		cy.adjust( 'Text Color', '#ffa03b' )
		cy.adjust( 'Hover Effect', 'scale' )
			.assertClassName( '.ugb-button2', 'ugb--hover-effect-scale' )
		cy.adjust( 'Hover Opacity', 0.6 )
		cy.adjust( 'Hover Colors', {
			[ `Button Color #1` ]: '#bd8b8b',
			[ `Button Color #2` ]: '#3fa35b',
			[ `Gradient Direction (degrees)` ]: 72,
			[ `Text Color` ]: '#80194d',
		} )
		cy.adjust( 'Typography', {
			[ `Size` ]: 31,
			[ `Weight` ]: '700',
			[ `Transform` ]: 'lowercase',
			[ `Letter Spacing` ]: 2.9,
		} )
		cy.adjust( 'Button Size', 'small' )
			.assertClassName( '.ugb-button2', 'ugb-button--size-small' )
		cy.adjust( 'Border Radius', 40 )
		cy.adjust( 'Vertical Padding', 15 )
		cy.adjust( 'Horizontal Padding', 43 )
		cy.adjust( 'Shadow', 4 )
		cy.adjust( 'Opacity', 0.6 ).assertComputedStyle( {
			'.ugb-button2 .ugb-button--inner': {
				[ `font-size` ]: '31px',
				[ `font-weight` ]: '700',
				[ `text-transform` ]: 'lowercase',
				[ `letter-spacing` ]: '2.9px',
				[ `color` ]: '#ffa03b',
			},
			'.ugb-button2': {
				[ `background-color` ]: '#a13939',
				[ `background-image` ]: 'linear-gradient(138deg, #a13939, #4e59d4)',
				[ `padding-top` ]: '15px',
				[ `padding-right` ]: '43px',
				[ `padding-bottom` ]: '15px',
				[ `padding-left` ]: '43px',
				[ `opacity` ]: '0.6',
				[ `border-radius` ]: '40px',
			},
		} )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				unit: 'em',
				value: 2,
			},
		} ).assertComputedStyle( {
			'.ugb-button2 .ugb-button--inner': {
				[ `font-size` ]: '2em',
			},
		} )
		cy.waitFA()
		cy.adjust( 'Icon', 'info' )
		cy.adjust( 'Adv. Icon Settings', {
			[ `Icon Size` ]: 41,
			[ `Icon Spacing` ]: 25,
		} ).assertComputedStyle( {
			'.ugb-button2 svg': {
				[ `height` ]: '41px',
				[ `width` ]: '41px',
				[ `margin-right` ]: '25px',
			},
		} )
	} )

	if ( tabletMobileViewports.some( _viewport => _viewport === viewport ) ) {
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport,
				value: 31,
			},
		} ).assertComputedStyle( {
			'.ugb-button2 .ugb-button--inner': {
				[ `font-size` ]: '31px',
			},
		}, { wait: 300 } )

		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport,
				unit: 'em',
				value: 7,
			},
		} ).assertComputedStyle( {
			'.ugb-button2 .ugb-button--inner': {
				[ `font-size` ]: '7em',
			},
		}, { wait: 300 } )
	}

	cy.collapse( 'Button #3' )
	cy.toggleStyle( 'Button #3' )
	desktopOnly( () => {
		cy.adjust( 'Button Color Type', 'gradient' )
		cy.adjust( 'Button Color #1', '#a13939' )
		cy.adjust( 'Button Color #2', '#4e59d4' )
		cy.adjust( 'Gradient Direction (degrees)', 138 )
		cy.adjust( 'Text Color', '#ffa03b' )
		cy.adjust( 'Hover Effect', 'scale' )
			.assertClassName( '.ugb-button3', 'ugb--hover-effect-scale' )
		cy.adjust( 'Hover Opacity', 0.6 )
		cy.adjust( 'Hover Colors', {
			[ `Button Color #1` ]: '#bd8b8b',
			[ `Button Color #2` ]: '#3fa35b',
			[ `Gradient Direction (degrees)` ]: 72,
			[ `Text Color` ]: '#80194d',
		} )
		cy.adjust( 'Typography', {
			[ `Size` ]: 31,
			[ `Weight` ]: '700',
			[ `Transform` ]: 'lowercase',
			[ `Letter Spacing` ]: 2.9,
		} )
		cy.adjust( 'Button Size', 'small' )
			.assertClassName( '.ugb-button3', 'ugb-button--size-small' )
		cy.adjust( 'Border Radius', 40 )
		cy.adjust( 'Vertical Padding', 15 )
		cy.adjust( 'Horizontal Padding', 43 )
		cy.adjust( 'Shadow', 4 )
		cy.adjust( 'Opacity', 0.6 ).assertComputedStyle( {
			'.ugb-button3 .ugb-button--inner': {
				[ `font-size` ]: '31px',
				[ `font-weight` ]: '700',
				[ `text-transform` ]: 'lowercase',
				[ `letter-spacing` ]: '2.9px',
				[ `color` ]: '#ffa03b',
			},
			'.ugb-button3': {
				[ `background-color` ]: '#a13939',
				[ `background-image` ]: 'linear-gradient(138deg, #a13939, #4e59d4)',
				[ `padding-top` ]: '15px',
				[ `padding-right` ]: '43px',
				[ `padding-bottom` ]: '15px',
				[ `padding-left` ]: '43px',
				[ `opacity` ]: '0.6',
				[ `border-radius` ]: '40px',
			},
		} )
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				unit: 'em',
				value: 2,
			},
		} ).assertComputedStyle( {
			'.ugb-button3 .ugb-button--inner': {
				[ `font-size` ]: '2em',
			},
		} )
		cy.waitFA()
		cy.adjust( 'Icon', 'info' )
		cy.adjust( 'Adv. Icon Settings', {
			[ `Icon Size` ]: 41,
			[ `Icon Spacing` ]: 25,
		} ).assertComputedStyle( {
			'.ugb-button3 svg': {
				[ `height` ]: '41px',
				[ `width` ]: '41px',
				[ `margin-right` ]: '25px',
			},
		} )
	} )

	if ( tabletMobileViewports.some( _viewport => _viewport === viewport ) ) {
		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport,
				value: 31,
			},
		} ).assertComputedStyle( {
			'.ugb-button3 .ugb-button--inner': {
				[ `font-size` ]: '31px',
			},
		}, { wait: 300 } )

		cy.adjust( 'Typography', {
			[ `Size` ]: {
				viewport,
				unit: 'em',
				value: 7,
			},
		} ).assertComputedStyle( {
			'.ugb-button3 .ugb-button--inner': {
				[ `font-size` ]: '7em',
			},
		}, { wait: 300 } )
	}

	assertBlockBackground( '.ugb-button-wrapper', { viewport } )
	assertSeparators( { viewport } )
}
