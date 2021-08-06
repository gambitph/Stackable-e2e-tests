/**
 * External dependencies
 */
import { range } from 'lodash'

export class ForcePseudoClass {
	constructor() {
		this.styles = []
		this.registered = new WeakMap()
		this.uniqueID = 0
	}

	loadDocumentStyles() {
		cy.document().then( doc => {
			range( 0, doc.styleSheets.length ).forEach( id => {
				const sheet = doc.styleSheets[ id ]
				if ( sheet.href ) {
					this.addLink( sheet.href )
				} else if ( sheet.ownerNode && sheet.ownerNode.nodeName &&
                sheet.ownerNode.nodeName === 'STYLE' && sheet.ownerNode.firstChild ) {
					this.addCSS( sheet.ownerNode.firstChild.textContent )
				}
			} )
		} )
	}

	addCSS( text ) {
		cy.document().then( doc => {
			const copySheet = doc.createElement( 'style' )
			copySheet.type = 'text/css'
			copySheet.textContent = text
			doc.head.appendChild( copySheet )
			range( 0, copySheet.sheet.cssRules.length ).forEach( id => {
				if ( copySheet.sheet.cssRules[ id ].selectorText && copySheet.sheet.cssRules[ id ].selectorText.includes( ':' ) ) {
					this.styles.push( copySheet.sheet.cssRules[ id ] )
				}
			} )

			doc.head.removeChild( copySheet )
		} )
	}

	addLink( url ) {
		const self = this
		cy.wrap( [] ).then( () => {
			return new Promise( ( resolve, reject ) => {
				cy.server()
				cy.route( {
					method: 'GET',
					url,
					status: 200,
				} ).as( 'sheetUrl' )

				fetch( '@sheetUrl' )
					.then( response => response.text() )
					.then( response => {
						self.addCSS( response )
						resolve( self.styles )
					} )
					.catch( error => reject( error ) )
			} )
		} )
	}

	matches( element, selector, pseudoClass ) {
		selector = selector.replace( new RegExp( pseudoClass, 'g' ), '' )

		selector.split( / +/ ).forEach( part => {
			try {
				if ( element.matches( part ) ) {
					return true
				}
			} catch ( ignored ) {
				// reached a non-selector part such as '>'
			}
		} )
		return false
	}

	register( element, pseudoclass ) {
		const uuid = this.uniqueID++
		const customClasses = {}
		this.styles.forEach( style => {
			if ( style.selectorText.includes( pseudoclass ) ) {
				style.selectorText.split( /\s*,\s*/g )
					.filter( selector => this.matches( element, selector, pseudoclass ) )
					.forEach( selector => {
						const newSelector = this._getCustomSelector( selector, pseudoclass, uuid )
						customClasses[ newSelector ] = style.style.cssText.split( /\s*;\s*/ ).join( ';' )
					} )
			}
		} )

		if ( ! this.style ) {
			this._createStyleElement()
		}

		Object.keys( customClasses ).forEach( selector => {
			const cssClass = selector + ' { ' + customClasses[ selector ] + ' }'
			this.style.sheet.insertRule( cssClass )
		} )
		this.registered.get( element ).set( pseudoclass, uuid )
	}

	toggleStyle( element, pseudoclass, force ) {
		if ( ! this.registered.has( element ) ) {
			this.registered.set( { element }, new WeakMap() )
		}
		if ( ! this.registered.get( { element } ).has( pseudoclass ) ) {
			this.register( element, pseudoclass )
		}
		const uuid = this.registered.get( { element } ).get( pseudoclass )
		element.classList.toggle( this._getMimicClassName( pseudoclass, uuid ).substr( 1 ), force )
	}

	_getMimicClassName( pseudoClass, uuid ) {
		return pseudoClass.replace( ':', '.' ) + '-forcepseudoclass-' + uuid
	}

	_getCustomSelector( selectorText, pseudoClass, uuid ) {
		return selectorText.replace( new RegExp( pseudoClass, 'g' ), this._getMimicClassName( pseudoClass, uuid ) )
	}

	_createStyleElement() {
		cy.document().then( doc => {
			const style = doc.createElement( 'style' )
			style.type = 'text/css'
			doc.head.appendChild( style )
			this.style = style
		} )
	}
}
