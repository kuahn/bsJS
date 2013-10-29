function bsTest( $printer,$title ){
	var i, j, k, r, t, s, f, check;
	if( $title === undefined )
		return $printer( '<hr><div style="font-weight:bold;font-size:30px;padding:10px;text-align:right;color:#' + ( !bsTest.isOK ? 'a00">FAIL' : '0a0">OK' ) + '</div>' );
	r = '<div style="border:1px dashed #999;padding:10px;margin:10px"><div style="float:left"><b>'+$title+'</b><hr>';
	t = s = f = 0;
	for( k = 1, i = 2, j = arguments.length ; i < j ; k++ ){
		t++;
		r += k + '. '+ arguments[i++] + ' == <b>';
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
		r += '</b> :: <b>'+ origin + '</b> <b style="color:#' + ( check ? ( s++,'0a0">ok') : (f++,'a00">no') ) + '</b><br>';
	}
	r += '</div><div style="padding:5px;float:right;border:1px dashed #999;text-align:center"><b style="font-size:30px;color:#' + ( f ? 'a00">FAIL' : '0a0">OK' ) + '</b><br>ok:<b style="color:#0a0">' + s + '</b> no:<b style="color:#a00">' + f + '</b></div><br clear="both"></div>';
	$printer( r );
	if( f ) bsTest.isOK = 0;
}
bsTest.isOK = 1;