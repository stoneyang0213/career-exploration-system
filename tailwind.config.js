module.exports = {
	content: [
		'./index.html',
		'./report.html',
		'./assessments/**/*.html',
		'./js/**/*.js',
	],
	theme: { extend: {} },
	// Safelist dynamically generated utility classes used in JS
	safelist: [
		{ pattern: /(bg|text|border)-(red|green|blue|yellow|purple|orange|teal|indigo|pink|emerald|cyan)-(50|100|200|300|400|500|600|700)/ },
		{ pattern: /(hover:)?text-(indigo|purple|pink|blue|green|orange)-(600|700)/ },
	],
	plugins: [],
};

