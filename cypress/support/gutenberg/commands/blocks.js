
/**
 * External dependencies
 */
import {
	first, uniqueId,
} from 'lodash'

/**
 * Internal dependencies
 */
import { getBlocksRecursive, dispatchResolver } from '~common/util'

/**
 * Register functions to Cypress Commands.
 */
Cypress.Commands.add( 'assertBlockError', assertBlockError )
Cypress.Commands.add( 'addBlock', addBlock )
Cypress.Commands.add( 'selectBlock', selectBlock )
Cypress.Commands.add( 'typeBlock', typeBlock )
Cypress.Commands.add( 'deleteBlock', deleteBlock )
Cypress.Commands.add( 'addInnerBlock', addInnerBlock )
Cypress.Commands.add( 'asBlock', { prevSubject: true }, asBlock )
Cypress.Commands.add( 'addNewColumn', { prevSubject: true }, addNewColumn )

/**
 * Command for asserting block error.
 */
export function assertBlockError() {
	cy.get( '.block-editor-warning' ).should( 'not.exist' )
}

/**
 * Command for adding a specific block in the inserter button.
 *
 * @param {string} blockName
 * @param {Object} options
 */
export function addBlock( blockName = 'ugb/accordion', options = {} ) {
	const {
		variation = '',
	} = options

	let clientIdCache
	const addInnerBlockClasses = clientId => {
		cy.wp().then( wp => {
			if ( ! clientId ) {
				clientId = clientIdCache
			}

			// If there are innerBlocks, add unique classes.
			const newlyAddedBlock = wp.data.select( 'core/block-editor' ).getBlock( clientId )

			if ( newlyAddedBlock.innerBlocks.length ) {
				newlyAddedBlock.innerBlocks.forEach( ( { clientId } ) => {
					const innerBlockClassName = wp.data.select( 'core/block-editor' ).getBlock( clientId ).attributes.className
					// TODO: Use updateBlockAttributes to update multiple blocks if gutenberg supports it already.
					// Only append the e2e className if there is a default value.
					wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, { className: `${ innerBlockClassName ? innerBlockClassName + ' ' : '' }e2etest-block-${ uniqueId() }` } )
				} )
			}

			clientIdCache = clientId
			return newlyAddedBlock
		} )
	}

	cy.wp().then( wp => {
		return new Cypress.Promise( resolve => {
			const block = wp.blocks.createBlock( blockName )
			wp.data.dispatch( 'core/editor' ).insertBlock( block )
				.then( dispatchResolver( () => {
					const className = wp.data.select( 'core/block-editor' ).getBlock( block.clientId ).attributes.className
					// Only append the e2e className if there is a default value.
					wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( block.clientId, { className: `${ className ? className + ' ' : '' }e2etest-block-${ uniqueId() }` } )
				} ) )

			resolve( addInnerBlockClasses( block.clientId ) )
		} )
	} )

	if ( variation ) {
		cy.get( '.block-editor-block-list__block.is-selected' )
			.find( '.block-editor-block-variation-picker' )
			.find( `button[aria-label="${ variation }"]` )
			.click( { force: true } )

		addInnerBlockClasses()
	}
}

/**
 * Command for selecting a specific block.
 *
 * @param {string} subject
 * @param {string | number | Object} selector
 */
export function selectBlock( subject, selector ) {
	if ( selector === '' ) {
		selector = undefined
	}
	cy.wp().then( wp => {
		cy.get( 'body' ).then( $body => {
			return new Cypress.Promise( resolve => {
				const willSelectBlock = getBlocksRecursive( wp.data.select( 'core/block-editor' ).getBlocks() ).filter( block => block.name === subject )

				if ( typeof selector === 'string' ) {
					let foundClientId = null
					let resolveCallback = null

					if ( selector.startsWith( '@' ) ) {
						cy.get( '@blockSnapshotBlocks' ).then( $blockSnapshotBlocks => {
							const foundStaticBlock = $blockSnapshotBlocks.find( ( { alias } ) => alias === selector.replace( '@', '' ) )
							const blockElement = $body.find( `.${ foundStaticBlock.attributes.className }` ).closest( '[data-block]' )
							const clientId = blockElement.data( 'block' )
							wp.data.dispatch( 'core/block-editor' )
								.selectBlock( clientId )
								.then( dispatchResolver( () => resolve( $body.find( `.wp-block[data-block="${ clientId }"]` ) ) ) )
						} )
					}

					willSelectBlock.forEach( ( { clientId } ) => {
						if ( ! foundClientId && $body.find( `.wp-block[data-block="${ clientId }"]:contains(${ selector })` ).length ) {
							foundClientId = clientId
							resolveCallback = $body.find( `.wp-block[data-block="${ clientId }"]:contains(${ selector })` )
						}
					} )

					wp.data.dispatch( 'core/block-editor' )
						.selectBlock( foundClientId )
						.then( dispatchResolver( () => resolve( resolveCallback ) ) )
				} else if ( typeof selector === 'number' ) {
					wp.data.dispatch( 'core/block-editor' )
						.selectBlock( willSelectBlock[ selector ].clientId )
						.then( dispatchResolver( () => resolve( $body.find( `.wp-block[data-block="${ willSelectBlock[ selector ].clientId }"]` ) ) ) )
				} else if ( typeof selector === 'object' ) {
					const {
						clientId,
					} = selector
					const resolveCallback = $body.find( `[data-block="${ clientId }"]` )
					wp.data.dispatch( 'core/block-editor' )
						.selectBlock( clientId )
						.then( dispatchResolver( () => resolve( resolveCallback ) ) )
				} else {
					wp.data.dispatch( 'core/block-editor' )
						.selectBlock( ( first( willSelectBlock ) || {} ).clientId )
						.then( dispatchResolver( () => resolve( $body.find( `.wp-block[data-block="${ ( first( willSelectBlock ) || {} ).clientId }"]` ) ) ) )
				}
			} )
		} )
	} )
}

/**
 * Command for typing in blocks
 *
 * @param {string} subject
 * @param {string} contentSelector
 * @param {string} content
 * @param {string | number | Object} customSelector
 * @param {Object} options
 */
export function typeBlock( subject, contentSelector = '', content = '', customSelector = '', options ) {
	( contentSelector
		? cy.selectBlock( subject, customSelector ).find( contentSelector )
		: cy.selectBlock( subject, customSelector )
	)
		.first()
		.click( { force: true } )
		.type( `{selectall}${ content }`, { force: true } )

	const {
		delay = 0,
	} = options

	cy.wait( delay )

	if ( content[ 0 ] !== '/' ) {
		cy.selectBlock( subject, customSelector )
	}
}

/**
 * Command for deleting a specific block.
 *
 * @param {string} subject
 * @param {string | number | Object} selector
 */
export function deleteBlock( subject, selector ) {
	cy.selectBlock( subject, selector )
		.then( $block => {
			const clientId = $block.data( 'block' )
			cy.wp().then( wp => {
				return new Cypress.Promise( resolve => {
					wp.data.dispatch( 'core/block-editor' ).removeBlock( clientId ).then( dispatchResolver( resolve ) )
				} )
			} )
		} )
}

/**
 * Command for adding inner block using block appender
 *
 * @param {string} blockName
 * @param {string} blockToAdd
 * @param {string | number | Object} customSelector
 */
export function addInnerBlock( blockName = 'ugb/accordion', blockToAdd = 'ugb/accordion', customSelector ) {
	cy.selectBlock( blockName, customSelector )
	cy.wp().then( wp => {
		return new Cypress.Promise( resolve => {
			const selectedBlockClientId = wp.data.select( 'core/block-editor' ).getSelectedBlockClientId()
			const newBlock = wp.blocks.createBlock( blockToAdd, { className: `e2etest-block-${ uniqueId() }` } )
			wp.data.dispatch( 'core/editor' ).insertBlock( newBlock, 0, selectedBlockClientId ).then( dispatchResolver( resolve ) )
		} )
	} )
}

/**
 * Command for setting block alias.
 * Instead of yielding the DOM element, we
 * will yield the block object.
 *
 * @param {Object} subject
 * @param {string} alias
 * @param {Object} options
 */
export function asBlock( subject, alias, options = {} ) {
	const {
		isStatic = false,
	} = options

	cy.wrap( subject ).as( alias )

	if ( ! isStatic ) {
		return
	}

	/**
	 * Asynchronously initialize contentSnapshots and stubbedStyles
	 * using Cypress alias.
	 *
	 * @see https://docs.cypress.io/guides/core-concepts/variables-and-aliases.html
	 */
	cy.wrap( [] ).as( `${ alias }.contentSnapshots` )
	cy.wrap( [] ).as( `${ alias }.stubbedStyles` )
	cy.wp().then( wp => {
		if ( subject.attributes && subject.clientId ) {
			// This is to handle passed block object from `addBlock` command
			cy.get( '@blockSnapshotBlocks' ).then( $blockSnapshotBlocks =>
				cy.wrap( [ ...$blockSnapshotBlocks, Object.assign( subject, { alias } ) ] ).as( 'blockSnapshotBlocks' ) )
			return
		}
		// This is to handle passed block element from `selectBlock` command
		const clientId = subject.data( 'block' )
		const block = wp.data.select( 'core/block-editor' ).getBlock( clientId )
		cy.get( '@blockSnapshotBlocks' ).then( $blockSnapshotBlocks =>
			cy.wrap( [ ...$blockSnapshotBlocks, Object.assign( block, { alias } ) ] ).as( 'blockSnapshotBlocks' ) )
		// Normalize the block alias. Always transform it to block object.
		cy.wrap( block ).as( alias )
	} )
}

/**
 * Command for adding a new column.
 *
 * @param {*} subject
 * @param {Object} options
 */
export function addNewColumn( subject, options = {} ) {
	const {
		label = 'Add Button',
	} = options

	cy.wrap( subject )
		.find( '.block-list-appender' )
		.find( `button[aria-label="${ label }"], button[aria-label="Add Column"]` )
		.click( { force: true } )
}
