/**
 * External dependencies
 */
import {
	assertBlockExist, blockErrorTest, switchDesigns, switchLayouts,
} from '~stackable-e2e/helpers'

describe( 'Feature Block', () => {
	it( 'should show the block', assertBlockExist( 'ugb/feature', '.ugb-feature' ) )

	it( 'should not trigger block error when refreshing the page', blockErrorTest( 'ugb/feature' ) )

	it( 'should switch layout', switchLayouts( 'ugb/feature', [
		'Basic',
		'Plain',
		{
			value: 'half',
		},
		{
			value: 'overlap',
		},
		{
			value: 'overlap2',
		},
		{
			value: 'overlap3',
		},
		{
			value: 'overlap4',
		},
		{
			value: 'overlap5',
		},
		{
			value: 'overlap-bg',
		},
		{
			value: 'overlap-bg2',
		},
		{
			value: 'overlap-bg3',
		},
		{
			value: 'overlap-bg4',
		},
	] ) )

	it( 'should switch design', switchDesigns( 'ugb/feature', [
		'Angled Feature',
		'Arch Feature',
		'Aspire Feature 2',
		'Aspire Feature',
		'Aurora Feature',
		'Bean Feature 1',
		'Bean Feature 2',
		'Capital Feature',
		'Cary Feature',
		'Chic Feature',
		'Dare Feature',
		'Decora Feature',
		'Detour Feature',
		'Dim Feature',
		'Dustin Feature',
		'Elevate Feature',
		'Flex Feature',
		'Glow Feature',
		'Heights Feature',
		'Hue Feature',
		'Lounge Feature',
		'Lush Feature',
		'Peplum Feature',
		'Prime Feature',
		'Proact Feature',
		'Seren Feature',
		'Speck Feature',
		'Upland Feature',
	] ) )
} )
