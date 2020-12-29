
/**
 * External dependencies
 */
import { range } from 'lodash'

/**
 * Internal dependencies
 */
import { blocks } from '../config'
import { getAddresses } from '../support/util'
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts,
} from '../support/helpers'

describe( 'Number Box Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/number-box', '.ugb-number-box' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/number-box' ) )

	it( 'should switch layout', switchLayouts( 'ugb/number-box', [
		'Basic',
		'Plain',
		'Background',
		'Heading',
		{
			value: 'heading2',
		},
		'Faded',
	] ) )
	it( 'should switch design', switchDesigns( 'ugb/number-box', [
		'Angled Number Box',
		'Aurora Number Box',
		'Capital Number Box',
		'Cary Number Box',
		'Elevate Number Box',
		'Flex Number Box',
		'Hue Number Box',
		'Lounge Number Box',
		'Lume Number Box',
		'Lush Number Box',
		'Propel Number Box',
		'Speck Number Box',
	] ) )
} )
