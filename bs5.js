( function( W, N ){
'use strict';
if( !Date.now ) Date.now = function(){return +new Date;};
if( !W['console'] )	W['console'] = {log:function(){alert( arguments.join() );}};
if( !Array.prototype.indexOf )
	Array.prototype.indexOf = function( $v, i ){
		var j, k, l;
		if( j = this.length ){
			for( i = !i ? 0 : i, k = parseInt( j * .5 ) + 1, j-- ; i < k ; i++ )
				if( this[l = i] === $v || this[l = j - i] === $v ) return l;
		}
		return -1;
	};
function init(doc){
	var bs = (function(doc){
		var sel,sz,t0,div;
		if( doc.querySelectorAll ){
			sel = function( $sel ){
				return doc.querySelectorAll( $sel );
			};
		}else if( sz = W['Sizzle'] ){
			sel = function( $sel ){
				return sz( $sel );
			};
		}else if( sz = doc.getElementById('sizzle') ){
			t0 = doc.createElement( 'script' );
			doc.getElementsByTagName('head')[0].appendChild( t0 );
			t0.text = sz.text;
			sz = Sizzle;
			sel = function( $sel ){
				return sz( $sel );
			};
		}else{
			sel = function( $sel ){
				var t0, t1, i, j;
				switch( $sel.charAt(0) ){
				case'#':return {0:doc.getElementById($sel.substr(1)),length:1};
				case'.':
					$sel = $sel.substr(1);
					t0 = doc.getElementsByTagName('*');
					t1 = {length:0};
					for( i = 0, j = t0.length ; i < j ; i++ ) if( t0[i].className.indexOf( $sel ) > -1 ) t1[t1.length++] = t0[i];
					return t1;
				}
				return doc.getElementsByTagName($sel);
			};
		}
		div = doc.createElement( 'div' );
		function bs( $sel ){
			var r, t0, i, j, k;
			t0 = typeof $sel; 
			if( t0 == 'function' ) return $sel();
			if( t0 == 'string' ){
				if( $sel.charAt(0) == '<' ){
					div.innerHTML = $sel;
					return div.childNodes;
				}else return sel( $sel );
			}else if( $sel.isDom ) return $sel;
			else if( $sel.nodeType ) return {0:$sel,length:1};
			else if( j = $sel.length ){
				r = {length:0};
				for( i = 0 ; i < j ; i++ ){
					t0 = bs( $sel[i] );
					k = t0.length;
					while( k-- ) r[r.length++] = t0[k];
				}
				return r;
			}
		}
		return bs;
	})(doc);
	var factory = (function(bs){
		function cls( $arg ){
			var key, factory, t0, k;
			key = $arg[0], factory = $arg[1];
			if( factory.init ){
				cls[key] = function( $key ){
					this.__k = $key;
					this.__i( $key );
				};
			}else{
				cls[key] = function( $key ){
					this.__k = $key;
				};
			}
			t0 = cls[key].prototype;
			t0.$ = factory.$;
			t0.__i = factory.init;
			t0.__d = del;
			t0.__f = factory;
			for( k in factory.method ) t0[k] = factory.method[k];
			return factory;
		}
		function del(){
			delete this.__f[this.__k];
			return this.__k;
		}
		function factory( $key ){
			function F(){
				var t0;
				return ( t0 = arguments[0] ).charAt(0) == '@' ? ( F[t0=t0.substr(1)] = new cls[$key](t0) ) : F[t0] || ( F[t0] = new cls[$key](t0) );
			}
			return F;
		}
		bs.module = function(){
			bs[arguments[0]] = new cls(arguments);
		};
		bs.factory = factory;
		return factory;
	})(bs);
	bs.module( 'D', (function(){
		function b(c,f){return function(){return f.apply(c,arguments);};}
		var D = factory( 'D' );
		D.$ = function D$(){
			var self, mode, i, j, k, v, s, e, p;
			i = 0, j = arguments.length;
			while( i < j ){
				if( ( k = arguments[i++] ) === null ) return t0.__d();
				switch( k.charAt(0) ){
				case'~': mode = 1; k = k.substr(1); break;
				case'=': mode = 2; k = k.substr(1); break;
				default: mode = 0;
				}
				self = this, s = 0;
				while( ( e = k.indexOf('.', s) ) > -1 ) self = self[p = k.substring( s, e )] || ( self[p] = bs.__('D') ), s = e + 1;
				if( s ) k = k.substr( s );
				if( mode == 1 ) return b( self, self[k] );
				v = arguments[i++];
				if( mode == 2 ) return self[k]( v );
				if( v === undefined ) return self[k];
				if( v === null ) delete self[k];
				else self[k] = v;
			}
			return v;
		};
		return D;
	} )() );
	bs.$ex = (function(){
		var ra, rc, random, rand, randf;
		ra = {}, rc = 0;
		random = function random(){
			rc++, rc %= 1000;
			return ra[rc] || ( ra[rc] = Math.random() );
		};
		rand = function rand( $a, $b ){ return parseInt( random() * ( parseInt( $b ) - $a + 1 ) ) + $a; }
		randf = function randf( $a, $b ){ return random() * ( parseFloat($b) - parseFloat($a) ) + parseFloat($a); }
		return function ex(){
			var t0, i, j;
			t0 = arguments[0];
			i = 1, j = arguments.length;
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
			node = $node.childNodes;
			r = {};
			for( i = 0, j = node.length ; i < j ; i++ ){
				t0 = type ? node[i] : node.nextNode();
				if( t0.nodeType == 3 ){
					r.value = (type ? t0.textContent : t0.text).replace( t, '' );
				}else{
					n = t0.nodeName;
					t0 = _xml( t0 );
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
			t0 = $data.childNodes;
			r = {}, i = 0, j = t0.length;
			if( $end ){
				( nn = function(){
					var k, t1;
					for( var k = 0 ; i < j && k < 5000 ; i++, k++ ){
						t1 = type ? t0[i] : t0.nextNode();
						r[t1.nodeName] = _xml( t1 );
					}
					i < j ? setTimeout( nn, 16 ) : $end( r );
				} )();
			}else{
				for( ; i < j ; i++ ){
					t1 = type ? t0[i] : t0.nextNode();
					r[t1.nodeName] = _xml( t1 );
				}
				return r;
			}
		}
		function filter( $data ){
			if( $data.substr( 0, 20 ).indexOf( '<![CDATA[' ) > -1 ) $data = $data.substring( 0, 20 ).replace( '<![CDATA[', '' ) + $data.substr( 20 );
			if( $data.substr( $data.length - 5 ).indexOf( ']]>' ) > -1 ) $data = $data.substring( 0, $data.length - 5 ) + $data.substr( $data.length - 5 ).replace( ']]>', '' );
			return $data.replace( t, '' );
		}
		if( W['DOMParser'] ){
			type = 1;
			parser = new DOMParser;
			return function( $data, $end ){
				return xml0( parser.parseFromString( filter( $data ), "text/xml" ), $end );
			};
		}else{
			type = 0;
			parser = (function(){
				var t0, i, j;
				t0 = 'MSXML2.DOMDocument', t0 = ['Microsoft.XMLDOM', 'MSXML.DOMDocument', t0, t0+'.3.0', t0+'.4.0', t0+'.5.0', t0+'.6.0'];
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
			if( window['HTMLCanvasElement'] ){
				t0.onload = $data.loaded;
			}else{
				( t1 = function(){
					t0.complete ? $data.loaded() : setTimeout( t1, 10 );
				} )();
			}
			t0.src = $src;
			return t0;
		}
		return function load( $end ){
			var t0, path, i, j;
			if( arguments.length == 2 && arguments[1][0] ){
				path = arguments[1];
				i = 0;
			}else{
				path = arguments;
				i = 1;
			}
			j = path.length;
			t0 = {
				count:0, length:0,
				loaded:function loaded(){
					var t1, w, h, i, j;
					if( ++t0.count == ( j = t0.length ) ){
						i = 0;
						while( i < j ){
							t1 = t0[i++];
							t1.bs = {w:w = t1.width, h:h = t1.height};
						}
						if( $end ) $end( t0 );
					}
				}
			};
			while( i < j ) t0[t0.length++] = _load( path[i++], t0 );
		};
	})();
	bs.$alert = function $alert( $msg ){ alert( $msg ); };
	bs.$url = function $url( $url ){ location.href = $url; };
	bs.$open = function $open( $url ){ W.open( $url ); };
	bs.$back = function $back(){ history.back(); };
	bs.$reload = function $reload(){ location.reload(); };
	bs.$js = (function(doc){
		var _callback = 0;
		bs.__callback = {};
		return function js( $end, $url ){
			var t0, i;
			t0 = doc.createElement( 'script' ), t0.type = 'text/javascript', t0.charset = 'utf-8';
			if( $url.charAt( $url.length -1 ) == '=' ){
				$url += 'bs.__callback.' + ( i = 'c' + (_callback++) );
				bs.__callback[i] = function(){
					$end.apply( null, arguments );
					delete bs.__callback[i];
				};
			}else if( $end ){
				if( W['addEventListener'] ){
					t0.onload = function(){
						t0.onload = null;
						$end();
					}
				}else{
					t0.onreadystatechange = function(){
						if( t0.readyState == 'loaded' ){
							t0.onreadystatechange = null;
							$end();
						}
					}
				}
			}
			doc.getElementsByTagName( 'head' )[0].appendChild( t0 );
			t0.src = $url;
		};
	})(doc);
	(function(){
		var	_timeout = 5000, _cgiA = []; 
		var rq = W['XMLHttpRequest'] ? function rq(){ return new XMLHttpRequest; } : ( function(){
			var t0, i, j;
			t0 = 'MSXML2.XMLHTTP', t0 = ['Microsoft.XMLHTTP',t0,t0+'.3.0',t0+'.4.0',t0+'.5.0'];
			i = t0.length;
			while( i-- ){
				try{ new ActiveXObject( j = t0[i] ); }catch( $e ){ continue; }
				break;
			}
			return function rq(){ return new ActiveXObject( j ); };
		} )();
		function xhrSend( $type, $xhr, $data ){
			$xhr.setRequestHeader( 'Content-Type', $type == 'GET' ? 'text/plain; charset=UTF-8' : 'application/x-www-form-urlencoded; charset=UTF-8' );
			$xhr.setRequestHeader( 'Cache-Control', 'no-cache' );
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
				};
				t1 = setTimeout( function(){
					if( t1 < 0 ) return;
					t1 = -1;
					$end( null );
				}, _timeout );
			}
			return t0;
		}
		function cgi( $arguments, $idx ){
			var t0, i, j;
			t0 = _cgiA;
			t0.length = 0;
			i = $idx ? $idx : 0, j = $arguments.length;
			if( j - i > 1 ) while( i < j ) t0[t0.length] = encodeURIComponent( $arguments[i++] ) + '=' + encodeURIComponent( $arguments[i++] );
			t0[t0.length] = 'bsNoCache=' + bs.$ex( 1000, '~' ,9999 );
			return t0.join( '&' );
		}
		bs.$timeout = function timeout( $time ){
			_timeout = parseInt( $time * 1000 );
		};
		bs.$get = function get( $end, $url ){
			var t0;
			t0 = cgi( arguments, 2 );
			$url = $url.split( '#' );
			$url = $url[0] + ( $url[0].indexOf( '?' ) > -1 ? '&' : '?' ) + t0 + ( $url[1] ? '#' + $url[1] : '' );
			t0 = xhr( $end );
			t0.open( 'GET', $url, $end ? true : false );
			xhrSend( 'GET', t0, '' );
			if( !$end )	return t0.responseText;
		};
		bs.$post = function post( $end, $url ){
			var t0;
			t0 = xhr( $end );
			t0.open( 'POST', $url, $end ? true : false );
			xhrSend( 'POST', t0, cgi( arguments, 2 ) || '' );
			if( !$end )	return t0.responseText;
		};
	})();
	bs.$ck = function ck( $key ){
		var r, t0, t1, t2, key, val, i, j;
		t0 =  doc.cookie.split(';');
		i = t0.length;
		if( arguments.length == 1 ){
			while( i-- ){
				if( ( t1 = t0[i] ) && t1.substring( 0, j = t1.indexOf('=') ).replace( /\s/, '' ) == $key ){
					t2 = t1.substr( j + 1);
				}
			}
		}else{
			val = arguments[1];
			t1 = $key + '=' + ( val || '' ) + ';domain='+document.domain+';path=/';
			if( arguments[2] ){
				t0 = new Date;
				t0.setTime( t0.getTime() + arguments[2] * 86400000 );
				t1 += ';expires=' + t0.toUTCString();
			}else if( val === null ){
				t0 = new Date;
				t0.setTime( t0.getTime() - 86400000 );
				t1 += ';expires=' + t0.toUTCString();
			}
			doc.cookie = t1;
			t2 = val + '';
		}
		return t2 ? decodeURIComponent( t2 ) : null;
	};
	( function( doc ){
		var platform, app, agent, device,
			flash, browser, bVersion, os, osVersion, cssPrefix, stylePrefix, transform3D,
			b, bStyle, div,
			v, a, c;
			
		agent = navigator.userAgent.toLowerCase();
		platform = navigator.platform.toLowerCase();
		app = navigator.appVersion.toLowerCase();
		flash = 0;
		device = 'pc';
		( function(){
			function ie(){
				if ( agent.indexOf( 'msie' ) < 0 ) return;
				if( agent.indexOf( 'iemobile' ) > -1 ) os = 'winMobile';
				browser = 'ie';
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
		
		bs.detect = {
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
			var filter, sv, nopx;
			sv = (function(){
				var i = 0;
				function sv(){this.v = arguments[0], this.u = arguments[1];}
				sv.prototype.toString = function(){return this.v + this.u;}
				function sv$(){return i ? sv$[--i] : new sv( arguments[0], arguments[1] );}
				sv._ = function sv_(){sv$[i++] = arguments[0];}
				return sv$;
			})();
			filter = (function(){
				var filter;
				filter = {};
				if( !bs.detect.opacity )
					filter.opacity = function($s){
						var v;
						switch( v = arguments[0] ){
						case undefined: return $s.opacity;
						case null:
							delete $s.opacity;
							$s.s.filter = '';
							return v;
						}
						$s.opacity = v;
						$s.s.filter = 'alpha(opacity=' + parseInt( v * 100 ) + ')';
						return v;
					};
	
				return filter;
			})();
			function style(){this.s = arguments[0];}
			(function(){
				var p, pf, pfL, i, j, k, kk, l;
				pf = bs.detect.stylePrefix, pfL = pf.length;
				for( k in doc.body.style ){
					if( k == 'length' ) continue;
					if( k.substr( 0, pfL ) == pf ){
						k = k.substr( pfL );
						p = 1;
					}else{
						p = 0;
					}
					for( i = l = 0, j = k.length, kk = '' ; i < j ; i++ ){
						if( k.charCodeAt(i) < 90 ){
							kk += k.substring( l, i ).toLowerCase() + '-';
							l = i;
						}
					}
					style[kk + k.substring( l ).toLowerCase()] = ( p ? pf : '' ) + k;
				}
			})();
			nopx = {'opacity':1,'zIndex':1};
			style.prototype.$ = function( $arg ){
				var i, j, k, v, f, vt, u;
				i = 0, j = $arg.length;
				while( i < j ){
					k = style[$arg[i++]], v = $arg[i++];
					if( filter[k] ) v = filter[k]( this, v );
					else if( v === undefined ) return this[k].v; //get
					else if( v === null ){//del
						sv._( this[k] );
						delete this[k];
						this.s[k] = '';
					}else{
						if( this[k] === undefined ){//add
							this[k] = typeof v == 'number' ? sv( v, nopx[k]?'':'px' ) :
								( u = v.indexOf( ':' ) ) == -1 ? sv( v, '' ):
								sv(  parseFloat( v.substr( 0, u ) ), v.substr( u + 1 ) );
							v = this[k].v;
						}else{//set
							this[k].v = v;
						}
						this.s[k] = this[k]+'';
					}
				}
				return v;
			};
			return style;
		})();
		bs.module( 'c', ( function( style ){
			var css, sheet, rule, del;
			sheet = doc.createElement( 'style' );
			doc.getElementsByTagName( 'head' )[0].appendChild( sheet );
			sheet = sheet.styleSheet || sheet.sheet;
			rule = sheet.cssRules || sheet.rules;
			function idx( $sel ){
				var i, j, k;
				$sel = $sel.toLowerCase();
				for( i = 0, j = rule.length ; i < j ; i++ )
					if( rule[k = i].selectorText.toLowerCase() == $sel ||
						rule[k = j - i - 1].selectorText.toLowerCase() == $sel
					) return k;
			}
			css = factory( 'c' );
			css.$ = function css$(){
				if( arguments[0] === null ) return del( this.__d() );
				return this.s.$( arguments );
			};
			if( sheet.insertRule ){
				css.init = function( $key ){
					sheet.insertRule( $key + '{}', rule.length );
					this.s = new style( rule[rule.length - 1].style );
				};
				del = function del( $key ){
					sheet.deleteRule( idx( $key ) );
				};
			}else{
				css.init = function( $key ){
					sheet.addRule( $key, ' ' );
					this.s = new style( rule[rule.length - 1].style );
				};
				del = function del( $key){
					sheet.removeRule( idx( $key ) );
				};
			}
			return css;
		})( style ) );
		bs.module( 'd', (function( bs, style, doc ){
			var d, ds, ev, t;
			t = /^\s*|\s*$/g;
			function x( $dom ){
				var i = 0; do i += $dom.offsetLeft; while( $dom = $dom.offsetParent )
				return i;
			}
			function y( $dom ){
				var i = 0; do i += $dom.offsetTop; while( $dom = $dom.offsetParent )
				return i;
			}
			d = factory( 'd' );
			d.init = function( $key ){
				var t0, i;
				t0 = bs( $key );
				this.length = i = t0.length;
				while( i-- ) this[i] = t0[i];
			};
			d.$ = function d$(){
				var dom, t0, l, s, i, j, k, v;
				if( typeof arguments[0] == 'number' ){
					s = l = 1;
				}else{
					l = this.length, s = 0;
				}
				j = arguments.length;
				while( l-- ){
					dom = this[l], i = s, ds.length = 0;
					while( i < j ){
						k = arguments[i++], v = arguments[i++];
						if( k === null ) return this._();
						if( v === undefined ){ //get
							if( style[k] ){
								ds.length = 1;
								ds[0] = k;
								ds[1] = undefined;
								return dom.bsS ? dom.bsS.$(ds) : undefined;
							}else if( ev[k] ){
								return ev( dom, k );
							}else{
								return ( t0 = ds[k.charAt(0)] ) ? t0( dom, k.substr(1) ) : d[k]( dom );
							}
						}else{
							style[k] ? ( ds[ds.length++] = k, ds[ds.length++] = v ) :
							ev[k] ? ev( dom, k, v ) :
							( t0 = ds[k.charAt(0)] ) ? t0( dom, k.substr(1), v ) :
							d[k]( dom, v );
						}
					}
					if( ds.length ){
						if( !dom.bsS ) dom.bsS = new style( dom.style );
						dom.bsS.$( ds );
					}
				}
				return v;
			};
			d.method = {
				isDom:1,
				'_': function(){
					var dom, i, j, k;
					i = this.length;
					while( i-- ){
						dom = this[i];
						if( dom.bsE ) dom.bsE = dom.bsE._();
						if( dom.bsS ) dom.bsS = null;
						dom.parentNode.removeChild( dom );
						j = dom.attributes.length;
						while( j-- ){
							k = dom.attributes[j].nodeName;
							switch( typeof dom.getAttribute( k ) ){
							case'object':case'function': dom.removeAttribute( k );
							}
						}
						this[i] = null;
					}
					this.__d();
				}
			};
			ds = {
				'@':function( $dom, $k, $v ){
					return $v === undefined ? $dom[$k] : ($dom[$k] = $v);
				},
				'_':( function( view, style ){
					return bs.detect.cstyle ? function( $dom, $k ){
						var t0 = view.getComputedStyle($dom,'').getPropertyValue($k);
						return t0.substr( t0.length - 2 ) == 'px' ? parseFloat( t0.substring( 0, t0.length - 2 ) ) : t0;
					} : function( $dom, $k ){
						var t0 = $dom.currentStyle[style[$k]];
						return t0.substr( t0.length - 2 ) == 'px' ? parseFloat( t0.substring( 0, t0.length - 2 ) ) : t0;
					};
				} )( doc.defaultView, style ),
				'>':function( $dom, $k, $v ){
					var i, j;
					if( $v ){
						$v = bs( $v ), i = 0, j = $v.length;
						while( i < j ) $dom.appendChild( $v[i++] );
					}else{
						return $k == '>' ? $dom.childNodes : $dom.childNodes[$k.substr(1)];
					}
				}
			};
			d.x = x, d.y = y;
			d.lx = function( $dom ){ return x( $dom ) - x( $dom.parentNode ); };
			d.ly = function( $dom ){ return y( $dom ) - y( $dom.parentNode ); };
			d.w = function( $dom ){ return $dom.offsetWidth; };
			d.h = function( $dom ){ return $dom.offsetHeight; };
			d.submit = function( $dom ){ $dom.submit(); };
			d.focus = function( $dom ){ $dom.focus(); };
			d.blur = function( $dom ){ $dom.blur(); };
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
				var t = bs.detect.text;
				d.text = function( $dom ){return $v === undefined ? $dom[t] : ($dom[t]=$v);};
				d['text+'] = function( $dom ){return $dom[t] += $v;};
				d['+text'] = function( $dom ){return $dom[t] = $v + $dom[t];};
			})();
			d.style = function( $dom ){return $dom.bsS;};
			d['class'] = function( $dom, $v ){return $v === undefined ? $dom.className : ($dom.className = $v);};
			d['class+'] = function( $dom, $v ){
				var t0 = $dom.className;
				return ( t0 && t0.indexOf( $v ) == -1 ) ? ( $dom.className = $val + ' ' + t0.replace( t, '' ) ) : $dom.className;
			};
			d['class-'] = function( $dom, $v ){return $dom.className = $dom.className.replace( $v, '' ).replace( '  ', ' ' );};
			d.id = function( $dom ){ return $dom.id };
			d.src = function( $dom ){ return $dom.src; };
			ev = (function(){
				var k, ev, i;
				function ev$( $dom, $k, $v ){
					var t0;
					if( $v ) return ( $dom.bsE || ( $dom.bsE = new ev( $dom ) ) ).$( $k, $v );
					if( $v === undefined ) return ( t0 = $dom.bsE ) ? t0[$k] : $dom[$k];
					if( $v === null ) return ( t0 = $dom.bsE ) ? t0.$( $k, null ) : ( $dom[$k] = null );
				}
				for( k in doc.createElement('div') ) k.substr(0,2) == 'on' ? ( i = 1,ev$[k.substr(2).toLowerCase()] = 1 ) : 0;
				if( !i ){
					k = Object.getOwnPropertyNames(doc)
						.concat(Object.getOwnPropertyNames(Object.getPrototypeOf(Object.getPrototypeOf(doc))))
						.concat(Object.getOwnPropertyNames(Object.getPrototypeOf(W)));
					i = k.length;
					while( i-- ) k[i].substr(0,2) == 'on' ? ( ev$[k[i].substr(2).toLowerCase()] = 1 ) : 0;
				}
				ev = ( function( x, y ){
					var pageX, pageY, evType, prevent;
					evType = {
						'touchstart':2,'touchend':1,'touchmove':1,
						'mousedown':4,'mouseup':3,'mousemove':3,'click':3,'mouseover':3,'mouseout':3
					};
					if( bs.detect.browser == 'ie' && bs.detect.browserVer < 9 ){
						pageX = 'x', pageY = 'y';
					}else{
						pageX = 'pageX', pageY = 'pageY';
					}
					
					function ev( $dom ){
						this.dom = $dom;
					}
					ev.prototype.prevent = bs.detect.event ? function(){
						this.event.preventDefault(), this.event.stopPropagation();
					} : function( $e ){
						this.event.returnValue = false, this.event.cancelBubble = true;
					};
					ev.prototype._ = function(){
						var k;
						for( k in this ) if( this.hasOwnProperty[k] && typeof this[k] == 'function' ) dom['on'+k] = null;
						return null;
					};
					ev.prototype.$ = function( $k, $v ){
						var self, dom, type;
						self = this, dom = self.dom;
						if( $v === null ){
							dom['on'+$k] = null;
							delete self[$k];
						}else{
							self[$k] = $v;
							dom['on'+$k] = function( $e ){
								var type, start, dx, dy, t0, t1, t2, i, j, X, Y;
								self.event = $e || ( $e = event );
								self.type = $e.type, self.code = $e.keyCode;
								if( type = evType[$k] ){
									dx = x( dom );
									dy = y( dom );
									if( type < 3 ){
										t0 = $e.changedTouches;
										self.length = i = t0.length;
										while( i-- ){
											t1 = t0[i];
											self['lx'+i] = ( self['x'+i] = X = t1[pageX] ) - dx;
											self['ly'+i] = ( self['y'+i] = Y = t1[pageY] ) - dy;
											if( type == 2 ){
												self['_x'+i] = X;
												self['_y'+i] = Y;
											}else{
												self['dx'+i] = X - self['_x'+i];
												self['dy'+i] = Y - self['_y'+i];
											}
										}
										self.x = self.x0, self.y = self.y0, self.lx = self.lx0, self.ly = self.ly0, self.dx = self.dx0, self.dy = self.dy0;
									}else{
										self.length = 0;
										self.lx = ( self.x = $e[pageX] ) - dx;
										self.ly = ( self.y = $e[pageY] ) - dy;
										if( type == 4 ){
											self._x = self.x, self._y = self.y;
										}else{				
											self.dx = self.x - self._x, self.dy = self.y - self._y;
										}
									}
								}
								$v.call( dom, self );
							};
						}
					};
					return ev;
				} )( x, y );
				return ev$;
			})();
			return d;
		})( bs, style, doc ) );
	})( W.document );
	W[N||'bs'] = bs;
}
init.len = 0;
W[N||'bs'] = function(){

	init[init.len++] = arguments[0];
};
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