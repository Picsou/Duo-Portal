var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');

domready(function(){
	var stream = shoe('/nick');
	var d = dnode();

	d.on('remote', function (remote) {
		window.remote = remote;
		ready();
	});

    d.pipe(stream).pipe(d);

	//if(typeof window.ready == 'function') {
		//ready();
	//}
});

