exports.route = {
	port:8001,
	root:'../node',
	index:'index.js',
	config:'config.js',
	
	table:{
		'/special':'special.js'
	},
	
	rules:{
		'/':[
			'global','globalHead.js',
			'local','subConfig.js',
			'local','subHead.js',
			'tail', 'H',
			'tail', 'T',
			'url',
			'local','subFoot.js',
			'global','globalFoot.js'
		]
	}
};