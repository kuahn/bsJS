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
	var sql, db, dbtype;
	bs.sql = bs.q = function( $sel ){return sql[$sel] || ( sql[$sel] = new sql( $sel ) );},
	sql = function( $sel ){this.sel = $sel;},
	sql.prototype.$ = function(){
		var i, j, k, v;
		i = 0, j = arguments.length;
		while( i < j ){
			k = arguments[i++], v = arguments[i++];
			if( v === undefined ) return this[k];
			if( k == 'run' ){
				t0 = v ? bs.$tmpl( this.query, v ) : this.query;
				if( this.type == 'record' ) return bs.db( this.db ).$( 'record', t0, arguments[i++] );
				return bs.db( this.db ).$( 'rs', t0, arguments[i++] );
			}else this[k] = v;
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
							case'ex':return t0.query( v );
							case'rs':return t1 = arguments[i++], t0.query( v, function( e, r ){e ? t1( null, e ) : t1( r );} );
							case'record':return t1 = arguments[i++], t0.query( v ).on('result', function( r ){t1( r );} );
							}
							throw 1;
					}
				}
			}, d;
		})()
	};
})();
(function(){
	var http, form, sort, next, flush,
		application,
		session, sessionName, id,
		cookie, clientCookie, ckParser,
		head, response, rq, rp, getData, postData, postFile,
		data, staticRoute, mimeTypes,
		err;
	http = require('http'), form = require( 'formidable' ),
	(function( http ){
		var url, query, crypto, fs, op, freg;
		url = require('url'), query = require('querystring'), crypto = require('crypto'), fs = require('fs'),
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
		},
		op = function( $url, $method ){
			op.hostname = $url.hostname, op.method = $method,
			op.port = $url.port, op.path = $url.path;
			return op;
		}, freg = /^\/([A-Za-z]{1}:\/)/;
		bs.$get = function( $end, $url ){
			var t0;
			t0 = url.parse( $url );
			switch( t0.protocol ){
			case'http:':
				if( !$end ) return null;
				t0 = http.request( op( t0, 'GET' ), function( rs ){
					var t0 = '';
					rs.on( 'data', function( $data ){t0 += $data;} ),
					rs.on( 'end', function(){$end(t0);} );
				}),
				t0.on('error', function( $e ){$end( null, $e );});
				break;
			case'file:':
				t0 = t0.path.replace( freg, '$1' );
				if( !$end ) return fs.existsSync( t0 ) ? fs.readFileSync( t0 ) : null;
				fs.exists( t0, function( $ex ){
					if( !$ex ) return $end( null );
					fs.readFile( t0, function( $e, $d ){
						if( $e ) return $end( $e );
						return $end( $d );
					});
				});
				break;
			}
		},
		bs.$post = function( $end, $url ){
		},
		bs.$put = function( $end, $url ){
		},
		bs.$delete = function( $end, $url ){
		};
	})( http ),
	//base
	sort = function( a, b ){return a = a.length, b = b.length, a > b ? 1 : a == b ? 0 : -1;},
	bs.$next = function(){next();},
	bs.$flush = flush = function(){
		var t0, i;
		i = cookie.length;
		while( i-- ) head[head.length] = ['Set-Cookie', cookie[i]];
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
	bs.$requestGet = bs.$rqG = function( $k ){return getData[$k];},
	bs.$requestPost = bs.$rqP = function( $k ){return postData[$k];},
	bs.$requestFile = bs.$rqF = function( $k ){return postFile[$k];},
	bs.$response = bs.$rp = function(){
		var i, j;
		for( i = 0, j = arguments.length ; i < j ; i++ ) response[response.length] = arguments[i];
	},
	//data
	bs.$data = function( $k, $v ){return $v === undefined ? data[$k] : data[$k] = $v;},
	//error
	err = function( $code, $v ){rp.writeHead( $code, (staticRoute['Content-Type'] = 'text/html', staticRoute) ), rp.end( $v || '' );},
	//route
	staticRoute = {'Content-Type':0}, mimeTypes = require('./bsnode.mime.types'),
	onData = function( $data ){postData += $data;},
	bs.$route = function( $data ){
		var port, root, index, config, table, rules, rule, currRule, postForm,
			t0, i, j, k, l;
		postForm = new form.IncomingForm,
		postForm.encoding = 'utf-8',
		postForm.keepExtensions = true;
		if( $data.upload ) postForm.uploadDir = $data.upload;
		if( $data.maxsize ) postForm.maxFieldsSize = parseInt( $data.maxsize * 1024 * 1024 );
		
		root = $data.root, index = $data.index || 'index.bs', config = $data.config ? root+'/'+$data.config : 0,
		table = $data.table, rules = [], rule = $data.rules;
		for( k in table ) table[k] = root+'/'+table[k];
		for( k in rule ) rules[rules.length] = k;
		rules.sort( sort );
	
		port = http.createServer( function( $rq, $rp ){
			var fullPath, path, file, ext, log, router, nextstep, idx, t0, i, j;
			
			rq = $rq, rp = $rp, t0 = bs.$url( $rq.url ),
			getData = bs.$cgiParse( t0.query ), postData = postFile = null, 
			fullPath = path = t0.pathname;
			
			i = path.lastIndexOf( '/' ) + 1, ext = 'bs';
			if( path.substr( path.length - 1 ) == '/' ) path = path.substring( 0,  i ), file = index;
			else{
				t0 = path.substring( i );
				if( ( j = t0.indexOf( '.' ) ) > -1 ){
					file = t0, path = path.substring( 0, i );
					if( ( ext = t0.substr( j + 1 ) ) != 'bs' ){
						if( t0 = bs.$get( null, 'file://'+__dirname+'/'+root+fullPath ) ) rp.writeHead( 200, ( staticRoute['Content-Type'] = mimeTypes[ext] || 'Unknown type', staticRoute ) ), $rp.end( t0 );
						else err( 404, 'no file<br>file://'+ root+fullPath);
						return;
					}
				}else path += '/', file = index;
			}
			
			ckParser(), head.length = cookie.length = response.length = 0, data = {},
			nextstep = function(){
				var t0, i;
				if( idx < currRule.length ){
					i = currRule[idx++];
					if( !require( 
						log = i == 'absolute' ? root + '/' + currRule[idx++] :
						i == 'relative' ? root + path + currRule[idx++] :
						i == 'head' ? ( t0 = file.split('.'), root + path + currRule[idx++] + t0[0] + '.' + t0[1] ) :
						i == 'tail' ? ( t0 = file.split('.'), root + path + t0[0] + currRule[idx++] + '.' + t0[1] ) :
						i == 'url' ? root + path + file : 0
					).bs( bs ) ) nextstep();
				}else flush();
			},
			router = function(){
				var t0, i, j, k;
				try{
					if( config ) require( log = config ).bs( bs );
					if( t0 = table[fullPath] ) require( log = t0 ).bs( bs ), flush();
					else{
						i = rules.length;
						while( i-- ) if( path.indexOf( rules[i] ) > -1 ) return currRule = rule[rules[i]], idx = 0, ( next = nextstep )();
						throw 1;
					}
				}catch( $e ){
					err( 500, 'not exist<br>fullpath:'+fullPath+'<br>path:'+path+'<br>file:'+file+'<br>'+log );
				}
			};
			if( $rq.method.toLowerCase() == 'get' ) router();
			else postForm.parse( $rq, function( $e, $data, $file ){
				if( $e ) err( 500, 'post Error' + $e );
				else postData = $data, postFile = $file, router();
			});
		}).listen( $data.port || 80 );
		console.log('server started with port ' + ($data.port || 80)); 
	};
})();
