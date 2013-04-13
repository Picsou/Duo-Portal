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

	window.update_info = function(user, invite, x, y, portal_x, portal_y, vertical1, error) {

		var stream = shoe('/nick');
		var d = dnode();

		d.on('remote', function (remote) {
			remote.set_xy(user, x, y, portal_x, portal_y, vertical1, function () {
				remote.get_xy(invite, function(x2, y2){ 
					x_player2 = x2;
					y_player2 = y2;
				});

				remote.get_portal(invite, function(x2, y2, vertical2){ 
					x_portal2 = x2;
					y_portal2 = y2;
					vertical_portal2 = vertical2;
				});
			});
		});

		d.on('end', function(){
			error();
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

	window.confirm_invite = function(user, inviting, cb, cb1) {
		var stream = shoe('/nick');
		var d = dnode();

		d.on('remote', function (remote) {
			remote.confirm_invite(user, inviting, cb, cb1);
		});

		d.pipe(stream).pipe(d);
	}

	window.refuse_invite = function(user, cb) {
		var stream = shoe('/nick');
		var d = dnode();

		d.on('remote', function (remote) {
			remote.refuse_invite(user, cb);
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

	window.send_message = function(user, message) {
		var stream = shoe('/nick');
		var d = dnode();

		d.on('remote', function (remote) {
			remote.send_message(user, message);
		});

		d.pipe(stream).pipe(d);
	}

	window.get_message = function(user, cb) {
		var stream = shoe('/nick');
		var d = dnode();

		d.on('remote', function (remote) {
			remote.get_message(user, cb);
		});

		d.pipe(stream).pipe(d);
	}

	if(typeof window.ready == 'function') {
		ready();
	}
});

