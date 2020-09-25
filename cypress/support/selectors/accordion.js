
const SELECTORS = {
	general: {
		closeAdjacentOnOpen: {
			type: 'checkbox',
			selector: '.ugb--help-tip-accordion-adjacent-open',
		},
		openAtTheStart: {
			type: 'checkbox',
			selector: '.ugb--help-tip-accordion-open-start',
		},
		reverseArrow: {
			type: 'checkbox',
			selector: '.ugb--help-tip-accordion-reverse-arrow',
		},
		borderRadius: {
			type: 'range-control',
			selector: '.ugb--help-tip-general-border-radius',
		},
		shadowOutline: {
			type: 'range-control',
			selector: '.ugb--help-tip-general-shadow',
		},
	},
	columnBackground: {
		backgroundType: {
			type: 'button-group',
			selector: '.ugb--help-tip-background-color-type>div>div',
		},
		backgroundColor1: {
			type: 'color-picker',
			selector: '.ugb--help-tip-background-color1',
		},
		backgroundColor2: {
			type: 'color-picker',
			selector: '.ugb--help-tip-background-color2',
		},
		gradientSettings: {
			type: 'popover-settings',
			selector: '.ugb--help-tip-gradient-color-settings',
			childOptions: {
				gradientDirection: {
					type: 'range-control',
					selector: '.ugb--help-tip-gradient-direction',
				},
				color1Location: {
					type: 'range-control',
					selector: '.ugb--help-tip-gradient-location1',
				},
				color2Location: {
					type: 'range-control',
					selector: '.ugb--help-tip-gradient-location2',
				},
				backgroundBlendMode: {
					type: 'dropdown',
					selector: '.ugb--help-tip-background-blend-mode',
				},
			},
		},
		// TODO: Background Image or Video
	},
	title: {
		typography: {
			type: 'popover-settings',
			selector: '.ugb--help-tip-typography',
			childOptions: {
				fontFamily: {
					type: 'font-family',
					selector: '.ugb--help-tip-typography-family',
				},
				fontSize: {
					type: 'range-control',
					selector: '.ugb--help-tip-typography-size',
				},
				fontWeight: {
					type: 'dropdown',
					selector: '.ugb--help-tip-typography-weight',
				},
				fontTransform: {
					type: 'dropdown',
					selector: '.ugb--help-tip-typography-transform',
				},
				lineHeight: {
					type: 'range-control',
					selector: '.ugb--help-tip-typography-line-height',
				},
				letterSpacing: {
					type: 'range-control',
					selector: '.ugb--help-tip-typography-letter-spacing',
				},
			},
		},
		fontSize: {
			type: 'range-control',
			selector: '.ugb--help-tip-typography-size',
		},
		htmlTag: {
			type: 'button-group',
			selector: '.ugb--help-tip-typography-html-tag',
		},
		titleColor: {
			type: 'color-picker',
			selector: '.ugb--help-tip-title-color',
		},
		titleAlign: {
			type: 'button-group',
			selector: '.ugb--help-tip-alignment-title',
		},
	},

	// Accordion Option.
	arrow: {
		size: {
			type: 'range-control',
			selector: '.ugb--help-tip-arrow-size',
		},
		color: {
			type: 'color-picker',
			selector: '.ugb--help-tip-accordion-arrow-color',
		},
	},

	spacing: {
		padding: {
			type: 'four-range-control',
			selector: '.ugb--help-tip-spacing-padding',
		},
		title: {
			type: 'range-control',
			selector: '.ugb--help-tip-spacing-title',
		},
	},
}

export default SELECTORS
