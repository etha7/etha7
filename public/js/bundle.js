(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
<<<<<<< HEAD

=======
module.exports={
  "riskGraph": 
    {
      "riskTitle": "Risk vs Reward",
      "riskDescription": "This is measured by comparing the percent chance of getting sick with the resources gathered."
        
    },
  "trustGraph": 
    {
      "trustTitle": "Trust",
      "trustDescription": "This is measured by comparing the percent chance of getting sick with percent who team up."
        
    },
  "moralityGraph": 
    {
      "moralityTitle": "Morality",
      "moralityDescription": "This is measured by comparing the percent sick and on a team with percent sick and not on a team." 
    },
	"choices": [
		{	
            "choice": "Risk"
		},
		{	
            "choice": "Safe"
		},
		{
            "choice": "Risk"
		},
		{
            "choice": "Risk"
		}
	]
}


},{}],2:[function(require,module,exports){
var canvas = document.getElementById("mainCanvas");
var homebutton = document.getElementById("home-button");
var canvasLeft = canvas.offsetLeft,
    canvasTop = canvas.offsetTop;
var context = canvas.getContext("2d");
var clickableElements = [];

var data = require("./data.json");
data.choices.push({"side": "dokr" });
console.log(data);

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight; 

mapMain();

function mapMain(){
       //Initialize the game world
   var stage        = new createjs.Stage("mainCanvas")
   
     //Enable touch based interface for mobile devices
   createjs.Touch.enable(stage);

   //Resize canvas on window resize   
   window.addEventListener('click', function(event) {
    var x = event.pageX - canvasLeft,
        y = event.pageY - canvasTop;
     //Collision detection between clicked offset and element.
    clickableElements.forEach(function(element) {
        if (y > element.top && y < element.top + element.height 
            && x > element.left && x < element.left + element.width) {
            //alert('clicked an element');
            //element.clicked(stage);
        }
    });
}, false)


   //Resize canvas on window resize   
   window.addEventListener("resize", function(){
      stage.canvas.width  = window.innerWidth;
      stage.canvas.height = window.innerHeight;
   }, false);
   
   //Main game loop
   var FPS = 50;
   createjs.Ticker.setFPS(FPS);
   createjs.Ticker.addEventListener("tick", function(){
      //Commit all updates to actual stage/canvas
      stage.update();

   });
   
   var world        = initWorld();
   var background   = initBackground(stage, canvas);
   
   //function initText(stage, canvas, text, color, xpos, ypos){
   
   var helpText1 = initText(stage, canvas, "The location you have selected is represented", "blue", canvas.width/3, canvas.height/10);
   var helpText2 = initText(stage, canvas, "as a blue dot, click elsewhere to move selected position", "blue", canvas.width/3, canvas.height/8);
   var citySelectionText = initCitySelectionText(stage,canvas);
   citySelectionText.color = "green";
   var safeCity = new City({x: canvas.width/6, y: canvas.height/2}, "green", stage, "Safe", citySelectionText);
   safeCity.add();
   clickableElements.push(safeCity);
   var riskCity = new City({x: (5 * canvas.width)/6, y: canvas.height/2}, "red", stage, "Risky", citySelectionText);
   riskCity.add();
   clickableElements.push(riskCity);
   
}


function main(){
   //Initialize the game world
   var stage        = new createjs.Stage("mainCanvas");
   var world        = initWorld();
   var background   = initBackground(stage, canvas);
   
   //Initalize the game controls and player
   var left         = initJoysticks(stage).left;
   var player       = initPlayer(stage, left);
       player.setCamera(new Camera(player.getPos(), canvas.width, canvas.height));

   //Initialize array of resource objects and resource text
   var resources    = initResources(stage, canvas);
   var resourceText = initResourceText(stage,canvas, player);

   //Initialize Pathfinding
   var easystar = initPathfinding(world, player, background); 
   
   //Enable touch based interface for mobile devices
   createjs.Touch.enable(stage);

   //Resize canvas on window resize   
   window.addEventListener("resize", function(){
      stage.canvas.width  = window.innerWidth;
      stage.canvas.height = window.innerHeight;
   }, false);
   

   //Main game loop
   var FPS = 50;
   createjs.Ticker.setFPS(FPS);
   createjs.Ticker.addEventListener("tick", function(){

      //Do pathfinding calculation
      easystar.calculate();

      //Move player according to joystick
      player.move();

      //Check if player is colliding with resources
      player.pickup(stage, resources);

      //Move along calculated pathfinding path
      player.goPath();

      //Update resource text
      resourceText.text = "Resources: "+player.getResources();

      //Commit all updates to actual stage/canvas
      stage.update();

   });

}
>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56
//Utility functions:------------------------------------------------

//Utility function for comparing arrays for equality
Array.prototype.equals = function( array ) {
  return this.length == array.length && 
           this.every( function(this_i,i) { return this_i == array[i] } )  
}

<<<<<<< HEAD

=======
>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56
//Utility functions:^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


//Class definitions:------------------------------------------------

//Base class for all primitive objects that get drawn
<<<<<<< HEAD
function EaselObject( pos, color){
=======
function easelObject(pos, color){
>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56

   this.easelShape = new createjs.Shape();
   this.getEaselShape = function(){ return this.easelShape; };

<<<<<<< HEAD
=======
   this.test = function(pos) { this.getEaselShape().x = pos.x; this.getEaselShape().y = pos.y;};
   this.test({x: 10, y: 11});
   console.log(this.getEaselShape().x);
   console.log(this.getEaselShape().y);

>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56
   //Set initial position
   this.easelShape.x = pos.x;
   this.easelShape.y = pos.y;

   //Position setters and getters
   this.getPos = function() { return {x: this.getEaselShape().x, y: this.getEaselShape().y}; };
   this.setPos = function(pos) { this.getEaselShape().x = pos.x; this.getEaselShape().y = pos.y;};

   //The object's color
   this.color = color;

   //Adds the current object to the stage
   this.add = function(stage) {
      stage.addChild(this.getEaselShape());
      stage.update();
   };

   //Removes the current object from the stage
   this.remove = function(stage) {
      stage.removeChild(this.getEaselShape());
   };
}
<<<<<<< HEAD
=======
function Rectangle(pos, color, width, height){
   easelObject.call(this, pos, color);
   
   this.width  = width;
   this.height = height;
   this.top = pos.y;
   this.left = pos.x;
   
   //Draw the rectangle
   this.draw = function(){
      this.shape.graphics.beginFill(this.color).drawRect(this.left,this.top,this.width, this.height);
   }
   this.draw();

}
>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56

//A class for representing circles
function Circle(pos, color, radius ){
   //Call constructor of superclass
<<<<<<< HEAD
   EaselObject.call(this, pos, color);  
=======
   easelObject.call(this, pos, color);  
>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56

   //Set the new radius
   this.radius = radius;

<<<<<<< HEAD
   //Function: draw a circle
   this.draw = function(){
      this.easelShape.graphics.clear();
      this.easelShape.graphics.beginFill(this.color).drawCircle(0,0,this.radius);
   }

   //Function: draw a dotted circle
   this.drawDotted = function(){
      this.easelShape.graphics.clear();

      //20 pixel lines with 5 pixel gaps
      //this.easelShape.graphics.setStrokeDash([20,5]);
      this.easelShape.graphics.setStrokeStyle(2).beginStroke(this.color).drawCircle(0,0,this.radius);
   }
    
   this.draw();
}

function Rectangle(pos, color, width, height){
   EaselObject.call(this, pos, color);

   this.width  = width;
   this.height = height;


   //Easel.js draws rectangles using coordinates representing the rectangle's upper left corner
   //The position offsets here draw the rectangle such that pos represents the center if it. 
   this.easelShape.x -=  this.width/2
   this.easelShape.y -=  this.height/2
   
   //Draw the rectangle
   this.draw = function(){
      this.easelShape.graphics.clear();
      this.getEaselShape().graphics.beginFill(this.color).drawRect(0, 0, this.width, this.height);
   }
   this.draw();

}

function Resource(value){
   Circle.call(this, {x: 0, y: 0}, "white", 10);
=======
   //All of these elements are currently being used to check whether something has been clicked on or not.
   this.top = pos.y - radius;
   this.left = pos.x - radius;
   this.height = 2*radius;
   this.width = 2*radius;
   
   //Determines if circle is dotted outline
   this.isDotted = false;
   this.invertIsDotted = function(){ this.isDotted = !this.isDotted;}

   //Function: draw a circle
   this.draw = function(){
      this.easelShape.graphics.beginFill(this.color).drawCircle(0,0,this.radius);
   }
   //Function: draw a dotted circle
   this.drawDotted = function(){
      this.easelShape.graphics.setStrokeDash([2,2]);
      this.easelShape.setStrokeStyle(2).beginsStroke("grey").drawCircle(0,0,this.radius);
   }
    
   //Actually draw the circle
   if(this.isDotted === true)
      this.drawDotted();
   else
      this.draw();
}

function Resource(value){
   Circle.call(this, {x: 0, y: 0}, "blue", 10);
>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56
   this.value = value;
}

function DiseaseZone(playerPos){
<<<<<<< HEAD
   Circle.call(this, playerPos, "red", 75);
   this.drawDotted();
   this.AllowsTeams = false;

   //Inverts whether the diseaseZone allows teams
   //TODO make property of player
   this.invertAllowsTeams = function(){

     //Set to not allow teams
     if(this.AllowsTeams === true){
        this.color = "red";
        this.drawDotted();
     }
     else
     {
        this.color = "green";
        this.drawDotted();
     }
     this.AllowsTeams = !this.AllowsTeams;
   };
   
=======
   Circle.call(this, playerPos, "grey", 30);
   this.invertIsDotted();
>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56
}

function Camera(pos, width, height){
   this.pos = pos;
   this.width = width;
   this.height = height;
   this.getPos = function(){return this.pos;};
   this.setPos = function(pos) {this.pos = pos;};
   this.getWidth = function(){return this.width;};
   this.setWidth = function(width) {this.width = width;};
   this.getHeight = function(){return this.height;};
   this.setHeight = function(height) {this.height = height;};
}

<<<<<<< HEAD
function Player(pos){
   Circle.call( this, pos, "red", 20);
    //{x: canvas.width/2, y: canvas.height/2}, "red", 20);
   
   this.setPos(pos);

   this.id;
   this.diseaseZone = new DiseaseZone(this.getPos());
=======




function Player(joystick){
   Circle.call( this, {x: canvas.width/2, y: canvas.height/2}, "red", 20);

   this.diseaseZone = new DiseaseZone(this.getPos());
   this.joystick = joystick;
>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56
   this.resources = 0;
   this.camera = {};
   this.path = [];

<<<<<<< HEAD
   //this.getCamera = function(){ return this.camera;};
   //this.setCamera = function(camera){ this.camera = camera; };
   
   //Moves the player along a path determined by A* algorithm
   this.goPath = function(deltaTime){
      
      if(this.path.equals([]) === false)
      {
         var pos = {x: this.path[0].x, y: this.path[0].y};
         this.setPos(pos);
         this.path.splice(0, 1*deltaTime); //Remove deltaTime elements starting from 
                                //element 0;
         return pos;
      }
      
      return {x: this.getPos().x, y: this.getPos().y};
=======
   this.getCamera = function(){ return this.camera;};
   this.setCamera = function(camera){ this.camera = camera; };
   
   //Moves the player along a path determined by A* algorithm
   this.goPath = function(){
      
      if(this.path.equals([]) === false)
      {
         this.setPos({x: this.path[0].x, y: this.path[0].y});
         this.path.splice(0,1); //Remove element 0;
      }
>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56
   }

   this.getResources = function(){ return this.resources;};
   this.setResources = function(newResources){ this.resources = newResources};

   //Override inherited setPos
   var parentSetPos = this.setPos;
   this.setPos = function(pos){ 
<<<<<<< HEAD
       //this.camera.setPos(pos);
       this.diseaseZone.setPos(pos);
       parentSetPos.call(this, pos); //need call so 'this' is defined as the current Player
   };

   //Override inherited add
   var parentAdd = this.add;
   this.add = function(stage){
      this.diseaseZone.add(stage);
      parentAdd.call(this, stage);
   }
      
   
=======
       this.camera.setPos(pos);
       parentSetPos.call(this, pos); //need call so 'this' is defined as the current Player
   };
      
   
   //Update player's location with respect to joystick
   this.move = function () {

      //Move player with left joystick
      var playerPos = this.getPos();
      var direction = this.joystick.getDirection();
      if(isNaN(direction.x) || isNaN(direction.y))
      {
         direction.x = 0;
         direction.y = 0;
      }
      playerPos.x += this.joystick.getForce()*direction.x;
      playerPos.y += this.joystick.getForce()*direction.y;
      this.setPos(playerPos);
   };
>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56

   //Check if standing on any resources
   this.pickup = function(stage, resources){
      var easelShape = this.getEaselShape();
      var resourceCopy = resources.slice(0,resources.length);
      for (var x of resourceCopy){
         var pos = x.getPos();
         var pt =  easelShape.globalToLocal(pos.x, pos.y); //hitTest needs coordinates relative to easelShape
         if(easelShape.hitTest(pt.x, pt.y)) //If player is over resource
         {
            this.setResources(this.getResources() + x.value);
            var remIndex = resources.indexOf(x);
            resources.splice(remIndex,1);
            x.remove(stage);
         }
      }
   }
}

<<<<<<< HEAD
//Controls ---------------------------------------------------------

//Creates a Joystick at the given location
function Joystick(pos, player){

   this.pos = pos;
   this.player = player;

   this.baseSize = 35;
   this.baseColor = "grey";
=======


//Dragable Class: Makes objects Dragable
function Dragable(pos, color){

   //Call superclass's constructor
   EaselObject.call(this, pos, color);

   //Update coordinates while object is moved while pressed
   this.getEaselShape().on("pressmove", function(e){
      e.target.x = e.stageX; //(stageX, stageY) = mouseCoordinate
      e.target.y = e.stageY;
   });

};


//Creates a Joystick at the given location
function Joystick(pos){

   this.pos = pos;

   this.baseSize = 35;
   this.baseColor = "red";
>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56
   this.base = new Circle(this.pos, this.baseColor, this.baseSize);

   this.stickSize = 25;
   this.stickColor = "white";
   this.stick =  new Circle(this.pos, this.stickColor, this.stickSize);

   //Limited Dragging
   this.stick.getEaselShape().on("pressmove", function(e){
      e.target.x = e.stageX; //(stageX, stageY) = mouseCoordinate
      e.target.y = e.stageY;
   });
   
   var baseVar = this.base; //No idea why I have to do this; scoping?
   //Reset stick to base potition on when joystick is released
   this.stick.getEaselShape().on("pressup", function(e){
      e.target.x = baseVar.getPos().x;  
      e.target.y = baseVar.getPos().y;
   });
   
<<<<<<< HEAD
   this.getPos = function() { return this.base.getPos()};
   this.setPos = function(pos) {
      this.base.setPos(pos);
      this.stick.setPos(pos);
   }
=======
   this.getPos = function() { return this.stick.getPos()};
>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56

   //Get the direction the joystick is pointing
   this.getDirection = function(){
      var v = this.stick.getPos();
      var w = this.base.getPos();
      var x1 = v.x - w.x; //new coordinates
      var y1 = v.y - w.y;
      var mag1 = Math.sqrt(x1*x1 + y1*y1);

      return {x: x1/mag1, y: y1/mag1}
   };

   //Get the force acting on a player by the joystick
   this.getForce = function(){
      var v = this.stick.getPos();
      var w = this.base.getPos();
      return Math.abs(Math.sqrt(v.x*v.x + v.y*v.y) - Math.sqrt(w.x*w.x + w.y*w.y));
   };

<<<<<<< HEAD

   //Update player's location with respect to joystick
   this.move = function (delta) { //Delta is deltaTime

      //Move player with left joystick
      var playerPos = this.player.getPos();
      var direction = this.getDirection();

      //TODO make damping player property
      var damping = 1/20;
      if(isNaN(direction.x) || isNaN(direction.y))
      {
         direction.x = 0;
         direction.y = 0;
      }
      playerPos.x += damping*delta*this.getForce()*direction.x;
      playerPos.y += damping*delta*this.getForce()*direction.y;
      this.player.setPos(playerPos);

   };


=======
>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56
   this.add = function(stage){
      stage.addChild(this.base.getEaselShape());
      stage.addChild(this.stick.getEaselShape());
      stage.update();
   }

}

<<<<<<< HEAD
//Button for opting in or out of teams
function TeamButton(pos, color, player){

   //TODO make baseSize some kind of global variable
   var baseSize = 35;
   Circle.call(this, pos, color, baseSize);

   this.player = player;

   this.getEaselShape().on("click", function(e){
      player.diseaseZone.invertAllowsTeams();
   });
}
//Controls ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//Dragable Class: Makes objects Dragable
function Dragable(pos, color){

   //Call superclass's constructor
   EaselObject.call(this, pos, color);

   //Update coordinates while object is moved while pressed
   this.getEaselShape().on("pressmove", function(e){
      e.target.x = e.stageX; //(stageX, stageY) = mouseCoordinate
      e.target.y = e.stageY;
   });

};




//Class definitions:^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
exports.EaselObject = EaselObject;
exports.Circle      = Circle;
exports.Rectangle   = Rectangle;
exports.Resource    = Resource;
exports.Camera      = Camera;
exports.DiseaseZone = DiseaseZone;
exports.Player      = Player;
exports.Joystick    = Joystick;
exports.TeamButton  = TeamButton;

},{}],2:[function(require,module,exports){
/* IMPORTANT: Several variables in this js, like "io", exist because
   mainGame.js is included below socket.io.js in views/citizen.handlebars.
    */


/* Import classes */

//Requiring enabled by browserify

var EaselObject = require("./Classes").EaselObject;
var Circle      = require("./Classes").Circle;
var Rectangle   = require("./Classes").Rectangle;
var Resource    = require("./Classes").Resource;
var Camera      = require("./Classes").Camera;
var DiseaseZone = require("./Classes").DiseaseZone;
var Player      = require("./Classes").Player;
var Joystick    = require("./Classes").Joystick;
var TeamButton  = require("./Classes").TeamButton;


var gameport = 8080; //port clients will connect to 
var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight; 

var stage        = new createjs.Stage("mainCanvas");

var player,
    remotePlayers,
    deltaTime,
    socket;

main();


function main(){
   
   //Initialize the game world
   var world        = initWorld();
   var background   = initBackground(stage, canvas);

   
   //Initalize the game controls and player
   player           = initPlayer(stage);
   //player.setCamera(new Camera(player.getPos(), canvas.width, canvas.height));
   var leftJoystick = initJoysticks(stage, player).left;
   var teamButton   = initTeamButton(stage, player);

   //Initialize array of resource objects and resource text
   var resources    = initResources(stage, canvas);
   var resourceText = initResourceText(stage,canvas, player);

   //Initialize Pathfinding
   var easystar = initPathfinding(world, player, background); 
   
   //Enable touch based interface for mobile devices
   createjs.Touch.enable(stage);

   //Resize canvas on window resize   
   window.addEventListener("resize", function(){
      stage.canvas.width  = window.innerWidth;
      stage.canvas.height = window.innerHeight;
      background.width    = window.innerWidth;
      background.height   = window.innerHeight;
      background.draw();

      //TODO encapsulate these offsets within Joystick and TeamButton
      leftJoystick.setPos({x: window.innerWidth/6, y: window.innerHeight/2});
      teamButton.setPos({x: window.innerWidth - window.innerWidth/6, y: window.innerHeight/2});


   }, false);
   

   /* Multiplayer initialization code */
   //Connect client to server 
   socket = io.connect();
   console.log("socket:");
   console.log(socket);
   //TODO change from localhost
   
   //Initialize remote players 
   remotePlayers = [];

   //Listen for events
   setEventHandlers();


   //Main game loop----------------------------------------------
   var FPS = 50;
   createjs.Ticker.setFPS(FPS);
   var previousTime = (new Date()).getTime();
   var currentTime;
   // pixels/frame * frames/second = pixels/second: delta time is
   // empirical FPS
   createjs.Ticker.addEventListener("tick", function(){

      //Logic to create deltaTime so movement is relative to time
      //rather than frames.
      var timer = new Date();
      currentTime = timer.getTime();
      deltaTime = currentTime - previousTime;
      previousTime = currentTime;

      //Do pathfinding calculation
      easystar.calculate();

      //Move player according to joystick
      leftJoystick.move(deltaTime);

      //Check if player is colliding with resources
      player.pickup(stage, resources);

      //Move along calculated pathfinding path

      var newPathPos;
      player.goPath(deltaTime);
      socket.emit("move player", {  x: player.getPos().x,
                                    y: player.getPos().y});
              
      for(i = 0; i < remotePlayers.length; i++) {
         currPlayer = remotePlayers[i];
         newPathPos = currPlayer.goPath(deltaTime);
         socket.emit("move player", {  x: newPathPos.x,
                                       y: newPathPos.y });
      }


      //Update resource text
      resourceText.text = "Resources: "+player.getResources();

      //Commit all updates to actual stage/canvas
      stage.update();

   });

}
//Utility functions:------------------------------------------------

//Utility function for comparing arrays for equality
Array.prototype.equals = function( array ) {
  return this.length == array.length && 
           this.every( function(this_i,i) { return this_i == array[i] } )  
}


//Utility functions:^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

=======

//Creates a City at the given location
function City(pos, baseColor, stage, type, citySelectionText){
   this.pos = pos;
   
   this.stage = stage;
   
   this.cityType = type;
   this.citySelectionText = citySelectionText;
   
   this.baseSize = 35;
   this.baseColor = baseColor;
   this.base = new Circle(this.pos, this.baseColor, this.baseSize);

   if(type === "Safe") {
      this.stickSize = 25;
      this.stickColor = "blue";
      this.stick =  new Circle(this.pos, this.stickColor, this.stickSize);
   } else { 
      this.stickSize = 25;
      this.stickColor = baseColor;
      this.stick =  new Circle(this.pos, this.stickColor, this.stickSize);
   }
   

   this.top = pos.y;
   this.left = pos.x;
   this.height = this.baseSize;
   this.width = this.baseSize;

   this.base.getEaselShape().on("click", function(e){
        clickableElements.forEach(function(element) {
          element.unselected(stage);
        });
        data.choices.push({"cat": "salad" });
        var stickSize = 25;
        var stickColor = "blue";
        var stick =  new Circle(pos, stickColor, stickSize);
        citySelectionText.text = "City Selection: " + type;
        citySelectionText.color = baseColor;
        stage.addChild(stick.getEaselShape());
        stage.update();
   });
   
   this.unselected = function(stage){
        this.stickSize = 26;
        this.stickColor = baseColor;
        this.stick =  new Circle(this.pos, this.stickColor, this.stickSize);
        stage.addChild(this.stick.getEaselShape());
        stage.update();
   }
   
   this.getPos = function() { return this.stick.getPos()};

   this.getCityType = function() {return this.cityType};
   this.getCitySelectionText = function() {return this.citySelectionText};

   this.add = function(){
      this.stage.addChild(this.base.getEaselShape());
      this.stage.addChild(this.stick.getEaselShape());
      this.stage.update();
   }
}


//Class definitions:^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56

//Creates a square world of size 1000 that our pathfinding algorithm can use
function initWorld(){
   var size = 1000;
   var world = []
   for(var i = 0; i < size; i++){
      world[i] = []
      for(var j = 0; j < size; j++){
         world[i][j] =0;
      }
   }
   return world;
}

<<<<<<< HEAD
//Creates and displayes the Resources: x text
function initResourceText(stage, canvas, player){
   resourceText = new createjs.Text("Resources: "+player.getResources(), "20px Arial", "white");
=======
function initText(stage, canvas, text, color, xpos, ypos){
   var newText = new createjs.Text(text, "20px Arial", color);
   newText.x = xpos;
   newText.y = ypos; //TODO more logically position Resources text
   newText.textBaseline = "alphabet"; //Not sure what this setting does
   stage.addChild(newText);
   return newText;
}

function initHelpText(stage, canvas){
   resourceText = new createjs.Text("The city you have selected is represented as a blue dot", "20px Arial", "blue");
   resourceText.x = 0;
   resourceText.y = canvas.height/6; //TODO more logically position Resources text
   resourceText.textBaseline = "alphabet"; //Not sure what this setting does
   stage.addChild(resourceText);
   return resourceText;
}

//Creates and displayes the Resources: x text
function initResourceText(stage, canvas){
   resourceText = new createjs.Text("Resources: 0", "20px Arial", "#00FFFF");
>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56
   resourceText.x = 0;
   resourceText.y = canvas.height/12; //TODO more logically position Resources text
   resourceText.textBaseline = "alphabet"; //Not sure what this setting does
   stage.addChild(resourceText);
   return resourceText;
<<<<<<< HEAD

=======
}

//Creates and displayes the City Selection: x text
function initCitySelectionText(stage, canvas){
   resourceText = new createjs.Text("City Selection: Safe", "20px Arial", "#00FFFF");
   resourceText.x = 0;
   resourceText.y = canvas.height/12; //TODO more logically position Resources text
   resourceText.textBaseline = "alphabet"; //Not sure what this setting does
   stage.addChild(resourceText);
   return resourceText;
>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56
}

//Creates an array of randomly placed Resources on the stage
function initResources(stage, canvas){

   var numResources = 3; //TODO make global/make logical choice. Too high a number may incur resource problems
   var currPos = {x: 0, y: 0};
   var resources = [];
   var resourceValue = 10;

   for (i = 0; i < numResources; i ++){
      currPos.x = Math.floor((Math.random() * canvas.width)); //Random number from zero to canvas.width
      currPos.y = Math.floor((Math.random() * canvas.height));

      var resource = new Resource(resourceValue);
      resource.setPos(currPos);
      resource.add(stage);
      resources.push(resource);
   }

   return resources;
}

//Create an object to represent the background and register pathfinding events
function initBackground(stage, canvas){
   var color = "black";
   var width = canvas.width;
   var height = canvas.height;

<<<<<<< HEAD
   
   
   var background = new Rectangle( {x: width/2, y: height/2}, color, width, height);
=======
   //TODO convert the background to a working Rectangle
   //var background = new Rectangle({x: canvas.width/2, y: canvas.height/2}, color, width, height);
   var background = new Circle( {x: width/2, y: width/2}, color, 2000);
>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56
   background.add(stage);

   return background;

}

//Create desired Joysticks for the user
<<<<<<< HEAD
function initJoysticks(stage, player){
   var canvas = document.getElementById("mainCanvas");
   //var right  = new Joystick({x:canvas.width - canvas.width/6, y: canvas.height/2});
   var left = new Joystick({x: canvas.width/6, y: canvas.height/2}, player);
=======
function initJoysticks(stage){
   var canvas = document.getElementById("mainCanvas");
   //var right  = new Joystick({x:canvas.width - canvas.width/6, y: canvas.height/2});
   var left = new Joystick({x: canvas.width/6, y: canvas.height/2});
>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56

   //Add to canvas
   //right.add(stage);
   left.add(stage);

   return {left: left};
}

<<<<<<< HEAD
//Creates a player and associates it to a joystick
function initPlayer(stage){

   //Init local player
   player = new Player({x: stage.canvas.width/2, y: stage.canvas.height/2});
   player.add(stage);


   return player;
}

//Creates a button that allows users to opt in or out of teams
function initTeamButton(stage, player){

   //Put button at right of joystick
   var buttonPos = {x: stage.canvas.width - stage.canvas.width/6, y: stage.canvas.height/2};
   var teamButton = new TeamButton(buttonPos, "grey", player);
   teamButton.add(stage);

   return teamButton;
}
=======
//Create desired Cities for the user
function initCity(stage){
   var canvas = document.getElementById("mainCanvas");
   //var right  = new Joystick({x:canvas.width - canvas.width/6, y: canvas.height/2});
   var left = new City({x: canvas.width/6, y: canvas.height/2});

   //Add to canvas
   //right.add(stage);
   left.add(stage);

   return {left: left};
}

//Creates a player and associates it to a joystick
function initPlayer(stage, stick){
   player = new Player(stick);
   player.add(stage);
   return player;
}

>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56

//Initialize A* pathfinding with easystar libary
function initPathfinding(world, player, background){

   var easystar = new EasyStar.js();
   easystar.setGrid(world);
   easystar.setAcceptableTiles([0]); //tiles we're able to walk on
   easystar.enableDiagonals(); 
   
   //Generate path when background is clicked
   background.getEaselShape().on("click", function(e){
         var pos = player.getPos();
         
         easystar.findPath(Math.floor(pos.x), Math.floor(pos.y), 
                           Math.floor(e.stageX), Math.floor(e.stageY), 
                           function(path){ 
              if( path === null) {
                  console.log("Path not found");
              }
              else{
<<<<<<< HEAD
=======

                  //By default, easystar produces paths of very high resolution
                  //The code which updates the player's position in order to follow this path
                  //can only move one position per tick. In order to speed up the player
                  //either ticks must go faster, or the path has to have less elements without looking
                  //choppy. The code below attempts the latter.

                  //Remove every fourth element of the path 
                  for(var i = 0; i < path.length; i++)
                  {
                     if((i%2) === 0)
                     {
                        path.splice(i,2); //remove i from path
                        i++;
                     }
                  }
>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56
                  player.path = path;
              }
         });
   });
   return easystar;
}

<<<<<<< HEAD
function setEventHandlers() {
   socket.on("connect", onSocketConnected);
   socket.on("disconnect", onSocketDisconnect);
   socket.on("new player", onNewPlayer);
   socket.on("move player", onMovePlayer);
   socket.on("remove player", onRemovePlayer);
};

function onSocketConnected() {
   console.log("Client :: Client connected on port : "+gameport);

   console.log("emmitting LOCATION");
   console.log(stage.canvas.width/2);

   socket.emit("new player", {   id: player.id, 
                                  x: stage.canvas.width/2, 
                                  y: stage.canvas.height/2 });
}

function onSocketDisconnect() {
   console.log("Client :: Client disconnected from port : "+gameport);
}

function onNewPlayer(data) {
   console.log("Client :: New player "+data.id+"connected on port : "+gameport);

   
   var newPlayer = new Player({x: data.x, y: data.y}); //TODO rewrite player 

   console.log("NEW PLAYER LOCATION");
   console.log(newPlayer.getPos());
   newPlayer.id = data.id;
   remotePlayers.push(newPlayer);

   //stage = current stage global
   newPlayer.add(stage);
}

function onMovePlayer(data) {
   var movePlayer = playerById(data.id);

   if(!movePlayer) {
      console.log("Client :: Player not found: " + data.id);
      return;
   }

   movePlayer.setPos({x: data.x, y: data.y});

}

function onRemovePlayer(data) {
   var removePlayer = playerById(data.id);

   if(!removePlayer) {
      console.log("Client :: Player not found: "+data.id);
      return;
   };

   //Remove the player from remoteplayers array
   remotePlayers.splice(remotePlayers.indexOf(removePlayer),1);
}

// Multiplayer Helper Functions 
function playerById(id){
   var i ;
   for( i = 0; i < remotePlayers.length; i++) {
      if(remotePlayers[i].id == id)
            return remotePlayers[i];
   };

   return false;
}



},{"./Classes":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInB1YmxpYy9qcy9DbGFzc2VzLmpzIiwicHVibGljL2pzL21haW5HYW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG4vL1V0aWxpdHkgZnVuY3Rpb25zOi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vL1V0aWxpdHkgZnVuY3Rpb24gZm9yIGNvbXBhcmluZyBhcnJheXMgZm9yIGVxdWFsaXR5XG5BcnJheS5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24oIGFycmF5ICkge1xuICByZXR1cm4gdGhpcy5sZW5ndGggPT0gYXJyYXkubGVuZ3RoICYmIFxuICAgICAgICAgICB0aGlzLmV2ZXJ5KCBmdW5jdGlvbih0aGlzX2ksaSkgeyByZXR1cm4gdGhpc19pID09IGFycmF5W2ldIH0gKSAgXG59XG5cblxuLy9VdGlsaXR5IGZ1bmN0aW9uczpeXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5cblxuXG4vL0NsYXNzIGRlZmluaXRpb25zOi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vL0Jhc2UgY2xhc3MgZm9yIGFsbCBwcmltaXRpdmUgb2JqZWN0cyB0aGF0IGdldCBkcmF3blxuZnVuY3Rpb24gRWFzZWxPYmplY3QoIHBvcywgY29sb3Ipe1xuXG4gICB0aGlzLmVhc2VsU2hhcGUgPSBuZXcgY3JlYXRlanMuU2hhcGUoKTtcbiAgIHRoaXMuZ2V0RWFzZWxTaGFwZSA9IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzLmVhc2VsU2hhcGU7IH07XG5cbiAgIC8vU2V0IGluaXRpYWwgcG9zaXRpb25cbiAgIHRoaXMuZWFzZWxTaGFwZS54ID0gcG9zLng7XG4gICB0aGlzLmVhc2VsU2hhcGUueSA9IHBvcy55O1xuXG4gICAvL1Bvc2l0aW9uIHNldHRlcnMgYW5kIGdldHRlcnNcbiAgIHRoaXMuZ2V0UG9zID0gZnVuY3Rpb24oKSB7IHJldHVybiB7eDogdGhpcy5nZXRFYXNlbFNoYXBlKCkueCwgeTogdGhpcy5nZXRFYXNlbFNoYXBlKCkueX07IH07XG4gICB0aGlzLnNldFBvcyA9IGZ1bmN0aW9uKHBvcykgeyB0aGlzLmdldEVhc2VsU2hhcGUoKS54ID0gcG9zLng7IHRoaXMuZ2V0RWFzZWxTaGFwZSgpLnkgPSBwb3MueTt9O1xuXG4gICAvL1RoZSBvYmplY3QncyBjb2xvclxuICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuXG4gICAvL0FkZHMgdGhlIGN1cnJlbnQgb2JqZWN0IHRvIHRoZSBzdGFnZVxuICAgdGhpcy5hZGQgPSBmdW5jdGlvbihzdGFnZSkge1xuICAgICAgc3RhZ2UuYWRkQ2hpbGQodGhpcy5nZXRFYXNlbFNoYXBlKCkpO1xuICAgICAgc3RhZ2UudXBkYXRlKCk7XG4gICB9O1xuXG4gICAvL1JlbW92ZXMgdGhlIGN1cnJlbnQgb2JqZWN0IGZyb20gdGhlIHN0YWdlXG4gICB0aGlzLnJlbW92ZSA9IGZ1bmN0aW9uKHN0YWdlKSB7XG4gICAgICBzdGFnZS5yZW1vdmVDaGlsZCh0aGlzLmdldEVhc2VsU2hhcGUoKSk7XG4gICB9O1xufVxuXG4vL0EgY2xhc3MgZm9yIHJlcHJlc2VudGluZyBjaXJjbGVzXG5mdW5jdGlvbiBDaXJjbGUocG9zLCBjb2xvciwgcmFkaXVzICl7XG4gICAvL0NhbGwgY29uc3RydWN0b3Igb2Ygc3VwZXJjbGFzc1xuICAgRWFzZWxPYmplY3QuY2FsbCh0aGlzLCBwb3MsIGNvbG9yKTsgIFxuXG4gICAvL1NldCB0aGUgbmV3IHJhZGl1c1xuICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XG5cbiAgIC8vRnVuY3Rpb246IGRyYXcgYSBjaXJjbGVcbiAgIHRoaXMuZHJhdyA9IGZ1bmN0aW9uKCl7XG4gICAgICB0aGlzLmVhc2VsU2hhcGUuZ3JhcGhpY3MuY2xlYXIoKTtcbiAgICAgIHRoaXMuZWFzZWxTaGFwZS5ncmFwaGljcy5iZWdpbkZpbGwodGhpcy5jb2xvcikuZHJhd0NpcmNsZSgwLDAsdGhpcy5yYWRpdXMpO1xuICAgfVxuXG4gICAvL0Z1bmN0aW9uOiBkcmF3IGEgZG90dGVkIGNpcmNsZVxuICAgdGhpcy5kcmF3RG90dGVkID0gZnVuY3Rpb24oKXtcbiAgICAgIHRoaXMuZWFzZWxTaGFwZS5ncmFwaGljcy5jbGVhcigpO1xuXG4gICAgICAvLzIwIHBpeGVsIGxpbmVzIHdpdGggNSBwaXhlbCBnYXBzXG4gICAgICAvL3RoaXMuZWFzZWxTaGFwZS5ncmFwaGljcy5zZXRTdHJva2VEYXNoKFsyMCw1XSk7XG4gICAgICB0aGlzLmVhc2VsU2hhcGUuZ3JhcGhpY3Muc2V0U3Ryb2tlU3R5bGUoMikuYmVnaW5TdHJva2UodGhpcy5jb2xvcikuZHJhd0NpcmNsZSgwLDAsdGhpcy5yYWRpdXMpO1xuICAgfVxuICAgIFxuICAgdGhpcy5kcmF3KCk7XG59XG5cbmZ1bmN0aW9uIFJlY3RhbmdsZShwb3MsIGNvbG9yLCB3aWR0aCwgaGVpZ2h0KXtcbiAgIEVhc2VsT2JqZWN0LmNhbGwodGhpcywgcG9zLCBjb2xvcik7XG5cbiAgIHRoaXMud2lkdGggID0gd2lkdGg7XG4gICB0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuXG4gICAvL0Vhc2VsLmpzIGRyYXdzIHJlY3RhbmdsZXMgdXNpbmcgY29vcmRpbmF0ZXMgcmVwcmVzZW50aW5nIHRoZSByZWN0YW5nbGUncyB1cHBlciBsZWZ0IGNvcm5lclxuICAgLy9UaGUgcG9zaXRpb24gb2Zmc2V0cyBoZXJlIGRyYXcgdGhlIHJlY3RhbmdsZSBzdWNoIHRoYXQgcG9zIHJlcHJlc2VudHMgdGhlIGNlbnRlciBpZiBpdC4gXG4gICB0aGlzLmVhc2VsU2hhcGUueCAtPSAgdGhpcy53aWR0aC8yXG4gICB0aGlzLmVhc2VsU2hhcGUueSAtPSAgdGhpcy5oZWlnaHQvMlxuICAgXG4gICAvL0RyYXcgdGhlIHJlY3RhbmdsZVxuICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24oKXtcbiAgICAgIHRoaXMuZWFzZWxTaGFwZS5ncmFwaGljcy5jbGVhcigpO1xuICAgICAgdGhpcy5nZXRFYXNlbFNoYXBlKCkuZ3JhcGhpY3MuYmVnaW5GaWxsKHRoaXMuY29sb3IpLmRyYXdSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgIH1cbiAgIHRoaXMuZHJhdygpO1xuXG59XG5cbmZ1bmN0aW9uIFJlc291cmNlKHZhbHVlKXtcbiAgIENpcmNsZS5jYWxsKHRoaXMsIHt4OiAwLCB5OiAwfSwgXCJ3aGl0ZVwiLCAxMCk7XG4gICB0aGlzLnZhbHVlID0gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIERpc2Vhc2Vab25lKHBsYXllclBvcyl7XG4gICBDaXJjbGUuY2FsbCh0aGlzLCBwbGF5ZXJQb3MsIFwicmVkXCIsIDc1KTtcbiAgIHRoaXMuZHJhd0RvdHRlZCgpO1xuICAgdGhpcy5BbGxvd3NUZWFtcyA9IGZhbHNlO1xuXG4gICAvL0ludmVydHMgd2hldGhlciB0aGUgZGlzZWFzZVpvbmUgYWxsb3dzIHRlYW1zXG4gICAvL1RPRE8gbWFrZSBwcm9wZXJ0eSBvZiBwbGF5ZXJcbiAgIHRoaXMuaW52ZXJ0QWxsb3dzVGVhbXMgPSBmdW5jdGlvbigpe1xuXG4gICAgIC8vU2V0IHRvIG5vdCBhbGxvdyB0ZWFtc1xuICAgICBpZih0aGlzLkFsbG93c1RlYW1zID09PSB0cnVlKXtcbiAgICAgICAgdGhpcy5jb2xvciA9IFwicmVkXCI7XG4gICAgICAgIHRoaXMuZHJhd0RvdHRlZCgpO1xuICAgICB9XG4gICAgIGVsc2VcbiAgICAge1xuICAgICAgICB0aGlzLmNvbG9yID0gXCJncmVlblwiO1xuICAgICAgICB0aGlzLmRyYXdEb3R0ZWQoKTtcbiAgICAgfVxuICAgICB0aGlzLkFsbG93c1RlYW1zID0gIXRoaXMuQWxsb3dzVGVhbXM7XG4gICB9O1xuICAgXG59XG5cbmZ1bmN0aW9uIENhbWVyYShwb3MsIHdpZHRoLCBoZWlnaHQpe1xuICAgdGhpcy5wb3MgPSBwb3M7XG4gICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgIHRoaXMuZ2V0UG9zID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wb3M7fTtcbiAgIHRoaXMuc2V0UG9zID0gZnVuY3Rpb24ocG9zKSB7dGhpcy5wb3MgPSBwb3M7fTtcbiAgIHRoaXMuZ2V0V2lkdGggPSBmdW5jdGlvbigpe3JldHVybiB0aGlzLndpZHRoO307XG4gICB0aGlzLnNldFdpZHRoID0gZnVuY3Rpb24od2lkdGgpIHt0aGlzLndpZHRoID0gd2lkdGg7fTtcbiAgIHRoaXMuZ2V0SGVpZ2h0ID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5oZWlnaHQ7fTtcbiAgIHRoaXMuc2V0SGVpZ2h0ID0gZnVuY3Rpb24oaGVpZ2h0KSB7dGhpcy5oZWlnaHQgPSBoZWlnaHQ7fTtcbn1cblxuZnVuY3Rpb24gUGxheWVyKHBvcyl7XG4gICBDaXJjbGUuY2FsbCggdGhpcywgcG9zLCBcInJlZFwiLCAyMCk7XG4gICAgLy97eDogY2FudmFzLndpZHRoLzIsIHk6IGNhbnZhcy5oZWlnaHQvMn0sIFwicmVkXCIsIDIwKTtcbiAgIFxuICAgdGhpcy5zZXRQb3MocG9zKTtcblxuICAgdGhpcy5pZDtcbiAgIHRoaXMuZGlzZWFzZVpvbmUgPSBuZXcgRGlzZWFzZVpvbmUodGhpcy5nZXRQb3MoKSk7XG4gICB0aGlzLnJlc291cmNlcyA9IDA7XG4gICB0aGlzLmNhbWVyYSA9IHt9O1xuICAgdGhpcy5wYXRoID0gW107XG5cbiAgIC8vdGhpcy5nZXRDYW1lcmEgPSBmdW5jdGlvbigpeyByZXR1cm4gdGhpcy5jYW1lcmE7fTtcbiAgIC8vdGhpcy5zZXRDYW1lcmEgPSBmdW5jdGlvbihjYW1lcmEpeyB0aGlzLmNhbWVyYSA9IGNhbWVyYTsgfTtcbiAgIFxuICAgLy9Nb3ZlcyB0aGUgcGxheWVyIGFsb25nIGEgcGF0aCBkZXRlcm1pbmVkIGJ5IEEqIGFsZ29yaXRobVxuICAgdGhpcy5nb1BhdGggPSBmdW5jdGlvbihkZWx0YVRpbWUpe1xuICAgICAgXG4gICAgICBpZih0aGlzLnBhdGguZXF1YWxzKFtdKSA9PT0gZmFsc2UpXG4gICAgICB7XG4gICAgICAgICB2YXIgcG9zID0ge3g6IHRoaXMucGF0aFswXS54LCB5OiB0aGlzLnBhdGhbMF0ueX07XG4gICAgICAgICB0aGlzLnNldFBvcyhwb3MpO1xuICAgICAgICAgdGhpcy5wYXRoLnNwbGljZSgwLCAxKmRlbHRhVGltZSk7IC8vUmVtb3ZlIGRlbHRhVGltZSBlbGVtZW50cyBzdGFydGluZyBmcm9tIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2VsZW1lbnQgMDtcbiAgICAgICAgIHJldHVybiBwb3M7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiB7eDogdGhpcy5nZXRQb3MoKS54LCB5OiB0aGlzLmdldFBvcygpLnl9O1xuICAgfVxuXG4gICB0aGlzLmdldFJlc291cmNlcyA9IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzLnJlc291cmNlczt9O1xuICAgdGhpcy5zZXRSZXNvdXJjZXMgPSBmdW5jdGlvbihuZXdSZXNvdXJjZXMpeyB0aGlzLnJlc291cmNlcyA9IG5ld1Jlc291cmNlc307XG5cbiAgIC8vT3ZlcnJpZGUgaW5oZXJpdGVkIHNldFBvc1xuICAgdmFyIHBhcmVudFNldFBvcyA9IHRoaXMuc2V0UG9zO1xuICAgdGhpcy5zZXRQb3MgPSBmdW5jdGlvbihwb3MpeyBcbiAgICAgICAvL3RoaXMuY2FtZXJhLnNldFBvcyhwb3MpO1xuICAgICAgIHRoaXMuZGlzZWFzZVpvbmUuc2V0UG9zKHBvcyk7XG4gICAgICAgcGFyZW50U2V0UG9zLmNhbGwodGhpcywgcG9zKTsgLy9uZWVkIGNhbGwgc28gJ3RoaXMnIGlzIGRlZmluZWQgYXMgdGhlIGN1cnJlbnQgUGxheWVyXG4gICB9O1xuXG4gICAvL092ZXJyaWRlIGluaGVyaXRlZCBhZGRcbiAgIHZhciBwYXJlbnRBZGQgPSB0aGlzLmFkZDtcbiAgIHRoaXMuYWRkID0gZnVuY3Rpb24oc3RhZ2Upe1xuICAgICAgdGhpcy5kaXNlYXNlWm9uZS5hZGQoc3RhZ2UpO1xuICAgICAgcGFyZW50QWRkLmNhbGwodGhpcywgc3RhZ2UpO1xuICAgfVxuICAgICAgXG4gICBcblxuICAgLy9DaGVjayBpZiBzdGFuZGluZyBvbiBhbnkgcmVzb3VyY2VzXG4gICB0aGlzLnBpY2t1cCA9IGZ1bmN0aW9uKHN0YWdlLCByZXNvdXJjZXMpe1xuICAgICAgdmFyIGVhc2VsU2hhcGUgPSB0aGlzLmdldEVhc2VsU2hhcGUoKTtcbiAgICAgIHZhciByZXNvdXJjZUNvcHkgPSByZXNvdXJjZXMuc2xpY2UoMCxyZXNvdXJjZXMubGVuZ3RoKTtcbiAgICAgIGZvciAodmFyIHggb2YgcmVzb3VyY2VDb3B5KXtcbiAgICAgICAgIHZhciBwb3MgPSB4LmdldFBvcygpO1xuICAgICAgICAgdmFyIHB0ID0gIGVhc2VsU2hhcGUuZ2xvYmFsVG9Mb2NhbChwb3MueCwgcG9zLnkpOyAvL2hpdFRlc3QgbmVlZHMgY29vcmRpbmF0ZXMgcmVsYXRpdmUgdG8gZWFzZWxTaGFwZVxuICAgICAgICAgaWYoZWFzZWxTaGFwZS5oaXRUZXN0KHB0LngsIHB0LnkpKSAvL0lmIHBsYXllciBpcyBvdmVyIHJlc291cmNlXG4gICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLnNldFJlc291cmNlcyh0aGlzLmdldFJlc291cmNlcygpICsgeC52YWx1ZSk7XG4gICAgICAgICAgICB2YXIgcmVtSW5kZXggPSByZXNvdXJjZXMuaW5kZXhPZih4KTtcbiAgICAgICAgICAgIHJlc291cmNlcy5zcGxpY2UocmVtSW5kZXgsMSk7XG4gICAgICAgICAgICB4LnJlbW92ZShzdGFnZSk7XG4gICAgICAgICB9XG4gICAgICB9XG4gICB9XG59XG5cbi8vQ29udHJvbHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vQ3JlYXRlcyBhIEpveXN0aWNrIGF0IHRoZSBnaXZlbiBsb2NhdGlvblxuZnVuY3Rpb24gSm95c3RpY2socG9zLCBwbGF5ZXIpe1xuXG4gICB0aGlzLnBvcyA9IHBvcztcbiAgIHRoaXMucGxheWVyID0gcGxheWVyO1xuXG4gICB0aGlzLmJhc2VTaXplID0gMzU7XG4gICB0aGlzLmJhc2VDb2xvciA9IFwiZ3JleVwiO1xuICAgdGhpcy5iYXNlID0gbmV3IENpcmNsZSh0aGlzLnBvcywgdGhpcy5iYXNlQ29sb3IsIHRoaXMuYmFzZVNpemUpO1xuXG4gICB0aGlzLnN0aWNrU2l6ZSA9IDI1O1xuICAgdGhpcy5zdGlja0NvbG9yID0gXCJ3aGl0ZVwiO1xuICAgdGhpcy5zdGljayA9ICBuZXcgQ2lyY2xlKHRoaXMucG9zLCB0aGlzLnN0aWNrQ29sb3IsIHRoaXMuc3RpY2tTaXplKTtcblxuICAgLy9MaW1pdGVkIERyYWdnaW5nXG4gICB0aGlzLnN0aWNrLmdldEVhc2VsU2hhcGUoKS5vbihcInByZXNzbW92ZVwiLCBmdW5jdGlvbihlKXtcbiAgICAgIGUudGFyZ2V0LnggPSBlLnN0YWdlWDsgLy8oc3RhZ2VYLCBzdGFnZVkpID0gbW91c2VDb29yZGluYXRlXG4gICAgICBlLnRhcmdldC55ID0gZS5zdGFnZVk7XG4gICB9KTtcbiAgIFxuICAgdmFyIGJhc2VWYXIgPSB0aGlzLmJhc2U7IC8vTm8gaWRlYSB3aHkgSSBoYXZlIHRvIGRvIHRoaXM7IHNjb3Bpbmc/XG4gICAvL1Jlc2V0IHN0aWNrIHRvIGJhc2UgcG90aXRpb24gb24gd2hlbiBqb3lzdGljayBpcyByZWxlYXNlZFxuICAgdGhpcy5zdGljay5nZXRFYXNlbFNoYXBlKCkub24oXCJwcmVzc3VwXCIsIGZ1bmN0aW9uKGUpe1xuICAgICAgZS50YXJnZXQueCA9IGJhc2VWYXIuZ2V0UG9zKCkueDsgIFxuICAgICAgZS50YXJnZXQueSA9IGJhc2VWYXIuZ2V0UG9zKCkueTtcbiAgIH0pO1xuICAgXG4gICB0aGlzLmdldFBvcyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5iYXNlLmdldFBvcygpfTtcbiAgIHRoaXMuc2V0UG9zID0gZnVuY3Rpb24ocG9zKSB7XG4gICAgICB0aGlzLmJhc2Uuc2V0UG9zKHBvcyk7XG4gICAgICB0aGlzLnN0aWNrLnNldFBvcyhwb3MpO1xuICAgfVxuXG4gICAvL0dldCB0aGUgZGlyZWN0aW9uIHRoZSBqb3lzdGljayBpcyBwb2ludGluZ1xuICAgdGhpcy5nZXREaXJlY3Rpb24gPSBmdW5jdGlvbigpe1xuICAgICAgdmFyIHYgPSB0aGlzLnN0aWNrLmdldFBvcygpO1xuICAgICAgdmFyIHcgPSB0aGlzLmJhc2UuZ2V0UG9zKCk7XG4gICAgICB2YXIgeDEgPSB2LnggLSB3Lng7IC8vbmV3IGNvb3JkaW5hdGVzXG4gICAgICB2YXIgeTEgPSB2LnkgLSB3Lnk7XG4gICAgICB2YXIgbWFnMSA9IE1hdGguc3FydCh4MSp4MSArIHkxKnkxKTtcblxuICAgICAgcmV0dXJuIHt4OiB4MS9tYWcxLCB5OiB5MS9tYWcxfVxuICAgfTtcblxuICAgLy9HZXQgdGhlIGZvcmNlIGFjdGluZyBvbiBhIHBsYXllciBieSB0aGUgam95c3RpY2tcbiAgIHRoaXMuZ2V0Rm9yY2UgPSBmdW5jdGlvbigpe1xuICAgICAgdmFyIHYgPSB0aGlzLnN0aWNrLmdldFBvcygpO1xuICAgICAgdmFyIHcgPSB0aGlzLmJhc2UuZ2V0UG9zKCk7XG4gICAgICByZXR1cm4gTWF0aC5hYnMoTWF0aC5zcXJ0KHYueCp2LnggKyB2Lnkqdi55KSAtIE1hdGguc3FydCh3Lngqdy54ICsgdy55KncueSkpO1xuICAgfTtcblxuXG4gICAvL1VwZGF0ZSBwbGF5ZXIncyBsb2NhdGlvbiB3aXRoIHJlc3BlY3QgdG8gam95c3RpY2tcbiAgIHRoaXMubW92ZSA9IGZ1bmN0aW9uIChkZWx0YSkgeyAvL0RlbHRhIGlzIGRlbHRhVGltZVxuXG4gICAgICAvL01vdmUgcGxheWVyIHdpdGggbGVmdCBqb3lzdGlja1xuICAgICAgdmFyIHBsYXllclBvcyA9IHRoaXMucGxheWVyLmdldFBvcygpO1xuICAgICAgdmFyIGRpcmVjdGlvbiA9IHRoaXMuZ2V0RGlyZWN0aW9uKCk7XG5cbiAgICAgIC8vVE9ETyBtYWtlIGRhbXBpbmcgcGxheWVyIHByb3BlcnR5XG4gICAgICB2YXIgZGFtcGluZyA9IDEvMjA7XG4gICAgICBpZihpc05hTihkaXJlY3Rpb24ueCkgfHwgaXNOYU4oZGlyZWN0aW9uLnkpKVxuICAgICAge1xuICAgICAgICAgZGlyZWN0aW9uLnggPSAwO1xuICAgICAgICAgZGlyZWN0aW9uLnkgPSAwO1xuICAgICAgfVxuICAgICAgcGxheWVyUG9zLnggKz0gZGFtcGluZypkZWx0YSp0aGlzLmdldEZvcmNlKCkqZGlyZWN0aW9uLng7XG4gICAgICBwbGF5ZXJQb3MueSArPSBkYW1waW5nKmRlbHRhKnRoaXMuZ2V0Rm9yY2UoKSpkaXJlY3Rpb24ueTtcbiAgICAgIHRoaXMucGxheWVyLnNldFBvcyhwbGF5ZXJQb3MpO1xuXG4gICB9O1xuXG5cbiAgIHRoaXMuYWRkID0gZnVuY3Rpb24oc3RhZ2Upe1xuICAgICAgc3RhZ2UuYWRkQ2hpbGQodGhpcy5iYXNlLmdldEVhc2VsU2hhcGUoKSk7XG4gICAgICBzdGFnZS5hZGRDaGlsZCh0aGlzLnN0aWNrLmdldEVhc2VsU2hhcGUoKSk7XG4gICAgICBzdGFnZS51cGRhdGUoKTtcbiAgIH1cblxufVxuXG4vL0J1dHRvbiBmb3Igb3B0aW5nIGluIG9yIG91dCBvZiB0ZWFtc1xuZnVuY3Rpb24gVGVhbUJ1dHRvbihwb3MsIGNvbG9yLCBwbGF5ZXIpe1xuXG4gICAvL1RPRE8gbWFrZSBiYXNlU2l6ZSBzb21lIGtpbmQgb2YgZ2xvYmFsIHZhcmlhYmxlXG4gICB2YXIgYmFzZVNpemUgPSAzNTtcbiAgIENpcmNsZS5jYWxsKHRoaXMsIHBvcywgY29sb3IsIGJhc2VTaXplKTtcblxuICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XG5cbiAgIHRoaXMuZ2V0RWFzZWxTaGFwZSgpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XG4gICAgICBwbGF5ZXIuZGlzZWFzZVpvbmUuaW52ZXJ0QWxsb3dzVGVhbXMoKTtcbiAgIH0pO1xufVxuLy9Db250cm9scyBeXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5cblxuLy9EcmFnYWJsZSBDbGFzczogTWFrZXMgb2JqZWN0cyBEcmFnYWJsZVxuZnVuY3Rpb24gRHJhZ2FibGUocG9zLCBjb2xvcil7XG5cbiAgIC8vQ2FsbCBzdXBlcmNsYXNzJ3MgY29uc3RydWN0b3JcbiAgIEVhc2VsT2JqZWN0LmNhbGwodGhpcywgcG9zLCBjb2xvcik7XG5cbiAgIC8vVXBkYXRlIGNvb3JkaW5hdGVzIHdoaWxlIG9iamVjdCBpcyBtb3ZlZCB3aGlsZSBwcmVzc2VkXG4gICB0aGlzLmdldEVhc2VsU2hhcGUoKS5vbihcInByZXNzbW92ZVwiLCBmdW5jdGlvbihlKXtcbiAgICAgIGUudGFyZ2V0LnggPSBlLnN0YWdlWDsgLy8oc3RhZ2VYLCBzdGFnZVkpID0gbW91c2VDb29yZGluYXRlXG4gICAgICBlLnRhcmdldC55ID0gZS5zdGFnZVk7XG4gICB9KTtcblxufTtcblxuXG5cblxuLy9DbGFzcyBkZWZpbml0aW9uczpeXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5cbmV4cG9ydHMuRWFzZWxPYmplY3QgPSBFYXNlbE9iamVjdDtcbmV4cG9ydHMuQ2lyY2xlICAgICAgPSBDaXJjbGU7XG5leHBvcnRzLlJlY3RhbmdsZSAgID0gUmVjdGFuZ2xlO1xuZXhwb3J0cy5SZXNvdXJjZSAgICA9IFJlc291cmNlO1xuZXhwb3J0cy5DYW1lcmEgICAgICA9IENhbWVyYTtcbmV4cG9ydHMuRGlzZWFzZVpvbmUgPSBEaXNlYXNlWm9uZTtcbmV4cG9ydHMuUGxheWVyICAgICAgPSBQbGF5ZXI7XG5leHBvcnRzLkpveXN0aWNrICAgID0gSm95c3RpY2s7XG5leHBvcnRzLlRlYW1CdXR0b24gID0gVGVhbUJ1dHRvbjtcbiIsIi8qIElNUE9SVEFOVDogU2V2ZXJhbCB2YXJpYWJsZXMgaW4gdGhpcyBqcywgbGlrZSBcImlvXCIsIGV4aXN0IGJlY2F1c2VcbiAgIG1haW5HYW1lLmpzIGlzIGluY2x1ZGVkIGJlbG93IHNvY2tldC5pby5qcyBpbiB2aWV3cy9jaXRpemVuLmhhbmRsZWJhcnMuXG4gICAgKi9cblxuXG4vKiBJbXBvcnQgY2xhc3NlcyAqL1xuXG4vL1JlcXVpcmluZyBlbmFibGVkIGJ5IGJyb3dzZXJpZnlcblxudmFyIEVhc2VsT2JqZWN0ID0gcmVxdWlyZShcIi4vQ2xhc3Nlc1wiKS5FYXNlbE9iamVjdDtcbnZhciBDaXJjbGUgICAgICA9IHJlcXVpcmUoXCIuL0NsYXNzZXNcIikuQ2lyY2xlO1xudmFyIFJlY3RhbmdsZSAgID0gcmVxdWlyZShcIi4vQ2xhc3Nlc1wiKS5SZWN0YW5nbGU7XG52YXIgUmVzb3VyY2UgICAgPSByZXF1aXJlKFwiLi9DbGFzc2VzXCIpLlJlc291cmNlO1xudmFyIENhbWVyYSAgICAgID0gcmVxdWlyZShcIi4vQ2xhc3Nlc1wiKS5DYW1lcmE7XG52YXIgRGlzZWFzZVpvbmUgPSByZXF1aXJlKFwiLi9DbGFzc2VzXCIpLkRpc2Vhc2Vab25lO1xudmFyIFBsYXllciAgICAgID0gcmVxdWlyZShcIi4vQ2xhc3Nlc1wiKS5QbGF5ZXI7XG52YXIgSm95c3RpY2sgICAgPSByZXF1aXJlKFwiLi9DbGFzc2VzXCIpLkpveXN0aWNrO1xudmFyIFRlYW1CdXR0b24gID0gcmVxdWlyZShcIi4vQ2xhc3Nlc1wiKS5UZWFtQnV0dG9uO1xuXG5cbnZhciBnYW1lcG9ydCA9IDgwODA7IC8vcG9ydCBjbGllbnRzIHdpbGwgY29ubmVjdCB0byBcbnZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5DYW52YXNcIik7XG52YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5jYW52YXMud2lkdGggID0gd2luZG93LmlubmVyV2lkdGg7XG5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0OyBcblxudmFyIHN0YWdlICAgICAgICA9IG5ldyBjcmVhdGVqcy5TdGFnZShcIm1haW5DYW52YXNcIik7XG5cbnZhciBwbGF5ZXIsXG4gICAgcmVtb3RlUGxheWVycyxcbiAgICBkZWx0YVRpbWUsXG4gICAgc29ja2V0O1xuXG5tYWluKCk7XG5cblxuZnVuY3Rpb24gbWFpbigpe1xuICAgXG4gICAvL0luaXRpYWxpemUgdGhlIGdhbWUgd29ybGRcbiAgIHZhciB3b3JsZCAgICAgICAgPSBpbml0V29ybGQoKTtcbiAgIHZhciBiYWNrZ3JvdW5kICAgPSBpbml0QmFja2dyb3VuZChzdGFnZSwgY2FudmFzKTtcblxuICAgXG4gICAvL0luaXRhbGl6ZSB0aGUgZ2FtZSBjb250cm9scyBhbmQgcGxheWVyXG4gICBwbGF5ZXIgICAgICAgICAgID0gaW5pdFBsYXllcihzdGFnZSk7XG4gICAvL3BsYXllci5zZXRDYW1lcmEobmV3IENhbWVyYShwbGF5ZXIuZ2V0UG9zKCksIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCkpO1xuICAgdmFyIGxlZnRKb3lzdGljayA9IGluaXRKb3lzdGlja3Moc3RhZ2UsIHBsYXllcikubGVmdDtcbiAgIHZhciB0ZWFtQnV0dG9uICAgPSBpbml0VGVhbUJ1dHRvbihzdGFnZSwgcGxheWVyKTtcblxuICAgLy9Jbml0aWFsaXplIGFycmF5IG9mIHJlc291cmNlIG9iamVjdHMgYW5kIHJlc291cmNlIHRleHRcbiAgIHZhciByZXNvdXJjZXMgICAgPSBpbml0UmVzb3VyY2VzKHN0YWdlLCBjYW52YXMpO1xuICAgdmFyIHJlc291cmNlVGV4dCA9IGluaXRSZXNvdXJjZVRleHQoc3RhZ2UsY2FudmFzLCBwbGF5ZXIpO1xuXG4gICAvL0luaXRpYWxpemUgUGF0aGZpbmRpbmdcbiAgIHZhciBlYXN5c3RhciA9IGluaXRQYXRoZmluZGluZyh3b3JsZCwgcGxheWVyLCBiYWNrZ3JvdW5kKTsgXG4gICBcbiAgIC8vRW5hYmxlIHRvdWNoIGJhc2VkIGludGVyZmFjZSBmb3IgbW9iaWxlIGRldmljZXNcbiAgIGNyZWF0ZWpzLlRvdWNoLmVuYWJsZShzdGFnZSk7XG5cbiAgIC8vUmVzaXplIGNhbnZhcyBvbiB3aW5kb3cgcmVzaXplICAgXG4gICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBmdW5jdGlvbigpe1xuICAgICAgc3RhZ2UuY2FudmFzLndpZHRoICA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgc3RhZ2UuY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgIGJhY2tncm91bmQud2lkdGggICAgPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgIGJhY2tncm91bmQuaGVpZ2h0ICAgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICBiYWNrZ3JvdW5kLmRyYXcoKTtcblxuICAgICAgLy9UT0RPIGVuY2Fwc3VsYXRlIHRoZXNlIG9mZnNldHMgd2l0aGluIEpveXN0aWNrIGFuZCBUZWFtQnV0dG9uXG4gICAgICBsZWZ0Sm95c3RpY2suc2V0UG9zKHt4OiB3aW5kb3cuaW5uZXJXaWR0aC82LCB5OiB3aW5kb3cuaW5uZXJIZWlnaHQvMn0pO1xuICAgICAgdGVhbUJ1dHRvbi5zZXRQb3Moe3g6IHdpbmRvdy5pbm5lcldpZHRoIC0gd2luZG93LmlubmVyV2lkdGgvNiwgeTogd2luZG93LmlubmVySGVpZ2h0LzJ9KTtcblxuXG4gICB9LCBmYWxzZSk7XG4gICBcblxuICAgLyogTXVsdGlwbGF5ZXIgaW5pdGlhbGl6YXRpb24gY29kZSAqL1xuICAgLy9Db25uZWN0IGNsaWVudCB0byBzZXJ2ZXIgXG4gICBzb2NrZXQgPSBpby5jb25uZWN0KCk7XG4gICBjb25zb2xlLmxvZyhcInNvY2tldDpcIik7XG4gICBjb25zb2xlLmxvZyhzb2NrZXQpO1xuICAgLy9UT0RPIGNoYW5nZSBmcm9tIGxvY2FsaG9zdFxuICAgXG4gICAvL0luaXRpYWxpemUgcmVtb3RlIHBsYXllcnMgXG4gICByZW1vdGVQbGF5ZXJzID0gW107XG5cbiAgIC8vTGlzdGVuIGZvciBldmVudHNcbiAgIHNldEV2ZW50SGFuZGxlcnMoKTtcblxuXG4gICAvL01haW4gZ2FtZSBsb29wLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgdmFyIEZQUyA9IDUwO1xuICAgY3JlYXRlanMuVGlja2VyLnNldEZQUyhGUFMpO1xuICAgdmFyIHByZXZpb3VzVGltZSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG4gICB2YXIgY3VycmVudFRpbWU7XG4gICAvLyBwaXhlbHMvZnJhbWUgKiBmcmFtZXMvc2Vjb25kID0gcGl4ZWxzL3NlY29uZDogZGVsdGEgdGltZSBpc1xuICAgLy8gZW1waXJpY2FsIEZQU1xuICAgY3JlYXRlanMuVGlja2VyLmFkZEV2ZW50TGlzdGVuZXIoXCJ0aWNrXCIsIGZ1bmN0aW9uKCl7XG5cbiAgICAgIC8vTG9naWMgdG8gY3JlYXRlIGRlbHRhVGltZSBzbyBtb3ZlbWVudCBpcyByZWxhdGl2ZSB0byB0aW1lXG4gICAgICAvL3JhdGhlciB0aGFuIGZyYW1lcy5cbiAgICAgIHZhciB0aW1lciA9IG5ldyBEYXRlKCk7XG4gICAgICBjdXJyZW50VGltZSA9IHRpbWVyLmdldFRpbWUoKTtcbiAgICAgIGRlbHRhVGltZSA9IGN1cnJlbnRUaW1lIC0gcHJldmlvdXNUaW1lO1xuICAgICAgcHJldmlvdXNUaW1lID0gY3VycmVudFRpbWU7XG5cbiAgICAgIC8vRG8gcGF0aGZpbmRpbmcgY2FsY3VsYXRpb25cbiAgICAgIGVhc3lzdGFyLmNhbGN1bGF0ZSgpO1xuXG4gICAgICAvL01vdmUgcGxheWVyIGFjY29yZGluZyB0byBqb3lzdGlja1xuICAgICAgbGVmdEpveXN0aWNrLm1vdmUoZGVsdGFUaW1lKTtcblxuICAgICAgLy9DaGVjayBpZiBwbGF5ZXIgaXMgY29sbGlkaW5nIHdpdGggcmVzb3VyY2VzXG4gICAgICBwbGF5ZXIucGlja3VwKHN0YWdlLCByZXNvdXJjZXMpO1xuXG4gICAgICAvL01vdmUgYWxvbmcgY2FsY3VsYXRlZCBwYXRoZmluZGluZyBwYXRoXG5cbiAgICAgIHZhciBuZXdQYXRoUG9zO1xuICAgICAgcGxheWVyLmdvUGF0aChkZWx0YVRpbWUpO1xuICAgICAgc29ja2V0LmVtaXQoXCJtb3ZlIHBsYXllclwiLCB7ICB4OiBwbGF5ZXIuZ2V0UG9zKCkueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IHBsYXllci5nZXRQb3MoKS55fSk7XG4gICAgICAgICAgICAgIFxuICAgICAgZm9yKGkgPSAwOyBpIDwgcmVtb3RlUGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgY3VyclBsYXllciA9IHJlbW90ZVBsYXllcnNbaV07XG4gICAgICAgICBuZXdQYXRoUG9zID0gY3VyclBsYXllci5nb1BhdGgoZGVsdGFUaW1lKTtcbiAgICAgICAgIHNvY2tldC5lbWl0KFwibW92ZSBwbGF5ZXJcIiwgeyAgeDogbmV3UGF0aFBvcy54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogbmV3UGF0aFBvcy55IH0pO1xuICAgICAgfVxuXG5cbiAgICAgIC8vVXBkYXRlIHJlc291cmNlIHRleHRcbiAgICAgIHJlc291cmNlVGV4dC50ZXh0ID0gXCJSZXNvdXJjZXM6IFwiK3BsYXllci5nZXRSZXNvdXJjZXMoKTtcblxuICAgICAgLy9Db21taXQgYWxsIHVwZGF0ZXMgdG8gYWN0dWFsIHN0YWdlL2NhbnZhc1xuICAgICAgc3RhZ2UudXBkYXRlKCk7XG5cbiAgIH0pO1xuXG59XG4vL1V0aWxpdHkgZnVuY3Rpb25zOi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vL1V0aWxpdHkgZnVuY3Rpb24gZm9yIGNvbXBhcmluZyBhcnJheXMgZm9yIGVxdWFsaXR5XG5BcnJheS5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24oIGFycmF5ICkge1xuICByZXR1cm4gdGhpcy5sZW5ndGggPT0gYXJyYXkubGVuZ3RoICYmIFxuICAgICAgICAgICB0aGlzLmV2ZXJ5KCBmdW5jdGlvbih0aGlzX2ksaSkgeyByZXR1cm4gdGhpc19pID09IGFycmF5W2ldIH0gKSAgXG59XG5cblxuLy9VdGlsaXR5IGZ1bmN0aW9uczpeXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5cblxuXG4vL0NyZWF0ZXMgYSBzcXVhcmUgd29ybGQgb2Ygc2l6ZSAxMDAwIHRoYXQgb3VyIHBhdGhmaW5kaW5nIGFsZ29yaXRobSBjYW4gdXNlXG5mdW5jdGlvbiBpbml0V29ybGQoKXtcbiAgIHZhciBzaXplID0gMTAwMDtcbiAgIHZhciB3b3JsZCA9IFtdXG4gICBmb3IodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKXtcbiAgICAgIHdvcmxkW2ldID0gW11cbiAgICAgIGZvcih2YXIgaiA9IDA7IGogPCBzaXplOyBqKyspe1xuICAgICAgICAgd29ybGRbaV1bal0gPTA7XG4gICAgICB9XG4gICB9XG4gICByZXR1cm4gd29ybGQ7XG59XG5cbi8vQ3JlYXRlcyBhbmQgZGlzcGxheWVzIHRoZSBSZXNvdXJjZXM6IHggdGV4dFxuZnVuY3Rpb24gaW5pdFJlc291cmNlVGV4dChzdGFnZSwgY2FudmFzLCBwbGF5ZXIpe1xuICAgcmVzb3VyY2VUZXh0ID0gbmV3IGNyZWF0ZWpzLlRleHQoXCJSZXNvdXJjZXM6IFwiK3BsYXllci5nZXRSZXNvdXJjZXMoKSwgXCIyMHB4IEFyaWFsXCIsIFwid2hpdGVcIik7XG4gICByZXNvdXJjZVRleHQueCA9IDA7XG4gICByZXNvdXJjZVRleHQueSA9IGNhbnZhcy5oZWlnaHQvMTI7IC8vVE9ETyBtb3JlIGxvZ2ljYWxseSBwb3NpdGlvbiBSZXNvdXJjZXMgdGV4dFxuICAgcmVzb3VyY2VUZXh0LnRleHRCYXNlbGluZSA9IFwiYWxwaGFiZXRcIjsgLy9Ob3Qgc3VyZSB3aGF0IHRoaXMgc2V0dGluZyBkb2VzXG4gICBzdGFnZS5hZGRDaGlsZChyZXNvdXJjZVRleHQpO1xuICAgcmV0dXJuIHJlc291cmNlVGV4dDtcblxufVxuXG4vL0NyZWF0ZXMgYW4gYXJyYXkgb2YgcmFuZG9tbHkgcGxhY2VkIFJlc291cmNlcyBvbiB0aGUgc3RhZ2VcbmZ1bmN0aW9uIGluaXRSZXNvdXJjZXMoc3RhZ2UsIGNhbnZhcyl7XG5cbiAgIHZhciBudW1SZXNvdXJjZXMgPSAzOyAvL1RPRE8gbWFrZSBnbG9iYWwvbWFrZSBsb2dpY2FsIGNob2ljZS4gVG9vIGhpZ2ggYSBudW1iZXIgbWF5IGluY3VyIHJlc291cmNlIHByb2JsZW1zXG4gICB2YXIgY3VyclBvcyA9IHt4OiAwLCB5OiAwfTtcbiAgIHZhciByZXNvdXJjZXMgPSBbXTtcbiAgIHZhciByZXNvdXJjZVZhbHVlID0gMTA7XG5cbiAgIGZvciAoaSA9IDA7IGkgPCBudW1SZXNvdXJjZXM7IGkgKyspe1xuICAgICAgY3VyclBvcy54ID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIGNhbnZhcy53aWR0aCkpOyAvL1JhbmRvbSBudW1iZXIgZnJvbSB6ZXJvIHRvIGNhbnZhcy53aWR0aFxuICAgICAgY3VyclBvcy55ID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIGNhbnZhcy5oZWlnaHQpKTtcblxuICAgICAgdmFyIHJlc291cmNlID0gbmV3IFJlc291cmNlKHJlc291cmNlVmFsdWUpO1xuICAgICAgcmVzb3VyY2Uuc2V0UG9zKGN1cnJQb3MpO1xuICAgICAgcmVzb3VyY2UuYWRkKHN0YWdlKTtcbiAgICAgIHJlc291cmNlcy5wdXNoKHJlc291cmNlKTtcbiAgIH1cblxuICAgcmV0dXJuIHJlc291cmNlcztcbn1cblxuLy9DcmVhdGUgYW4gb2JqZWN0IHRvIHJlcHJlc2VudCB0aGUgYmFja2dyb3VuZCBhbmQgcmVnaXN0ZXIgcGF0aGZpbmRpbmcgZXZlbnRzXG5mdW5jdGlvbiBpbml0QmFja2dyb3VuZChzdGFnZSwgY2FudmFzKXtcbiAgIHZhciBjb2xvciA9IFwiYmxhY2tcIjtcbiAgIHZhciB3aWR0aCA9IGNhbnZhcy53aWR0aDtcbiAgIHZhciBoZWlnaHQgPSBjYW52YXMuaGVpZ2h0O1xuXG4gICBcbiAgIFxuICAgdmFyIGJhY2tncm91bmQgPSBuZXcgUmVjdGFuZ2xlKCB7eDogd2lkdGgvMiwgeTogaGVpZ2h0LzJ9LCBjb2xvciwgd2lkdGgsIGhlaWdodCk7XG4gICBiYWNrZ3JvdW5kLmFkZChzdGFnZSk7XG5cbiAgIHJldHVybiBiYWNrZ3JvdW5kO1xuXG59XG5cbi8vQ3JlYXRlIGRlc2lyZWQgSm95c3RpY2tzIGZvciB0aGUgdXNlclxuZnVuY3Rpb24gaW5pdEpveXN0aWNrcyhzdGFnZSwgcGxheWVyKXtcbiAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5DYW52YXNcIik7XG4gICAvL3ZhciByaWdodCAgPSBuZXcgSm95c3RpY2soe3g6Y2FudmFzLndpZHRoIC0gY2FudmFzLndpZHRoLzYsIHk6IGNhbnZhcy5oZWlnaHQvMn0pO1xuICAgdmFyIGxlZnQgPSBuZXcgSm95c3RpY2soe3g6IGNhbnZhcy53aWR0aC82LCB5OiBjYW52YXMuaGVpZ2h0LzJ9LCBwbGF5ZXIpO1xuXG4gICAvL0FkZCB0byBjYW52YXNcbiAgIC8vcmlnaHQuYWRkKHN0YWdlKTtcbiAgIGxlZnQuYWRkKHN0YWdlKTtcblxuICAgcmV0dXJuIHtsZWZ0OiBsZWZ0fTtcbn1cblxuLy9DcmVhdGVzIGEgcGxheWVyIGFuZCBhc3NvY2lhdGVzIGl0IHRvIGEgam95c3RpY2tcbmZ1bmN0aW9uIGluaXRQbGF5ZXIoc3RhZ2Upe1xuXG4gICAvL0luaXQgbG9jYWwgcGxheWVyXG4gICBwbGF5ZXIgPSBuZXcgUGxheWVyKHt4OiBzdGFnZS5jYW52YXMud2lkdGgvMiwgeTogc3RhZ2UuY2FudmFzLmhlaWdodC8yfSk7XG4gICBwbGF5ZXIuYWRkKHN0YWdlKTtcblxuXG4gICByZXR1cm4gcGxheWVyO1xufVxuXG4vL0NyZWF0ZXMgYSBidXR0b24gdGhhdCBhbGxvd3MgdXNlcnMgdG8gb3B0IGluIG9yIG91dCBvZiB0ZWFtc1xuZnVuY3Rpb24gaW5pdFRlYW1CdXR0b24oc3RhZ2UsIHBsYXllcil7XG5cbiAgIC8vUHV0IGJ1dHRvbiBhdCByaWdodCBvZiBqb3lzdGlja1xuICAgdmFyIGJ1dHRvblBvcyA9IHt4OiBzdGFnZS5jYW52YXMud2lkdGggLSBzdGFnZS5jYW52YXMud2lkdGgvNiwgeTogc3RhZ2UuY2FudmFzLmhlaWdodC8yfTtcbiAgIHZhciB0ZWFtQnV0dG9uID0gbmV3IFRlYW1CdXR0b24oYnV0dG9uUG9zLCBcImdyZXlcIiwgcGxheWVyKTtcbiAgIHRlYW1CdXR0b24uYWRkKHN0YWdlKTtcblxuICAgcmV0dXJuIHRlYW1CdXR0b247XG59XG5cbi8vSW5pdGlhbGl6ZSBBKiBwYXRoZmluZGluZyB3aXRoIGVhc3lzdGFyIGxpYmFyeVxuZnVuY3Rpb24gaW5pdFBhdGhmaW5kaW5nKHdvcmxkLCBwbGF5ZXIsIGJhY2tncm91bmQpe1xuXG4gICB2YXIgZWFzeXN0YXIgPSBuZXcgRWFzeVN0YXIuanMoKTtcbiAgIGVhc3lzdGFyLnNldEdyaWQod29ybGQpO1xuICAgZWFzeXN0YXIuc2V0QWNjZXB0YWJsZVRpbGVzKFswXSk7IC8vdGlsZXMgd2UncmUgYWJsZSB0byB3YWxrIG9uXG4gICBlYXN5c3Rhci5lbmFibGVEaWFnb25hbHMoKTsgXG4gICBcbiAgIC8vR2VuZXJhdGUgcGF0aCB3aGVuIGJhY2tncm91bmQgaXMgY2xpY2tlZFxuICAgYmFja2dyb3VuZC5nZXRFYXNlbFNoYXBlKCkub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcbiAgICAgICAgIHZhciBwb3MgPSBwbGF5ZXIuZ2V0UG9zKCk7XG4gICAgICAgICBcbiAgICAgICAgIGVhc3lzdGFyLmZpbmRQYXRoKE1hdGguZmxvb3IocG9zLngpLCBNYXRoLmZsb29yKHBvcy55KSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGUuc3RhZ2VYKSwgTWF0aC5mbG9vcihlLnN0YWdlWSksIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24ocGF0aCl7IFxuICAgICAgICAgICAgICBpZiggcGF0aCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQYXRoIG5vdCBmb3VuZFwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgcGxheWVyLnBhdGggPSBwYXRoO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICB9KTtcbiAgIH0pO1xuICAgcmV0dXJuIGVhc3lzdGFyO1xufVxuXG5mdW5jdGlvbiBzZXRFdmVudEhhbmRsZXJzKCkge1xuICAgc29ja2V0Lm9uKFwiY29ubmVjdFwiLCBvblNvY2tldENvbm5lY3RlZCk7XG4gICBzb2NrZXQub24oXCJkaXNjb25uZWN0XCIsIG9uU29ja2V0RGlzY29ubmVjdCk7XG4gICBzb2NrZXQub24oXCJuZXcgcGxheWVyXCIsIG9uTmV3UGxheWVyKTtcbiAgIHNvY2tldC5vbihcIm1vdmUgcGxheWVyXCIsIG9uTW92ZVBsYXllcik7XG4gICBzb2NrZXQub24oXCJyZW1vdmUgcGxheWVyXCIsIG9uUmVtb3ZlUGxheWVyKTtcbn07XG5cbmZ1bmN0aW9uIG9uU29ja2V0Q29ubmVjdGVkKCkge1xuICAgY29uc29sZS5sb2coXCJDbGllbnQgOjogQ2xpZW50IGNvbm5lY3RlZCBvbiBwb3J0IDogXCIrZ2FtZXBvcnQpO1xuXG4gICBjb25zb2xlLmxvZyhcImVtbWl0dGluZyBMT0NBVElPTlwiKTtcbiAgIGNvbnNvbGUubG9nKHN0YWdlLmNhbnZhcy53aWR0aC8yKTtcblxuICAgc29ja2V0LmVtaXQoXCJuZXcgcGxheWVyXCIsIHsgICBpZDogcGxheWVyLmlkLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBzdGFnZS5jYW52YXMud2lkdGgvMiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogc3RhZ2UuY2FudmFzLmhlaWdodC8yIH0pO1xufVxuXG5mdW5jdGlvbiBvblNvY2tldERpc2Nvbm5lY3QoKSB7XG4gICBjb25zb2xlLmxvZyhcIkNsaWVudCA6OiBDbGllbnQgZGlzY29ubmVjdGVkIGZyb20gcG9ydCA6IFwiK2dhbWVwb3J0KTtcbn1cblxuZnVuY3Rpb24gb25OZXdQbGF5ZXIoZGF0YSkge1xuICAgY29uc29sZS5sb2coXCJDbGllbnQgOjogTmV3IHBsYXllciBcIitkYXRhLmlkK1wiY29ubmVjdGVkIG9uIHBvcnQgOiBcIitnYW1lcG9ydCk7XG5cbiAgIFxuICAgdmFyIG5ld1BsYXllciA9IG5ldyBQbGF5ZXIoe3g6IGRhdGEueCwgeTogZGF0YS55fSk7IC8vVE9ETyByZXdyaXRlIHBsYXllciBcblxuICAgY29uc29sZS5sb2coXCJORVcgUExBWUVSIExPQ0FUSU9OXCIpO1xuICAgY29uc29sZS5sb2cobmV3UGxheWVyLmdldFBvcygpKTtcbiAgIG5ld1BsYXllci5pZCA9IGRhdGEuaWQ7XG4gICByZW1vdGVQbGF5ZXJzLnB1c2gobmV3UGxheWVyKTtcblxuICAgLy9zdGFnZSA9IGN1cnJlbnQgc3RhZ2UgZ2xvYmFsXG4gICBuZXdQbGF5ZXIuYWRkKHN0YWdlKTtcbn1cblxuZnVuY3Rpb24gb25Nb3ZlUGxheWVyKGRhdGEpIHtcbiAgIHZhciBtb3ZlUGxheWVyID0gcGxheWVyQnlJZChkYXRhLmlkKTtcblxuICAgaWYoIW1vdmVQbGF5ZXIpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiQ2xpZW50IDo6IFBsYXllciBub3QgZm91bmQ6IFwiICsgZGF0YS5pZCk7XG4gICAgICByZXR1cm47XG4gICB9XG5cbiAgIG1vdmVQbGF5ZXIuc2V0UG9zKHt4OiBkYXRhLngsIHk6IGRhdGEueX0pO1xuXG59XG5cbmZ1bmN0aW9uIG9uUmVtb3ZlUGxheWVyKGRhdGEpIHtcbiAgIHZhciByZW1vdmVQbGF5ZXIgPSBwbGF5ZXJCeUlkKGRhdGEuaWQpO1xuXG4gICBpZighcmVtb3ZlUGxheWVyKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkNsaWVudCA6OiBQbGF5ZXIgbm90IGZvdW5kOiBcIitkYXRhLmlkKTtcbiAgICAgIHJldHVybjtcbiAgIH07XG5cbiAgIC8vUmVtb3ZlIHRoZSBwbGF5ZXIgZnJvbSByZW1vdGVwbGF5ZXJzIGFycmF5XG4gICByZW1vdGVQbGF5ZXJzLnNwbGljZShyZW1vdGVQbGF5ZXJzLmluZGV4T2YocmVtb3ZlUGxheWVyKSwxKTtcbn1cblxuLy8gTXVsdGlwbGF5ZXIgSGVscGVyIEZ1bmN0aW9ucyBcbmZ1bmN0aW9uIHBsYXllckJ5SWQoaWQpe1xuICAgdmFyIGkgO1xuICAgZm9yKCBpID0gMDsgaSA8IHJlbW90ZVBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmKHJlbW90ZVBsYXllcnNbaV0uaWQgPT0gaWQpXG4gICAgICAgICAgICByZXR1cm4gcmVtb3RlUGxheWVyc1tpXTtcbiAgIH07XG5cbiAgIHJldHVybiBmYWxzZTtcbn1cblxuXG4iXX0=
=======
},{"./data.json":1}]},{},[2]);
>>>>>>> 17dc8ba78ca466836f66aa20989aa32920076c56
