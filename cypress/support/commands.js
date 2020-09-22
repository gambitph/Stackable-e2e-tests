// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
Cypress.Commands.add( 'setupWP', () => {
	cy.visit( '/?setup' )
} )

Cypress.Commands.add( 'loginAdmin', () => {
	cy.visit( '/wp-login.php' )
	cy.get( '#user_login' ).clear().type( 'admin' )
	cy.get( '#user_pass' ).clear().type( 'admin' )
	cy.get( '#loginform' ).submit()
} )

Cypress.Commands.add( 'hideAnyGutenbergTip', () => {
	cy.get( 'body' ).then( $body => {
		if ( $body.find( '.edit-post-welcome-guide' ).length ) {
			cy.get( '.edit-post-welcome-guide button:eq(0)' ).click()
		}
	} )
} )

Cypress.Commands.add( 'newPage', () => {
	cy.setupWP()
	cy.visit( '/wp-admin/post-new.php?post_type=page' )
	cy.hideAnyGutenbergTip()
} )

/**
 * Command for clicking the block inserter button
 */
Cypress.Commands.add( 'toggleBlockInserterButton', () => {
	cy.get( '.edit-post-header-toolbar__inserter-toggle' ).click( { force: true } )
} )

/**
 * Command for adding a specific ugb block in the inserter button.
 */
Cypress.Commands.add( 'addUgbBlockInInserterButton', ( blockname = 'accordion' ) => {
	cy.toggleBlockInserterButton()
	cy.get( `.block-editor-block-types-list>.block-editor-block-types-list__list-item>.editor-block-list-item-ugb-${ blockname }:first` ).click( { force: true } )
	return cy.get( `[data-type="ugb/${ blockname }"]` ).last()
} )

/**
 * Command for typing in the block inserter textarea.
 */
Cypress.Commands.add( 'typeInInserterTextarea', ( input = '' ) => {
	cy.document().then( doc => {
		// Sometimes the textarea has to be clicked first before typing.
		if ( doc.querySelector( `.block-editor-default-block-appender` ) ) {
			cy.get( `textarea[aria-label="Add block"]` ).click( { force: true } )
		}
		cy.get( `p[aria-label="Empty block; start writing or type forward slash to choose a block"]` ).click( { force: true } ).type( input, { force: true } )
	} )
} )

/**
 * Command for adding a specific ugb block in the inserter textarea.
 */
Cypress.Commands.add( 'addUgbBlockInInserterTextarea', ( blockname = 'accordion' ) => {
	if ( blockname === 'feature' || blockname === 'icon' ) {
		cy.typeInInserterTextarea( `/${ blockname }{downarrow}{enter}` )
		return cy.get( `[data-type="ugb/${ blockname }"]` ).last()
	} else if ( blockname === 'text' ) {
		cy.typeInInserterTextarea( `/advanced-${ blockname }{downarrow}{enter}` )
		return cy.get( `[data-type="ugb/${ blockname }"]` ).last()
	}
	cy.typeInInserterTextarea( `/${ blockname }{enter}` )
	return cy.get( `[data-type="ugb/${ blockname }"]` ).last()
} )

/**
 * Command for deleting a specific block.
 */
Cypress.Commands.add( 'removeBlock', { prevSubject: 'element' }, subject => {
	cy.log( subject )
	cy.get( subject ).click( { force: true } )
	cy.get( `.components-button.components-dropdown-menu__toggle[aria-label="More options"]` ).click( { force: true } )
	cy.get( `button` ).contains( `Remove Block` ).click( { force: true } )
} )

/**
 * Command for opening the block inspectore of a block.
 */
Cypress.Commands.add( 'openInspector', { prevSubject: 'element' }, ( subject, tab ) => {
	// Only allow chained elements with .wp-block to enter this command.
	if ( cy.get( subject ).should( 'have.class', 'wp-block' ) ) {
		cy.get( subject ).click( { force: true } )
		cy.document().then( doc => {
			if ( ! doc.querySelector( '.interface-interface-skeleton__sidebar' ) ) {
				cy.get( 'button[aria-label="Settings"]' ).click( { force: true } )
			}
			if ( tab ) {
				const TABS = {
					layout: 'Layout',
					style: 'Style',
					advanced: 'Advanced',
				}

				cy.document().then( doc => {
					if ( ! doc.querySelector( `[data-label="${ TABS[ tab.toLowerCase() ] } Tab"]` ) ) {
						cy.get( '[data-label="Block"]' ).click( { force: true } )
					}
					cy.get( `[data-label="${ TABS[ tab.toLowerCase() ] } Tab"]` ).click( { force: true } )
				} )
			}
		} )
	}
	return cy.get( subject )
} )

/**
 * Command for scrolling the sidebar panel to
 * a specific selector.
 */
Cypress.Commands.add( 'scrollSidebarToView', selector => {
	cy.document().then( doc => {
		const selectedEl = doc.querySelector( selector )
		if ( selectedEl ) {
			const { y } = selectedEl.getBoundingClientRect()
			if ( y ) {
				cy.get( '.interface-complementary-area' ).scrollTo( 0, y )
			}
		}
	} )
} )

/**
 * Command for scrolling the editor panel to
 * a specific selector.
 */
Cypress.Commands.add( 'scrollSidebarToView', selector => {
	cy.document().then( doc => {
		const selectedEl = doc.querySelector( selector )
		if ( selectedEl ) {
			const { y } = selectedEl.getBoundingClientRect()
			if ( y ) {
				cy.get( '.interface-interface-skeleton__content' ).scrollTo( 0, y )
			}
		}
	} )
} )

/**
 * Command for collapsing an accordion.
 */
Cypress.Commands.add( 'collapse', { prevSubject: 'element' }, ( subject, name = 'General' ) => {
	if ( cy.get( subject ).should( 'have.class', 'wp-block' ) ) {
		const kebabCaseName = name.split( ' ' ).map( word => word.toLowerCase() ).join( '-' )
		cy.document().then( doc => {
			const el = doc.querySelector( `.ugb-panel--${ kebabCaseName }>h2>button` )
			if ( el ) {
				if ( el.getAttribute( 'aria-expanded' ) === 'false' ) {
					cy.scrollSidebarToView( `.ugb-panel--${ kebabCaseName }>h2>button` )
					cy.get( `.ugb-panel--${ kebabCaseName }>h2>button` ).click( { force: true } )
				}
			}
		} )
	}
	return cy.get( subject )
} )

/**
 * Command for enabling/disabling an
 * accordion.
 */
Cypress.Commands.add( 'toggleStyle', { prevSubject: 'element' }, ( subject, name = 'Block Title', enabled = true ) => {
	if ( cy.get( subject ).should( 'have.class', 'wp-block' ) ) {
		const kebabCaseName = name.split( ' ' ).map( word => word.toLowerCase() ).join( '-' )
		cy.document().then( doc => {
			const el = doc.querySelector( `.ugb-panel--${ kebabCaseName }>h2>button>span>.ugb-toggle-panel-form-toggle` )
			if ( el ) {
				if ( enabled === ! Array.from( el.classList ).includes( 'is-checked' ) ) {
					cy.scrollSidebarToView( `.ugb-panel--${ kebabCaseName }>h2>button>span>.ugb-toggle-panel-form-toggle>input` )
					cy.get( `.ugb-panel--${ kebabCaseName }>h2>button>span>.ugb-toggle-panel-form-toggle>input` ).click( { force: true } )
				}
			}
		} )
	}
	return cy.get( subject )
} )

// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
