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
		cy.adjust( 'Height', 30, { unit: 'vh' } ).assertComputedStyle( {
			'.ugb-spacer': {
				[ `height` ]: '30vh',
			},
		} )

		cy.adjust( 'Color Type', 'single' )
		cy.adjust( 'Background Color', '#000000' )
		cy.adjust( 'Background Color Opacity', 0.6 ).assertComputedStyle( {
			'.ugb-spacer--inner': {
				[ `background-color` ]: 'rgba(0, 0, 0, 0.6)',
			},
		} )

		cy.adjust( 'Color Type', 'gradient' )
		cy.adjust( 'Background Color #1', '#ff5c5c' )
		cy.adjust( 'Background Color #2', '#7bff5a' )
		cy.adjust( 'Adv. Gradient Color Settings', {
			[ `Gradient Direction (degrees)` ]: 160,
			[ `Color 1 Location` ]: 28,
			[ `Color 2 Location` ]: 75,
			[ `Background Gradient Blend Mode` ]: 'hue',
		} ).assertComputedStyle( {
			'.ugb-spacer--inner:before': {
				[ `background-image` ]: 'linear-gradient(#ff5c5c 28%, #7bff5a 75%)',
				[ `mix-blend-mode` ]: 'hue',
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
		// Add Custom Size Test unit: vw

		// Test Top and Bottom Separator
		assertSeparators( { viewport: 'Desktop' } )
	} )

	it( 'should adjust tablet options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/spacer' )
		cy.openInspector( 'ugb/spacer', 'Style' )

		// Test General options
		cy.collapse( 'General' )
		cy.adjust( 'Height', 194, { viewport: 'Tablet', unit: 'px' } ).assertComputedStyle( {
			'.ugb-spacer': {
				[ `height` ]: '194px',
			},
		} )
		cy.resetStyle( 'Height' )
		cy.adjust( 'Height', 30, { viewport: 'Tablet', unit: 'vh' } ).assertComputedStyle( {
			'.ugb-spacer': {
				[ `height` ]: '30vh',
			},
		} )

		cy.setBlockAttribute( {
			[ `tabletBackgroundMediaUrl` ]: 'http://sandbox.gambit.ph/for-test/wp-content/uploads/sites/85/2020/12/avi-richards-ojBNujxI2_c-unsplash.jpg',
		} )

		cy.adjust( 'Adv. Background Image Settings', {
			[ `Image Position` ]: {
				viewport: 'Tablet',
				value: 'top left',
			},
			[ `Image Repeat` ]: {
				viewport: 'Tablet',
				value: 'no-repeat',
			},
			[ `Image Size` ]: {
				viewport: 'Tablet',
				value: 'custom',
			},
			[ `Custom Size` ]: {
				viewport: 'Tablet',
				value: 806,
				unit: 'px',
			},
		} ).assertComputedStyle( {
			'.ugb-spacer--inner': {
				[ `background-size` ]: '806px',
			},
		} )

		// Test Top and Bottom Separator
		assertSeparators( { viewport: 'Tablet' } )
	} )

	it( 'should adjust mobile options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/spacer' )
		cy.openInspector( 'ugb/spacer', 'Style' )

		// Test General options
		cy.collapse( 'General' )
		cy.adjust( 'Height', 194, { viewport: 'Mobile', unit: 'px' } ).assertComputedStyle( {
			'.ugb-spacer': {
				[ `height` ]: '194px',
			},
		} )
		cy.resetStyle( 'Height' )
		cy.adjust( 'Height', 30, { viewport: 'Mobile', unit: 'vh' } ).assertComputedStyle( {
			'.ugb-spacer': {
				[ `height` ]: '30vh',
			},
		} )

		cy.setBlockAttribute( {
			[ `mobileBackgroundMediaUrl` ]: 'http://sandbox.gambit.ph/for-test/wp-content/uploads/sites/85/2020/12/avi-richards-ojBNujxI2_c-unsplash.jpg',
		} )

		cy.adjust( 'Adv. Background Image Settings', {
			[ `Image Position` ]: {
				viewport: 'Mobile',
				value: 'top left',
			},
			[ `Image Repeat` ]: {
				viewport: 'Mobile',
				value: 'no-repeat',
			},
			[ `Image Size` ]: {
				viewport: 'Mobile',
				value: 'custom',
			},
			[ `Custom Size` ]: {
				viewport: 'Mobile',
				value: 806,
				unit: 'px',
			},
		} ).assertComputedStyle( {
			'.ugb-spacer--inner': {
				[ `background-size` ]: '806px',
			},
		} )

		// Test Top and Bottom Separator
		assertSeparators( { viewport: 'Mobile' } )
	} )
} )
