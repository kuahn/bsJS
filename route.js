exports.route = {
	port:8001,
	root:'../node',
	index:'index.bs',
	config:'config.bs',
	
	table:{
		'/special':'special.bs'
	},
	
	rules:{
		'/':[
			'global','globalHead.bs',
			'local','subConfig.bs',
			'head', 'H',
			'tail', 'T',
			'url',
			'global','globalFoot.bs'
		]
	}
};