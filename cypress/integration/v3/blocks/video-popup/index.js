/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, checkJsFiles,
} from '~stackable-e2e/helpers'

export {
	blockExist,
	blockError,
	loadedFiles,
	selectIcon,
}

function blockExist() {
	it( 'should show the block', assertBlockExist( 'stackable/video-popup', '.stk-block-video-popup' ) )
}

function blockError() {
	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'stackable/video-popup' ) )
}

function loadedFiles() {
	it( 'should assert the loaded files in the frontend', checkJsFiles( 'stackable/video-popup', '#stk-frontend-video-popup-js' ) )
}

function selectIcon() {
	it( 'should assert selected icon', () => {
		cy.setupWP()
		cy.newPage()
		cy.addBlock( 'stackable/video-popup' )
		cy.selectBlock( 'stackable/icon' )
		cy.changeIcon( 1, 'youtube', 'ugb-icon--youtube' )
		cy.selectBlock( 'stackable/video-popup' )
			.find( 'svg[data-icon="youtube"]' )
			.should( 'exist' )
		cy.savePost()
		cy.getPostUrls().then( ( { previewUrl } ) => {
			cy.visit( previewUrl )
			cy.get( '.stk-block-video-popup' )
				.find( 'svg[data-icon="youtube"]' )
				.should( 'exist' )
		} )
	} )
}
