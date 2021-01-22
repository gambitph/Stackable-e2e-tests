/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest,
} from '~stackable-e2e/helpers'

describe( 'Expand Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/expand', '.ugb-expand' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/expand' ) )

	it( 'should adjust desktop options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/expand' )
		cy.openInspector( 'ugb/expand', 'Style' )

		// Test General options
		const aligns = [ 'left', 'center', 'right' ]
		aligns.forEach( align => {
			cy.adjust( 'Align', align ).assertComputedStyle( {
				'.ugb-inner-block': {
					[ `text-align` ]: align,
				},
			} )
		} )

		// Test Title options
		cy.collapse( 'Title' )
		cy.adjust( 'Title HTML Tag', 'h6' )
			.assertHtmlTag( '.ugb-expand__title', 'h6' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Monospace',
			[ `Size` ]: 50,
			[ `Weight` ]: '100',
			[ `Transform` ]: 'none',
			[ `Line-Height` ]: 0.1,
			[ `Letter Spacing` ]: 1.9,
		} )
		cy.adjust( 'Title Color', '#ff0000' )
		cy.adjust( 'Size', 27 ).assertComputedStyle( {
			'.ugb-expand__title': {
				[ `font-size` ]: '27px',
				[ `font-weight` ]: '100',
				[ `text-transform` ]: 'none',
				[ `letter-spacing` ]: '1.9px',
				[ `color` ]: '#ff0000',
			},
		} )
		const titleAligns = [ 'left', 'center', 'right' ]
		titleAligns.forEach( align => {
			cy.adjust( 'Align', align ).assertComputedStyle( {
				'.ugb-expand__title': {
					[ `text-align` ]: align,
				},
			} )
		} )

		// Test Text options
		cy.collapse( 'Text' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Serif',
			[ `Size` ]: 50,
			[ `Weight` ]: '100',
			[ `Line-Height` ]: 1.8,
			[ `Letter Spacing` ]: 1.9,
		} )
		cy.adjust( 'Size', 1.25, { unit: 'em' } )
		cy.resetStyle( 'Size' )
		cy.adjust( 'Size', 20, { unit: 'px' } )
		cy.adjust( 'Text Color', '#ff0000' ).assertComputedStyle( {
			'.ugb-expand__less-text p, .ugb-expand__more-text p': {
				[ `font-size` ]: '20px',
				[ `font-weight` ]: '100',
				[ `letter-spacing` ]: '1.9px',
				[ `color` ]: '#ff0000',
			},
		} )
		const textAligns = [ 'left', 'center', 'right' ]
		textAligns.forEach( align => {
			cy.adjust( 'Align', align ).assertComputedStyle( {
				'.ugb-expand__less-text p, .ugb-expand__more-text p': {
					[ `text-align` ]: align,
				},
			} )
		} )

		// Test Link options
		cy.collapse( 'Link' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Sans-Serif',
			[ `Size` ]: 18,
			[ `Weight` ]: '100',
			[ `Line-Height` ]: 1.7,
			[ `Letter Spacing` ]: 1.9,
		} )
		cy.adjust( 'Size', 1.25, { unit: 'em' } )
		cy.resetStyle( 'Size' )
		cy.adjust( 'Size', 20, { unit: 'px' } )
		cy.adjust( 'Link Color', '#ff6666' ).assertComputedStyle( {
			'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
				[ `font-size` ]: '20px',
				[ `font-weight` ]: '100',
				[ `letter-spacing` ]: '1.9px',
				[ `color` ]: '#ff6666',
			},
		} )
		const linkAligns = [ 'left', 'center', 'right' ]
		linkAligns.forEach( align => {
			cy.adjust( 'Align', align ).assertComputedStyle( {
				'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
					[ `text-align` ]: align,
				},
			} )
		} )

		// Test Spacing options
		cy.collapse( 'Spacing' )
		cy.adjust( 'Title', 44 ).assertComputedStyle( {
			'.ugb-expand__title': {
				[ `margin-bottom` ]: '44px',
			},
		} )
		cy.adjust( 'Text', 12 ).assertComputedStyle( {
			'.ugb-expand__less-text, .ugb-expand__more-text': {
				[ `margin-bottom` ]: '12px',
			},
		} )
		cy.adjust( 'Link', 39 ).assertComputedStyle( {
			'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
				[ `margin-bottom` ]: '39px',
			},
		} )
	} )

	it( 'should adjust tablet options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/expand' )
		cy.openInspector( 'ugb/expand', 'Style' )

		// Test General options
		const aligns = [ 'left', 'center', 'right' ]
		aligns.forEach( align => {
			cy.adjust( 'Align', align, { viewport: 'Tablet' } ).assertComputedStyle( {
				'.ugb-inner-block': {
					[ `text-align` ]: align,
				},
			} )
		} )

		// Test Title options
		cy.collapse( 'Title' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Serif',
			[ `Size` ]: 50,
			[ `Weight` ]: '100',
			[ `Transform` ]: 'none',
			[ `Line-Height` ]: 1.1,
			[ `Letter Spacing` ]: 1.9,
		}, { viewport: 'Tablet' } )
		cy.adjust( 'Size', 27, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-expand__title': {
				[ `font-size` ]: '27px',
				[ `font-weight` ]: '100',
				[ `text-transform` ]: 'none',
				[ `letter-spacing` ]: '1.9px',
			},
		} )
		const titleAligns = [ 'left', 'center', 'right' ]
		titleAligns.forEach( align => {
			cy.adjust( 'Align', align, { viewport: 'Tablet' } ).assertComputedStyle( {
				'.ugb-expand__title': {
					[ `text-align` ]: align,
				},
			} )
		} )

		// Test Text options
		cy.collapse( 'Text' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Monospace',
			[ `Size` ]: 50,
			[ `Weight` ]: '300',
			[ `Line-Height` ]: 1.8,
			[ `Letter Spacing` ]: 2.1,
		}, { viewport: 'Tablet' } )
		cy.adjust( 'Size', 20, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-expand__less-text p, .ugb-expand__more-text p': {
				[ `font-size` ]: '20px',
				[ `font-weight` ]: '300',
				[ `letter-spacing` ]: '2.1px',
			},
		} )
		const textAligns = [ 'left', 'center', 'right' ]
		textAligns.forEach( align => {
			cy.adjust( 'Align', align, { viewport: 'Tablet' } ).assertComputedStyle( {
				'.ugb-expand__less-text p, .ugb-expand__more-text p': {
					[ `text-align` ]: align,
				},
			} )
		} )

		// Test Link options
		cy.collapse( 'Link' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Sans-Serif',
			[ `Size` ]: 18,
			[ `Weight` ]: '100',
			[ `Line-Height` ]: 1.7,
			[ `Letter Spacing` ]: 1.9,
		}, { viewport: 'Tablet' } )
		cy.adjust( 'Size', 20, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
				[ `font-size` ]: '20px',
				[ `font-weight` ]: '100',
				[ `letter-spacing` ]: '1.9px',
			},
		} )
		const linkAligns = [ 'left', 'center', 'right' ]
		linkAligns.forEach( align => {
			cy.adjust( 'Align', align, { viewport: 'Tablet' } ).assertComputedStyle( {
				'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
					[ `text-align` ]: align,
				},
			} )
		} )

		// Test Spacing options
		cy.collapse( 'Spacing' )
		cy.adjust( 'Title', 38, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-expand__title': {
				[ `margin-bottom` ]: '38px',
			},
		} )
		cy.adjust( 'Text', 23, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-expand__less-text, .ugb-expand__more-text': {
				[ `margin-bottom` ]: '23px',
			},
		} )
		cy.adjust( 'Link', 42, { viewport: 'Tablet' } ).assertComputedStyle( {
			'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
				[ `margin-bottom` ]: '42px',
			},
		} )
	} )

	it( 'should adjust mobile options inside style tab', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/expand' )
		cy.openInspector( 'ugb/expand', 'Style' )

		// Test General options
		const aligns = [ 'left', 'center', 'right' ]
		aligns.forEach( align => {
			cy.adjust( 'Align', align, { viewport: 'Mobile' } ).assertComputedStyle( {
				'.ugb-inner-block': {
					[ `text-align` ]: align,
				},
			} )
		} )

		// Test Title options
		cy.collapse( 'Title' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Serif',
			[ `Size` ]: 50,
			[ `Weight` ]: '100',
			[ `Transform` ]: 'none',
			[ `Line-Height` ]: 1.1,
			[ `Letter Spacing` ]: 1.9,
		}, { viewport: 'Mobile' } )
		cy.adjust( 'Size', 27, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-expand__title': {
				[ `font-size` ]: '27px',
				[ `font-weight` ]: '100',
				[ `text-transform` ]: 'none',
				[ `letter-spacing` ]: '1.9px',
			},
		} )
		const titleAligns = [ 'left', 'center', 'right' ]
		titleAligns.forEach( align => {
			cy.adjust( 'Align', align, { viewport: 'Mobile' } ).assertComputedStyle( {
				'.ugb-expand__title': {
					[ `text-align` ]: align,
				},
			} )
		} )

		// Test Text options
		cy.collapse( 'Text' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Serif',
			[ `Size` ]: 50,
			[ `Weight` ]: '300',
			[ `Line-Height` ]: 1.8,
			[ `Letter Spacing` ]: 2.1,
		}, { viewport: 'Mobile' } )
		cy.adjust( 'Size', 20, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-expand__less-text p, .ugb-expand__more-text p': {
				[ `font-size` ]: '20px',
				[ `font-weight` ]: '300',
				[ `letter-spacing` ]: '2.1px',
			},
		} )
		const textAligns = [ 'left', 'center', 'right' ]
		textAligns.forEach( align => {
			cy.adjust( 'Align', align, { viewport: 'Mobile' } ).assertComputedStyle( {
				'.ugb-expand__less-text p, .ugb-expand__more-text p': {
					[ `text-align` ]: align,
				},
			} )
		} )

		// Test Link options
		cy.collapse( 'Link' )
		cy.adjust( 'Typography', {
			[ `Font Family` ]: 'Monospace',
			[ `Size` ]: 18,
			[ `Weight` ]: '100',
			[ `Line-Height` ]: 1.7,
			[ `Letter Spacing` ]: 1.9,
		}, { viewport: 'Mobile' } )
		cy.adjust( 'Size', 20, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
				[ `font-size` ]: '20px',
				[ `font-weight` ]: '100',
				[ `letter-spacing` ]: '1.9px',
			},
		} )
		const linkAligns = [ 'left', 'center', 'right' ]
		linkAligns.forEach( align => {
			cy.adjust( 'Align', align, { viewport: 'Mobile' } ).assertComputedStyle( {
				'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
					[ `text-align` ]: align,
				},
			} )
		} )

		// Test Spacing options
		cy.collapse( 'Spacing' )
		cy.adjust( 'Title', 24, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-expand__title': {
				[ `margin-bottom` ]: '24px',
			},
		} )
		cy.adjust( 'Text', 31, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-expand__less-text, .ugb-expand__more-text': {
				[ `margin-bottom` ]: '31px',
			},
		} )
		cy.adjust( 'Link', 37, { viewport: 'Mobile' } ).assertComputedStyle( {
			'.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text': {
				[ `margin-bottom` ]: '37px',
			},
		} )
	} )
} )
