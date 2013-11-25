function invoker(){
	var i, j, k, v;
	i = 0, j = arguments.length;
	while( i < j ){
		k = arguments[i++], v = arguments[i++];
		if( v === undefined ) return invoker[k];
		invoker[k] = v;
	}
}
invoker.command = function( $key ){
	invoker[$key] = Array.prototype.slice.call( arguments, 1 );
}
invoker.run = function( $key ){
	var t0, arg;
	t0 = invoker[$key],
	arg = Array.prototype.slice.call( arguments, 1 );
	if( typeof t0 == 'function' ){
		t0.apply( t0, arg );
	}else if( t0.splice ){
		if( !t0.next )
			t0.next = function(){
				t0.cursor++;
				invoker[t0[t0.cursor]].apply( t0, arguments );
			}
		t0.cursor = 0;
		invoker[t0[t0.cursor]].apply( t0, arg );
	}
}
// Node.js
if ( typeof module !== 'undefined' && module.exports ) module.exports = invoker;
