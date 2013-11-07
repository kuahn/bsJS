function bsTest( $printer,$title ){
	var id, i, j, k, r, t, s, f, check, title;
	if( typeof $printer != 'function' ){
		title = $printer;
		$printer = bsTest.printer;
		i = 1;
	}else{
		title = $title;
		i = 2;
	}
	id = bsTest.id++;
	r = '<div style="border:1px dashed #999;padding:10px;margin:10px"><div id="bsTestOn'+id+'" style="display:none;cursor:pointer" onclick="bsTest.on(this)"><div style="float:left"><b>'+title+'</b><hr>';
	t = s = f = 0;
	for( k = 1, j = arguments.length ; i < j ; k++ ){
		t++;
		r += k + '. '+ arguments[i++] + ' == <b>';
		target = arguments[i++];
		origin = arguments[i++];
		if( target && target.splice ){
			r += target[0] + ' ~ ' + target[1];
			if( target[0] <= origin && origin <= target[1] ){
				check = 1;
			}else{
				check = 0;
			}
		}else{
			r += target;
			check = origin === target;
		}
		r += '</b> :: <b>'+ origin + '</b> <b style="color:#' + ( check ? ( s++,'0a0">OK') : (f++,'a00">NO') ) + '</b><br>';
	}
	if( f ) bsTest.isOK = 0;
	r += '</div><div style="padding:5px;float:right;border:1px dashed #999;text-align:center"><b style="font-size:30px;color:#' + ( f ? 'a00">FAIL' : '0a0">OK' ) + '</b><br>ok:<b style="color:#0a0">' + s + '</b> no:<b style="color:#a00">' + f + '</b></div><br clear="both"></div>'+
		'<div id="bsTestOff'+id+'" style="display:block;cursor:pointer" onclick="bsTest.off(this)"><b>'+title+'</b> : <b style="color:#' + ( f ? 'a00">FAIL' : '0a0">OK' ) + '</b></div></div>';
	$printer( r );
	if( window.top.bsTest ) window.top.bsTest.isOKsub = bsTest.isOK;
	if( bsTest.result )bsTest.result( '<hr><div style="font-weight:bold;font-size:30px;padding:10px;color:#' + ( !bsTest.isOK ? 'a00">FAIL' : '0a0">OK' ) + '</div>' );
}
bsTest.isOKsub = bsTest.isOK = 1, bsTest.id = 0;
bsTest.off = function(dom){dom.style.display = 'none', document.getElementById('bsTestOn'+dom.id.substr(9)).style.display = 'block';};
bsTest.on = function(dom){dom.style.display = 'none', document.getElementById('bsTestOff'+dom.id.substr(8)).style.display = 'block';};
bsTest.tear = (function(){
	var r0, r1;
	r0 = /</g;
	r1 = /\t\t/g;
	return function( $title, $func ){
		var id;
		$func();
		id = bsTest.id++;
		bsTest.printer( '<div style="border:1px solid #999;background:#eee;padding:10px;margin:10px">'+
			'<div id="bsTestOn'+id+'" style="display:none;cursor:pointer" onclick="bsTest.on(this)"><b>'+$title+'</b><hr><pre>'+$func.toString().replace( r0, '&lt;' ).replace( r1, '\t' )+'</pre></div>'+
			'<div id="bsTestOff'+id+'" style="display:block;cursor:pointer" onclick="bsTest.off(this)"><b>'+$title+'</b></div>'+
		'</div>' );
	};
})();
bsTest.suite = function(){
	var arg, i, k;
	arg = arguments, i = arg.length, k = 0;
	function sum(){
		var self = this;
		setTimeout( function(){
			var idx = self.id.charAt(self.id.length - 1 );
			bsTest.printer( '<div style="border:1px solid #999;background:#eee;padding:10px;margin:10px"><a href="'+arg[idx]+'" target="_blank">'+
				arg[idx] + '</a> loaded :: ' +
				'<b style="font-size:20px;color:#' + ( !bsTest.isOKsub ? 'a00">FAIL' : '0a0">OK' ) + '</b>' +
				'</div>' );
			
			if( !bsTest.isOKsub ) bsTest.isOK = 0;
			if( ++k == arg.length ){
				if( bsTest.result ) bsTest.result( '<hr><div style="font-weight:bold;font-size:30px;padding:10px;color:#' + ( !bsTest.isOK ? 'a00">FAIL' : '0a0">OK' ) + '</div>' );
			}else load();
		},10 );
	}
	function load(){
		if( i-- ) bs.dom( '<iframe></iframe>' ).$( 'float', 'left', 'id', 'bsTestIF' + i, '<', 'body', '@src', arg[i], 'load', sum, 'visibility', 'hidden' );
	}
	load();
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