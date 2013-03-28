var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');

domready(function(){
	window.x_player1 = 0
	window.y_player1 = 0

	window.x_player2 = 0
	window.y_player2 = 0

	window.set_nick = function (nick) {
		var stream = shoe('/nick');
		var d = dnode();

		d.on('remote', function (remote) {
			remote.set_nick(nick, function () {
				remote.get_nick(function(value){ 
					console.log("new nick: " + value); 

					window.setInterval(function(){
						update_info(x, y);
					}, 100);
				});
			});
		});

		d.pipe(stream).pipe(d);
	}

	window.update_info = function(id, x, y) {
		var stream = shoe('/xy');
		var d = dnode();

		d.on('remote', function (remote) {
			remote.set_xy(id, x, y, function () {
				remote.get_xy(id ^ 1, function(x2, y2){ 
					x_player2 = x2;
					y_player2 = y2;
				});
			});
		});

		d.pipe(stream).pipe(d);
	}
});

