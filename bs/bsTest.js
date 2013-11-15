function bsTest( $printer,$title ){
	var id, i, j, k, r, t, s, f, check, title, target, origin, t0, t1;
	if( typeof $printer != 'function' ){
		title = $printer;
		$printer = bsTest.printer;
		i = 1;
	}else{
		title = $title;
		i = 2;
	}
	id = bsTest.id++;
	r = '<div style="border:1px dashed #999;padding:10px;margin:10px"><div id="bsTestOn'+id+'" style="display:none;cursor:pointer" onclick="bsTest.on(this)"><div style="float:left"><b>'+title+'</b><hr><ol>';
	t = s = f = 0;
	for( k = 1, j = arguments.length ; i < j ; k++ ){
		t++;
		t0 = arguments[i++];
		r += '<li>';
		if( typeof t0 == 'function' ){
			r += '<pre style="display:inline;">'+bsTest.f2s(t0)+'</pre>';
			target = t0();
		}else{
			r += t0;
			target = arguments[i++];
		}
		r += ' <b>';
		origin = arguments[i++];
		if( target && target.bsTestType )	t1 = bsTest._bsCompare(target, origin, r), r = t1[0], check = t1[1];
		else if( origin && origin.bsTestType ) t1 = bsTest._bsCompare(origin, target, r), r = t1[0], check = t1[1];
		else{
			r += '== ' + target;
			check = origin === target;
		}
		r += '</b> :: <b>'+ (origin ? (origin.bsTestType ? target:origin) : origin) + '</b> <b style="color:#' + ( check ? ( s++,'0a0">OK') : (f++,'a00">NO') ) + '</b></li>';
	}
	if( f ) bsTest.isOK = 0;
	r += '</ol></div><div style="padding:5px;float:right;border:1px dashed #999;text-align:center"><b style="font-size:30px;color:#' + ( f ? 'a00">FAIL' : '0a0">OK' ) + '</b><br>ok:<b style="color:#0a0">' + s + '</b> no:<b style="color:#a00">' + f + '</b></div><br clear="both"></div>'+
		'<div id="bsTestOff'+id+'" style="display:block;cursor:pointer" onclick="bsTest.off(this)"><b>'+title+'</b> : <b style="color:#' + ( f ? 'a00">FAIL' : '0a0">OK' ) + '</b></div></div>';
	$printer( r );
	if( window.top.bsTest ) window.top.bsTest.isOKsub = bsTest.isOK;
	if( bsTest.result )bsTest.result( '<hr><div style="font-weight:bold;font-size:30px;padding:10px;color:#' + ( !bsTest.isOK ? 'a00">FAIL' : '0a0">OK' ) + '</div>' );
}
bsTest.f2s = (function(){
	var r0, r1;
	r0 = /</g;
	r1 = /\t/g;
	return function( $f ){
		var t0, t1, i, j;
		t0 = $f.toString().split('\n');
		t1 = t0[t0.length - 1];
		t1 = t1.substr( 0, t1.length - 1 );
		for( i = 0, j = t0.length ; i < j ; i++ ) if( t0[i].substr( 0, t1.length ) == t1 ) t0[i] = t0[i].substr( t1.length );
		return t0.join( '\n' ).replace( r0, '&lt;' ).replace( r1, '  ' );
	};
})();
bsTest.RANGE = function( a, b ){
	var t0 = [a,b];
	t0.bsTestType = 'range';
	return t0;
};
bsTest.IN = function(){
	var t0 = Array.prototype.slice.call( arguments, 0 );
	t0.bsTestType = 'in';
	return t0;
};
bsTest.NOT = function( a ){
	var t0 = [a];
	t0.bsTestType = 'not';
	return t0;
};
bsTest.ITEM = function( a ){
	var t0 = a;
	t0.bsTestType = 'item';
	return t0;
}
bsTest._deepCompare = function( $a, $b ){
	var t0, i, j, l;
	if( (t0 = typeof $a) != typeof $b ) return false;
	switch( t0 ){
	case'number':case'boolean':
	case'undefined':case'null':
	case'string': return $a === $b;
	case'object':
		if( l=0, $a.splice ){
			if( $a.length != $b.length ) return false;
			for( i = 0, j = $a.length ; i < j ; i++ )	if( !bsTest._deepCompare( $a[i], $b[i] ) ) return false;
		}else{
			for( i in $b ) l++;
			for( i in $a ){
				if( !bsTest._deepCompare( $a[i], $b[i] ) ) return false;
				l--;
			}
		}
		return !l;
	}
};
bsTest._bsCompare = function($t, $o, $r) {
	var chk;
	switch( $t.bsTestType ){
	case'in':
		$r += 'of [' + $t.join(',') +']';
		chk = $t.indexOf( $o ) > -1 ? 1 : 0;
		break;
	case'range':
		$r += '( ' + $t[0] + ' ~ ' + $t[1] + ' ) ';
		chk = $t[0] <= $o && $o <= $t[1];
		break;
	case'not':
		$r += '!= ' + $t[0];
		chk = $o !== $t[0] ? 1 : 0;
		break;
	case'item':
		$r += '== ' + $t;
		chk = bsTest._deepCompare($t, $o);
	}
	return [$r, chk];
};
bsTest.isOKsub = bsTest.isOK = 1, bsTest.id = 0, bsTest.IFid = 'bsTestIF';
bsTest.off = function(dom){dom.style.display = 'none', document.getElementById('bsTestOn'+dom.id.substr(9)).style.display = 'block';};
bsTest.on = function(dom){dom.style.display = 'none', document.getElementById('bsTestOff'+dom.id.substr(8)).style.display = 'block';};
bsTest.tear = function( $title, $func ){
	var id;
	$func();
	id = bsTest.id++;
	bsTest.printer( '<div style="border:1px solid #999;background:#eee;padding:10px;margin:10px">'+
		'<div id="bsTestOn'+id+'" style="display:none;cursor:pointer" onclick="bsTest.on(this)"><b>'+$title+'</b><hr><pre>'+bsTest.f2s($func)+'</pre></div>'+
		'<div id="bsTestOff'+id+'" style="display:block;cursor:pointer" onclick="bsTest.off(this)"><b>'+$title+'</b></div>'+
	'</div>' );
};
bsTest.suite = function(){
	var i = arguments.length;
	bsTest.suite.urls = arguments;
	while( i-- ) bsTest.printer(
		'<div style="width:250px;float:left;border:1px dashed #999;background:#eee;padding:10px;margin:10px">'+
			'<div id="bsTestSuite'+i+'">'+arguments[i]+' loading</div>'+
			'<iframe id="'+bsTest.IFid+i+'" src="'+arguments[i]+'" scrolling="no" style="margin-top:10px;border:0;width:100%;height:200px" onload="javascript:bsTest.suite.onload(this)"></iframe>'+
		'</div>'
	);
};
bsTest.suite.onload = function( $iframe ){
	var i, url;
	i = $iframe.id.substr( bsTest.IFid.length );
	console.log(i);
	url = bsTest.suite.urls[i];
	bs.dom( '#bsTestSuite'+i ).$( 'html', '<a href="'+url+'" target="_blank">'+url+'</a> ' +
		'<b style="font-size:20px;color:#' + ( !bsTest.isOKsub ? 'a00">FAIL' : '0a0">OK' ) + '</b>' );
	bs.dom( bs.dom( '#bsTestSuite'+i ).$('<') ).$( 'border-radius', 10 );
	if( !bsTest.isOKsub ) bsTest.isOK = 0;
	bsTest.result( '<div style="font-weight:bold;font-size:30px;padding:10px;color:#' + ( !bsTest.isOK ? 'a00">FAIL' : '0a0">OK' ) + '</div><hr>' );
};
bsTest.auto = (function(){
	var test, arg, testType;
	testType = {
		'number':[0, 111, -111, Number.MAX_VALUE, Number.MIN_VALUE, Number.NaN, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, null, undefined]
	};
	test = {};
	return function( $title, $context, $func, $result ){
		var arg, i, j;
		arg = [];
		for( test.length = 0, i = 3, j = arguments.length ; i < j ; i++ ){
			test[test.length++] = testType[arguments[i]];
		}
		for( i = 0 ; i < test.length ; i++ )
			 arg[i] = test[i][0];
		$func.apply( $context, arg )
	};
})();