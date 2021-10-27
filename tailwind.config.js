const colours = require('tailwindcss/colors');

module.exports = {
	purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				cyan: colours.cyan,
				lightBlue: colours.lightBlue,
				green: colours.green,
				emerald: colours.emerald,
				grey: colours.gray,
				coolGrey: colours.coolGray,
				trueGrey: colours.trueGray,
				warmGrey: colours.warmGray
			},
			fontFamily: {
				"nunito": ["Nunito"]
			}
		},
	},
	variants: {
		extend: {},
	},
	plugins: [require("@tailwindcss/forms")],
}
