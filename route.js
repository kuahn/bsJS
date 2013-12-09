exports.route = {
	port:8001,
	root:'../node',
	fileroot:'c:/__app/bs.dev/node',
	index:'index.bs',
	config:'config.bs',
	
	table:{
		'/special':'special.bs'
	},
	
	rules:{
		'/':[
			'absolute','head.bs',
			'relative','subConfig.bs',
			'head', 'H',
			'tail', 'T',
			'url',
			'absolute','foot.bs'
		]
	}
};