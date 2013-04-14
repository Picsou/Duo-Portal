function declareComponents(){
	Crafty.c('Ape', {
		_potentiallyInWall: false,

		Ape: function () {
		    // Setup animations
		    this.requires("SpriteAnimation, Collision")
		        .animate("walk_left", [
		        [444, 150],
		        [544, 150],
		        [494, 150]
		    ])
		        .animate("walk_right", [
		        [307, 151],
		        [208, 150],
		        [256, 151]
		    ])
		    .animate("jump_up", [
		        [53, 227]
		    ])
		    .animate("jump_down", [
		        [102, 227],
		        [143, 230]
		    ])
		        .animate("still", 256, 151, 256)
		    // Change animation when the direction changes
		    .bind("NewDirection", function (direction) {
		        if (direction.x < 0) {
		            if (!this.isPlaying("walk_left"))
		                this.stop().animate("walk_left", 20, -1);
		        }
		        if (direction.x > 0) {
		            if (!this.isPlaying("walk_right")) {
		                this.stop().animate("walk_right", 20, -1);
		            }
		        }
		        if (direction.y) {
		            if (!this.isPlaying("jump_up"))
		                this.stop().animate("jump_up", 20, 1);
		        }
		        if (!direction.x && !direction.y) {
		            this.stop().animate("still", 0, -1);
		        }
		    })
		    // A rudimentary way to prevent the user from passing solid areas
		    .bind('Moved', function (from) {
		        if (this.hit('solid') && !this._potentiallyInWall) {
		            this.attr({
		                x: from.x,
		                y: from.y
		            });
		        } 
		        if (!this.hit('solid')) {
		            this._potentiallyInWall = false;
		        }
		    }).bind('Change', function (from) {	
		        if (this._justTraversed) {
		            this._potentiallyInWall = true;
		        }
		    });
		    return this;
		}
	});

	Crafty.c("Teleport", {
		_justTraversed: false,

		teleport: function () {
		    this.requires("Collision").onHit("Portal", function (target) {
		        if (bluePortal.x <= width && yellowPortal.x <= width) {
		            if (this._justTraversed == false) {
		                this._justTraversed = true;

						var destinationPortal;
						if (target[0].obj == bluePortal) {
							destinationPortal = yellowPortal;
						} else if (target[0].obj == yellowPortal) {
							destinationPortal = bluePortal;
						}

						if (destinationPortal._direction == "horizontal") {
							if (destinationPortal._value > 0) {
								this.attr({
		                        	x: destinationPortal.x + 20,
		                        	y: destinationPortal.y - (destinationPortal.h + 60)
		                    	});
							} else {
								this.attr({
		                        	x: destinationPortal.x,
		                       		y: destinationPortal.y + (destinationPortal.h + 10)
		                    	});
							}
						} else if (destinationPortal._direction == "vertical") {
							if (destinationPortal._value > 0) {
								this.attr({
		                      		x: destinationPortal.x - (destinationPortal.w + 30),
		                       		y: destinationPortal.y
		                   		});
							} else {
								this.attr({
		                       		x: destinationPortal.x + (destinationPortal.w + 30),
		                       		y: destinationPortal.y
		                    	});
							}
						}
		            }
		        }
		    }, function (target) {
		        this._justTraversed = false;
		    });

		    return this;
		}
	});

	Crafty.c("Portal", {
		_direction: "",
		_value: 0
	});

	/* Portal inclination */
	Crafty.c("vertical", {});
	Crafty.c("horizontal", {});

	/* Create a particule that will collide with the nearest object between the player's arm and the wall in order to project the portal */
	Crafty.c("ParticleCollision", {
		_collisionStep: 1,
		_particuleSize: 5,
		_lastComponent: "",

		detectCollision: function (playerPosition, mouseCoordinates, portalCollision) {
		    this.attr({
		        x: playerPosition.x,
		        y: playerPosition.y,
		        w: this._particuleSize,
		        h: this._particuleSize
		    });
		    this.requires("Collision");
		    var dx = mouseCoordinates.x - playerPosition.x;
		    var dy = mouseCoordinates.y - playerPosition.y;
		    var alpha = dy / dx;
		    var i = 0;
		    while (this.hit('solid') == false && i < width) {
		        if (dx > 0) {
		            this.attr({
		                x: this._x + this._collisionStep,
		                y: this._y + this._collisionStep * alpha
		            });
		        } else {
		            this.attr({
		                x: this._x - this._collisionStep,
		                y: this._y - this._collisionStep * alpha
		            });
		        }
		        i = i + 1;
		    }
			if (!this.hit('active_wall')) {
		    	return null;
			}

			/* Handle portal rotation */
		    if (this._lastComponent) {
		        portalCollision.removeComponent(this._lastComponent);
		    }

		    if (this.hit('vertical')) {
				portalCollision._value = dx;
				portalCollision._direction = "vertical";
		        if (portalCollision == bluePortal) {
		            portalCollision.addComponent("vertical_blue");
		            this._lastComponent = "vertical_blue";
		        } else {
		            portalCollision.addComponent("vertical_red");
		            this._lastComponent = "vertical_red";
		        }
		    } else if (this.hit('horizontal')) {
				portalCollision._value = dy;
				portalCollision._direction = "horizontal";
		        if (portal == bluePortal) {
		            portalCollision.addComponent("horizontal_blue");
		            this._lastComponent = "horizontal_blue";
		        } else {
		            portalCollision.addComponent("horizontal_red");
		            this._lastComponent = "horizontal_red";
		        }
		    }

			/* Handle portal positioning after collision occured */
		    if (dx > 0) {
		        this.attr({
		            x: this._x - portalCollision._w / 2 + this._particuleSize
		        });
		    } else {
		        this.attr({
		            x: this._x - portalCollision._w / 2
		        });
		    }
		    if (dy > 0) {
		        this.attr({
		            y: this._y - portalCollision._h / 2 + this._particuleSize
		        });
		    } else {
		        this.attr({
		            y: this._y - portalCollision._h / 2
		        });
		    }
		    return this.attr();
		}
	});

	/* Entering the exit door allows you to proceed to the next level */
	Crafty.c("LevelUp", {
		init: function () {
		    this.requires("Collision")
		        .onHit("Exit", function () {
				level = level + 1;
		        Crafty.scene("Level" + level);
		    });
		}
	});

	Crafty.c("Exit", {});

	/* Retrieving graphics from sprite sheets */

	Crafty.sprite("./images/inactive_wall_unit.png", {
		active_wall: [0, 0, 24, 24]
	});

	Crafty.sprite("./images/active_wall_unit.png", {
		inactive_wall: [0, 0, 24, 24]
	});

	Crafty.sprite("./images/exit_door.png", {
		exitDoor: [0, 0, 48, 48]
	});

	Crafty.sprite("./images/resized_main_char.png", {
		still_blue: [256, 151, 49, 74]
	});

	Crafty.sprite("./images/resized_secondary_char.png", {
		still_red: [256, 151, 49, 74]
	});

	Crafty.sprite("./images/sprite_portals_resized.png", {
		vertical_blue: [0, 0, 41, 83],
		vertical_red: [52, 0, 41, 83],
		horizontal_blue: [8, 95, 83, 42],
		horizontal_red: [8, 147, 83, 42],
	});
}

function initEntities(){
	// Adding a nice background image
    Crafty.e("2D, DOM, Image").image("./images/background.png");

	/* Entities declarations */
	var left = Crafty.e("2D, DOM, solid, vertical")
        .attr({
        x: 0,
        y: 0,
        w: 0,
        h: height
    });

    var right = Crafty.e("2D, DOM, solid, vertical")
        .attr({
        x: width,
        y: 0,
        w: 0,
        h: height
    });

    smaller = users['user'].hashCode() > users['invite'].hashCode() ? users['invite'] : users['user'];

    player_color = smaller == users['user'] ? 'blue' : 'red';
    other_player_color = smaller != users['user'] ? 'blue' : 'red';

    player2 = Crafty.e("2D, DOM, Multiway, Tween, still_" + other_player_color)
        .attr({
        x: 10,
        y: height - 100,
        z: 1
    });

    player1 = Crafty.e("2D, DOM, Ape, Multiway, Gravity, Teleport, LevelUp, still_" + player_color)
        .attr({
        x: 10,
        y: height - 100,
        z: 1
    })
        .Ape()
        .multiway(charSpeed, {
        SPACE: -90,
        RIGHT_ARROW: 0,
        LEFT_ARROW: 180
    })
        .gravity("floor")
        .gravityConst(gravity)
        .teleport();

    yellowPortal = Crafty.e("2D, DOM, Portal")
        .attr({
        x: width + 100,
        y: width + 100,
        z: 1
    });

    bluePortal = Crafty.e("2D, DOM, Portal")
        .attr({
        x: width + 100,
        y: width + 100,
        z: 1
    });

    portal = smaller == users['user'] ? bluePortal : yellowPortal;
    other_portal = smaller == users['user'] ? yellowPortal : bluePortal;

    exitDoor = Crafty.e("2D, DOM, exitDoor, Exit")
        .attr({
        x: width - 45,
        y: height - 68,
        z: 1
    });

    collisionParticle = Crafty.e("2D, ParticleCollision")
        .attr({
        x: 0,
        y: 0
    });

    mouse = Crafty.e("2D, Mouse").attr({
        w: width,
        h: height
    });

    mouse.bind('Click', function (e) {
        document.getElementById('mes').focus();

        var coordinates = Crafty.DOM.translate(e.clientX, e.clientY);
        var newPortalPosition = collisionParticle.detectCollision(player1.attr(), coordinates, portal);
		if (newPortalPosition != null) {
        	portal.attr({
            	x: newPortalPosition.x,
            	y: newPortalPosition.y
        	});
		}
    });
}

/* Build walls for left to right and bottom to top */
function buildWall(xWall, yWall, blocks, direction, wallType) {
	var xIncrease;
	var yIncrease;
	if (direction == "horizontal") {
	    xIncrease = 24;
	    yIncrease = 0;
	} else if (direction == "vertical") {
	    xIncrease = 0;
	    yIncrease = 24;
	}
	for (var i = 0; i < blocks; i++) {
	    var wall = Crafty.e("2D, DOM, solid, floor, " + direction + ", " + wallType)
	        .attr({
	        x: xWall + i * xIncrease,
	        y: yWall + i * yIncrease,
	        z: 0
	    });
	}
}

function buildThickWall(x, y, height1, width1, wallType, direction) {
	if (direction == "vertical") {
		for(i = 0; i < width1; i++){
			for(j = 0; j < height1; j++){
				buildWall((x * 24) + (i * 24), (y * 24) + (j * 24), width1, "vertical", wallType);
			} 
		}
	} else {
		for(i = 0; i < width1; i++){
			for(j = 0; j < height1; j++){
				buildWall((x * 24) + (i * 24), (y * 24) + (j * 24), height1, "horizontal", wallType);
			}
		}
	}
}
