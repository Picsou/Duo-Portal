var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');

domready(function(){
	var stream = shoe('/nick');
	var d = dnode();

	d.on('remote', function (remote) {
		window.remote = remote;
	});

    d.pipe(stream).pipe(d);

	/*window.register_callback = function(cb, fps, result, invite, id) {
		var stream = shoe('/nick');
		var d = dnode();

		d.on('remote', function (remote) {
			remote.register_callback(cb, fps, result, invite, id);
		});

		d.pipe(stream).pipe(d);
	}

	window.cancel_interval = function(id) {
		var stream = shoe('/nick');
		var d = dnode();

		d.on('remote', function (remote) {
			remote.cancel_interval(id);
		});

		d.pipe(stream).pipe(d);
	}*/

	if(typeof window.ready == 'function') {
		ready();
	}
});

