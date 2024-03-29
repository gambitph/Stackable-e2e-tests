/**
 * External dependencies
 */
import {
	lowerCase, range, startCase,
} from 'lodash'
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts, assertContainerLink, assertBlockTitleDescriptionContent, responsiveAssertHelper, assertAligns, assertContainer, assertTypography, assertBlockTitleDescription, assertBlockBackground, assertSeparators, assertAdvancedTab,
} from '~stackable-e2e/helpers'

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
	it( 'should show the block', assertBlockExist( 'ugb/team-member', '.ugb-team-member' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/team-member' ) )
}

function switchLayout() {
	it( 'should switch layout', switchLayouts( 'ugb/team-member', [
		{ value: 'Basic', selector: '.ugb-team-member--design-basic' },
		{ value: 'Plain', selector: '.ugb-team-member--design-plain' },
		{ value: 'Horizontal', selector: '.ugb-team-member--design-horizontal' },
		{ value: 'Overlay', selector: '.ugb-team-member--design-overlay' },
		{ value: 'Overlay Simple', selector: '.ugb-team-member--design-overlay-simple' },
		{ value: 'Half', selector: '.ugb-team-member--design-half' },
	] ) )
}

function switchDesign() {
	it( 'should switch design', switchDesigns( 'ugb/team-member', [
		'Capital Team Member',
		'Cary Team Member 1',
		'Cary Team Member 2',
		'Decora Team Member',
		'Detour Team Member',
		'Dim Team Member',
		'Elevate Team Member',
		'Glow Team Member',
		'Heights Team Member',
		'Hue Team Member',
		'Lume Team Member',
		'Lush Team Member',
		'Prime Team Member',
		'Seren Team Member 1',
		'Seren Team Member 2',
		'Upland Team Member',
	] ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/team-member' ).asBlock( 'teamMemberBlock', { isStatic: true } )

		cy.typeBlock( 'ugb/team-member', '.ugb-team-member__item1 .ugb-team-member__name', 'Hello World! 1', 0 )
			.assertBlockContent( '.ugb-team-member__item1 .ugb-team-member__name', 'Hello World! 1' )
		cy.typeBlock( 'ugb/team-member', '.ugb-team-member__item1 .ugb-team-member__position', 'Helloo World!! 12', 0 )
			.assertBlockContent( '.ugb-team-member__item1 .ugb-team-member__position', 'Helloo World!! 12' )
		cy.typeBlock( 'ugb/team-member', '.ugb-team-member__item1 .ugb-team-member__description', 'Hellooo World!!! 123', 0 )
			.assertBlockContent( '.ugb-team-member__item1 .ugb-team-member__description', 'Hellooo World!!! 123' )

		cy.openInspector( 'ugb/team-member', 'Style' )
		assertBlockTitleDescriptionContent( 'ugb/team-member' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'ugb/team-member' ).asBlock( 'teamMemberBlock', { isStatic: true } )
		cy.openInspector( 'ugb/team-member', 'Style' )
		cy.collapse( 'General' )
		cy.adjust( 'Columns', 3 )
		range( 1, 4 ).forEach( idx => {
			cy.setBlockAttribute( {
				[ `image${ idx }Url` ]: Cypress.env( 'DUMMY_IMAGE_URL' ),
			} )
		} )
	} )

	afterEach( () => cy.assertFrontendStyles( '@teamMemberBlock' ) )

	it( `should assert General options in ${ lowerCase( viewport ) }`, () => {
		// General Tab
		cy.collapse( 'General' )
		cy.adjust( 'Columns', 3 )
		desktopOnly( () => {
			cy.get( '.ugb-team-member__item3' ).should( 'exist' )
		} )
		assertAligns( 'Align', '.ugb-inner-block', { viewport } )
	} )

	it( `should assert Container options in ${ lowerCase( viewport ) }`, () => {
		// Container Tab
		cy.collapse( 'Container' )
		assertContainer( '.ugb-team-member__item', { viewport }, 'column%sBackgroundMediaUrl' )
	} )

	it( `should assert Spacing options in ${ lowerCase( viewport ) }`, () => {
	// Spacing Tab
		cy.collapse( 'Spacing' )

		cy.adjust( 'Paddings', [ 25, 26, 27, 28 ], { viewport, unit: 'px' } ).assertComputedStyle( {
			'.ugb-team-member__item': {
				'padding-top': '25px',
				'padding-right': '26px',
				'padding-bottom': '27px',
				'padding-left': '28px',
			},
		} )
		cy.adjust( 'Paddings', [ 3, 4, 5, 6 ], { viewport, unit: 'em' } ).assertComputedStyle( {
			'.ugb-team-member__item': {
				'padding-top': '3em',
				'padding-right': '4em',
				'padding-bottom': '5em',
				'padding-left': '6em',
			},
		} )
		cy.adjust( 'Paddings', [ 17, 18, 19, 20 ], { viewport, unit: '%' } ).assertComputedStyle( {
			'.ugb-team-member__item': {
				'padding-top': '17%',
				'padding-right': '18%',
				'padding-bottom': '19%',
				'padding-left': '20%',
			},
		} )

		cy.adjust( 'Image', 3, { viewport } )
		cy.adjust( 'Name', 8, { viewport } )
		cy.adjust( 'Position', 13, { viewport } )
		cy.adjust( 'Description', 18, { viewport } )
		cy.adjust( 'Social', 13, { viewport } )
		cy.adjust( 'Social Button Gap', 10, { viewport } )
			.assertComputedStyle( {
				'.ugb-team-member__image': {
					'margin-bottom': '3px',
				},
				'.ugb-team-member__name': {
					'margin-bottom': '8px',
				},
				'.ugb-team-member__position': {
					'margin-bottom': '13px',
				},
				'.ugb-team-member__description': {
					'margin-bottom': '18px',
				},
				'.ugb-button-container': {
					'margin-bottom': '13px',
				},
				'.ugb-button': {
					'margin-left': '10px',
					'margin-right': '10px',
				},
			} )
	} )

	it( `should assert Image options in ${ lowerCase( viewport ) }`, () => {
		// Image Tab
		cy.collapse( 'Image' )
		desktopOnly( () => {
			cy.adjust( 'Shape', {
				label: 'Blob 1',
				value: 'blob1',
			} )
			cy.adjust( 'Flip Shape Horizontally', true )
			cy.adjust( 'Flip Shape Vertically', true )
			cy.adjust( 'Stretch Shape Mask', true ).assertClassName( 'img.ugb-img--shape', 'ugb-image--shape-stretch' )

		// We won't be able to assert image size for now since it requires server handling.
		} )

		cy.adjust( 'Image Width', 300, { viewport } ).assertComputedStyle( {
			'.ugb-img': {
				'width': '300px',
			},
		} )
		desktopOnly( () => {
			cy.adjust( 'Force square image', true ).assertComputedStyle( {
				'.ugb-img': {
					'height': '300px',
				},
			} )
		} )

		cy.adjust( 'Align', 'left', { viewport } ).assertComputedStyle( {
			'.ugb-team-member__image': {
				'margin-left': '0px',
				'margin-right': 'auto',
			},
		} )
		cy.adjust( 'Align', 'center', { viewport } ).assertComputedStyle( {
			'.ugb-team-member__image': {
				'margin-left': 'auto',
				'margin-right': 'auto',
			},
		} )
		cy.adjust( 'Align', 'right', { viewport } ).assertComputedStyle( {
			'.ugb-team-member__image': {
				'margin-left': 'auto',
				'margin-right': '0px',
			},
		} )
	} )

	it( `should assert Name, Position and Description options in ${ lowerCase( viewport ) }`, () => {
	// Name, Position and Description Tabs
		const typographyAssertions = [ 'name', 'position', 'description' ]
		typographyAssertions.forEach( typographyAssertion => {
			const label = startCase( typographyAssertion )
			cy.collapse( label )
			if ( typographyAssertion === 'name' ) {
				desktopOnly( () => {
					cy.adjust( 'Title HTML Tag', 'h4' ).assertHtmlTag( '.ugb-team-member__name', 'h4' )
				} )
			}

			desktopOnly( () => {
				cy.adjust( `${ label } Color`, '#742f2f' ).assertComputedStyle( {
					[ `.ugb-team-member__${ typographyAssertion }` ]: {
						'color': '#742f2f',
					},
				} )
			} )

			cy.adjust( 'Size', 55, { viewport, unit: 'px' } ).assertComputedStyle( {
				[ `.ugb-team-member__${ typographyAssertion }` ]: {
					'font-size': '55px',
				},
			} )
			cy.adjust( 'Size', 2, { viewport, unit: 'em' } ).assertComputedStyle( {
				[ `.ugb-team-member__${ typographyAssertion }` ]: {
					'font-size': '2em',
				},
			} )

			assertTypography( `.ugb-team-member__${ typographyAssertion }`, { viewport } )
			assertAligns( 'Align', `.ugb-team-member__${ typographyAssertion }`, { viewport } )
		} )
	} )

	it( `should assert Social options in ${ lowerCase( viewport ) }`, () => {
	// Social Tab
		cy.collapse( 'Social' )

		desktopOnly( () => {
			cy.adjust( 'Pinterest', true )
			cy.adjust( 'LinkedIn', true )
			cy.adjust( 'YouTube', true )
			cy.get( 'a.ugb-button-pinterest' ).should( 'exist' )
			cy.get( 'a.ugb-button-linkedin' ).should( 'exist' )
			cy.get( 'a.ugb-button-youtube' ).should( 'exist' )

			const buttonDesigns = [ 'ghost', 'plain' ]
			buttonDesigns.forEach( design => {
				cy.adjust( 'Design', {
					label: startCase( design ),
					value: design,
				} ).assertClassName( '.ugb-social-button', `ugb-button--design-${ design }` )
			} )
			cy.adjust( 'Design', {
				label: 'Basic',
				value: 'basic',
			} )
			cy.adjust( 'Use social colors', true ).assertClassName( '.ugb-social-button', 'ugb-social-button--social-colors' )
			cy.adjust( 'Use social colors', false )
			cy.adjust( 'Color Type', 'gradient' )
			cy.adjust( 'Button Color #1', '#a13939' )
			cy.adjust( 'Button Color #2', '#4e59d4' )
			cy.adjust( 'Gradient Direction (degrees)', 138 )
			cy.adjust( 'Text Color', '#ffa03b' )
			cy.adjust( 'Hover Effect', 'scale' ).assertClassName( '.ugb-button', 'ugb--hover-effect-scale' )
			cy.adjust( 'Hover Opacity', 0.6 )
			cy.adjust( 'Hover Colors', {
				'Button Color #1': '#bd8b8b',
				'Button Color #2': '#3fa35b',
				'Gradient Direction (degrees)': 72,
				'Text Color': '#80194d',
			} )
			cy.adjust( 'Button Size', 'small' ).assertClassName( '.ugb-button', 'ugb-button--size-small' )
			cy.adjust( 'Border Radius', 40 )
			cy.adjust( 'Vertical Padding', 15 )
			cy.adjust( 'Horizontal Padding', 20 )
			cy.adjust( 'Shadow', 4 )
			cy.adjust( 'Opacity', 0.6 ).assertComputedStyle( {
				'.ugb-button svg:not(.ugb-custom-icon)': {
					'color': '#ffa03b',
				},
				'.ugb-button': {
					'background-color': '#a13939',
					'background-image': 'linear-gradient(138deg, #a13939, #4e59d4)',
					'padding-top': '15px',
					'padding-right': '20px',
					'padding-bottom': '15px',
					'padding-left': '20px',
					'opacity': '0.6',
					'border-radius': '40px',
				},
			} )
		} )
		assertAligns( 'Align', '.ugb-team-member__buttons', { viewport } )
	} )

	it( `should assert Effects options in ${ lowerCase( viewport ) }`, () => {
	// Effects option
		desktopOnly( () => {
			cy.collapse( 'Effects' )
			const effects = [
				'shadow',
				'lift',
				'lift-more',
				'lift-shadow',
				'lift-staggered',
				'lift-shadow-staggered',
				'scale',
				'scale-more',
				'scale-shadow',
				'lower',
				'lower-more',
			]
			effects.forEach( effect => {
				cy.adjust( 'Hover Effect', effect )
					.assertClassName( '.ugb-team-member__item', `ugb--hover-${ effect }` )
			} )
			cy.adjust( 'Color on Hover', true ).assertClassName( '.ugb-team-member', 'ugb-team-member--color-on-hover' )
		} )
	} )

	it( `should assert Block Title & Description options in ${ lowerCase( viewport ) }`, () => {
		assertBlockTitleDescription( { viewport } )
	} )

	it( `should assert Block Background options in ${ lowerCase( viewport ) }`, () => {
		assertBlockBackground( '.ugb-team-member', { viewport } )
	} )

	it( `should assert Top & Bottom Separator options in ${ lowerCase( viewport ) }`, () => {
		assertSeparators( { viewport } )
	} )

	it( `should assert Container Link options in ${ lowerCase( viewport ) }`, () => {
		assertContainerLink( '.ugb-team-member__item', { viewport } )
	} )
}

function advancedTab( viewport, desktopOnly ) {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( 'ugb/team-member' ).asBlock( 'teamMemberBlock', { isStatic: true } )
	cy.openInspector( 'ugb/team-member', 'Advanced' )

	assertAdvancedTab( '.ugb-team-member', {
		viewport,
		customCssSelectors: [
			'.ugb-team-member__item',
			'.ugb-team-member__content',
			'.ugb-team-member__name',
			'.ugb-team-member__position',
			'.ugb-team-member__description',
		],
	} )

	desktopOnly( () => {
		cy.setBlockAttribute( {
			'image1Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
			'image2Url': Cypress.env( 'DUMMY_IMAGE_URL' ),
		} )
		range( 1, 3 ).forEach( idx => {
			cy.collapse( `Column #${ idx }` )
			cy.adjust( 'Column Background', '#a03b3b' ).assertComputedStyle( {
				[ `.ugb-team-member__item${ idx }` ]: {
					'background-color': '#a03b3b',
				},
			} )
			cy.collapse( `Image #${ idx }` )
			cy.adjust( 'Shape', {
				label: 'Blob 3',
				value: 'blob3',
			} )
			cy.adjust( 'Flip Shape Horizontally', true )
			cy.adjust( 'Flip Shape Vertically', true )
			cy.adjust( 'Stretch Shape Mask', true ).assertClassName( `.ugb-team-member__item${ idx } img.ugb-img--shape`, 'ugb-image--shape-stretch' )
		} )
	} )
	cy.assertFrontendStyles( '@teamMemberBlock' )
}
