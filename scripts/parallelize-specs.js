/* eslint-disable */
const glob = require( 'glob' )
const { trim, castArray } = require( 'lodash' )
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
		const splitFiles = files.reduce( ( acc, curr, idx ) => {
			acc[ idx % args[ 'total-machines' ] ] = ! Array.isArray( acc[ idx % args[ 'total-machines' ] ] ) 
				? castArray( curr ) 
				: Array( ...acc[ idx % args[ 'total-machines' ] ], curr )

			return acc
		}, Array( args[ 'total-machines' ] ) )

		const env = _config.env || {}
		const config = _config.config || {}
		if ( args.env ) {
			Object.assign( env, args.env.split( ',' ).reduce( ( acc, curr ) => {
				const [ key, ...value ] = curr.split( '=' )
				return Object.assign( acc, { [ key ]: trim( value.join( '=' ), '"' ) } )
			}, {} ) )
		}

		if ( args.config ) {
			Object.assign( config, args.config.split( ',' ).reduce( ( acc, curr ) => {
				const [ key, ...value ] = curr.split( '=' )
				return Object.assign( acc, { [ key ]: trim( value.join( '=' ), '"' ) } )
			}, {} ) )
		}

		cypress.run( {
			browser: args.browser || 'electron',
			spec: splitFiles[ args[ 'machine-number' ] - 1 ].join( ',' ),
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

