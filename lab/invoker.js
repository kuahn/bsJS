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

//일반적인 시나리오
invoker(
	'err', function(){
		//전체에러처리
	},
	'a', function(){
		asyncQuery(q,p, function(err, result){
			if(err) invoker.a_err();
			else invoker.b( q1, p1 );
		});
	},
	'a_err', function(){
		//....
		invoke.err();
	},
	'b', function( q, p ){
		asyncQuery( q, p, function(err, result){
			if(err) invoker.b_err(null, q1,p1);
		});
	},
	'b_err', function(){
		//....
		invoke.err();
	}
);
invoker.a();

//시나리오 구축
invoker(
	'a1', function(){
		asyncQuery( q, p, function(err, result){
			this.next( q1, p1 );
		});
	},
	'a2', function(){
		asyncQuery( q, p, function(err, result){
			this.next( q1, p1 );
		});
	},
	'a3', function(q, p, next){
		//....
	}
);
invoker.command( 'action1', 'a1', 'a2', 'a3' );
invoker.run( 'action1' );