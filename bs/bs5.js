/*
 * bs5 - OpenSource JavaScript library
 *
 * Copyright 2013.10 hikaMaeng, bsJS-Team.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * GitHub: https://github.com/hikaMaeng/bs5
 * Facebook group: https://www.facebook.com/groups/bs5js/?hc_location=stream
 */
( function( W, N ){
'use strict';
if( !W['console'] )	W['console'] = {log:function(){alert( arguments.join() );}};
if( !Array.prototype.indexOf )
	Array.prototype.indexOf = function( $v, $i ){
		var i, j, k, l;
		if( j = this.length )
			for( i = $i || 0, k = parseInt( j * .5 ) + 1, j-- ; i < k ; i++ )
				if( this[l = i] === $v || this[l = j - i] === $v ) return l;
		return -1;
	};
Date.now || ( Date.now = function(){return +new Date;} );

if( !W['JSON'] ) W['JSON'] = {
	stringify:(function(){
		function stringify( $obj ){
			var t0, i, j;
			switch( t0 = typeof $obj ){
			case'number':case'boolean':case'function': return $obj.toString();
			case'undefined':case'null': return t0;
			case'string': return '"' + $obj + '"';
			case'object':
				t0 = '';
				if( $obj.splice ){
					for( i = 0, j = $obj.length ; i < j ; i++ ) t0 += ',' + stringify( $obj[i] );
					return '[' + t0.substr(1) + ']';
				}else{
					for( i in $obj ) t0 += ',"'+i+'":' + stringify( $obj[i] );
					return '{' + t0.substr(1) + '}';
				}
			}
		}
		return stringify;
	})(),
	parse:function( $str ){
		var t0;
		eval( 't0='+$str );
		return t0;
	}
};

function init(doc){
	var bs = (function(doc){
		var sel,sz,t0,div,nodes;
		if( doc.querySelectorAll ) sel = function( $sel ){return doc.querySelectorAll( $sel );};
		else if( sz = W['Sizzle'] ) sel = function( $sel ){return sz( $sel );};
		else if( sz = doc.getElementById('sizzle') ){
			t0 = doc.createElement( 'script' ),
			doc.getElementsByTagName('head')[0].appendChild( t0 ),
			t0.text = sz.text, sz = Sizzle,
			sel = function( $sel ){return sz( $sel );};
		}else{
			sz = {};
			sel = function( $sel ){
				var t0, i;
				if( ( t0 = $sel.charAt(0) ) == '#' ) return sz[0] = doc.getElementById($sel.substr(1)), sz.length = 1, sz;
				if( t0 == '.' ){
					$sel = $sel.substr(1), t0 = doc.getElementsByTagName('*'), sz.length = 0, i = t0.length;
					while( i-- ) if( t0[i].className.indexOf( $sel ) > -1 ) sz[sz.length++] = t0[i];
					return sz;
				}
				return doc.getElementsByTagName($sel);
			};
		}
		div = doc.createElement( 'div' ), nodes = {};
		function bs( $sel, $node ){
			var r, t0, i, j, k;
			t0 = typeof $sel; 
			if( t0 == 'function' ) return $sel();
			if( t0 == 'string' ) return $sel.charAt(0) == '<' ? ( div.innerHTML = $sel, div.childNodes ) : sel( $sel );
			if( $sel.isDom ) return $sel;
			r = $node ? {} : nodes;
			if( $sel.nodeType == 1 ) return r[0] = $sel, r.length = 1, r;
			if( j = $sel.length ){
				r.length = 0;
				for( i = 0 ; i < j ; i++ ){
					t0 = bs( $sel[i], 1 ), r.length = k = t0.length;
					while( k-- ) r[k] = t0[k];
				}
				return r;
			}
		}
		bs.sel = sel;
		return bs;
	})(doc);
	var factory = (function(bs){
		function cls( $arg ){
			var key, factory, t0, k;
			key = $arg[0], factory = $arg[1],
			cls[key] = factory.init ? function($key){this.__k = $key,this.__i( $key );} : function($key){this.__k = $key;};
			t0 = cls[key].prototype, t0.$ = factory.$, t0.__i = factory.init, t0.__d = del, t0.__f = factory;
			for( k in factory.method ) t0[k] = factory.method[k];
			return factory;
		}
		function del(){return delete this.__f[this.__k], this.__k;}
		function factory( $key ){
			function F(){
				var t0, t1;
				return typeof ( t0 = arguments[0] ) == 'string' ? 
						( t1 = t0.charAt(0) ) == '@' ? ( F[t0=t0.substr(1)] = new cls[$key](t0) ) :
						t1 == '<' ? new cls[$key](t0) : F[t0] || ( F[t0] = new cls[$key](t0) ) :
					new cls[$key](t0);
			}
			return F;
		}
		bs.module = function(){
			var t0, t1, i;
			t0 = arguments[0].split(','), arguments[0] = t0[0], t1 = new cls(arguments), i = t0.length;
			while( i-- ) bs[t0[i]] = t1;
		};
		return bs.factory = factory;
	})(bs);
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
	bs.$trim = (function(){
		var t = /^\s*|\s*$/g;
		return function trim( $v ){
			var i, j;
			switch( typeof $v ){
			case'object':
				for( i = 0, j = $v.length ; i < j ; i++ ) $v[i] = $v[i].replace( t, '' );
				return $v;
			case'string': return $v.replace( t, '' );
			}
		};
	})();
	bs.$xml = (function(){
		var type, parser, t;
		t = /^\s*|\s*$/g;
		function _xml( $node ){
			var node, r, n, t0, t1, i, j;
			node = $node.childNodes, r = {};
			for( i = 0, j = node.length ; i < j ; i++ ){
				t0 = type ? node[i] : node.nextNode();
				if( t0.nodeType == 3 ){
					r.value = (type ? t0.textContent : t0.text).replace( t, '' );
				}else{
					n = t0.nodeName, t0 = _xml( t0 );
					if( t1 = r[n] ){
						if( t1.length === undefined ) r[n] = {length:2,0:t1,1:t0};
						else r[n][t1.length++] = t0;
					}else r[n] = t0;
				}
			}
			if( t0 = $node.attributes ) for( i = 0, j = t0.length ; i < j ; i++ ) r['$'+t0[i].name] = t0[i].value;
			return r;
		}
		function xml0( $data, $end ){
			var r, t0, t1, nn, i, j;
			t0 = $data.childNodes, r = {}, i = 0, j = t0.length;
			if( $end ){
				( nn = function(){
					var k, t1;
					for( var k = 0 ; i < j && k < 5000 ; i++, k++ ) t1 = type ? t0[i] : t0.nextNode(), r[t1.nodeName] = _xml( t1 );
					i < j ? setTimeout( nn, 16 ) : $end( r );
				} )();
			}else{
				for( ; i < j ; i++ ) t1 = type ? t0[i] : t0.nextNode(), r[t1.nodeName] = _xml( t1 );
				return r;
			}
		}
		function filter( $data ){
			if( $data.substr( 0, 20 ).indexOf( '<![CDATA[' ) > -1 ) $data = $data.substring( 0, 20 ).replace( '<![CDATA[', '' ) + $data.substr( 20 );
			if( $data.substr( $data.length - 5 ).indexOf( ']]>' ) > -1 ) $data = $data.substring( 0, $data.length - 5 ) + $data.substr( $data.length - 5 ).replace( ']]>', '' );
			return $data.replace( t, '' );
		}
		if( W['DOMParser'] ){
			type = 1, parser = new DOMParser;
			return function( $data, $end ){
				return xml0( parser.parseFromString( filter( $data ), "text/xml" ), $end );
			};
		}else{
			type = 0, parser = (function(){
				var t0, i, j;
				t0 = 'MSXML2.DOMDocument', t0 = ['Microsoft.XMLDOM', 'MSXML.DOMDocument', t0, t0+'.3.0', t0+'.4.0', t0+'.5.0', t0+'.6.0'],
				i = t0.length;
				while( i-- ){
					try{ new ActiveXObject( j = t0[i] ); }catch( $e ){ continue; }
					break;
				}
				return function(){
					return new ActiveXObject( j );
				};
			})();
			return function xml( $data, $end ){
				var p = parser();
				p.loadXML( filter( $data ) );
				return xml0( p, $end );
			};
		}
	})();
	bs.$img = (function(){
		function _load( $src, $data ){
			var t0, t1;
			t0 = new Image;
			if( window['HTMLCanvasElement'] ) t0.onload = $data.loaded;
			else ( t1 = function(){t0.complete ? $data.loaded() : setTimeout( t1, 10 );} )();
			return t0.src = $src, t0;
		}
		return function load( $end ){
			var t0, path, i, j;
			arguments.length == 2 && arguments[1][0] ? ( path = arguments[1], i = 0 ) : ( path = arguments, i = 1 ), j = path.length,
			t0 = {
				count:0, length:0,
				loaded:function loaded(){
					var t1, w, h, i, j;
					if( ++t0.count == ( j = t0.length ) ){
						i = 0;
						while( i < j ) t1 = t0[i++], t1.bsImg = {w:w = t1.width, h:h = t1.height};
						$end( t0 );
					}
				}
			};
			while( i < j ) t0[t0.length++] = _load( path[i++], t0 );
		};
	})();
	bs.$alert = function $alert( $msg ){ alert( $msg ); };
	bs.$url = function $url( $url_ ){ location.href = $url_; };
	bs.$open = function $open( $url ){ W.open( $url ); };
	bs.$back = function $back(){ history.back(); };
	bs.$reload = function $reload(){ location.reload(); };
	bs.$js = (function(doc){
		var _callback = 0;
		bs.__callback = {};
		return function js( $end, $url ){
			var t0, i;
			t0 = doc.createElement( 'script' ), t0.type = 'text/javascript', t0.charset = 'utf-8', t0.src = $url;
			if( $url.charAt( $url.length -1 ) == '=' ){
				$url += 'bs.__callback.' + ( i = 'c' + (_callback++) ),
				bs.__callback[i] = function(){
					$end.apply( null, arguments );
					delete bs.__callback[i];
				};
			}else if( $end ){
				if( W['addEventListener'] ) t0.onload = function(){t0.onload = null, $end();}
				else t0.onreadystatechange = function(){(t0.readyState == 'loaded' || t0.readyState == 'complete') && ( t0.onreadystatechange = null, $end() );}
			}
			doc.getElementsByTagName( 'head' )[0].appendChild( t0 );
		};
	})(doc);
	(function(){
		var	_timeout = 5000, _cgiA = [], _cgiH = [];
		var rq = W['XMLHttpRequest'] ? function rq(){ return new XMLHttpRequest; } : ( function(){
			var t0, i, j;
			t0 = 'MSXML2.XMLHTTP', t0 = ['Microsoft.XMLHTTP',t0,t0+'.3.0',t0+'.4.0',t0+'.5.0'],
			i = t0.length;
			while( i-- ){
				try{ new ActiveXObject( j = t0[i] ); }catch( $e ){ continue; }
				break;
			}
			return function rq(){ return new ActiveXObject( j ); };
		} )();
		function xhrSend( $type, $xhr, $data ){
			var i, j;
			i = 0, j = _cgiH.length,
			$xhr.setRequestHeader( 'Content-Type', $type == 'GET' ? 'text/plain; charset=UTF-8' : 'application/x-www-form-urlencoded; charset=UTF-8' ),
			$xhr.setRequestHeader( 'Cache-Control', 'no-cache' );
			while(i < j) $xhr.setRequestHeader( _cgiH[i++], _cgiH[i++] );
			$xhr.send( $data );
		}
		function xhr( $end ){
			var t0, t1;
			t0 = rq();
			if( typeof $end == 'function' ){
				t0.onreadystatechange = function(){
					if( t0.readyState != 4 || t1 < 0 ) return;
					clearTimeout( t1 ), t1 = -1;
					$end( t0.status == 200 || t0.status == 0 ? t0.responseText : null );
				},
				t1 = setTimeout( function(){
					if( t1 < 0 ) return;
					t1 = -1;
					$end( null );
				}, _timeout );
			}
			return t0;
		}
		function cgi( $arguments, $idx ){
			var t0, t1, i, j;
			t0 = _cgiA, t0.length = 0, _cgiH.length = 0,
			i = $idx ? $idx : 0, j = $arguments.length;
			if( j - i > 1 ) while( i < j )
				if ( $arguments[i].charAt(0) == '@' ) _cgiH[_cgiH.length] = $arguments[i++].substr(1), _cgiH[_cgiH.length] = $arguments[i++];
				else t0[t0.length] = encodeURIComponent( $arguments[i++] ) + '=' + encodeURIComponent( $arguments[i++] );
			t0[t0.length] = 'bsNoCache=' + bs.$ex( 1000, '~' ,9999 );
			return t0.join( '&' );
		}
		function httpMethod( $type, $args, $end, $url ){
			var t0;
			t0 = xhr( $end ),
			t0.open( $type, $url, $end ? true : false ),
			xhrSend( $type, t0, cgi( $args, 2 ) || '' );
			if( !$end )	return t0.responseText;
		}
		bs.$timeout = function timeout( $time ){_timeout = parseInt( $time * 1000 );};
		bs.$get = function get( $end, $url ){
			var t0;
			t0 = xhr( $end ),
			$url = $url.split( '#' ),
			$url = $url[0] + ( $url[0].indexOf( '?' ) > -1 ? '&' : '?' ) + cgi( arguments, 2 ) + ( $url[1] ? '#' + $url[1] : '' ),
			t0.open( 'GET', $url, $end ? true : false ),
			xhrSend( 'GET', t0, '' );
			if( !$end )	return t0.responseText;
		};
		bs.$post = function post( $end, $url ){
			return httpMethod( 'POST', arguments, $end, $url );
		};
		bs.$put = function put( $end, $url ){
			return httpMethod( 'PUT', arguments, $end, $url );
		};
		bs.$delete = function post( $end, $url ){
			return httpMethod( 'DELETE', arguments, $end, $url );
		};
	} )();
	bs.$ck = function ck( $key ){
		var r, t0, t1, t2, key, val, i, j;
		t0 =  doc.cookie.split(';');
		i = t0.length;
		if( arguments.length == 1 ){
			while( i-- ) if( ( t1 = t0[i] ) && t1.substring( 0, j = t1.indexOf('=') ).replace( /\s/, '' ) == $key ) t2 = t1.substr( j + 1);
		}else{
			val = arguments[1],
			t1 = $key + '=' + ( val || '' ) + ';domain='+document.domain+';path='+ (arguments[3] || '/');
			if( val === null ){
				t0 = new Date,
				t0.setTime( t0.getTime() - 86400000 ),
				t1 += ';expires=' + t0.toUTCString();
			}else if( arguments[2] ){
				t0 = new Date,
				t0.setTime( t0.getTime() + arguments[2] * 86400000 ),
				t1 += ';expires=' + t0.toUTCString();
			}
			doc.cookie = t1, t2 = val + '';
		}
		return t2 ? decodeURIComponent( t2 ) : null;
	};
	( function( doc ){
		var platform, app, agent, device,
			flash, browser, bVersion, os, osVersion, cssPrefix, stylePrefix, transform3D,
			b, bStyle, div, keyframe, keyframecss,
			v, a, c;
			
		agent = navigator.userAgent.toLowerCase(),
		platform = navigator.platform.toLowerCase(),
		app = navigator.appVersion.toLowerCase(),
		flash = 0,
		device = 'pc';
		( function(){
			function ie(){
				if ( agent.indexOf( 'msie' ) < 0 && agent.indexOf( 'trident' ) < 0 ) return;
				if( agent.indexOf( 'iemobile' ) > -1 ) os = 'winMobile';
				browser = 'ie';
				if( agent.indexOf( 'msie' ) < 0 ) return bVersion = 11;
				return bVersion = parseFloat( /msie ([\d]+)/.exec( agent )[1] );
			}
			function chrome( i ){
				if( agent.indexOf( i = 'chrome' ) > -1 || agent.indexOf( i = 'crios' ) > -1 ){
					browser = 'chrome';
					return bVersion = parseFloat( ( i == 'chrome' ? /chrome\/([\d]+)/ : /crios\/([\d]+)/ ).exec( agent )[1] );
				}
			}
			function firefox(){
				if( agent.indexOf( 'firefox' ) < 0 ) return;
				browser = 'firefox';
				return bVersion = parseFloat( /firefox\/([\d]+)/.exec( agent )[1] );
			}
			function safari(){
				if( agent.indexOf( 'safari' ) < 0 ) return;
				browser = 'safari';
				return bVersion = parseFloat( /safari\/([\d]+)/.exec( agent )[1] );
			}
			function opera(){
				if( agent.indexOf( 'opera' ) < 0 ) return;
				browser = 'opera';
				return bVersion = parseFloat( /version\/([\d]+)/.exec( agent )[1] );
			}
			function naver(){
				if( agent.indexOf( 'naver' ) > -1 ) return browser = 'naver';
			}
			var i;
			if( agent.indexOf( 'android' ) > -1 ){
				browser = os = 'android';
				if( agent.indexOf( 'mobile' ) == -1 ){
					browser += 'Tablet'
					device = 'tablet';
				}else{
					device = 'mobile';
				}
				i = /android ([\d.]+)/.exec( agent );
				if( i ){
					i = i[1].split('.');
					osVersion = parseFloat( i[0] + '.' + i[1] );
				}else{
					osVersion = 0;
				}
				i = /safari\/([\d.]+)/.exec( agent );
				if( i ) bVersion = parseFloat( i[1] );
				naver() || chrome() || firefox() || opera();
			}else if( agent.indexOf( i = 'iphone' ) > -1 || agent.indexOf( i = 'ipad' ) > -1 ){
				device = i == 'ipad' ? 'tablet' : 'mobile';
				browser = os = i;
				i = /os ([\d_]+)/.exec( agent );
				if( i ){
					i = i[1].split('_');
					osVersion = parseFloat( i[0] + '.' + i[1] );
				}else{
					osVersion = 0;
				}
				i = /mobile\/10a([\d]+)/.exec( agent );
				if( i ) bVersion = parseFloat( i[1] );
				naver() || chrome() || opera();
			}else{
				( function(){
					var plug, t0, e;
					plug = navigator.plugins;
					if( agent.indexOf( 'msie' ) > -1 ){
						try {
							t0 = new ActiveXObject( 'ShockwaveFlash.ShockwaveFlash' );
							t0 = t0.GetVariable( '$version' ).substr( 4 ).split( ',' );
							flash = parseFloat( t0[0] + '.' + t0[1] );
						}catch( e ){}
					}else if( plug && plug.length ){
						if( plug['Shockwave Flash 2.0'] || plug['Shockwave Flash'] ){
							if( plug['Shockwave Flash 2.0'] ){
								t0 = plug['Shockwave Flash 2.0'];
							}else{
								t0 = plug['Shockwave Flash'];
							}
							t0 = t0.description.split( ' ' )[2].split( '.' );
							flash = parseFloat( t0[0] + '.' + t0[1] );
						}
					}else if( agent.indexOf( 'webtv' ) > -1 ){
						flash = agent.indexOf( 'webtv/2.6' ) > -1 ? 4 : agent.indexOf("webtv/2.5") > -1 ? 3 : 2;
					}
				} )();
				if( platform.indexOf( 'win' ) > -1 ){
					os = 'win';
					if( agent.indexOf( 'windows nt 5.1' ) > -1 || agent.indexOf( 'windows xp' ) > -1 ){
						osVersion = 'xp';
					}else if( agent.indexOf( 'windows nt 6.1' ) > -1 || agent.indexOf( 'windows nt 7.0' ) > -1 ){
						osVersion = '7';
					}else if( agent.indexOf( 'windows nt 6.2' ) > -1 || agent.indexOf( 'windows nt 8.0' ) > -1 ){
						osVersion = '8';
					}
					ie() || chrome() || firefox() || safari() || opera();
				}else if( platform.indexOf( 'mac' ) > -1 ){      
					os = 'mac';
					i = /os x ([\d._]+)/.exec(agent)[1].replace( '_', '.' ).split('.');
					osVersion = parseFloat( i[0] + '.' + i[1] );
					chrome() || firefox() || safari() || opera();
				}else{
					os = app.indexOf( 'x11' ) > -1 ? 'unix' : app.indexOf( 'linux' ) > -1 ? 'linux' : 0;
					chrome() || firefox();
				}
			}
		})();
	
		b = doc.body;
		bStyle = b.style;
		div = doc.createElement( 'div' );
		div.innerHTML = '<div style="opacity:.55;position:fixed;top:100px;visibility:hidden;-webkit-overflow-scrolling:touch">a</div>';
		div = div.getElementsByTagName( 'div' )[0];
	
		c = doc.createElement( 'canvas' );
		c = 'getContext' in c ? c : null;
		a = doc.createElement( 'audio' );
		a = 'canPlayType' in a ? a : null;
		v = doc.createElement( 'video' );
		v = 'canPlayType' in v ? v : null;
		
		switch( browser ){
		case'ie': cssPrefix = '-ms-', stylePrefix = 'ms'; transform3D = bVersion > 9 ? 1 : 0;
			if( bVersion == 6 ){
				doc.execCommand( 'BackgroundImageCache', false, true );
				b.style.position = 'relative';
			}
			break;
		case'firefox': cssPrefix = '-moz-', stylePrefix = 'Moz'; transform3D = 1; break;
		case'opera': cssPrefix = '-o-', stylePrefix = 'O'; transform3D = 0; break;
		default: cssPrefix = '-webkit-', stylePrefix = 'webkit'; transform3D = os == 'android' ? ( osVersion < 4 ? 0 : 1 ) : 0;
		}
		if( keyframe = W['CSSRule'] ) keyframe = keyframe.KEYFRAME_RULE ? ( keyframecss = 'keyframes', 'KEYFRAME' ) :
						keyframe.WEBKIT_KEYFRAME_RULE ? ( keyframecss = '-webkit-keyframes', 'WEBKIT_KEYFRAME' ) :
						keyframe.MOZ_KEYFRAME_RULE ? ( keyframecss = '-moz-keyframes', 'MOZ_KEYFRAME' ) :
						null;
		bs.DETECT = {
			'device':device, 'browser':browser, 'browserVer':bVersion, 'os':os, 'osVer':osVersion, 'flash':flash, 'sony':agent.indexOf( 'sony' ) > -1,
			//dom
			'root':b.scrollHeight ? b : doc.documentElement,
			'scroll':doc.documentElement && typeof doc.documentElement.scrollLeft == 'number' ? 'scroll' : 'page',
			'selector':doc.querySelectorAll ? 1 : 0, 'insertBefore':div.insertBefore ? 1 : 0, 'png':browser == 'ie' && bVersion < 8 ? 0 : 1, 
			'opacity':div.style.opacity == '0.55' ? 1 : 0, 'text':div.innerText ? 'innerText' : div.textContent ? 'textContent' : 'innerHTML',
			'cstyle':doc.defaultView && doc.defaultView.getComputedStyle ? 1 : 0,
			//event
			'event':div.addEventListener ? 1 : 0,
			'eventOn':div.addEventListener ? '' : 'on',
			'eventTouch':div.ontouchstart === undefined ? 0 : 1,
			'eventRotate':'onorientationchange' in W ? 'orientationchange' : 0,
			//css3
			'mobileScroll':div.style.webkitOverflowScrolling ? 1 : 0, 'cssPrefix':cssPrefix, 'stylePrefix':stylePrefix, 'filterFix':browser == 'ie' && bVersion == 8 ? ';-ms-' : ';',
			'transition':stylePrefix + 'Transition' in bStyle || 'transition' in bStyle ? 1 : 0, 'transform3D':transform3D,
			'keyframe': keyframe, 'keyframecss': keyframecss,
			//html5
			'canvas':c ? 1: 0, 'canvasText':c && c.getContext('2d').fillText ? 1 : 0,
			'audio':a ? 1 : 0,
			'audioMp3':a && a.canPlayType( 'audio/mpeg;' ).indexOf( 'no' ) < 0 ? 1 : 0,
			'audioOgg':a && a.canPlayType( 'audio/ogg;' ).indexOf( 'no' ) < 0 ? 1 : 0,
			'audioWav':a && a.canPlayType( 'audio/wav;' ).indexOf( 'no' ) < 0 ? 1 : 0,
			'audioMp4':a && a.canPlayType( 'audio/mp4;' ).indexOf( 'no' ) < 0 ? 1 : 0,
			'video':v ? 1 : 0,
			'videoCaption':'track' in doc.createElement('track') ? 1 : 0,
			'videoPoster':v && 'poster' in v ? 1 : 0,
			'videoWebm':v && v.canPlayType( 'video/webm; codecs="vp8,mp4a.40.2"' ).indexOf( 'no' ) == -1 ? 1 : 0,
			'videH264':v && v.canPlayType( 'video/mp4; codecs="avc1.42E01E,m4a.40.2"' ).indexOf( 'no' ) == -1 ? 1 : 0,
			'videoTeora':v && v.canPlayType( 'video/ogg; codecs="theora,vorbis"' ).indexOf( 'no' ) == -1 ? 1 : 0,
			'local':W.localStorage && 'setItem' in localStorage ? 1 : 0,
			'geo':navigator.geolocation ? 1 : 0,
			'worker':W.Worker ? 1 : 0,
			'file':W.FileReader ? 1 : 0,
			'message':W.postMessage ? 1 : 0,
			'history':'pushState' in history ? 1 : 0,
			'offline':W.applicationCache ? 1 : 0,
			'db':W.openDatabase ? 1 : 0,
			'socket':W.WebSocket ? 1 : 0
		};
	} )( doc );
	(function( doc ){
		var style;
		style = (function(){
			var style, nopx, b, pf, reg, regf;
			b = doc.body.style,
			reg = /-[a-z]/g, regf = function($0){return $0.charAt(1).toUpperCase();},
			pf = bs.DETECT.stylePrefix, nopx = {'opacity':1,'zIndex':1},
			style = function(){this.s = arguments[0], this.u = {};},
			style.prototype.init = function(){this.s.cssText = '';},
			style.prototype.$ = function( $arg, i ){
				var t0, j, k, v, v0, u, s;
				u = this.u, s = this.s, i = i || 0, j = $arg.length;
				while( i < j ){
					t0 = $arg[i++], v = $arg[i++];
					if( !( k = style[t0] ) ){
						k = t0.replace( reg, regf );
						if( k in b ) style[t0] = k;
						else{
							k = pf+k.charAt(0).toUpperCase()+k.substr(1);
							if( k in b ) style[t0] = k;
							else continue;
						}
					}else if( typeof k == 'function' ){
						v = k( this, v );
						continue;
					}
					if( v || v === 0 ){ 
						if( this[k] === undefined ){ //add
							if( ( t0 = typeof v ) == 'number' ) this[k] = v, u[k] = nopx[k] ? '' : 'px';
							else if( t0 == 'string' )
								if( v.substr(0,3) == 'url' || ( v0 = v.indexOf( ':' ) ) == -1 ) this[k] = v, u[k] = '';
								else this[k] = parseFloat( v.substr( 0, v0 ) ), u[k] = v.substr( v0 + 1 ), v = this[k];
						}else this[k] = v; //set
						s[k] = v + u[k];
					}else if( v === null ) delete this[k], delete u[k], s[k] = '';//del
					else return this[k]; //get
				}
				return v;
			},
			style.prototype.$g = function( t0 ){
				var k = style[t0];
				if( !k ){
					k = t0.replace( reg, regf );
					if( k in b ) style[t0] = k;
					else{
						k = pf+k.charAt(0).toUpperCase()+k.substr(1);
						if( k in b ) style[t0] = k;
						else return 0;
					}
				}else if( typeof k == 'function' ) return k( this );
				return this[k];
			},
			style.prototype.$s = function( t0, v ){
				var k = style[t0];
				if( !k ){
					k = t0.replace( reg, regf );
					if( k in b ) style[t0] = k;
					else{
						k = pf+k.charAt(0).toUpperCase()+k.substr(1);
						if( k in b ) style[t0] = k;
						else return 0;
					}
				}else if( typeof k == 'function' ) return k( this, v );
				return this[k] = v;
			},
			style.float = 'styleFloat' in b ? 'styleFloat' : 'cssFloat' in b ? 'cssFloat' : 'float',
			bs.style = style;
			
			if( !( 'opacity' in b ) ) style.opacity = function(s){
				var v = arguments[1];
				if( v === undefined ) return s.opacity;
				else if( v === null ) return delete s.opacity, s.s.filter = '', v;
				else return s.opacity = v, s.s.filter = 'alpha(opacity=' + parseInt( v * 100 ) + ')', v;
			};
			return style;
		})();
		bs.module( 'c,css', ( function( style ){
			var css, sheet, rule, ruleSet, idx, add, del, ruleKey, keyframe;
			sheet = doc.createElement( 'style' ),
			doc.getElementsByTagName( 'head' )[0].appendChild( sheet ),
			sheet = sheet.styleSheet || sheet.sheet,
			ruleSet = sheet.cssRules || sheet.rules;
			ruleKey = {'keyframes':bs.DETECT.keyframecss};
			keyframe = bs.DETECT.keyframe;
			idx = function( $rule ){
				var i, j, k, l;
				for( i = 0, j = ruleSet.length, k = parseInt( j * .5 ) + 1, j-- ; i < k ; i++ )
					if( ruleSet[l = i] === $rule || ruleSet[l = j - i] === $rule ) return l;
			};
			if( sheet.insertRule ){
				add = function( $k, $v ){sheet.insertRule( $k + ($v?'{'+$v+'}':'{}'), ruleSet.length ); return ruleSet[ruleSet.length - 1];}
				del = function( $v ){sheet.deleteRule( idx( $v ) );};
			}else{
				add = function( $k, $v ){sheet.addRule( $k, $v||' ' );return ruleSet[ruleSet.length - 1];};
				del = function( $v ){sheet.removeRule( idx( $v ) );};
			}
			rule = function( $rule ){this.r = $rule, this.s = new style( $rule );}
				
			css = factory( 'c' );
			css.init = function( $key ){
				var v;
				if( $key.indexOf('@') > -1 ){
					$key = $key.split('@');
					if( $key[0] == 'keyframes' && !keyframe ){
						this.type = -1;
						return;
					}else if( $key[0] == 'font-face' ){
						$key = $key[1].split(' '),
						v = 'font-family:'+$key[0]+";src:url('"+$key[1]+".eot');src:"+
							"url('"+$key[1]+".eot?#iefix') format('embedded-opentype'),"+
							"url('"+$key[1]+".woff') format('woff'),"+
							"url('"+$key[1]+".ttf') format('truetype'),"+
							"url('"+$key[1]+".svg') format('svg');",
						$key = '@font-face',
						this.type = 5;
					}else{
						$key = '@' + ( ruleKey[$key[0]] || $key[0] )+ ' ' + $key[1],
						this.type = 7;
					}
				}else this.type = 1;
				this.r = add( $key, v );
				if( this.type == 1 ) this.s = new style( this.r.style );
			};
			css.$ = function css$(){
				var type, t0, r;
				t0 = arguments[0], type = this.type;
				if( t0 === null ) return del( type < 0 ? 0 : this.__d(), this.r );
				else if( type == 1 ) return this.s.$( arguments );
				else if( type == 7 ){
					if( !this[t0] ){
						if( this.r.appendRule ) this.r.appendRule( t0+'{}' );
						else this.r.insertRule( t0+'{}' );
						r = this.r.cssRules[this.r.cssRules.length - 1];
						this[t0] = {r:r, s:new style( r.style )};
					}
					if( arguments[1] == null ) this[t0].s.init();
					else this[t0].s.$( arguments, 1 );
				}
				return this;
			};
			return css;
		})( style ) );
		bs.module( 'd,dom', (function( bs, style, doc ){
			var d, ds, ev, t, nodes, drill;
			t = /^\s*|\s*$/g;
			function x( $dom ){
				var i = 0; do i += $dom.offsetLeft; while( $dom = $dom.offsetParent )
				return i;
			}
			function y( $dom ){
				var i = 0; do i += $dom.offsetTop; while( $dom = $dom.offsetParent )
				return i;
			}
			d = factory( 'd' ),
			d.init = function( $key ){
				var t0, i;
				t0 = bs( $key ), this.length = i = t0.length;
				while( i-- ) this[i] = t0[i];
			},
			d.$ = function d$(){
				var dom, target, t0, l, s, i, j, k, v;
				j = arguments.length, typeof arguments[0] == 'number' ? ( s = l = 1, target = this[arguments[0]] ) : ( l = this.length, s = 0 );
				while( l-- ){
					dom = target || this[l], i = s, ds.length = 0;
					while( i < j ){
						k = arguments[i++];
						if( k === null ) return this._();
						if( ( v = arguments[i++] ) === undefined ){ //get
							return ev[k] ? ev( dom, k ) :
								( t0 = ds[k.charAt(0)] ) ? t0( dom, k.substr(1) ) :
								k == 'this' ? ( ds.length ? ( dom.bsS || ( dom.bsS = new style( dom.style ) ) ).$( ds ) : undefined, this ) :
								d[k] ? d[k]( dom ) :
								dom.bsS ? ( ds.length = 1, ds[0] = k, ds[1] = undefined, dom.bsS.$( ds ) ) : undefined;
						}
						v = ev[k] ? ev( dom, k, v ) :
							( t0 = ds[k.charAt(0)] ) ? ( v = t0( dom, k.substr(1), v, arguments, i ), i = t0.i || i, v ) :
							d[k] ? d[k]( dom, v ) : ( ds[ds.length++] = k, ds[ds.length++] = v );
					}
					if( ds.length ) ( dom.bsS || ( dom.bsS = new style( dom.style ) ) ).$( ds );
					if( target ) break;
				}
				return v;
			},
			d.method = {
				isDom:1,
				'_': function(){
					var dom, i, j, k;
					i = this.length;
					while( i-- ){
						dom = this[i];
						if( dom.nodeType == 3 ) continue;
						if( dom.bsE ) dom.bsE = dom.bsE._();
						if( dom.bsS ) dom.bsS = null;
						dom.parentNode.removeChild( dom ),
						j = dom.attributes.length;
						while( j-- )
							switch( typeof dom.getAttribute( k = dom.attributes[j].nodeName ) ){
							case'object':case'function': dom.removeAttribute( k );
							}
						this[i] = null;
					}
					if( this.__d ) this.__d();
				}
			},
			nodes = {length:0};
			function childNodes( $nodes ){
				var i, j;
				for( nodes.length = i = 0, j = $nodes.length ; i < j ; i++ )
					if( $nodes[i].nodeType == 1 ) nodes[nodes.length++] = $nodes[i];
				return nodes;
			}
			drill = function( $dom, $k ){
				var i, j;
				if( $k.indexOf( '>' ) > -1 ){
					$k = $k.split('>');
					i = 0, j = $k.length;
					do $dom = childNodes( $dom.childNodes )[$k[i++]]; while( i < j )
				}else $dom = childNodes( $dom.childNodes )[$k];
				return $dom;
			};
			ds = {
				'@':function( $dom, $k, $v ){
					if( $v === undefined ) return $dom[$k] || $dom.getAttribute($k);
					else if( $v === null ){
						$dom.removeAttribute($k);
						try{delete $dom[$k];}catch(e){};
					}else $dom[$k] = $v, $dom.setAttribute($k, $v);
					return $v;
				},
				'_':( function( view, style ){
					return bs.DETECT.cstyle ? function( $dom, $k ){
						var t0 = view.getComputedStyle($dom,'').getPropertyValue($k);
						return t0.substr( t0.length - 2 ) == 'px' ? parseFloat( t0.substring( 0, t0.length - 2 ) ) : t0;
					} : function( $dom, $k ){
						var t0 = $dom.currentStyle[style[$k]];
						return t0.substr( t0.length - 2 ) == 'px' ? parseFloat( t0.substring( 0, t0.length - 2 ) ) : t0;
					};
				} )( doc.defaultView, style ),
				'>':function( $dom, $k, $v, $arg, $i ){
					var t0, i, j, k, l, v;
					ds['>'].i = 0;
					if( $v ){
						if( $k ){
							if( typeof $v == 'string' ){
								if( style[$v] ) return $dom = drill( $dom, $k ), $dom.bsS ? ( ds.length=1,ds[0]=$v,ds[1]=undefined, $dom.bsS.$( ds ) ) : $dom.style[style[$v]];
								else if( ev[$v] ) return $dom = drill( $dom, $k ), ev( $dom, $v );
								else if( t0 = ds[$v.charAt(0)] ) return $dom = drill( $dom, $k ), t0( $dom, $v.substr(1), $arg[$i], $arg, $i+1 );
								else if( t0 = d[$v] ) return $dom = drill( $dom, $k ), t0( $dom, v );
							}
							$v = bs( $v ),
							t0 = Array.prototype.slice.call( $dom.childNodes, 0 );
							if( j = t0.length ){
								if( j - 1 < $k ) for( k = 0, l = $v.length ; k < l ; k++ ) $dom.appendChild( $v[k] );
								else for( i = 0, j = t0.length ; i < j ; i++ ){
									if( i < $k ) $dom.appendChild( t0[i] );
									else if( i == $k ) for( k = 0, l = $v.length ; k < l ; k++ ) $dom.appendChild( $v[k] );
									else $dom.appendChild( t0[i+1] );
								}
							}else for( i = 0, j = $v.length ; i < j ; i++ )$dom.appendChild( $v[i] );
						}else for( $v = bs( $v ), i = 0, j = $v.length ; i < j ; i++ ) $dom.appendChild( $v[i] );
					}else if( $v === null ){
						if( $k ) d.method._.call( childNodes( $dom.childNodes ), nodes[0] = nodes[$k], nodes.length = 1, nodes );
						else if( $dom.childNodes && childNodes( $dom.childNodes ).length ) d.method._.call( nodes );
					}else return childNodes( $dom.childNodes ), $k ? nodes[$k] : nodes;
				}
			};
			d.x = x, d.y = y;
			d.lx = function( $dom ){ return x( $dom ) - x( $dom.parentNode ); };
			d.ly = function( $dom ){ return y( $dom ) - y( $dom.parentNode ); };
			d.w = function( $dom ){ return $dom.offsetWidth; };
			d.h = function( $dom ){ return $dom.offsetHeight; };
			d.s = function( $dom ){ $dom.submit(); };
			d.f = function( $dom ){ $dom.focus(); };
			d.b = function( $dom ){ $dom.blur(); };
			d['<'] =function( $dom, $v ){
				var t0;
				if( $v ){
					if( $dom.parentNode ) $dom.parentNode.removeChild( $dom );
					t0 = bs( $v );
					t0[0].appendChild( $dom );
					return t0;
				}else{
					return $dom.parentNode;
				}
			};
			d.html = function( $dom, $v ){return $v === undefined ? $dom.innerHTML : ( $dom.innerHTML = $v );};
			d['html+'] = function( $dom, $v ){return $dom.innerHTML += $v;};
			d['+html'] = function( $dom, $v ){return $dom.innerHTML = $v + $dom.innerHTML;};
			(function(){
				var t = bs.DETECT.text;
				d.text = function( $dom, $v ){return $v === undefined ? $dom[t] : ($dom[t]=$v);};
				d['text+'] = function( $dom, $v ){return $dom[t] += $v;};
				d['+text'] = function( $dom, $v ){return $dom[t] = $v + $dom[t];};
			})();
			d.style = function( $dom ){return $dom.bsS;};
			d['class'] = function( $dom, $v ){return $v === undefined ? $dom.className : ($dom.className = $v);};
			(function(){
				var t = /^\s*|\s*$/g;
				d['class+'] = function( $dom, $v ){
					var t0;
					return !( t0 = $dom.className.replace(t,'') ) ? ( $dom.className = $v ) :
						t0.split( ' ' ).indexOf( $v ) == -1 ? ($dom.className = $v+' '+t0 ) : t0;
				};
				d['class-'] = function( $dom, $v ){
					var t0, i;
					if( !( t0 = $dom.className.replace(t,'') ) ) return t0;
					t0 = bs.$ex( t0.split( ' ' ) );
					if( ( i = t0.indexOf( $v ) ) > -1 ) t0.splice( i, 1 );
					return $dom.className = t0.join(' ');
				};
			})();
			d.id = function( $dom, $v ){ return $v === undefined ? $dom.id : ($dom.id = $v); };
			d.src = function( $dom ){ return $dom.src; };
			ev = (function(){
				var k, ev, i;
				function ev$( $dom, $k, $v ){
					var t0;
					if( $v ) return ( $dom.bsE || ( $dom.bsE = new ev( $dom ) ) ).$( $k, $v );
					if( $v === undefined ) return ( t0 = $dom.bsE ) ? t0[$k] : $dom[$k];
					if( $v === null ) return ( t0 = $dom.bsE ) ? t0.$( $k, null ) : ( $dom[$k] = null );
				}
				for( k in doc ) k.substr(0,2) == 'on' ? ( i = 1,ev$[k.substr(2).toLowerCase()] = 1 ) : 0;
				for( k in doc.createElement('input') ) k.substr(0,2) == 'on' ? ( i = 1,ev$[k.substr(2).toLowerCase()] = 1 ) : 0;
				if( !i ){
					k = Object.getOwnPropertyNames(doc)
						.concat(Object.getOwnPropertyNames(Object.getPrototypeOf(Object.getPrototypeOf(doc))))
						.concat(Object.getOwnPropertyNames(Object.getPrototypeOf(W)));
					i = k.length;
					while( i-- ) k[i].substr(0,2) == 'on' ? ( ev$[k[i].substr(2).toLowerCase()] = 1 ) : 0;
				}
				if( bs.DETECT.device =='tablet' || bs.DETECT.device=='mobile' ){
					ev$.down = 'touchstart', ev$.up = 'touchend', ev$.move = 'touchmove';
				}else{
					ev$.down = 'mousedown', ev$.up = 'mouseup', ev$.move = 'mousemove';
					ev$.rollover = function( $e ){
						if( !isChild( this, $e.event.fromElement || $e.event.relatedTarget ) ) $.type = 'rollover', $v.call( this, $e );
					};
					ev$.rollout = function( $e ){
						if( !isChild( this, $e.event.toElement || $e.event.explicitOriginalTarget ) ) $.type = 'rollout', $v.call( this, $e );
					};
				}
				ev = ( function( ev$, x, y ){
					var pageX, pageY, evType, prevent, keycode;
					evType = {
						'touchstart':2,'touchend':1,'touchmove':1,
						'mousedown':4,'mouseup':3,'mousemove':3,'click':3,'mouseover':3,'mouseout':3
					};
					if( bs.DETECT.browser == 'ie' && bs.DETECT.browserVer < 9 ){
						pageX = 'x', pageY = 'y';
					}else{
						pageX = 'pageX', pageY = 'pageY';
					}
					keycode = (function(){
						var t0, t1, i, j;
						t0 = 'a,65,b,66,c,67,d,68,e,69,f,70,g,71,h,72,i,73,j,74,k,75,l,76,m,77,n,78,o,79,p,80,q,81,r,82,s,83,t,84,u,85,v,86,w,87,x,88,y,88,z,90,back,8,tab,9,enter,13,shift,16,control,17,alt,18,pause,19,caps,20,esc,27,space,32,pageup,33,pagedown,34,end,35,home,36,left,37,up,38,right,39,down,40,insert,45,delete,46,numlock,144,scrolllock,145,0,48,1,49,2,50,3,51,4,52,5,53,6,54,7,55,8,56,9,57'.split(','),
						t1 = {},
						i = 0, j = t0.length;
						while( i < j ) t1[t0[i++]] = parseInt(t0[i++]);
						return t1;
					})();
					function ev( $dom ){
						this.dom = $dom;
					}
					ev.prototype.prevent = bs.DETECT.event ? function(){
						this.event.preventDefault(), this.event.stopPropagation();
					} : function( $e ){
						this.event.returnValue = false, this.event.cancelBubble = true;
					};
					ev.prototype.key = function( $key ){return this.code == keycode[$key];};
					ev.prototype._ = function(){
						var k;
						for( k in this ) if( this.hasOwnProperty[k] && typeof this[k] == 'function' ) dom['on'+k] = null;
						return null;
					};
					function isChild( $p, $c ){
						if( $c )
							do if( $c == $p ) return 1;
							while( $c = $c.parentNode )
						return 0;
					}
					ev.prototype.$ = function( $k, $v ){
						var self, dom, type;
						self = this, dom = self.dom;
						if( typeof ev$[$k] == 'string' ) $k = ev$[$k];
						if( $v === null ) dom['on'+$k] = null, delete self[$k];
						else if( $k == 'rollover' ) self.$( 'mouseover', ev$.rollover );
						else if( $k == 'rollout' ) self.$( 'mouseout', ev$.rollout );
						else{
							self[$k] = $v;
							dom['on'+$k] = function( $e ){
								var type, start, dx, dy, t0, t1, t2, i, j, X, Y;
								self.event = $e || ( $e = event ), self.type = $e.type, self.code = $e.keyCode, self.value = dom.value && bs.$trim( dom.value );
								if( type = evType[$k] ){
									dx = x( dom ), dy = y( dom );
									if( type < 3 ){
										t0 = $e.changedTouches,
										self.length = i = t0.length;
										while( i-- )
											t1 = t0[i],
											self['lx'+i] = ( self['x'+i] = X = t1[pageX] ) - dx,
											self['ly'+i] = ( self['y'+i] = Y = t1[pageY] ) - dy,
											type == 2 ?
												( self['_x'+i] = X, self['_y'+i] = Y ) :
												( self['dx'+i] = X - self['_x'+i], self['dy'+i] = Y - self['_y'+i] );
										self.x = self.x0, self.y = self.y0, self.lx = self.lx0, self.ly = self.ly0, self.dx = self.dx0, self.dy = self.dy0;
									}else{
										self.length = 0,
										self.lx = ( self.x = $e[pageX] ) - dx,
										self.ly = ( self.y = $e[pageY] ) - dy,
										type == 4 ?
											( self._x = self.x, self._y = self.y ) :
											( self.dx = self.x - self._x, self.dy = self.y - self._y );
									}
								}
								$v.call( dom, self );
							};
						}
					};
					return ev;
				} )( ev$, x, y );
				return ev$;
			})();
			return d;
		})( bs, style, doc ) );
		bs.WIN = (function(){
			var win;
			function ev( e, k, v, t ){
				var t0, i, j, target;
				target = t || W;
				if( v ){
					t0 = ev[e] || ( ev[e] = [] );
					t0[t0.length] = t0[k] = v;
					if( !target['on'+e] ) target['on'+e] = ev['@'+e] || ( ev['@'+e] = function( $e ){
						var t0, i, E;
						ev.event = $e || event;
						ev.type = ev.event.type, ev.code = ev.event.keyCode;
						t0 = ev[e], i = t0.length;
						while( i-- ) t0[i]( ev );
					} );
				}else if( ( t0 = ev[e] ) && t0[k] ){
					t0.splice( t0.indexOf( t0[k] ), 1 );
					if( !t0.length ) target['on'+e] = null;
				}
			}
			function hash( e, k, v ){
				var old, w, h;
				if( v ){
					t0 = ev[e] || ( ev[e] = [] );
					t0[t0.length] = t0[k] = v;
					if( !ev['@'+e] ){
						old = location.hash;
						ev['@'+e] = setInterval( function(){
							var t0, i, j;
							if( old != location.hash ){
								ev.type = 'hashchange'; ev.event = event,
								old = location.hash, t0 = ev[e], i = t0.length;
								while( i-- ) t0[i]( ev );
							}
						}, 50 );
					}
				}else if( ( t0 = ev[e] ) && t0[k] ){
					t0.splice( t0.indexOf( t0[k] ), 1 );
					if( !t0.length ){
						clearInterval( this['@'+e] );
						this['@'+e] = null;
					}
				}
			}
			function sizer( $wh ){
				win.on( 'resize', 'wh', $wh );
				if( bs.DETECT.eventRotate ) win.on( 'orientationchange', 'wh', $wh );
				$wh();
			}
			win = {
				on:function( e, k, v ){
					if( e == 'hashchange' && !W['HashChangeEvent'] ) return hash( e, k, v );
					if( e == 'orientationchange' && !W['DeviceOrientationEvent'] ) return 0;
					if( e.substr(0,3) == 'key' ) return ev( e, k, v, doc );
					ev( e, k, v );
				},
				is:(function( sel ){
					return function( $sel ){
						var t0;
						return ( t0 = sel( $sel ) ) && t0.length;
					};
				} )( bs.sel ),
				touchScroll:(function( doc, isTouch ){
					var i;
					function prevent( e ){
						e.preventDefault();
						return false;
					}
					return function(v){
						if( v ) doc.removeEventListener( 'touchmove', prevent, true);
						else if( isTouch && !i++ ) doc.addEventListener( 'touchmove', prevent, true);
					};
				})( doc, bs.DETECT.eventTouch ),
				scroll:(function( W, doc, root ){
					return function scroll(){
						switch( arguments[0].charAt(0) ){
						case'w': return root.scrollWidth;
						case'h': return root.scrollHeight;
						case'l': return doc.documentElement.scrollLeft || W.pageXOffset || 0;
						case't': return doc.documentElement.scrollTop || W.pageYOffset || 0;
						}
						W.scrollTo( arguments[0], arguments[1] );
					};
				})( W, doc, bs.DETECT.root ),
				w:0, h:0,
				sizer:(function( W, doc ){
					return function( $end ){
						var wh, r, s;
						if( !win.is( '#bsSizer' ) ) bs.d( '<div></div>' ).$( 'id', 'bsSizer', 'display','none','width','100%','height','100%','position','absolute','<','body' );
						s = bs.d('#bsSizer');
						switch( bs.DETECT.browser ){
						case'iphone':
							s.$( 'display', 'block', 'height', '120%' );
							W.onscroll = function( $e ){
								W.onscroll = null, W.scrollTo( 0, 0 );
								s.$( 'display', 'none', 'height', W.innerHeight+1 );
								sizer( function wh( $e ){
									$end( win.w = innerWidth, win.h = innerHeight );
								} );
							};
							W.scrollTo( 0, 1000 );
							break;
						case'android':case'androidTablet':
							if( bs.DETECT.sony ){
								sizer( function(){
									$end( win.w = s.$('w'), win.h = s.$('h') );
								} );
							}else{
								r = outerWidth == screen.width || screen.width == s.$('w') ? devicePixelRatio : 1;
								sizer( function wh(){
									$end( win.w = outerWidth / r, win.h = outerHeight / r + 1 );
								} );
							}
							break;
						default:
							if( W.innerHeight === undefined ){
								sizer( function(){
									$end( win.w = doc.documentElement.clientWidth || doc.body.clientWidth,
										win.h = doc.documentElement.clientHeight || doc.body.clientHeight );
								} );
							}else{
								sizer( function(){
									$end( win.w = W.innerWidth, win.h = W.innerHeight );
								} );
							}
						}
					}
				})( W, doc )
			};
			return win;
		})();
	})( W.document );
	bs.ANI = ( function(){
		var ani, timer, time, isLive, start, end, loop, isPause, ease, tweenPool, tTemp, style, filter;
		style = bs.style;
		filter = bs.filter;
		bs.style = bs.filter = null;
		ani = [];
		timer = W['requestAnimationFrame'] || W['webkitRequestAnimationFrame'] || W['msRequestAnimationFrame'] || W['mozRequestAnimationFrame'] || W['oRequestAnimationFrame'];
		if( timer ){
			start = function(){
				if( isLive ) return;
				isLive = 1, loop();
			};
			end = function(){ani.length = isLive = 0;};
			timer( function( $time ){if( Math.abs( $time - Date.now() ) < 1 ) time = 1;} );
			loop = function loop( $time ){
				var t, i, j;
				if( isPause ) return;
				if( isLive ){
					t = time ? $time : Date.now();
					i = ani.length;
					while( i-- ) if( ani[i].ANI(t) ) ani.splice( i, 1 );
					ani.length ? timer( loop ) : end();
				}
			};
		}else{
			start = function start(){
				if( isLive ) return;
				isLive = setInterval( loop, 17 );
			};
			end = function end(){
				if( !isLive ) return;
				clearInterval( isLive ), ani.length = isLive = 0;
			};
			loop = function loop(){
				var t, i;
				if( isPause ) return;
				if( isLive ){
					t = Date.now();
					i = ani.length;
					while( i-- ) if( ani[i].ANI(t) ) ani.splice( i, 1 );
					ani.length ? 0 : end();
				}
			};
		}
		ease = (function(){
			var PI, HPI, i;
			PI = Math.PI, HPI = PI * .5, i = 'cubic-bezier(';
			return {	
				linear:function(a,c,b){return b*a+c},//rate,start,term
				backIn:function(a,c,b){return b*a*a*(2.70158*a-1.70158)+c},
				backOut:function(a,c,b){a-=1;return b*(a*a*(2.70158*a+1.70158)+1)+c},
				backInOut:function(a,c,b){a*=2;if(1>a)return 0.5*b*a*a*(3.5949095*a-2.5949095)+c;a-=2;return 0.5*b*(a*a*(3.70158*a+2.70158)+2)+c},
				bounceIn:function(a,c,b,d,e){return b-ease[3]((e-d)/e,0,b)+c},
				bounceOut:function(a,c,b){if(0.363636>a)return 7.5625*b*a*a+c;if(0.727272>a)return a-=0.545454,b*(7.5625*a*a+0.75)+c;if(0.90909>a)return a-=0.818181,b*(7.5625*a*a+0.9375)+c;a-=0.95454;return b*(7.5625*a*a+0.984375)+c},
				bounceInOut:function(a,c,b,d,e){if(d<0.5*e)return d*=2,0.5*ease[13](d/e,0,b,d,e)+c;d=2*d-e;return 0.5*ease[14](d/e,0,b,d,e)+0.5*b+c},
				sineIn:function(a,c,b){return -b*Math.cos(a*HPI)+b+c},
				sineOut:function(a,c,b){return b*Math.sin(a*HPI)+c},
				sineInOut:function(a,c,b){return 0.5*-b*(Math.cos(PI*a)-1)+c},
				circleIn:function(a,c,b){return -b*(Math.sqrt(1-a*a)-1)+c},
				circleOut:function(a,c,b){a-=1;return b*Math.sqrt(1-a*a)+c},
				circleInOut:function(a,c,b){a*=2;if(1>a)return 0.5*-b*(Math.sqrt(1-a*a)-1)+c;a-=2;return 0.5*b*(Math.sqrt(1-a*a)+1)+c},
				_li:i+'0.250,0.250,0.750,0.750)',
				_baI:i+'0.600,-0.280,0.735,0.045)',_baO:i+'0.175,0.885,0.320,1.275)',_baIO:i+'0.680,-0.550,0.265,1.550)',
				_boI:i+'0.600,-0.280,0.735,0.045)',_boO:i+'0.175,0.885,0.320,1.275)',_boIO:i+'0.680,-0.550,0.265,1.550)',
				_siI:i+'0.470,0.000,0.745,0.715)',_siO:i+'0.390,0.575,0.565,1.000)',_siIO:i+'0.445,0.050,0.550,0.950)',
				_ciI:i+'0.600,0.040,0.980,0.335)',_ciO:i+'0.075,0.820,0.165,1.000)',_ciIO:i+'0.785,0.135,0.150,0.860)'
			};
		})();
		tweenPool = {length:0};
		function tween(){}
		tween.prototype.$ = function( $arg ){
			var t0, l, i, j, k, v, isDom, v0;
			
			this.t = t0 = $arg[0], this.isDom = isDom = t0.isDom, this.start = 1,
			this.time = 1000, this.timeR = .001, this.delay = 0, this.loop = this.loopC = 1,
			this.k = this.end = this.update = null, this.ease = ease.linear,
			this.length = i = t0.length || 1;
			while(i--)
				( this[i] ? (this[i].length=0) : (this[i]=[]) ), 
				( this[i][0] = isDom ? t0[i].bsS : (t0[i] || t0) );
			i = 1, j = $arg.length;
			while( i < j ){
				k = $arg[i++], v = $arg[i++];
				if( k == 'time' ) this.time = parseInt(v*1000), this.timeR = 1/this.time;
				else if( k == 'ease' ) this.ease = ease[v];
				else if( k == 'delay' ) this.delay = parseInt(v*1000);
				else if( k == 'loop' ) this.loop = this.loopC = v;
				else if( k == 'end' || k == 'update' ) this[k] = v;
				else if( k == 'key' ) tween[v] = this;
				else{
					l = this.length;
					while( l-- ){
						if( isDom ){
							if( style[k] ){
								v0 = this[l][0].$g( k ),
								this[l].push( style[k], v0, v - v0 );
							}
						}else{
							v0 = this[l][0][k],
							this[l].push( k, v0, v - v0 );
						}
					}
				}
			}
			this.ANI = isDom ? this.ANIstyle : this.ANIobj;
			this.stime = Date.now() + this.delay, this.etime = this.stime + this.time;
			ani[ani.length] = this, start();
		};
		tTemp = {length:0};
		tween.prototype.ANIstyle = function( $time ){
			var t0, t1, term, time, rate, i, j, l, k, v, e, s, u;
			if( !this.start ) return 1;
			if( ( term = $time - this.stime ) < 0 ) return;
			e = this.ease, time = this.time, rate = term * this.timeR, 
			l = this.length, j = this[0].length;
			if( term > this.time )
				if( --this.loopC ) return this.stime=$time+this.delay,this.etime=this.stime+this.time,0;
				else{
					while( l-- ){
						t0 = this[l], t1 = this[l][0], s = t1.s, u = t1.u, i = 1;
						while( i < j ) k = t0[i++], v = t0[i++] + t0[i++],
							typeof k == 'function' ? k( t1, v ) : s[k] = v + u[k];
					}
					tweenPool[tweenPool.length++] = this;
					if( this.end ) this.end( this.t );
					return 1;
				}
			while( l-- ){
				t0 = this[l], t1 = this[l][0], s = t1.s, u = t1.u, i = 1;
				while( i < j ) k = t0[i++], v = e( rate, t0[i++], t0[i++], term, time ),
					typeof k == 'function' ? k( t1, v ) : s[k] = v + u[k];
			}
			if( this.update ) this.update( rate, $time, this );
		};
		tween.prototype.ANIobj = function( $time ){
			var t0, t1, term, time, rate, i, j, l, k, v, e;
			if( !this.start ) return 1;
			if( ( term = $time - this.stime ) < 0 ) return;
			e = this.ease, time = this.time, rate = term * this.timeR, l = this.length, j = this[0].length;
			if( term > this.time )
				if( --this.loopC ) return this.stime=$time+this.delay,this.etime=this.stime+this.time,0;
				else{
					while( l-- ){
						t0 = this[l], t1 = this[l][0], i = 1;
						while( i < j ) t1[t0[i++]] = t0[i++] + t0[i++];
					}
					tweenPool[tweenPool.length++] = this;
					if( this.end ) this.end( this.t );
					return 1;
				}
			while( l-- ){
				t0 = this[l], t1 = this[l][0], i = 1;
				while( i < j ) t1[t0[i++]] = e(rate,t0[i++],t0[i++],term,time);
			}
			if( this.update ) this.update( rate, $time, this );
		};
		return {
                        tweenStop:function(){
                            for(var i=0; i < ani.length; i++){
                                if(ani[i].t){
                                    if(arguments[0].__k == ani[i].t.__k){
                                        ani[i] = {ANI:function(){}};
                                    }
                                }
                            }
                        },
			tween:function(){
				( tweenPool.length ? tweenPool[--tweenPool.length] : new tween ).$( arguments );
			},
			ani:function( $ani ){if( $ani.ANI )ani[ani.length] = $ani,start();},
			fps:(function(){
				var printer, prev, sum, cnt, isStop;
				prev = sum = cnt = 0;
				function fps(){
					if( arguments.length ){
						if( printer ) throw 'fps is running';
						isStop = 0,
						printer = arguments[0],
						bs.ANI.ani( fps );
					}else{
						isStop = 1,
						printer = null;
					}
				}
				fps.ANI = function( $time ){
					var i;
					i = parseInt(1000/($time - prev)),
					sum += i,
					cnt++,
					printer.innerHTML = "fps:"+i+", average:"+parseInt( sum / cnt ),
					prev = $time;
					return isStop;
				};
				return fps;
			})(),
			pause:function(){isPause = 1;},resume:function(){isPause = 0, loop();},
			stop:function(){end();},
			delay:(function(){
				var delay = [];
				return function( $f ){
					var i;
					if( (i = deley.indexOf( $f ) ) == -1 ){
						delay[delay.length] = $f;
						$f.bsDelay = setTimeout( $f, ( arguments[1] || 1 ) * 1000 );
					}else{
						delay.splice( i, 1 );
						clearTimeout( $f.bsDelay );
						delete $f.bsDelay;
					}
				};
			})()
		};
	})();
	W[N||'bs'] = bs;
}
init.len = 0;
W[N||'bs'] = function(){init[init.len++] = arguments[0];};
(function( doc ){
	var isReady;
	function loaded(){
		var i, j;
		if( isReady ) return;
		if( !doc.body ) return setTimeout( loaded, 1 );
		isReady = 1;
		if( doc.addEventListener ){
			doc.removeEventListener( "DOMContentLoaded", loaded, false );
			W.removeEventListener( "load", loaded, false );
		}else{
			doc.detachEvent( "onreadystatechange", loaded );
			W.detachEvent( "onload", loaded );
		}
		init(doc);
		for( i = 0, j = init.len ; i < j ; i++ ) init[i]();
	}
	if( doc.readyState !== "loading" ) loaded();
	if( doc.addEventListener ){
		doc.addEventListener( "DOMContentLoaded", loaded, false );
		W.addEventListener( "load", loaded, false );
	}else{
		doc.attachEvent( "onreadystatechange", loaded );
		W.attachEvent( "onload", loaded );		
		(function(){
			var t0, check;
			try{t0 = W.frameElement == null;}catch(e){}
			if( doc.documentElement.doScroll && t0 )( check = function(){
				if( isReady ) return;
				try{doc.documentElement.doScroll("left");
				}catch(e){return setTimeout( check, 1 );}
				loaded();
			} )();
		})();
	}
})( W.document );
} )( this );