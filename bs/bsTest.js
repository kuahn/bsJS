function bsTest( $printer,$title ){
	var i, j, k, r, t, s, f, check;
	if( $title === undefined )
		return $printer( '<hr><div style="font-weight:bold;font-size:30px;padding:10px;text-align:right;color:#' + ( !bsTest.isOK ? 'a00">FAIL' : '0a0">OK' ) + '</div>' );
		
	r = '<div style="border:1px dashed #999;padding:10px;margin:10px"><div id="bsTestOn'+bsTest.id+'" style="display:none;cursor:pointer" onclick="bsTest.on(this)"><div style="float:left"><b>'+$title+'</b><hr>';
	t = s = f = 0;
	for( k = 1, i = 2, j = arguments.length ; i < j ; k++ ){
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
	i = bsTest.id++;
	if( f ){
		bsTest.isOK = 0;
	}
	r += '</div><div style="padding:5px;float:right;border:1px dashed #999;text-align:center"><b style="font-size:30px;color:#' + ( f ? 'a00">FAIL' : '0a0">OK' ) + '</b><br>ok:<b style="color:#0a0">' + s + '</b> no:<b style="color:#a00">' + f + '</b></div><br clear="both"></div>'+
		'<div id="bsTestOff'+i+'" style="display:block;cursor:pointer" onclick="bsTest.off(this)"><b>'+$title+'</b> : <b style="color:#' + ( f ? 'a00">FAIL' : '0a0">OK' ) + '</b></div></div>';
	$printer( r );
	if( bsTest.result )bsTest.result( '<hr><div style="font-weight:bold;font-size:30px;padding:10px;text-align:right;color:#' + ( !bsTest.isOK ? 'a00">FAIL' : '0a0">OK' ) + '</div>' );
}
bsTest.isOK = 1, bsTest.id = 0;
bsTest.off = function(dom){dom.style.display = 'none', document.getElementById('bsTestOn'+dom.id.substr(9)).style.display = 'block';};
bsTest.on = function(dom){dom.style.display = 'none', document.getElementById('bsTestOff'+dom.id.substr(8)).style.display = 'block';};