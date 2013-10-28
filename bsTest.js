function bsTest( $printer ){
	var i, j, r, t, s, f,check;
	r = '';
	t = s = f = 0;
	for( i = 1, j = arguments.length ; i < j ; ){
		t++;
		r += arguments[i++] + ' == <b>';
		target = arguments[i++];
		origin = arguments[i++];
		if( target.splice ){
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
		r += '</b> :: <b>'+ origin + '</b> <b style="color:#' + ( check ? ( s++,'0f0">ok') : (f++,'f00">no') ) + '</b><br>';
	}
	r += '<br>total:' + t + ' ok:' + s + ' no:' + f + '<br><b style="font-size:50px;color:#' + ( f ? 'f00">fail' : '0f0">success' ) + '</b><br><br>';
	$printer( r );
}