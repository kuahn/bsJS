/*
 * bsNode - OpenSource Node.js web framework
 * version 0.1.0 / 2013.12.4 by projectBS committee
 * 
 * Copyright 2013.10 projectBS committee.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * GitHub: https://github.com/projectBS/bsJS
 * Facebook group: https://www.facebook.com/groups/bs5js/
 */
var bs = exports;
bs.$ex = (function(){
	var rc, random;
	rc = 0, random = function(){return rc = ( rc + 1 ) % 1000, random[rc] || ( random[rc] = Math.random() );};
	return function ex(){
		var t0, i, j;
		t0 = arguments[0], i = 1, j = arguments.length;
		while( i < j ){
			switch( arguments[i++] ){
			case'~': return parseInt( random() * ( arguments[i++] - t0 + 1 ) ) + t0;
			case'~f': return random() * ( arguments[i++] - t0 ) + t0;
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
	var url, query, crypto, fs;
	url = require('url'), query = require('querystring'), crypto = require('crypto'), fs = require('fs');
	bs.$url = function( $url ){return url.parse( $url );},
	bs.$escape = function( $val ){return query.escape( $val );},
	bs.$unescape = function( $val ){return query.unescape( $val );},
	bs.$cgiParse = function( $val ){return query.parse( $val );},
	bs.$cgiStringify = function( $val ){return query.stringify( $val );},
	bs.$crypt = function( $type, $val ){
		var t0;
		switch( $type ){
		case'sha256': return t0 = crypto.createHash('sha256'), t0.update( $val ), t0.digest('hex');
		}
	}
	bs.$get = function( $end, $url ){
	},
	bs.$post = function( $end, $url ){
	},
	bs.$put = function( $end, $url ){
	},
	bs.$delete = function( $end, $url ){
	};
})();
//mysql
(function(){
	var sql, db, dbtype;
	bs.sql = bs.q = function( $sel ){return sql[$sel] || ( sql[$sel] = new sql( $sel ) );},
	sql = function( $sel ){this.sel = $sel;},
	sql.prototype.$ = function(){
		var i, j, k, v;
		i = 0, j = arguments.length;
		while( i < j ){
			k = arguments[i++], v = arguments[i++];
			if( v === undefined ) return this[k];
			else switch( k ){
				case'db':case'type':case'record':case'field':case'query':this[k] = v; break;
				case'run':
					t0 = v ? bs::$tmpl( this.query, v ) : this.query;
					if( this.type == 'record' ) return bs.db( this.db ).$( 'record', t0, arguments[i++] );
					return bs.db( this.db ).$( 'rs', t0, arguments[i++] );
			}
		}
	},
	bs.db = db = function( $sel, $type ){return db[$sel] || ( db[$sel] = new dbtype[$type||'mysql']( $sel ) );},
	dbtype = {
		mysql:(function(){
			var d, mysql;
			return d = function( $sel ){this.sel = $sel;},
			d.prototype.open = function(){return this.__conn || ( this.__conn = ( mysql || ( mysql = require( 'mysql' ) ) ).createConnection( this ) );},
			d.prototype.close = function(){this.__conn.destroy();},
			d.prototype.$ = function(){
				var t0, t1, i, j, k, v;
				i = 0, j = arguments.length;
				while( i < j ){
					k = arguments[i++], v = arguments[i++];
					if( k == null ){
						if( this.__conn ) this.close();
						return delete db[this.sel];
					}
					if( v === undefined ) return k == 'url' ? this.host + ':' + this.port :
						k == 'id' ? this.user :
						k == 'pw' ? this.password :
						k == 'db' ? this.database :
						k == 'open' ? this.open() :
						k == 'close' ? this.close() :
						k == 'rollback' ? this.__conn && this.__conn.rollback() :
						k == 'commit' ? this.__conn && this.__conn.commit() : 0;
					else switch( k ){
						case'url':v = v.split(':'), this.host = v[0], this.port = v[1]; break;
						case'id':this.user = v; break;
						case'pw':this.password = v; break;
						case'db':this.database = v; break;
						default:
							t0 = this.open();
							switch( k ){
							case'ex':return t0.query( $v );
							case'rs':return t1 = arguments[i++], t0.query( $v, function( e, r ){e ? t1( null, e ) : t1( r );} );
							case'record':return t1 = arguments[i++], t0.query( $v ).on('result', function( r ){t1( r );} );
							}
							throw 1;
					}
				}
			}, d;
		})()
	};
})();
(function(){
	var server, sort, flush,
		application,
		session, sessionName, id,
		cookie, clientCookie, ckParser,
		head, response, rq, rp,
		data, staticRoute, mimeTypes,
		e404;
	//base	
	server = require('http'), 
	sort = function( a, b ){return a = a.length, b = b.length, a > b ? 1 : a == b ? 0 : -1;},
	flush = function(){
		var t0;
		for( t0 in cookie ) head[head.length] = ['Set-Cookie', cookie[k] ];
		head.push( flush[0], flush[1], ( t0 = response.join(''), flush[2][1] = Buffer.byteLength( t0, 'utf8' ), flush[2] ) ),
		rp.writeHead( 200, head ), rp.end( t0 );
	},
	flush[0] = ['Server', 'projectBS on node.js'],
	flush[1] = ['Content-Type', 'text/html; charset=utf-8'],
	flush[2] = ['Content-Length', 0],
	//application
	bs.$application = bs.$app = application = function( $k, $v ){return $v === undefined ? application[$k] : application[$k] = $v;},
	//session
	sessionName = '__bsNode', id = 0,
	bs.$session = bs.$se = session = function( $k, $v ){
		var t0;
		t0 = bs.$ck( sessionName );
		if( $v === undefined ){
			if( t0 && ( t0 = session[t0] ) ) return t0[$k];
		}else{
			if( !t0 ) bs.$ck( '@'+sessionName, t0 = bs.$crypt( 'sha256', bs.$ex( 1000,'~',9999 ) + (id++) + bs.$ex( 1000,'~',9999 ) ) );
			if( !session[t0] ) session[t0] = {};
			return session[t0][$k] = $v;
		}
	},
	//cookie
	cookie = {}, clientCookie = null,
	ckParser = function(){
		var t0, t1, i;
		clientCookie = {};
		if( t0 = rq.headers.cookie ){
			t0 = t0.split(';'), i = t0.length;
			while( i-- ) t0[i] = bs.$trim( t0[i].split('=') ), clientCookie[t0[i][0]] = t0[i][1];
		}
	},
	bs.$cookie = bs.$ck = function( $k, $v, $path, $expire, $domain ){
		var t0, t1;
		if( $v === undefined ) return clientCookie[$k];
		if( $k.chatAt(0) == '@' ) t0 = 1, $k = $k.substr(1);
		t0 = $k + '=' + ( bs.$escape($v) || '' ) + 
			';Path=' + ( $path || '/' ) + 
			( t0 ? ';HttpOnly' : '' ) + 
			( $domain ? ';Domain=' + $domain : '' );
		if( $v === null ) (t1 = new Date).setTime( t1.getTime() - 86400000 ),
			t0 += ';expires=' + t0.toUTCString() + ';Max-Age=0';
		else if( $expire ) (t1 = new Date).setTime( t1.getTime() + $expire * 86400000 ),
			t0 += ';expires=' + t1.toUTCString() + ';Max-Age=' + ( $expire * 86400 );
		cookie[$k] = t0;
	},
	//head, request, response
	head = [], response = [], 
	bs.$head = function( $k, $v ){head[head.length] = [$k, $v];},
	bs.$request = bs.$rq = function( $k ){return $k ? rq[$k] : rq;},
	bs.$requestGet = bs.$rqG = function( $k ){return $k;},
	bs.$requestPost = bs.$rqP = function( $k ){return $k;},
	bs.$requestFile = bs.$rqF = function( $k ){return $k;},
	bs.$response = bs.$rp = function(){
		var i, j;
		for( i = 0, j = arguments.length ; i < j ; i++ ) response[response.length] = arguments[i];
	},
	//data
	bs.$data = function( $k, $v ){return $v === undefined ? data[$k] : data[$k] = $v;},
	//error
	e404 = function( $v ){rp.writeHead( 404 ), rp.end( $v || '' );},
	//route
	staticRoute = {'Content-Type':0}, mimeTypes = require('./bsnode.mime.types'),
	bs.$route = function( $data ){
		var port, root, index, config, table, rules, rule,
			t0, i, j, k, l;
		root = $data.root, index = $data.index || 'index.bs', config = $data.config ? root+'/'+$data.config : 0,
		table = $data.table, rules = [], rule = $data.rules;
		for( k in table ) table[k] = root+'/'+table[k];
		for( k in rule ) rules[rules.length] = k;
		rules.sort( sort );
	
		port = server.createServer( function( $rq, $rp ){
			var fullPath, path, file, log, ext,
				t0, t1, i;
			rq = $rq, rp = $rp,
			fullPath = path = bs.$url( $rq.url ).pathname, ext = fullPath.split('.').pop().toLowerCase();
			if( ext == 'bs' ) i = path.lastIndexOf( '/' ) + 1, path = path.substring(i), file = path.substr(i);
			else if( path.substr( path.length - 1 ) == '/' ) file = index;
			else if( ext.indexOf('/') == -1 ) {
				if( t0 = bs.$get( null, 'file://'+ root+fullPath ) ) rp.writeHead( 200, ( staticRoute['Content-Type'] = mimeTypes[ext] || 'Unknown type', staticRoute ) ), t0.pipe( rp );
				else e404();
				return;
			}else i = path.lastIndexOf( '/' ) + 1, path = path.substring(i), file = path.substr(i) + '.bs';
				
			ckParser(), head.length = cookie.length = response.length = 0, data = {};
			try{
				if( config ) require( log = config ).bs( bs );
				if( t0 = table[fullPath] ) require( log = t0 ).bs( bs );
				else{
					i = rules.length;
					while( i-- ) if( path.indexOf( rules[i] ) > -1 ){
						t0 = rule[rules[i]];
						break;
					}
					if( !t0 ) throw 1;
					i = 0, j = t0.length; 
					while( i < j ) k = t0[i++], require(
						log = k == 'absolue' ? root + '/' + t0[i++] :
						k == 'relative' ? root + path + t0[i++] :
						k == 'head' ? ( t1 = file.split('.'), root + path + t0[i++] + t1[0] + '.' + t1[1] ) :
						k == 'tail' ? ( t1 = file.split('.'), root + path + t1[0] + t0[i++] + '.' + t1[1] ) :
						k == 'url' ? root + path + file : 0
					).bs( bs );
				}
				flush();
			}catch( $e ){
				e404( 'not exist<br>fullpath:'+fullPath+'<br>path:'+path+'<br>file:'+file+'<br>'+log );
			}
		}).listen( $data.port || 80 );
	};
})();