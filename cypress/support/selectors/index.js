/**
 * External dependencies
 */
import { merge } from 'lodash'

/**
 * Internal dependencies
 */
import accordion from './accordion'
import blockquote from './blockquote'
import general from './general'

const selectorsList = [
	accordion,
	blockquote,
	general,
]

export default merge( ...selectorsList )
