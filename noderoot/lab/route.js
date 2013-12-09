exports.route = {
	port:8001,
	root:'../noderoot/lab',
	index:'index.bs',
	config:'config.bs',
	upload:null,
	maxsize:2,
	table:{
		'/special':'special.bs'
	},
	rules:{
		'/':[
			'absolute', 'head.bs',
			'relative', 'subConfig.bs',
			'url',
			'absolute','foot.bs'
		]
	}
};