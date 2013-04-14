var intervalId;
var users;
var fps = 20;

function QueryString() {
    var query_string = new Array();
    var query = window.location.search.substring(1);
    var vars = query.split("&");

    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");

        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = pair[1];
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], pair[1]];
            query_string[pair[0]] = arr;
        } else {
            query_string[pair[0]].push(pair[1]);
        }
    }

    return query_string;
};

users = QueryString();

String.prototype.hashCode = function () {
    var hash = 0,
        i, char;

    if (this.length == 0) {
        return hash;
    }

    for (i = 0; i < this.length; i++) {
        char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    return hash;
};

function trigger() {
    if (intervalId) {
        clearInterval(intervalId);
    }

    intervalId = setInterval(function () {
        if (player1 != null && window.remote) {
			remote.set_xy(users['user'], player1._x, player1._y, portal._x, portal._y, portal.has('vertical_' + player_color), portal._value, function () {
				remote.get_xy(users['invite'], function(x2, y2){ 
					player2.tween({
	                    x: x2,
	                    y: y2
	                }, 6);
				});

				remote.get_portal(users['invite'], function(x2, y2, vertical2, value){ 
					other_portal.attr({
	                    x: x2,
	                    y: y2
	                });

					var portal2_state = (vertical2 ? "vertical" : "horizontal") + "_" + other_player_color;
					other_portal._direction = vertical2 ? "vertical" : "horizontal";
					other_portal._value = value;

					if(portal2_last != portal2_state){
						if(portal2_last){
							other_portal.removeComponent(portal2_last, false);
						}

						other_portal.addComponent(portal2_state);

						portal2_last = portal2_state;
					}
				});
			});
        }
    }, 1000 / fps);
}

function updateMessageSystem(){
	document.getElementById('fps').value = fps;
    document.getElementById('val').innerHTML = fps;

    document.getElementById('chat').style.width = width;
    document.getElementById('chat').style.height = height / 4.5;
    document.getElementById('chat').innerHTML = "";

    document.getElementById('mes').style.width = width / 2;
    document.getElementById('mes').focus();

	setInterval(function () {
		if(remote){					
		    remote.get_message(users['invite'], function (arg) {
		        if (arg instanceof Array) {
		            for (var x = 0; x < arg.length; x++) {
		                document.getElementById('chat').innerHTML += users['invite'] + ":" + arg[x] + "\n";
		            }

		            document.getElementById('chat').scrollTop = 999999;
		        }
		    });

			remote.get_level(users['user'], function (arg){
				console.log(level, arg);

				if(level < arg){
					console.log("aaaa", level, arg);
					level = arg;
					Crafty.scene("Level" + level);
				}
			});
		}
	}, 1000);
}

function update_fps() {
    fps = document.getElementById('fps').value;
    document.getElementById('val').innerHTML = fps;

    trigger();
}

function message() {
    if (event.keyCode == 37 || event.keyCode == 39) {
        event.preventDefault();
        return false;
    }

    if (event.keyCode == 13) {
        if (document.getElementById('mes').value.trim()) {
            document.getElementById('chat').innerHTML += users['user'] + ":" + document.getElementById('mes').value.trim() + "\n";
            document.getElementById('chat').scrollTop = 999999;

            remote.send_message(users['user'], document.getElementById('mes').value.trim());

            document.getElementById('mes').value = "";
        }
    }
}
