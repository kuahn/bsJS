//function bs(){}
var bs = exports;
bs.$ex = (function(){
	var ra, rc, random, rand, randf;
	ra = {}, rc = 0;
	random = function random(){
		rc++, rc %= 1000;
		return ra[rc] || ( ra[rc] = Math.random() );
	};
	rand = function rand( $a, $b ){ return parseInt( random() * ( parseInt( $b ) - $a + 1 ) ) + $a; };
	randf = function randf( $a, $b ){ return random() * ( parseFloat($b) - parseFloat($a) ) + parseFloat($a); };
	return function ex(){
		var t0, i, j;
		t0 = arguments[0], i = 1, j = arguments.length;
		while( i < j ){
			switch( arguments[i++] ){
			case'~': t0 = rand( t0, arguments[i++] ); break;
			case'~f': t0 = randf( t0, arguments[i++] );
			}
		}
		return t0;
	};
})();
(function(){
	function deco( $v, $t, $f, $r, $isEnd ){
		var t0 = $v;
		switch( $t ){
		case's':case'n': t0 = $isEnd ? t0 + $f : $f + t0; break;
		case'f': t0 = $f( t0, i ); break;
		case'r': if( typeof t0 == 'string' ) t0 = t0.replace( $f, $r );
		}
		return t0;
	}
	bs.$deco = function( $obj, $start, $end ){
		var type0, reg0, type1, reg1, t0, i;
		type0 = ( typeof $start ).charAt(0), i = 3;
		if( $start instanceof RegExp ) type0 = 'r', reg0 = $end,  $end = arguments[3], i = 4;
		if( !$end ) type1 = '-';
		else{
			type1 = ( typeof $end ).charAt(0);
			if( $end instanceof RegExp ) type1 = 'reg', reg1 = arguments[i];
		}
		if( $obj.splice ){
			t0 = [], i = $obj.length;
			while( i-- ) t0[i] = deco( deco( $obj[i], type0, $start, reg0 ), type1, $end, reg1 );
		}else{
			t0 = {};
			for( i in $obj ) t0[i] = deco( deco( $obj[i], type0, $start, reg0 ), type1, $end, reg1, 1 );
		}
		return t0;
	};
	bs.$reverse = function( $obj ){
		var t0, i;
		i = $obj.length;
		if( $obj.splice ){
			t0 = [];
			while( i-- ) t0[t0.length] = $obj[i];
		}else{
			t0 = {length:0};
			while( i-- ) t0[t0.length++] = $obj[i];
		}
		return t0;
	};
})();
(function(){
	var arg, reg;
	reg = /@[^@]+@/g;
	function r( $0 ){
		var t0, t1, t2, i, j, k, l, cnt;
		$0 = $0.substring( 1, $0.length - 1 );
		t0 = $0.split('.'), i = 1, j = arg.length, l = t0.length, cnt = 0;
		while( i < j ){
			t1 = arg[i++], k = 0;
			while( k < l && t1 !== undefined ) t1 = t1[t0[k++]];
			if( t1 !== undefined ) cnt++, t2 = t1;
		}
		if( cnt == 0 ) return $0;
		if( cnt > 1 ) return '@ERROR matchs '+cnt+'times@'
		i = typeof t2;
		if( i == 'object' )
			if( t2.TMPL ) return t2.TMPL( $0 );
			else if( t2.splice ) return t2.join('');
		else if( i == 'function' ) return t2( $0 );
		return t2;
	}
	bs.$tmpl = function( $str ){
		if( $str.substr(0,2) == '#T' ) $str = bs.d( $str ).$('@text');
		else if( $str.substr($str.length-5) == '.html' ) $str = bs.$get( null, $str );
		return arg = arguments, bs.$trim( $str.replace( reg, r ) );
	};
	function factory( r, v ){	
		function f( $v ){
			var t0, i;
			if( typeof $v == 'string' ) return $v.replace( r, v );
			else if( !$v ) return $v;
			if( typeof $v == 'object' ){
				if( $v.splice ){
					t0 = [], i = $v.length;
					while( i-- ) t0[i] = f( $v[i] );
				}else{
					t0 = {};
					for( i in $v ) t0[i] = f( $v[i] );
				}
				return t0;
			}
			return $v;
		};
		return f;
	}
	bs.$stripTag = factory( /[<][^>]+[>]/g, '' );
	bs.$trim = factory( /^\s*|\s*$/g, '' );
})();
(function(){
	var url, query;
	url = require('url'), query = require('query'),
	bs.$url = function( $url ){return url.parse( $url );},
	bs.$escape = function( $val ){return query.escape( $val );},
	bs.$unescape = function( $val ){return query.unescape( $val );},
	bs.$cgiParse = function( $val ){return query.parse( $val );},
	bs.$cgiStringify = function( $val ){return query.stringify( $val );};
})();
(function(){
	var server, head, response, cookie, data,
		sort, flush,
		rq, rp, clientCookie;
	server = require('http'), head = [], response = [], cookie = [],

	bs.$head = function( $k, $v ){head[head.length] = [$k, $v];},
	bs.$response = function(){
		var i, j;
		i = 0, j = arguments.length;
		while( i < j ) response[response.length] = arguments[i++];
	},
	bs.$request = function( $k ){return $k ? rq[$k] : request;},
	bs.$cookie = function( $k, $v, $path, $expire, $domain ){
		if( $v === undefined ) return clientCookie[$k];
		cookie[$k] = bs.$escape($v);
	},
	bs.$data = function( $k, $v ){return $v === undefined ? data[$k] : data[$k] = $v;},
	sort = function( a, b ){return a = a.length, b = b.length, a > b ? 1 : a == b ? 0 : -1;},
	flush = function(){
		var t0, i;
		t0 = response.join('');
		head.push(
			['Server', 'projectBS on node.js'],
			['Content-Type', 'text/html; charset=utf-8'],
			['Content-Length', Buffer.byteLength( t0, 'utf8' )]
		);
		if( i = cookie.length ) while( i-- ) head[head.length] = ['Set-Cookie',cookie[i]];
		rp.writeHead( 200, head ), rp.end( t0 );
	},
	bs.route = function( $data ){
		var port, root, index, config, table, rules, rule, 
			t0, i, j, k, l;
		root = $data.root, index = $data.index || 'index.js', config = $data.config ? root+'/'+$data.config : 0, 
		table = $data.table, rules = [], rule = $data.rules;
		for( k in table ) table[i] = root+'/'+table[i];
		for( k in rule ) rules[rules.length] = k;
		rules.sort( sort );

		port = server.createServer( function( $rq, $rp ){
			var fullPath, path, file, header, response,
				t0, i;
			fullPath = path = bs.$url( $rq.url ).pathname;
			if( path.substr( path.length - 3 ) == '.js' ) i = path.lastIndexOf( '/' ) + 1, path = path.substring(i), file = path.substr(i);
			else if( path.substr( path.length - 1 ) == '/' ) file = index;
			else i = path.lastIndexOf( '/' ) + 1, path = path.substring(i), file = path.substr(i) + '.js';
			
			if( file.substr( file.length - 2 ) != 'js' ){
				//static page
				return;
			}
			
			rq = $rq, rp = $rp,
			clientCookie = t0 = $rq.header.cookie ? bs.$cgiParse( t0 ) : null;
			head.length = cookie.length = response.length = 0,
			data = {};
			
			try{
				if( config ) require( config ).request( bs );
				if( t0 = table[fullPath] ) require( t0 ).request( bs );
				else{
					i = rules.length;
					while( i-- ) if( path.indexOf( rules[i] ) > -1 ){
						t0 = rule[rules[i]];
						break;
					}
					if( !t0 ) throw 1;
					i = 0, j = t0.length; 
					while( i < j ){
						k = t0[i++],
						require(
							k == 'global' ? root + '/' + t0[i++] :
							k == 'local' ? root + path + t0[i++] :
							k == 'head' ? ( file = file.split('.'), root + path + t0[i++] + file[0] + '.' + file[1] ) :
							k == 'tail' ? ( file = file.split('.'), root + path + file[0] + t0[i++] + '.' + file[1] ) :
							k == 'url' ? root + path + file : 0
						).bs( bs );
					}
				}
				flush();
			}catch( $e ){
				$rp.writeHead( 404, {'Content-Type':'text/html'} ),
				$rp.end( 'not exist' );
			}
		}).listen( $data.port || 80 );	
	};
})();