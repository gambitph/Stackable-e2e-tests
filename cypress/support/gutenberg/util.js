
/**
 * Create a DOM Element based on HTML string
 *
 * @param {string} htmlString
 *
 * @return {*} DOM Element
 */
export function createElementFromHTMLString( htmlString ) {
	const parentElement = document.createElement( 'div' )
	parentElement.innerHTML = htmlString

	return parentElement.firstElementChild
}

/**
 * Function for returning a stringified path location of the block from
 * `wp.data.select('core/block-editor').getBlocks()` by clientId
 *
 * e.g. [0].innerBlocks[2]
 *
 * @param {Array} blocks
 * @param {string} clientId
 *
 * @return {string} stringified path
 */
export function getBlockStringPath( blocks = [], clientId = '' ) {
	const paths = []
	let found = false

	function getBlockStringPathRecursive( _blocks, clientId ) {
		_blocks.forEach( ( _block, index ) => {
			if ( ! found ) {
				paths.push( `[${ index }]` )
				if ( _block.clientId === clientId ) {
					found = true
				}
			}
			if ( ! found && _block.innerBlocks.length ) {
				paths.push( '.innerBlocks' )
				getBlockStringPathRecursive( _block.innerBlocks, clientId )
				if ( ! found ) {
					paths.pop()
				}
			}
			if ( ! found ) {
				paths.pop()
			}
		} )
	}

	getBlockStringPathRecursive( blocks, clientId )
	return paths.join( '' )
}

