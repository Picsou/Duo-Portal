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

var messages = new Array();
var portal_x = new Array();
var portal_y = new Array();

var portal_vertical = new Array();
var value = new Array();

var level = new Array();

var animation = new Array();

var justTraversed = new Array();
 
var server = http.createServer(ecstatic);
server.listen(80);

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

			for(var x = 0; x < playing.length; x++){
				if(value == playing[x]){
					cb(false);

					return;
				}
			}

        	players[players.length] = value;
			confirm_players[confirm_players.length] = value;

			cb(players[players.length - 1]);
        },

		invite: function (user, invite, cb) {
			inviting[inviting.length] = user;
			inviting[inviting.length] = invite;

			cb();
        },

		refuse_invite: function (user, cb) {
			for(var i = 0; i < inviting.length; i++){
				if(inviting[i] == user){
					inviting.splice(i, 2);
					cb();
				}
			}	
        },

		confirm_nick: function (value) {
        	confirm_players[confirm_players.length] = value;
        },

        get_nick: function (cb) {
            cb(players, inviting);
        },

		confirm_invite: function (user, player, cb, cb1) {
			for(var i = 0; i < playing.length; i++){
				if(playing[i] == player){
					cb();
					return;
				}
			}

			for(var i = 0; i < inviting.length; i++){
				if(inviting[i] == player){
					cb1(true);
					return;
				}
			}

			for(var i = 0; i < inviting.length; i++){
				if(inviting[i] == user){
					inviting.splice(i, 1);
				}
			}

			cb1(false);
        },

		play: function (user, invite, cb) {
			playing[playing.length] = user;
			playing[playing.length] = invite;

 			level[playing.length - 2] = 1;
			level[playing.length - 1] = 1;

			cb();
        },

		set_xy: function (id, x, y, portal_x1, portal_y1, vertical1, value1, animation1, justTraversed1, cb) {
			for(var i = 0; i < playing.length; i++){
				if(id == playing[i]){
					player_x[i] = x;
					player_y[i] = y;

					portal_x[i] = portal_x1; 
					portal_y[i] = portal_y1;

					portal_vertical[i] = vertical1;
					value[i] = value1;

					animation[i] = animation1;

					justTraversed[i] = justTraversed1;

					cb(); 

					return;
				}
			}
	
            cb();
        },

        get_xy: function (id, cb) {
			for(var x = 0; x < playing.length; x++){
				if(id == playing[x]){
					if(cb){
						cb(player_x[x], player_y[x], animation[x], justTraversed[x]);
					}					
	
					return x;
				}
			}
        },

		get_portal: function (id, cb) {
			for(var x = 0; x < playing.length; x++){
				if(id == playing[x]){
					cb(portal_x[x], portal_y[x], portal_vertical[x], value[x]);
					
					return;
				}
			}
        },

        send_message: function (user, message) {
			for(var x = 0; x < playing.length; x++){
				if(user == playing[x]){
					if (messages[x] instanceof Array) {
						messages[x][messages[x].length] = message;
					}
					else{
						messages[x] = new Array();
						messages[x][0] = message;
					}
			
					return;
				}
			}
        },

		get_message: function (user, cb) {
			for(var x = 0; x < playing.length; x++){
				if(user == playing[x]){
					cb(messages[x]);

					messages[x] = null;
			
					return;
				}
			}
        },

		set_level: function (id, level1) {
			for(var x = 0; x < playing.length; x++){
				if(id == playing[x]){
					level[x] = level1;
					
					return;
				}
			}
        },

		get_level: function (id, cb) {
			for(var x = 0; x < playing.length; x++){
				if(id == playing[x]){
					cb(level[x]);
					
					return;
				}
			}
        }
    });

    d.pipe(stream).pipe(d);
});

sock.install(server, '/nick');
