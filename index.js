var http = require('http');
var shoe = require('shoe');
var ecstatic = require('ecstatic')(__dirname + '/static');
var dnode = require('dnode');
 
var players = new Array();
var confirm_players = new Array();
var inviting = new Array();

var playing = new Array();

var player_x = new Array();
var player_y = new Array();
 
var server = http.createServer(ecstatic);
server.listen(9999);

function in_array(needle, haystack) {
    var length = haystack.length;

    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle){
			return true;
		}
    }

    return false;
}

setInterval(function(){
	var new_players = new Array();
	var new_inviting = new Array();

	for(var x = 0; x < players.length; x++){
		if(in_array(players[x], confirm_players)){
			new_players[new_players.length] = players[x];
		}
	}

	for(var x = 0; x < inviting.length; x++){
		if(in_array(inviting[x], confirm_players)){
			new_inviting[new_inviting.length] = inviting[x];
		}
	}

	inviting = new_inviting;
	players = new_players;

	confirm_players = new Array();
}, 2000);

var sock = shoe(function (stream) {
    var d = dnode({
        set_nick: function (value, cb) {
			for(var x = 0; x < players.length; x++){
				if(value == players[x]){
					cb(false);

					return;
				}
			}

        	players[players.length] = value;

			cb(true);
        },

		invite: function (user, invite, cb) {
			inviting[inviting.length] = user;
			inviting[inviting.length] = invite;

			cb();
        },

		confirm_nick: function (value) {
        	confirm_players[confirm_players.length] = value;
        },

        get_nick: function (cb) {
            cb(players, inviting);
        },

		confirm_invite: function (user, cb) {
			for(var i = 0; i < playing.length; i++){
				if(playing[i] == user){
					cb(playing[i + 1]);
				}
			}
        },

		play: function (user, invite, cb) {
			playing[playing.length] = user;
			playing[playing.length] = invite;

			cb();
        },

		set_xy: function (id, x, y, cb) {
			for(var i = 0; i < playing.length; i++){
				if(id == playing[i]){
					player_x[i] = x;
					player_y[i] = y;

					//console.log(id, i, player_x[i], player_y[i]);

					cb();

					return;
				}
			}
	
            cb();

			//console.log("new x,y = " + x + " " + y);
        },

        get_xy: function (id, cb) {
			for(var x = 0; x < playing.length; x++){
				if(id == playing[x]){
					//console.log(id, x, player_x[x], player_y[x]);

					cb(player_x[x], player_y[x]);
					
					return;
				}
			}
			
            //cb(100, 100);
        }
    });

    d.pipe(stream).pipe(d);
});

sock.install(server, '/nick');
//sock.install(server, '/xy');
