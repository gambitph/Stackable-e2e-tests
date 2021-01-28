/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, assertSeparators,
} from '~stackable-e2e/helpers'

describe( 'Spacer Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/spacer', '.ugb-spacer' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/spacer' ) )

	it( 'should adjust desktop options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/spacer' )
		cy.openInspector( 'ugb/spacer', 'Style' )

		// Test General options
		cy.collapse( 'General' )
		cy.adjust( 'Height', 142 ).assertComputedStyle( {
			'.ugb-spacer': {
				[ `height` ]: '142px',
			},
		} )
		cy.resetStyle( 'Height' )
		cy.adjust( 'Height', 23, { unit: 'vh' } ).assertComputedStyle( {
			'.ugb-spacer': {
				[ `height` ]: '23vh',
			},
		} )

		cy.adjust( 'Color Type', 'single' )
		cy.adjust( 'Background Color', '#000000' )
		cy.adjust( 'Background Color Opacity', 0.6 ).assertComputedStyle( {
			'.ugb-spacer--inner': {
				[ `background-color` ]: 'rgba(0, 0, 0, 0.6)',
			},
		} )

		cy.setBlockAttribute( {
			[ `backgroundMediaUrl` ]: 'http://sandbox.gambit.ph/for-test/wp-content/uploads/sites/85/2020/12/avi-richards-ojBNujxI2_c-unsplash.jpg',
		} )
		cy.adjust( 'Background Media Tint Strength', 6 ).assertComputedStyle( {
			'.ugb-spacer--inner': {
				[ `background-image` ]: 'url("http://sandbox.gambit.ph/for-test/wp-content/uploads/sites/85/2020/12/avi-richards-ojBNujxI2_c-unsplash.jpg")',
			},
			'.ugb-spacer--inner:before': {
				[ `opacity` ]: '0.6',
			},
		} )
		cy.adjust( 'Fixed Background', true ).assertComputedStyle( {
			'.ugb-spacer--inner': {
				[ `background-attachment` ]: 'fixed',
			},
		} )
		cy.adjust( 'Adv. Background Image Settings', {
			[ `Image Position` ]: 'center center',
			[ `Image Repeat` ]: 'repeat-x',
			[ `Image Size` ]: 'custom',
			[ `Custom Size` ]: {
				value: 19,
				unit: '%',
			},
			[ `Image Blend Mode` ]: 'exclusion',
		} ).assertComputedStyle( {
			'.ugb-spacer--inner': {
				[ `background-position-x` ]: '50%',
				[ `background-position-y` ]: '50%',
				[ `background-size` ]: '19%',
				[ `background-blend-mode` ]: 'exclusion',
			},
		} )
		cy.resetStyle( 'Adv. Background Image Settings' )
		cy.adjust( 'Adv. Background Image Settings', {
			[ `Image Size` ]: 'custom',
			[ `Custom Size` ]: {
				value: 241,
				unit: 'px',
			},
		} ).assertComputedStyle( {
			'.ugb-spacer--inner': {
				[ `background-size` ]: '241px',
			},
		} )

		// Test Top and Bottom Separator
		assertSeparators( { viewport: 'Desktop' } )
	} )
} )
