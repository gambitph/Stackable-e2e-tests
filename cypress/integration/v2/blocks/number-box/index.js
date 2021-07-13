
/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, assertContainerLink, assertBlockTitleDescriptionContent, responsiveAssertHelper, assertAligns, assertTypography, assertBlockTitleDescription, assertBlockBackground, assertSeparators, assertContainer, assertAdvancedTab,
} from '~stackable-e2e/helpers'
import {
	startCase, range, lowerCase,
} from 'lodash'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced' } )

export {
	blockExist,
	blockError,
	switchLayout,
	switchDesign,
	typeContent,
	desktopStyle,
	tabletStyle,
	mobileStyle,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'ugb/number-box', '.ugb-number-box' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/number-box' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/number-box', [
		'Basic',
		{ value: 'Plain', selector: '.ugb-number-box--design-plain' },
		{ value: 'Background', selector: '.ugb-number-box--design-background' },
		{ value: 'Heading', selector: '.ugb-number-box--design-heading' },
		{ value: 'heading2', selector: '.ugb-number-box--design-heading2' },
		{ value: 'Faded', selector: '.ugb-number-box--design-faded' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/number-box', [
		'Angled Number Box',
		'Aurora Number Box',
		'Capital Number Box',
		'Cary Number Box',
		'Elevate Number Box',
		'Flex Number Box',
		'Hue Number Box',
		'Lounge Number Box',
		'Lume Number Box',
		'Lush Number Box',
		'Propel Number Box',
		'Speck Number Box',
	] ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/number-box' ).asBlock( 'numberBoxBlock', { isStatic: true } )

		cy.typeBlock( 'ugb/number-box', '.ugb-number-box__title', 'Hello World! 1' )
			.assertBlockContent( '.ugb-number-box__title', 'Hello World! 1' )
		cy.typeBlock( 'ugb/number-box', '.ugb-number-box__description', 'Helloo World!! 12' )
			.assertBlockContent( '.ugb-number-box__description', 'Helloo World!! 12' )

		cy.openInspector( 'ugb/number-box', 'Style' )
		assertBlockTitleDescriptionContent( 'ugb/number-box' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/number-box' ).asBlock( 'numberBoxBlock', { isStatic: true } )
		cy.openInspector( 'ugb/number-box', 'Style' )
		cy.collapse( 'General' )
		cy.adjust( 'Columns', 3 )
	} )

	// eslint-disable-next-line no-undef
	afterEach( () => cy.assertFrontendStyles( '@numberBoxBlock' ) )

	it( `should assert General options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'General' )
		desktopOnly( () => {
			cy.adjust( 'Columns', 3 )
			cy.get( '.ugb-number-box__item3' ).should( 'exist' )
		} )
		assertAligns( 'Align', '.ugb-inner-block', { viewport } )
	} )

	it( `should assert Container options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Container' )
		assertContainer( '.ugb-number-box__item', { viewport }, 'column%sBackgroundMediaUrl' )
	} )

	it( `should assert Spacing options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Spacing' )
		cy.adjust( 'Paddings', [ 25, 26, 27, 28 ], { viewport, unit: 'px' } ).assertComputedStyle( {
			'.ugb-number-box__item': {
				'padding-top': '25px',
				'padding-right': '26px',
				'padding-bottom': '27px',
				'padding-left': '28px',
			},
		} )
		cy.adjust( 'Paddings', [ 3, 4, 5, 6 ], { viewport, unit: 'em' } ).assertComputedStyle( {
			'.ugb-number-box__item': {
				'padding-top': '3em',
				'padding-right': '4em',
				'padding-bottom': '5em',
				'padding-left': '6em',
			},
		} )
		cy.adjust( 'Paddings', [ 17, 18, 19, 20 ], { viewport, unit: '%' } ).assertComputedStyle( {
			'.ugb-number-box__item': {
				'padding-top': '17%',
				'padding-right': '18%',
				'padding-bottom': '19%',
				'padding-left': '20%',
			},
		} )

		cy.adjust( 'Number', 33, { viewport } )
		cy.adjust( 'Title', 43, { viewport } )
		cy.adjust( 'Description', 53, { viewport } ).assertComputedStyle( {
			'.ugb-number-box__number': {
				'margin-bottom': '33px',
			},
			'.ugb-number-box__title': {
				'margin-bottom': '43px',
			},
			'.ugb-number-box__description': {
				'margin-bottom': '53px',
			},
		} )
	} )

	it( `should assert Number options in ${ lowerCase( viewport ) }`, () => {
		cy.collapse( 'Number' )
		assertTypography( '.ugb-number-box__number', { viewport } )
		cy.adjust( 'Size', 47, { viewport, unit: 'px' } ).assertComputedStyle( {
			'.ugb-number-box__number': {
				'font-size': '47px',
			},
		} )
		cy.adjust( 'Size', 4, { viewport, unit: 'em' } ).assertComputedStyle( {
			'.ugb-number-box__number': {
				'font-size': '4em',
			},
		} )
		cy.adjust( 'Shape Size', 2, { viewport } ).assertComputedStyle( {
			'.ugb-number-box__number': {
				'height': '2em',
				'width': '2em',
			},
		} )
		desktopOnly( () => {
			cy.adjust( 'Number 1 Label', '10' )
			cy.adjust( 'Number 2 Label', '20' )
			cy.adjust( 'Number 3 Label', '30' )
			cy.get( '.ugb-number-box__item1' )
				.find( 'div.ugb-number-box__number' )
				.contains( '10' )
				.should( 'exist' )
			cy.get( '.ugb-number-box__item2' )
				.find( 'div.ugb-number-box__number' )
				.contains( '20' )
				.should( 'exist' )
			cy.get( '.ugb-number-box__item3' )
				.find( 'div.ugb-number-box__number' )
				.contains( '30' )
				.should( 'exist' )

			cy.adjust( 'Number Shape', 'none' ).assertClassName( '.ugb-number-box', 'ugb-number-box--number-style-none' )
			cy.adjust( 'Number Shape', 'square' ).assertClassName( '.ugb-number-box', 'ugb-number-box--number-style-square' )

			cy.adjust( 'Number Background Color', '#d1dfe4' )
			cy.adjust( 'Number Color', '#000000' )
			cy.adjust( 'Opacity', 0.5 ).assertComputedStyle( {
				'.ugb-number-box__number': {
					'background-color': '#d1dfe4',
					'color': '#000000',
					'opacity': '0.5',
				},
			} )
		} )

		cy.adjust( 'Align', 'left', { viewport } ).assertComputedStyle( {
			'.ugb-number-box__number': {
				'margin-left': '0px',
				'margin-right': 'auto',
			},
		} )
		cy.adjust( 'Align', 'center', { viewport } ).assertComputedStyle( {
			'.ugb-number-box__number': {
				'margin-right': 'auto',
				'margin-left': 'auto',
			},
		} )
		cy.adjust( 'Align', 'right', { viewport } ).assertComputedStyle( {
			'.ugb-number-box__number': {
				'margin-right': '0px',
				'margin-left': 'auto',
			},
		} )
	} )

	it( `should assert Title & Description options in ${ lowerCase( viewport ) }`, () => {
		const typographyAssertions = [ 'title', 'description' ]
		typographyAssertions.forEach( typographyAssertion => {
			const label = startCase( typographyAssertion )
			cy.collapse( label )
			if ( typographyAssertion === 'title' ) {
				desktopOnly( () => {
					cy.adjust( 'Title HTML Tag', 'h4' ).assertHtmlTag( '.ugb-number-box__title', 'h4' )
				} )
			}

			desktopOnly( () => {
				cy.adjust( `${ label } Color`, '#742f2f' ).assertComputedStyle( {
					[ `.ugb-number-box__${ typographyAssertion }` ]: {
						'color': '#742f2f',
					},
				} )
			} )

			cy.adjust( 'Size', 55, { viewport, unit: 'px' } ).assertComputedStyle( {
				[ `.ugb-number-box__${ typographyAssertion }` ]: {
					'font-size': '55px',
				},
			} )
			cy.adjust( 'Size', 2, { viewport, unit: 'em' } ).assertComputedStyle( {

				[ `.ugb-number-box__${ typographyAssertion }` ]: {
					'font-size': '2em',
				},
			} )

			assertTypography( `.ugb-number-box__${ typographyAssertion }`, { viewport } )
			assertAligns( 'Align', `.ugb-number-box__${ typographyAssertion }`, { viewport } )
		} )
	} )

	it( `should assert Block Title & Description options in ${ lowerCase( viewport ) }`, () => {
		assertBlockTitleDescription( { viewport } )
	} )

	it( `should assert Block Background options in ${ lowerCase( viewport ) }`, () => {
		assertBlockBackground( '.ugb-number-box', { viewport } )
	} )

	it( `should assert Top & Bottom Separator options in ${ lowerCase( viewport ) }`, () => {
		assertSeparators( { viewport } )
	} )

	it( `should assert Container Link options in ${ lowerCase( viewport ) }`, () => {
		assertContainerLink( '.ugb-number-box__item', { viewport } )
	} )
}

function advancedTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/number-box' ).asBlock( 'numberBoxBlock', { isStatic: true } )
	cy.openInspector( 'ugb/number-box', 'Advanced' )

	assertAdvancedTab( '.ugb-number-box', {
		viewport,
		customCssSelectors: [
			'.ugb-number-box__item',
			'.ugb-number-box__number',
			'.ugb-number-box__content',
			'.ugb-number-box__title',
			'.ugb-number-box__description',
		],
	} )

	desktopOnly( () => {
		range( 1, 3 ).forEach( idx => {
			cy.collapse( `Column #${ idx }` )
			cy.adjust( 'Column Background', '#447c94' )
			cy.adjust( 'Number Background', '#3c464a' ).assertComputedStyle( {
				[ `.ugb-number-box__item${ idx }` ]: {
					'background-color': '#447c94',
				},
				[ `.ugb-number-box__item${ idx } .ugb-number-box__number` ]: {
					'background-color': '#3c464a',
				},
			} )
		} )
	} )
	cy.assertFrontendStyles( '@numberBoxBlock' )
}
