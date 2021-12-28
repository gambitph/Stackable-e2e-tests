/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, responsiveAssertHelper, Block, Advanced, assertImageModule, assertTypographyModule, assertContainerBackground, assertContainerSizeSpacing, assertContainerBordersShadow,
} from '~stackable-e2e/helpers'

const [ desktopStyle, tabletStyle, mobileStyle ] = responsiveAssertHelper( styleTab, { disableItAssertion: true } )
const [ desktopBlock, tabletBlock, mobileBlock ] = responsiveAssertHelper( blockTab, { tab: 'Block', disableItAssertion: true } )
const [ desktopAdvanced, tabletAdvanced, mobileAdvanced ] = responsiveAssertHelper( advancedTab, { tab: 'Advanced', disableItAssertion: true } )

export {
	blockExist,
	blockError,
	typeContent,
	desktopStyle,
	tabletStyle,
	mobileStyle,
	desktopBlock,
	tabletBlock,
	mobileBlock,
	desktopAdvanced,
	tabletAdvanced,
	mobileAdvanced,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/posts', '.stk-block-posts', { variation: 'Default Layout' } ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/posts', { variation: 'Default Layout' } ) )
}

function typeContent() {
	it( 'should allow typing in the block', () => {
		cy.setupWP()
		cy.registerPosts( { numOfPosts: 1 } )
		cy.newPage()
		cy.addBlock( 'stackable/posts', { variation: 'Default Layout' } )
		cy.openInspector( 'stackable/posts', 'Style' )
		cy.collapse( 'Read More Link' )

		cy.typeBlock( 'stackable/posts', '.stk-block-posts__readmore', 'Click to read more', 0 )
			.assertBlockContent( '.stk-block-posts__readmore', 'Click to read more' )
	} )
}

function styleTab( viewport, desktopOnly ) {
	beforeEach( () => {
		cy.setupWP()
		cy.registerPosts( { numOfPosts: 4 } )
		cy.newPage()
		cy.addBlock( 'stackable/posts', { variation: 'Default Layout' } )
		cy.openInspector( 'stackable/posts', 'Style' )
		cy.savePost()
	} )

	it( 'should assert General panel in Style tab', () => {
		cy.collapse( 'General' )
		cy.adjust( 'Columns', 3, { viewport } ).assertComputedStyle( {
			'.stk-block-posts': {
				'--stk-columns': '3',
			},
		} )

		desktopOnly( () => {
			cy.adjust( '.ugb-advanced-toolbar-control:contains(Content Width)', 'alignwide' ).assertClassName( '.stk-block-posts > .stk-content-align', 'alignwide' )
			cy.adjust( '.ugb-advanced-toolbar-control:contains(Content Width)', 'alignfull' ).assertClassName( '.stk-block-posts > .stk-content-align', 'alignfull' )
		} )

		cy.adjust( '.ugb--help-tip-advanced-block-content-width:contains(Content Width)', 568, { viewport, unit: 'px' } ).assertComputedStyle( {
			'.stk-block-posts > .stk-content-align': {
				'max-width': '568px',
			},
		} )
		cy.adjust( '.ugb--help-tip-advanced-block-content-width:contains(Content Width)', 88, { viewport, unit: '%' } ).assertComputedStyle( {
			'.stk-block-posts > .stk-content-align': {
				'max-width': '88%',
			},
		} )
		const aligns = [ 'flex-start', 'center', 'flex-end' ]
		aligns.forEach( align => {
			cy.adjust( '.ugb--help-tip-advanced-block-content-width:contains(Content Width)', 542, { viewport, unit: 'px' } )
			cy.adjust( 'Content Horizontal Align', align, { viewport } ).assertComputedStyle( {
				'.stk-block-posts > .stk-content-align': {
					'margin-left': `${ align === 'flex-start' ? '0px' : 'auto' }`,
					'margin-right': `${ align === 'flex-end' ? '0px' : 'auto' }`,
				},
			} )
		} )

		cy.adjust( 'Column Gap', 13, { viewport } ).assertComputedStyle( {
			'.stk-block-posts__items': {
				'column-gap': '13px',
			},
		} )
		cy.adjust( 'Row Gap', 29, { viewport } ).assertComputedStyle( {
			'.stk-block-posts__items': {
				'row-gap': '29px',
			},
		} )

		// TODO: Content Arrangement assertion
	} )

	it( 'should assert Query panel in Style tab', () => {
		desktopOnly( () => {
			cy.collapse( 'Query' )
			cy.adjust( 'Number of items', 4 )
			cy
				.get( '.stk-block-posts__items' )
				.find( '.stk-block-posts__item' )
				.should( 'have.length', 4 )

			cy.adjust( 'Offset', 2 )
			cy
				.get( '.stk-block-posts__items' )
				.find( '.stk-block-posts__item' )
				.should( 'have.length', 2 )
			cy.resetStyle( 'Offset' )

			cy.adjust( 'Order by', 'title,asc' )
			cy.adjust( 'Post Type', 'post' )
			cy.adjust( 'Filter by Taxonomy', 'category' )
			cy.adjust( 'Taxonomy Filter Type', '__in' )
			cy.adjust( 'Add item', [ 'Uncategorized' ] )

			// Adjust the options only to check the presence in inspector
			cy.adjust( 'Exclude Post IDs', '1,3' )
			cy.adjust( 'Display Specific Post IDs', '2,4' )
			// Reset the values since we cannot determine the post IDs of our added posts
			cy.resetStyle( 'Exclude Post IDs' )
			cy.resetStyle( 'Display Specific Post IDs' )

			cy.adjust( 'Hide the current post', true )

			const editorTitleOrder = []

			// Get the all the posts loaded in the editor to compare with posts in frontend
			cy.get( '.stk-block-posts__title' ).then( titles => {
				titles.each( function() {
					editorTitleOrder.push( this.innerText )
				} )

				// Assert the Order by option
				assert.isTrue(
					editorTitleOrder.every( ( item, index ) => index === 0 || item >= editorTitleOrder[ index - 1 ] ),
					`Expected the title of the posts to be in ascending order in Editor. Found: '${ editorTitleOrder }'`
				)
			} )
			cy.savePost()

			cy.getPostUrls().then( ( { previewUrl } ) => {
				cy.visit( previewUrl )
				cy.get( '.stk-block-posts__title a' ).then( titles => {
					const frontendTitleOrder = []
					titles.each( function() {
						frontendTitleOrder.push( this.innerText )
					} )

					// Assert the Order by option
					assert.isTrue(
						frontendTitleOrder.every( ( item, index ) => index === 0 || item >= frontendTitleOrder[ index - 1 ] ),
						`Expected the title of the posts to be in ascending order in Frontend. Found: '${ frontendTitleOrder }'`
					)
					// Assert the posts rendered in Editor is the same in Frontend
					assert.isTrue(
						JSON.stringify( editorTitleOrder ) === JSON.stringify( frontendTitleOrder ),
						'Expected the posts rendered in Editor is the same in Frontend.'
					)
				} )
			} )
		} )
	} )

	it( 'should assert Spacing panel in Style tab', () => {
		cy.collapse( 'Spacing' )
		cy.adjust( 'Featured Image', 55, { viewport } )
		cy.adjust( 'Title', 62, { viewport } )
		cy.adjust( 'Category', 24, { viewport } )
		cy.adjust( 'Excerpt', 73, { viewport } )
		cy.adjust( 'Meta', 32, { viewport } )
		cy.adjust( 'Read More Link', 59, { viewport } ).assertComputedStyle( {
			'.stk-img-wrapper': {
				'margin-bottom': '55px',
			},
			'.stk-block-posts__title': {
				'margin-bottom': '62px',
			},
			'.stk-block-posts__category': {
				'margin-bottom': '24px',
			},
			'.stk-block-posts__excerpt': {
				'margin-bottom': '73px',
			},
			'.stk-block-posts__meta': {
				'margin-bottom': '32px',
			},
			'.stk-block-posts__readmore': {
				'margin-bottom': '59px',
			},
		} )
	} )

	it( 'should assert Featured Image panel in Style tab', () => {
		cy.collapse( 'Featured Image' )
		assertImageModule( {
			viewport,
			selector: '.stk-block-posts__item .stk-img-wrapper',
			panelName: 'Featured Image',
			enableShadowOutline: true,
			shadowEditorSelector: '.stk-block-posts__item .stk-img-wrapper .stk-img-resizer-wrapper',
			shadowFrontendSelector: '.stk-block-posts__item .stk-img-wrapper',
			enableBorderRadius: true,
			isStaticBlock: true,
		} )
		desktopOnly( () => {
			cy.adjust( 'Add post links to images', true ).assertClassName( '.stk-block-posts__item article > a', 'stk-block-posts__image-link', { assertBackend: false } ) // image-link class should be present
		} )

		cy.adjust( 'Height', 559, { viewport, unit: 'px' } ).assertComputedStyle( {
			'.stk-block-posts__item .stk-img-wrapper': {
				'height': '559px',
			},
		} )

		cy.adjust( 'Height', 91, { viewport, unit: '%' } ).assertComputedStyle( {
			'.stk-block-posts__item .stk-img-wrapper': {
				'height': '91%',
			},
		} )

		cy.adjust( 'Height', 65, { viewport, unit: 'vh' } ).assertComputedStyle( {
			'.stk-block-posts__item .stk-img-wrapper': {
				'height': '65vh',
			},
		} )
	} )

	it( 'should assert Title panel in Style tab', () => {
		cy.collapse( 'Title' )
		assertTypographyModule( {
			selector: '.stk-block-posts__title',
			frontendSelector: '.stk-block-posts__title a',
			viewport,
			panelName: 'Title',
			enableContent: false,
			enableHtmlTag: true,
			enableShadowOutline: false,
			enableAlign: true,
			assertOptions: { assertBackend: false },
		} )
		desktopOnly( () => {
			cy.adjust( 'Apply hover effect when container is hovered', true )
			cy.savePost()
		} )
	} )

	it( 'should assert Category panel in Style tab', () => {
		cy.collapse( 'Category' )
		assertTypographyModule( {
			selector: '.stk-block-posts__category a',
			alignmentSelector: '.stk-block-posts__category',
			viewport,
			panelName: 'Category',
			enableContent: false,
			enableShadowOutline: false,
			enableAlign: true,
		} )
		desktopOnly( () => {
			cy.adjust( 'Highlighted', true )
			cy.adjust( 'Highlight Color', '#7cbb9c', { state: 'hover' } ).assertComputedStyle( {
				'.stk-block-posts__category .stk-button:after:hover': {
					'background': '#7cbb9c',
				},
			} )
			cy.adjust( 'Highlight Color', '#a780cf', { state: 'normal' } ).assertComputedStyle( {
				'.stk-block-posts__category .stk-button': {
					'background': '#a780cf',
				},
			} )
			cy.adjust( 'Apply hover effect when container is hovered', true )
			cy.savePost()
		} )
	} )

	it( 'should assert Excerpt panel in Style tab', () => {
		cy.collapse( 'Excerpt' )
		assertTypographyModule( {
			selector: '.stk-block-posts__excerpt p',
			alignmentSelector: '.stk-block-posts__excerpt',
			viewport,
			panelName: 'Excerpt',
			enableContent: false,
			enableShadowOutline: false,
			enableAlign: true,
		} )
		desktopOnly( () => {
			cy.adjust( 'Excerpt Length', 5 )
			cy.adjust( 'Apply hover effect when container is hovered', true )
			cy.publish()
			cy.getPostUrls().then( ( { previewUrl } ) => {
				cy.visit( previewUrl )
				// Excerpt length should be 5.
				cy.document().then( doc => {
					assert.isTrue(
						[ ...doc.querySelector( '.stk-block-posts__excerpt p' ).innerText.split( ' ' ) ].length === 5,
						`Expected excerpt text length to equal '5'. Found: '${ [ ...doc.querySelector( '.stk-block-posts__excerpt p' ).innerText.split( ' ' ) ].length }'`
					)
				} )
			} )
		} )
	} )

	it( 'should assert Meta panel in Style tab', () => {
		cy.collapse( 'Meta' )
		assertTypographyModule( {
			selector: '.stk-block-posts__meta',
			viewport,
			panelName: 'Meta',
			enableContent: false,
			enableShadowOutline: false,
			enableAlign: true,
		} )
		desktopOnly( () => {
			cy.adjust( 'Show Author', true )
			cy.adjust( 'Show Date', true )
			cy.adjust( 'Show Comments', true )
			cy.adjust( 'Separator', 'pipe' ).assertBlockContent( '.stk-block-posts__meta-sep', /|/ )
			cy.adjust( 'Apply hover effect when container is hovered', true )
			cy.savePost()
		} )
	} )

	it( 'should assert Read More Link panel in Style tab', () => {
		cy.collapse( 'Read More Link' )
		assertTypographyModule( {
			selector: '.stk-block-posts__readmore',
			viewport,
			enableContent: false,
			enableShadowOutline: false,
			enableAlign: true,
			panelName: 'Read More Link',
		} )
		desktopOnly( () => {
			cy.adjust( 'Apply hover effect when container is hovered', true )
			cy.savePost()
		} )
	} )

	it( 'should assert Container Background panel in Style tab', () => {
		cy.toggleStyle( 'Container Background' )
		assertContainerBackground( { viewport } )
	} )

	it( 'should assert Container Size & Spacing panel in Style tab', () => {
		assertContainerSizeSpacing( { viewport, selector: '.stk-block-posts__item > .stk-container' } )
	} )

	it( 'should assert Container Borders & Shadow panel in Style tab', () => {
		assertContainerBordersShadow( { viewport } )
	} )
}

const assertBlockTab = Block
	.includes( [
		'Alignment',
		'Background',
		'Size & Spacing',
		'Borders & Shadows',
	] )
	.run

function blockTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.registerPosts( { numOfPosts: 3 } )
		cy.newPage()
		cy.addBlock( 'stackable/posts', { variation: 'Default Layout' } )
		cy.openInspector( 'stackable/posts', 'Block' )
	} )

	assertBlockTab( {
		viewport,
		mainSelector: '.stk-block-posts',
		alignmentSelector: '.stk-block-posts',
		enableColumnAlignment: false,
		enableInnerBlockAlignment: false,
		contentVerticalAlignFrontendProperty: 'align-items',
	} )
}

const assertAdvancedTab = Advanced
	.includes( [
		'General',
		'Position',
		'Transform & Transition',
		'Motion Effects',
		'Custom Attributes',
		'Custom CSS',
		'Responsive',
		'Conditional Display',
		'Advanced',
	] )
	.run

function advancedTab( viewport ) {
	beforeEach( () => {
		cy.setupWP()
		cy.registerPosts( { numOfPosts: 3 } )
		cy.newPage()
		cy.addBlock( 'stackable/posts', { variation: 'Default Layout' } )
		cy.openInspector( 'stackable/posts', 'Advanced' )
		cy.savePost()
	} )

	assertAdvancedTab( {
		viewport,
		mainSelector: '.stk-block-posts',
		blockName: 'stackable/posts',
		positionEditorSelector: '.stk-block-posts__item > .stk-container',
		positionFrontendSelector: '.stk-block-posts__item > .stk-container',
		assertPositionUnits: false,
	} )
}

// TODO: Add tests for adding the Load more button & Pagination
