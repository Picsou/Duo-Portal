var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');

domready(function(){
	window.x_player2 = 0
	window.y_player2 = 0

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

	window.update_info = function(user, invite, x, y) {
		var stream = shoe('/nick');
		var d = dnode();

		d.on('remote', function (remote) {
			remote.set_xy(user, x, y, function () {
				remote.get_xy(invite, function(x2, y2){ 
					x_player2 = x2;
					y_player2 = y2;
				});
			});
		});

		d.pipe(stream).pipe(d);
	}

	window.invite = function(user, invite, cb) {
		var stream = shoe('/nick');
		var d = dnode();

		d.on('remote', function (remote) {
			remote.invite(user, invite, cb);
		});

		d.pipe(stream).pipe(d);
	}

	window.confirm_invite = function(user, cb) {
		var stream = shoe('/nick');
		var d = dnode();

		d.on('remote', function (remote) {
			remote.confirm_invite(user, cb);
		});

		d.pipe(stream).pipe(d);
	}

	window.play = function(user, invite, cb) {
		var stream = shoe('/nick');
		var d = dnode();

		d.on('remote', function (remote) {
			remote.play(user, invite, cb);
		});

		d.pipe(stream).pipe(d);
	}

	if(typeof window.ready == 'function') {
		ready();
	}
});

