/**
 * Internal dependencies
 */
import { publish } from './commands'
import {
	getActiveTab, getAddresses, getPreviewMode, parseClassList,
} from './util'
import config from '../../cypress.json'
import { collapse, openSidebar } from './commands/inspector'

/**
 * External dependencies
 */
import { startCase } from 'lodash'

/**
 * Helper function for creating block validation test.
 *
 * @param {string} blockName
 */
export const blockErrorTest = ( blockName = 'ugb/accordion' ) =>
	() => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( blockName )
		cy.publish()
		cy.reload()
	}

/**
 * Helper function for creating block exist assertion.
 *
 * @param {string} blockName
 * @param {string} selector
 */
export const assertBlockExist = ( blockName = 'ugb/accordion', selector = '.ugb-accordion' ) => () => {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( blockName )
	cy.get( selector ).should( 'exist' )
}

/**
 * Helper function for switching designs.
 *
 * @param {string} blockName
 * @param {Array} designs
 */
export const switchDesigns = ( blockName = 'ugb/accordion', designs = [] ) => () => {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( blockName )
	designs.forEach( design => {
		cy.openInspector( blockName, 'Layout' )
		cy.adjustDesign( design )
		cy.publish()
		cy.reload()
	} )
}

/**
 * Helper function for switching layouts.
 *
 * @param {string} blockName
 * @param {Array} layouts
 */
export const switchLayouts = ( blockName = 'ugb/accordion', layouts = [] ) => () => {
	cy.setupWP()
	cy.newPage()
	cy.addBlock( blockName )
	layouts.forEach( layout => {
		cy.openInspector( blockName, 'Layout' )
		cy.adjustLayout( layout )
		cy.publish()
		cy.reload()
	} )
}

/**
 * Helper function for generating assertion commands
 *
 * @param {*} subject
 * @param {Function} editorCallback
 * @param {Function} frontendCallback
 * @param {Object} options
 */
export const assertFunction = ( subject, editorCallback = () => {}, frontendCallback = () => {}, options = {} ) => {
	const {
		assertFrontend = true,
	} = options
	getActiveTab( tab => {
		cy.document().then( doc => {
			const activePanel = doc.querySelector( 'button.components-panel__body-toggle[aria-expanded="true"]' ).innerText
			cy
				.get( subject )
				.find( '.ugb-main-block' )
				.invoke( 'attr', 'class' )
				.then( classList => {
					const parsedClassList = parseClassList( classList )
					cy.window().then( editorWin => {
						cy.document().then( editorDoc => {
							editorCallback( {
								parsedClassList, win: editorWin, doc: editorDoc,
							} )
						} )
					} )

					if ( assertFrontend ) {
						getPreviewMode( previewMode => {
							publish()
							getAddresses( ( { currUrl, previewUrl } ) => {
								cy.visit( previewUrl )
								if ( previewMode !== 'Desktop' ) {
									cy.viewport( config[ `viewport${ previewMode }Width` ], config.viewportHeight )
								}

								cy.window().then( frontendWin => {
									cy.document().then( frontendDoc => {
										frontendCallback( {
											parsedClassList, win: frontendWin, doc: frontendDoc,
										} )
									} )
								} )

								if ( previewMode !== 'Desktop' ) {
									cy.viewPort( config.viewportWidth, config.viewportHeight )
								}

								cy.visit( currUrl )
								cy.get( parsedClassList ).click( { force: true } )
								openSidebar( 'Settings' )
								cy.get( `button[aria-label="${ startCase( tab ) } Tab"]` ).click( { force: true } )
								collapse( activePanel )
							} )
						} )
					}
				} )
		} )
	} )
}
