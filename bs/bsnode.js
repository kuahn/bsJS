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
bs.ROUTER =(function(){
	var filename, path;
	
	var server, url, s, e, t, h, count;

	url = require('url');
	s = {'/':[]}, e = {'/':[]}, t = {}, h = [], count = 5;
	function make( t ){
		return function( $path, $func ){
			var t0, i, j, k, v;
			i = 0, j = arguments.length;
			while( i < j ){
				k = arguments[i++], v = arguments[i++];
				if( !( t0 = t[k] ) ) t[k] = t0 = [];
				t0[t0.length] = v;
			}
		};
	}
	server = require('http').createServer();
	server.on('request', function router( $rq, $rp ){
		var t0;
		try{
			t0 = require( path+url.parse( $rq.url ).pathname+'/'+filename );
		}catch( $e ){
			$rp.writeHead( 404, {'Content-Type':'text/html'} ),
			$rp.end( 'not exist' );
			return;
		}
		$rp.writeHead( 200, t0.header() );
		$rp.end( t0.response() );
	} );
	server.on('connection', function(){} );
	server.on('close', function(){} );
	return {
		start:make(s),end:make(e),
		table:function(){
			var i, j;
			i = 0, j = arguments.length;
			while( i < j ) t[arguments[i++]] = arguments[i++];
		},
		go:function( $str ){location.hash = $str;},
		route:function( $port, $path, $filename ){
			path = $path, filename = $filename, server.listen( $port );
		}
	};
})();