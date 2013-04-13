var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');

domready(function(){
	var stream = shoe('/nick');
	var d = dnode();

<<<<<<< HEAD
	d.on('remote', function (remote) {
		window.remote = remote;
	});
=======
	window.set_nick = function (nick, cb) {
		var stream = shoe('/nick');
		var d = dnode();

		d.on('remote', function (remote) {
			remote.set_nick(nick, cb);
		});

		d.pipe(stream).pipe(d);
	}

	window.confirm_nick = function (nick, cb) {
		var stream = shoe('/nick');
		var d = dnode();

		d.on('remote', function (remote) {
			remote.confirm_nick(nick, cb);
		});

		d.pipe(stream).pipe(d);
	}

	window.get_nick = function (cb) {
		var stream = shoe('/nick');
		var d = dnode();

		d.on('remote', function (remote) {
			remote.get_nick(cb);
		});

		d.pipe(stream).pipe(d);
	}

	window.update_info = function(user, invite, x, y, portal_x, portal_y, vertical1, error) {
>>>>>>> 445261f788b33f4b3d2b43c6bca6806ca073568f

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

