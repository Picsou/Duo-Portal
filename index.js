var http = require('http');
var shoe = require('shoe');
var ecstatic = require('ecstatic')(__dirname + '/static');
var dnode = require('dnode');
 
var shared_state = new Array();

var x_player1 = 0;
var y_player1 = 0;

var x_player2 = 0;
var y_player2 = 0;
 
var server = http.createServer(ecstatic);
server.listen(9999);
 
var sock = shoe(function (stream) {
    var d = dnode({
        set_nick: function (value, cb) {
            shared_state[shared_state.length] = value;
            cb();

			console.log(shared_state);
        },

        get_nick: function (cb) {
            cb(shared_state[shared_state.length - 1]);
        },

		set_xy: function (id, x, y, cb) {
			//if(id == 0){
				x_player1 = x;
				y_player1 = y;
			//}
			//else{
				x_player2 = x - 100;
				y_player2 = y - 100;
			//}
			
            cb();

			//console.log("new x,y = " + x + " " + y);
        },

        get_xy: function (id, cb) {
            cb(id == 1 ? x_player2 : x_player1, id == 1 ? y_player2 : y_player1);
        }
    });

    d.pipe(stream).pipe(d);
});

sock.install(server, '/nick');
sock.install(server, '/xy');
