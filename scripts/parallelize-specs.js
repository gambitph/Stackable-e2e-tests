/* eslint-disable */
const glob = require( 'glob' )
const { chunk, trim } = require( 'lodash' )
const _config = require( '../cypress.json' )
const cypress = require( 'cypress' )

/**
 * Function for splitting the spec files based on the number of
 * expected machines which will run the tests.
 *
 * @param {Object} args
 */
function parallelizeSpecs( args ) {
	glob( args.spec, {}, function( err, files ) {
		const splitFiles = chunk( files, Math.ceil( files.length / args[ 'total-machines' ] ) )[ args[ 'machine-number' ] - 1 ]
		const env = _config.env || {}
		const config = _config.config || {}
		if ( args.env ) {
			Object.assign( env, args.env.split( ',' ).reduce( ( acc, curr ) => {
				const [ key, value ] = curr.split( '=' )
				return Object.assign( acc, { [ key ]: trim( value, '"' ) } )
			}, {} ) )
		}

		if ( args.config ) {
			Object.assign( config, args.config.split( ',' ).reduce( ( acc, curr ) => {
				const [ key, value ] = curr.split( '=' )
				return Object.assign( acc, { [ key ]: trim( value, '"' ) } )
			}, {} ) )
		}

		cypress.run( {
			browser: args.browser || 'electron',
			spec: splitFiles.join( ',' ),
			config,
			env,
		} ).then( result => {
			if ( result.failures ) {
				console.error( 'Could not execute tests' )
				console.error( result.message )
				process.exit( result.failures )
			}

			process.exit( result.totalFailed )
		} )
			.catch( err => {
				console.error( err.message )	
				process.exit( 1 )
			} )
	} )
}

const args = require( 'args-parser' )( process.argv )

parallelizeSpecs( args )
/* eslint-enable */

