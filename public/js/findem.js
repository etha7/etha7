(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var data = require('./data.json');

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
//Utility functions:------------------------------------------------

//Utility function for comparing arrays for equality
Array.prototype.equals = function( array ) {
  return this.length == array.length && 
           this.every( function(this_i,i) { return this_i == array[i] } )  
}

//Utility functions:^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


//Class definitions:------------------------------------------------

//Base class for all primitive objects that get drawn
function easelObject(pos, color){

   this.easelShape = new createjs.Shape();
   this.getEaselShape = function(){ return this.easelShape; };

   this.test = function(pos) { this.getEaselShape().x = pos.x; this.getEaselShape().y = pos.y;};
   this.test({x: 10, y: 11});
   console.log(this.getEaselShape().x);
   console.log(this.getEaselShape().y);

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

//A class for representing circles
function Circle(pos, color, radius ){
   //Call constructor of superclass
   easelObject.call(this, pos, color);  

   //Set the new radius
   this.radius = radius;

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
   this.value = value;
}

function DiseaseZone(playerPos){
   Circle.call(this, playerPos, "grey", 30);
   this.invertIsDotted();
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





function Player(joystick){
   Circle.call( this, {x: canvas.width/2, y: canvas.height/2}, "red", 20);

   this.diseaseZone = new DiseaseZone(this.getPos());
   this.joystick = joystick;
   this.resources = 0;
   this.camera = {};
   this.path = [];

   this.getCamera = function(){ return this.camera;};
   this.setCamera = function(camera){ this.camera = camera; };
   
   //Moves the player along a path determined by A* algorithm
   this.goPath = function(){
      
      if(this.path.equals([]) === false)
      {
         this.setPos({x: this.path[0].x, y: this.path[0].y});
         this.path.splice(0,1); //Remove element 0;
      }
   }

   this.getResources = function(){ return this.resources;};
   this.setResources = function(newResources){ this.resources = newResources};

   //Override inherited setPos
   var parentSetPos = this.setPos;
   this.setPos = function(pos){ 
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
   
   this.getPos = function() { return this.stick.getPos()};

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

   this.add = function(stage){
      stage.addChild(this.base.getEaselShape());
      stage.addChild(this.stick.getEaselShape());
      stage.update();
   }

}


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
        //data.choices.push({"choice": "lool"});
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
   resourceText.x = 0;
   resourceText.y = canvas.height/12; //TODO more logically position Resources text
   resourceText.textBaseline = "alphabet"; //Not sure what this setting does
   stage.addChild(resourceText);
   return resourceText;
}

//Creates and displayes the City Selection: x text
function initCitySelectionText(stage, canvas){
   resourceText = new createjs.Text("City Selection: Safe", "20px Arial", "#00FFFF");
   resourceText.x = 0;
   resourceText.y = canvas.height/12; //TODO more logically position Resources text
   resourceText.textBaseline = "alphabet"; //Not sure what this setting does
   stage.addChild(resourceText);
   return resourceText;
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

   //TODO convert the background to a working Rectangle
   //var background = new Rectangle({x: canvas.width/2, y: canvas.height/2}, color, width, height);
   var background = new Circle( {x: width/2, y: width/2}, color, 2000);
   background.add(stage);

   return background;

}

//Create desired Joysticks for the user
function initJoysticks(stage){
   var canvas = document.getElementById("mainCanvas");
   //var right  = new Joystick({x:canvas.width - canvas.width/6, y: canvas.height/2});
   var left = new Joystick({x: canvas.width/6, y: canvas.height/2});

   //Add to canvas
   //right.add(stage);
   left.add(stage);

   return {left: left};
}

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
                  player.path = path;
              }
         });
   });
   return easystar;
}

},{"./data.json":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInB1YmxpYy9qcy9kYXRhLmpzb24iLCJwdWJsaWMvanMvbWFwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzPXtcclxuICBcInJpc2tHcmFwaFwiOiBcclxuICAgIHtcclxuICAgICAgXCJyaXNrVGl0bGVcIjogXCJSaXNrIHZzIFJld2FyZFwiLFxyXG4gICAgICBcInJpc2tEZXNjcmlwdGlvblwiOiBcIlRoaXMgaXMgbWVhc3VyZWQgYnkgY29tcGFyaW5nIHRoZSBwZXJjZW50IGNoYW5jZSBvZiBnZXR0aW5nIHNpY2sgd2l0aCB0aGUgcmVzb3VyY2VzIGdhdGhlcmVkLlwiXHJcbiAgICAgICAgXHJcbiAgICB9LFxyXG4gIFwidHJ1c3RHcmFwaFwiOiBcclxuICAgIHtcclxuICAgICAgXCJ0cnVzdFRpdGxlXCI6IFwiVHJ1c3RcIixcclxuICAgICAgXCJ0cnVzdERlc2NyaXB0aW9uXCI6IFwiVGhpcyBpcyBtZWFzdXJlZCBieSBjb21wYXJpbmcgdGhlIHBlcmNlbnQgY2hhbmNlIG9mIGdldHRpbmcgc2ljayB3aXRoIHBlcmNlbnQgd2hvIHRlYW0gdXAuXCJcclxuICAgICAgICBcclxuICAgIH0sXHJcbiAgXCJtb3JhbGl0eUdyYXBoXCI6IFxyXG4gICAge1xyXG4gICAgICBcIm1vcmFsaXR5VGl0bGVcIjogXCJNb3JhbGl0eVwiLFxyXG4gICAgICBcIm1vcmFsaXR5RGVzY3JpcHRpb25cIjogXCJUaGlzIGlzIG1lYXN1cmVkIGJ5IGNvbXBhcmluZyB0aGUgcGVyY2VudCBzaWNrIGFuZCBvbiBhIHRlYW0gd2l0aCBwZXJjZW50IHNpY2sgYW5kIG5vdCBvbiBhIHRlYW0uXCIgXHJcbiAgICB9LFxyXG5cdFwiY2hvaWNlc1wiOiBbXHJcblx0XHR7XHRcclxuICAgICAgICAgICAgXCJjaG9pY2VcIjogXCJSaXNrXCJcclxuXHRcdH0sXHJcblx0XHR7XHRcclxuICAgICAgICAgICAgXCJjaG9pY2VcIjogXCJTYWZlXCJcclxuXHRcdH0sXHJcblx0XHR7XHJcbiAgICAgICAgICAgIFwiY2hvaWNlXCI6IFwiUmlza1wiXHJcblx0XHR9LFxyXG5cdFx0e1xyXG4gICAgICAgICAgICBcImNob2ljZVwiOiBcIlJpc2tcIlxyXG5cdFx0fVxyXG5cdF1cclxufVxyXG5cclxuIiwidmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbkNhbnZhc1wiKTtcclxudmFyIGhvbWVidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhvbWUtYnV0dG9uXCIpO1xyXG52YXIgY2FudmFzTGVmdCA9IGNhbnZhcy5vZmZzZXRMZWZ0LFxyXG4gICAgY2FudmFzVG9wID0gY2FudmFzLm9mZnNldFRvcDtcclxudmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG52YXIgY2xpY2thYmxlRWxlbWVudHMgPSBbXTtcclxuXHJcbnZhciBkYXRhID0gcmVxdWlyZSgnLi9kYXRhLmpzb24nKTtcclxuXHJcbmNhbnZhcy53aWR0aCAgPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDsgXHJcblxyXG5tYXBNYWluKCk7XHJcblxyXG5mdW5jdGlvbiBtYXBNYWluKCl7XHJcbiAgICAgICAvL0luaXRpYWxpemUgdGhlIGdhbWUgd29ybGRcclxuICAgdmFyIHN0YWdlICAgICAgICA9IG5ldyBjcmVhdGVqcy5TdGFnZShcIm1haW5DYW52YXNcIilcclxuICAgXHJcbiAgICAgLy9FbmFibGUgdG91Y2ggYmFzZWQgaW50ZXJmYWNlIGZvciBtb2JpbGUgZGV2aWNlc1xyXG4gICBjcmVhdGVqcy5Ub3VjaC5lbmFibGUoc3RhZ2UpO1xyXG5cclxuICAgLy9SZXNpemUgY2FudmFzIG9uIHdpbmRvdyByZXNpemUgICBcclxuICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgIHZhciB4ID0gZXZlbnQucGFnZVggLSBjYW52YXNMZWZ0LFxyXG4gICAgICAgIHkgPSBldmVudC5wYWdlWSAtIGNhbnZhc1RvcDtcclxuICAgICAvL0NvbGxpc2lvbiBkZXRlY3Rpb24gYmV0d2VlbiBjbGlja2VkIG9mZnNldCBhbmQgZWxlbWVudC5cclxuICAgIGNsaWNrYWJsZUVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgICAgIGlmICh5ID4gZWxlbWVudC50b3AgJiYgeSA8IGVsZW1lbnQudG9wICsgZWxlbWVudC5oZWlnaHQgXHJcbiAgICAgICAgICAgICYmIHggPiBlbGVtZW50LmxlZnQgJiYgeCA8IGVsZW1lbnQubGVmdCArIGVsZW1lbnQud2lkdGgpIHtcclxuICAgICAgICAgICAgLy9hbGVydCgnY2xpY2tlZCBhbiBlbGVtZW50Jyk7XHJcbiAgICAgICAgICAgIC8vZWxlbWVudC5jbGlja2VkKHN0YWdlKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSwgZmFsc2UpXHJcblxyXG5cclxuICAgLy9SZXNpemUgY2FudmFzIG9uIHdpbmRvdyByZXNpemUgICBcclxuICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgZnVuY3Rpb24oKXtcclxuICAgICAgc3RhZ2UuY2FudmFzLndpZHRoICA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgICBzdGFnZS5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICB9LCBmYWxzZSk7XHJcbiAgIFxyXG4gICAvL01haW4gZ2FtZSBsb29wXHJcbiAgIHZhciBGUFMgPSA1MDtcclxuICAgY3JlYXRlanMuVGlja2VyLnNldEZQUyhGUFMpO1xyXG4gICBjcmVhdGVqcy5UaWNrZXIuYWRkRXZlbnRMaXN0ZW5lcihcInRpY2tcIiwgZnVuY3Rpb24oKXtcclxuICAgICAgLy9Db21taXQgYWxsIHVwZGF0ZXMgdG8gYWN0dWFsIHN0YWdlL2NhbnZhc1xyXG4gICAgICBzdGFnZS51cGRhdGUoKTtcclxuXHJcbiAgIH0pO1xyXG4gICBcclxuICAgdmFyIHdvcmxkICAgICAgICA9IGluaXRXb3JsZCgpO1xyXG4gICB2YXIgYmFja2dyb3VuZCAgID0gaW5pdEJhY2tncm91bmQoc3RhZ2UsIGNhbnZhcyk7XHJcbiAgIFxyXG4gICAvL2Z1bmN0aW9uIGluaXRUZXh0KHN0YWdlLCBjYW52YXMsIHRleHQsIGNvbG9yLCB4cG9zLCB5cG9zKXtcclxuICAgXHJcbiAgIHZhciBoZWxwVGV4dDEgPSBpbml0VGV4dChzdGFnZSwgY2FudmFzLCBcIlRoZSBsb2NhdGlvbiB5b3UgaGF2ZSBzZWxlY3RlZCBpcyByZXByZXNlbnRlZFwiLCBcImJsdWVcIiwgY2FudmFzLndpZHRoLzMsIGNhbnZhcy5oZWlnaHQvMTApO1xyXG4gICB2YXIgaGVscFRleHQyID0gaW5pdFRleHQoc3RhZ2UsIGNhbnZhcywgXCJhcyBhIGJsdWUgZG90LCBjbGljayBlbHNld2hlcmUgdG8gbW92ZSBzZWxlY3RlZCBwb3NpdGlvblwiLCBcImJsdWVcIiwgY2FudmFzLndpZHRoLzMsIGNhbnZhcy5oZWlnaHQvOCk7XHJcbiAgIHZhciBjaXR5U2VsZWN0aW9uVGV4dCA9IGluaXRDaXR5U2VsZWN0aW9uVGV4dChzdGFnZSxjYW52YXMpO1xyXG4gICBjaXR5U2VsZWN0aW9uVGV4dC5jb2xvciA9IFwiZ3JlZW5cIjtcclxuICAgdmFyIHNhZmVDaXR5ID0gbmV3IENpdHkoe3g6IGNhbnZhcy53aWR0aC82LCB5OiBjYW52YXMuaGVpZ2h0LzJ9LCBcImdyZWVuXCIsIHN0YWdlLCBcIlNhZmVcIiwgY2l0eVNlbGVjdGlvblRleHQpO1xyXG4gICBzYWZlQ2l0eS5hZGQoKTtcclxuICAgY2xpY2thYmxlRWxlbWVudHMucHVzaChzYWZlQ2l0eSk7XHJcbiAgIHZhciByaXNrQ2l0eSA9IG5ldyBDaXR5KHt4OiAoNSAqIGNhbnZhcy53aWR0aCkvNiwgeTogY2FudmFzLmhlaWdodC8yfSwgXCJyZWRcIiwgc3RhZ2UsIFwiUmlza3lcIiwgY2l0eVNlbGVjdGlvblRleHQpO1xyXG4gICByaXNrQ2l0eS5hZGQoKTtcclxuICAgY2xpY2thYmxlRWxlbWVudHMucHVzaChyaXNrQ2l0eSk7XHJcbiAgIFxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbWFpbigpe1xyXG4gICAvL0luaXRpYWxpemUgdGhlIGdhbWUgd29ybGRcclxuICAgdmFyIHN0YWdlICAgICAgICA9IG5ldyBjcmVhdGVqcy5TdGFnZShcIm1haW5DYW52YXNcIik7XHJcbiAgIHZhciB3b3JsZCAgICAgICAgPSBpbml0V29ybGQoKTtcclxuICAgdmFyIGJhY2tncm91bmQgICA9IGluaXRCYWNrZ3JvdW5kKHN0YWdlLCBjYW52YXMpO1xyXG4gICBcclxuICAgLy9Jbml0YWxpemUgdGhlIGdhbWUgY29udHJvbHMgYW5kIHBsYXllclxyXG4gICB2YXIgbGVmdCAgICAgICAgID0gaW5pdEpveXN0aWNrcyhzdGFnZSkubGVmdDtcclxuICAgdmFyIHBsYXllciAgICAgICA9IGluaXRQbGF5ZXIoc3RhZ2UsIGxlZnQpO1xyXG4gICAgICAgcGxheWVyLnNldENhbWVyYShuZXcgQ2FtZXJhKHBsYXllci5nZXRQb3MoKSwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KSk7XHJcblxyXG4gICAvL0luaXRpYWxpemUgYXJyYXkgb2YgcmVzb3VyY2Ugb2JqZWN0cyBhbmQgcmVzb3VyY2UgdGV4dFxyXG4gICB2YXIgcmVzb3VyY2VzICAgID0gaW5pdFJlc291cmNlcyhzdGFnZSwgY2FudmFzKTtcclxuICAgdmFyIHJlc291cmNlVGV4dCA9IGluaXRSZXNvdXJjZVRleHQoc3RhZ2UsY2FudmFzLCBwbGF5ZXIpO1xyXG5cclxuICAgLy9Jbml0aWFsaXplIFBhdGhmaW5kaW5nXHJcbiAgIHZhciBlYXN5c3RhciA9IGluaXRQYXRoZmluZGluZyh3b3JsZCwgcGxheWVyLCBiYWNrZ3JvdW5kKTsgXHJcbiAgIFxyXG4gICAvL0VuYWJsZSB0b3VjaCBiYXNlZCBpbnRlcmZhY2UgZm9yIG1vYmlsZSBkZXZpY2VzXHJcbiAgIGNyZWF0ZWpzLlRvdWNoLmVuYWJsZShzdGFnZSk7XHJcblxyXG4gICAvL1Jlc2l6ZSBjYW52YXMgb24gd2luZG93IHJlc2l6ZSAgIFxyXG4gICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBmdW5jdGlvbigpe1xyXG4gICAgICBzdGFnZS5jYW52YXMud2lkdGggID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICAgIHN0YWdlLmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgIH0sIGZhbHNlKTtcclxuICAgXHJcblxyXG4gICAvL01haW4gZ2FtZSBsb29wXHJcbiAgIHZhciBGUFMgPSA1MDtcclxuICAgY3JlYXRlanMuVGlja2VyLnNldEZQUyhGUFMpO1xyXG4gICBjcmVhdGVqcy5UaWNrZXIuYWRkRXZlbnRMaXN0ZW5lcihcInRpY2tcIiwgZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgIC8vRG8gcGF0aGZpbmRpbmcgY2FsY3VsYXRpb25cclxuICAgICAgZWFzeXN0YXIuY2FsY3VsYXRlKCk7XHJcblxyXG4gICAgICAvL01vdmUgcGxheWVyIGFjY29yZGluZyB0byBqb3lzdGlja1xyXG4gICAgICBwbGF5ZXIubW92ZSgpO1xyXG5cclxuICAgICAgLy9DaGVjayBpZiBwbGF5ZXIgaXMgY29sbGlkaW5nIHdpdGggcmVzb3VyY2VzXHJcbiAgICAgIHBsYXllci5waWNrdXAoc3RhZ2UsIHJlc291cmNlcyk7XHJcblxyXG4gICAgICAvL01vdmUgYWxvbmcgY2FsY3VsYXRlZCBwYXRoZmluZGluZyBwYXRoXHJcbiAgICAgIHBsYXllci5nb1BhdGgoKTtcclxuXHJcbiAgICAgIC8vVXBkYXRlIHJlc291cmNlIHRleHRcclxuICAgICAgcmVzb3VyY2VUZXh0LnRleHQgPSBcIlJlc291cmNlczogXCIrcGxheWVyLmdldFJlc291cmNlcygpO1xyXG5cclxuICAgICAgLy9Db21taXQgYWxsIHVwZGF0ZXMgdG8gYWN0dWFsIHN0YWdlL2NhbnZhc1xyXG4gICAgICBzdGFnZS51cGRhdGUoKTtcclxuXHJcbiAgIH0pO1xyXG5cclxufVxyXG4vL1V0aWxpdHkgZnVuY3Rpb25zOi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuLy9VdGlsaXR5IGZ1bmN0aW9uIGZvciBjb21wYXJpbmcgYXJyYXlzIGZvciBlcXVhbGl0eVxyXG5BcnJheS5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24oIGFycmF5ICkge1xyXG4gIHJldHVybiB0aGlzLmxlbmd0aCA9PSBhcnJheS5sZW5ndGggJiYgXHJcbiAgICAgICAgICAgdGhpcy5ldmVyeSggZnVuY3Rpb24odGhpc19pLGkpIHsgcmV0dXJuIHRoaXNfaSA9PSBhcnJheVtpXSB9ICkgIFxyXG59XHJcblxyXG4vL1V0aWxpdHkgZnVuY3Rpb25zOl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXlxyXG5cclxuXHJcbi8vQ2xhc3MgZGVmaW5pdGlvbnM6LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4vL0Jhc2UgY2xhc3MgZm9yIGFsbCBwcmltaXRpdmUgb2JqZWN0cyB0aGF0IGdldCBkcmF3blxyXG5mdW5jdGlvbiBlYXNlbE9iamVjdChwb3MsIGNvbG9yKXtcclxuXHJcbiAgIHRoaXMuZWFzZWxTaGFwZSA9IG5ldyBjcmVhdGVqcy5TaGFwZSgpO1xyXG4gICB0aGlzLmdldEVhc2VsU2hhcGUgPSBmdW5jdGlvbigpeyByZXR1cm4gdGhpcy5lYXNlbFNoYXBlOyB9O1xyXG5cclxuICAgdGhpcy50ZXN0ID0gZnVuY3Rpb24ocG9zKSB7IHRoaXMuZ2V0RWFzZWxTaGFwZSgpLnggPSBwb3MueDsgdGhpcy5nZXRFYXNlbFNoYXBlKCkueSA9IHBvcy55O307XHJcbiAgIHRoaXMudGVzdCh7eDogMTAsIHk6IDExfSk7XHJcbiAgIGNvbnNvbGUubG9nKHRoaXMuZ2V0RWFzZWxTaGFwZSgpLngpO1xyXG4gICBjb25zb2xlLmxvZyh0aGlzLmdldEVhc2VsU2hhcGUoKS55KTtcclxuXHJcbiAgIC8vU2V0IGluaXRpYWwgcG9zaXRpb25cclxuICAgdGhpcy5lYXNlbFNoYXBlLnggPSBwb3MueDtcclxuICAgdGhpcy5lYXNlbFNoYXBlLnkgPSBwb3MueTtcclxuXHJcbiAgIC8vUG9zaXRpb24gc2V0dGVycyBhbmQgZ2V0dGVyc1xyXG4gICB0aGlzLmdldFBvcyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4ge3g6IHRoaXMuZ2V0RWFzZWxTaGFwZSgpLngsIHk6IHRoaXMuZ2V0RWFzZWxTaGFwZSgpLnl9OyB9O1xyXG4gICB0aGlzLnNldFBvcyA9IGZ1bmN0aW9uKHBvcykgeyB0aGlzLmdldEVhc2VsU2hhcGUoKS54ID0gcG9zLng7IHRoaXMuZ2V0RWFzZWxTaGFwZSgpLnkgPSBwb3MueTt9O1xyXG5cclxuICAgLy9UaGUgb2JqZWN0J3MgY29sb3JcclxuICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG5cclxuICAgLy9BZGRzIHRoZSBjdXJyZW50IG9iamVjdCB0byB0aGUgc3RhZ2VcclxuICAgdGhpcy5hZGQgPSBmdW5jdGlvbihzdGFnZSkge1xyXG4gICAgICBzdGFnZS5hZGRDaGlsZCh0aGlzLmdldEVhc2VsU2hhcGUoKSk7XHJcbiAgICAgIHN0YWdlLnVwZGF0ZSgpO1xyXG4gICB9O1xyXG5cclxuICAgLy9SZW1vdmVzIHRoZSBjdXJyZW50IG9iamVjdCBmcm9tIHRoZSBzdGFnZVxyXG4gICB0aGlzLnJlbW92ZSA9IGZ1bmN0aW9uKHN0YWdlKSB7XHJcbiAgICAgIHN0YWdlLnJlbW92ZUNoaWxkKHRoaXMuZ2V0RWFzZWxTaGFwZSgpKTtcclxuICAgfTtcclxufVxyXG5mdW5jdGlvbiBSZWN0YW5nbGUocG9zLCBjb2xvciwgd2lkdGgsIGhlaWdodCl7XHJcbiAgIGVhc2VsT2JqZWN0LmNhbGwodGhpcywgcG9zLCBjb2xvcik7XHJcbiAgIFxyXG4gICB0aGlzLndpZHRoICA9IHdpZHRoO1xyXG4gICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgdGhpcy50b3AgPSBwb3MueTtcclxuICAgdGhpcy5sZWZ0ID0gcG9zLng7XHJcbiAgIFxyXG4gICAvL0RyYXcgdGhlIHJlY3RhbmdsZVxyXG4gICB0aGlzLmRyYXcgPSBmdW5jdGlvbigpe1xyXG4gICAgICB0aGlzLnNoYXBlLmdyYXBoaWNzLmJlZ2luRmlsbCh0aGlzLmNvbG9yKS5kcmF3UmVjdCh0aGlzLmxlZnQsdGhpcy50b3AsdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICB9XHJcbiAgIHRoaXMuZHJhdygpO1xyXG5cclxufVxyXG5cclxuLy9BIGNsYXNzIGZvciByZXByZXNlbnRpbmcgY2lyY2xlc1xyXG5mdW5jdGlvbiBDaXJjbGUocG9zLCBjb2xvciwgcmFkaXVzICl7XHJcbiAgIC8vQ2FsbCBjb25zdHJ1Y3RvciBvZiBzdXBlcmNsYXNzXHJcbiAgIGVhc2VsT2JqZWN0LmNhbGwodGhpcywgcG9zLCBjb2xvcik7ICBcclxuXHJcbiAgIC8vU2V0IHRoZSBuZXcgcmFkaXVzXHJcbiAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xyXG5cclxuICAgLy9BbGwgb2YgdGhlc2UgZWxlbWVudHMgYXJlIGN1cnJlbnRseSBiZWluZyB1c2VkIHRvIGNoZWNrIHdoZXRoZXIgc29tZXRoaW5nIGhhcyBiZWVuIGNsaWNrZWQgb24gb3Igbm90LlxyXG4gICB0aGlzLnRvcCA9IHBvcy55IC0gcmFkaXVzO1xyXG4gICB0aGlzLmxlZnQgPSBwb3MueCAtIHJhZGl1cztcclxuICAgdGhpcy5oZWlnaHQgPSAyKnJhZGl1cztcclxuICAgdGhpcy53aWR0aCA9IDIqcmFkaXVzO1xyXG4gICBcclxuICAgLy9EZXRlcm1pbmVzIGlmIGNpcmNsZSBpcyBkb3R0ZWQgb3V0bGluZVxyXG4gICB0aGlzLmlzRG90dGVkID0gZmFsc2U7XHJcbiAgIHRoaXMuaW52ZXJ0SXNEb3R0ZWQgPSBmdW5jdGlvbigpeyB0aGlzLmlzRG90dGVkID0gIXRoaXMuaXNEb3R0ZWQ7fVxyXG5cclxuICAgLy9GdW5jdGlvbjogZHJhdyBhIGNpcmNsZVxyXG4gICB0aGlzLmRyYXcgPSBmdW5jdGlvbigpe1xyXG4gICAgICB0aGlzLmVhc2VsU2hhcGUuZ3JhcGhpY3MuYmVnaW5GaWxsKHRoaXMuY29sb3IpLmRyYXdDaXJjbGUoMCwwLHRoaXMucmFkaXVzKTtcclxuICAgfVxyXG4gICAvL0Z1bmN0aW9uOiBkcmF3IGEgZG90dGVkIGNpcmNsZVxyXG4gICB0aGlzLmRyYXdEb3R0ZWQgPSBmdW5jdGlvbigpe1xyXG4gICAgICB0aGlzLmVhc2VsU2hhcGUuZ3JhcGhpY3Muc2V0U3Ryb2tlRGFzaChbMiwyXSk7XHJcbiAgICAgIHRoaXMuZWFzZWxTaGFwZS5zZXRTdHJva2VTdHlsZSgyKS5iZWdpbnNTdHJva2UoXCJncmV5XCIpLmRyYXdDaXJjbGUoMCwwLHRoaXMucmFkaXVzKTtcclxuICAgfVxyXG4gICAgXHJcbiAgIC8vQWN0dWFsbHkgZHJhdyB0aGUgY2lyY2xlXHJcbiAgIGlmKHRoaXMuaXNEb3R0ZWQgPT09IHRydWUpXHJcbiAgICAgIHRoaXMuZHJhd0RvdHRlZCgpO1xyXG4gICBlbHNlXHJcbiAgICAgIHRoaXMuZHJhdygpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBSZXNvdXJjZSh2YWx1ZSl7XHJcbiAgIENpcmNsZS5jYWxsKHRoaXMsIHt4OiAwLCB5OiAwfSwgXCJibHVlXCIsIDEwKTtcclxuICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBEaXNlYXNlWm9uZShwbGF5ZXJQb3Mpe1xyXG4gICBDaXJjbGUuY2FsbCh0aGlzLCBwbGF5ZXJQb3MsIFwiZ3JleVwiLCAzMCk7XHJcbiAgIHRoaXMuaW52ZXJ0SXNEb3R0ZWQoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gQ2FtZXJhKHBvcywgd2lkdGgsIGhlaWdodCl7XHJcbiAgIHRoaXMucG9zID0gcG9zO1xyXG4gICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICB0aGlzLmdldFBvcyA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucG9zO307XHJcbiAgIHRoaXMuc2V0UG9zID0gZnVuY3Rpb24ocG9zKSB7dGhpcy5wb3MgPSBwb3M7fTtcclxuICAgdGhpcy5nZXRXaWR0aCA9IGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMud2lkdGg7fTtcclxuICAgdGhpcy5zZXRXaWR0aCA9IGZ1bmN0aW9uKHdpZHRoKSB7dGhpcy53aWR0aCA9IHdpZHRoO307XHJcbiAgIHRoaXMuZ2V0SGVpZ2h0ID0gZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5oZWlnaHQ7fTtcclxuICAgdGhpcy5zZXRIZWlnaHQgPSBmdW5jdGlvbihoZWlnaHQpIHt0aGlzLmhlaWdodCA9IGhlaWdodDt9O1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gUGxheWVyKGpveXN0aWNrKXtcclxuICAgQ2lyY2xlLmNhbGwoIHRoaXMsIHt4OiBjYW52YXMud2lkdGgvMiwgeTogY2FudmFzLmhlaWdodC8yfSwgXCJyZWRcIiwgMjApO1xyXG5cclxuICAgdGhpcy5kaXNlYXNlWm9uZSA9IG5ldyBEaXNlYXNlWm9uZSh0aGlzLmdldFBvcygpKTtcclxuICAgdGhpcy5qb3lzdGljayA9IGpveXN0aWNrO1xyXG4gICB0aGlzLnJlc291cmNlcyA9IDA7XHJcbiAgIHRoaXMuY2FtZXJhID0ge307XHJcbiAgIHRoaXMucGF0aCA9IFtdO1xyXG5cclxuICAgdGhpcy5nZXRDYW1lcmEgPSBmdW5jdGlvbigpeyByZXR1cm4gdGhpcy5jYW1lcmE7fTtcclxuICAgdGhpcy5zZXRDYW1lcmEgPSBmdW5jdGlvbihjYW1lcmEpeyB0aGlzLmNhbWVyYSA9IGNhbWVyYTsgfTtcclxuICAgXHJcbiAgIC8vTW92ZXMgdGhlIHBsYXllciBhbG9uZyBhIHBhdGggZGV0ZXJtaW5lZCBieSBBKiBhbGdvcml0aG1cclxuICAgdGhpcy5nb1BhdGggPSBmdW5jdGlvbigpe1xyXG4gICAgICBcclxuICAgICAgaWYodGhpcy5wYXRoLmVxdWFscyhbXSkgPT09IGZhbHNlKVxyXG4gICAgICB7XHJcbiAgICAgICAgIHRoaXMuc2V0UG9zKHt4OiB0aGlzLnBhdGhbMF0ueCwgeTogdGhpcy5wYXRoWzBdLnl9KTtcclxuICAgICAgICAgdGhpcy5wYXRoLnNwbGljZSgwLDEpOyAvL1JlbW92ZSBlbGVtZW50IDA7XHJcbiAgICAgIH1cclxuICAgfVxyXG5cclxuICAgdGhpcy5nZXRSZXNvdXJjZXMgPSBmdW5jdGlvbigpeyByZXR1cm4gdGhpcy5yZXNvdXJjZXM7fTtcclxuICAgdGhpcy5zZXRSZXNvdXJjZXMgPSBmdW5jdGlvbihuZXdSZXNvdXJjZXMpeyB0aGlzLnJlc291cmNlcyA9IG5ld1Jlc291cmNlc307XHJcblxyXG4gICAvL092ZXJyaWRlIGluaGVyaXRlZCBzZXRQb3NcclxuICAgdmFyIHBhcmVudFNldFBvcyA9IHRoaXMuc2V0UG9zO1xyXG4gICB0aGlzLnNldFBvcyA9IGZ1bmN0aW9uKHBvcyl7IFxyXG4gICAgICAgdGhpcy5jYW1lcmEuc2V0UG9zKHBvcyk7XHJcbiAgICAgICBwYXJlbnRTZXRQb3MuY2FsbCh0aGlzLCBwb3MpOyAvL25lZWQgY2FsbCBzbyAndGhpcycgaXMgZGVmaW5lZCBhcyB0aGUgY3VycmVudCBQbGF5ZXJcclxuICAgfTtcclxuICAgICAgXHJcbiAgIFxyXG4gICAvL1VwZGF0ZSBwbGF5ZXIncyBsb2NhdGlvbiB3aXRoIHJlc3BlY3QgdG8gam95c3RpY2tcclxuICAgdGhpcy5tb3ZlID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgLy9Nb3ZlIHBsYXllciB3aXRoIGxlZnQgam95c3RpY2tcclxuICAgICAgdmFyIHBsYXllclBvcyA9IHRoaXMuZ2V0UG9zKCk7XHJcbiAgICAgIHZhciBkaXJlY3Rpb24gPSB0aGlzLmpveXN0aWNrLmdldERpcmVjdGlvbigpO1xyXG4gICAgICBpZihpc05hTihkaXJlY3Rpb24ueCkgfHwgaXNOYU4oZGlyZWN0aW9uLnkpKVxyXG4gICAgICB7XHJcbiAgICAgICAgIGRpcmVjdGlvbi54ID0gMDtcclxuICAgICAgICAgZGlyZWN0aW9uLnkgPSAwO1xyXG4gICAgICB9XHJcbiAgICAgIHBsYXllclBvcy54ICs9IHRoaXMuam95c3RpY2suZ2V0Rm9yY2UoKSpkaXJlY3Rpb24ueDtcclxuICAgICAgcGxheWVyUG9zLnkgKz0gdGhpcy5qb3lzdGljay5nZXRGb3JjZSgpKmRpcmVjdGlvbi55O1xyXG4gICAgICB0aGlzLnNldFBvcyhwbGF5ZXJQb3MpO1xyXG4gICB9O1xyXG5cclxuICAgLy9DaGVjayBpZiBzdGFuZGluZyBvbiBhbnkgcmVzb3VyY2VzXHJcbiAgIHRoaXMucGlja3VwID0gZnVuY3Rpb24oc3RhZ2UsIHJlc291cmNlcyl7XHJcbiAgICAgIHZhciBlYXNlbFNoYXBlID0gdGhpcy5nZXRFYXNlbFNoYXBlKCk7XHJcbiAgICAgIHZhciByZXNvdXJjZUNvcHkgPSByZXNvdXJjZXMuc2xpY2UoMCxyZXNvdXJjZXMubGVuZ3RoKTtcclxuICAgICAgZm9yICh2YXIgeCBvZiByZXNvdXJjZUNvcHkpe1xyXG4gICAgICAgICB2YXIgcG9zID0geC5nZXRQb3MoKTtcclxuICAgICAgICAgdmFyIHB0ID0gIGVhc2VsU2hhcGUuZ2xvYmFsVG9Mb2NhbChwb3MueCwgcG9zLnkpOyAvL2hpdFRlc3QgbmVlZHMgY29vcmRpbmF0ZXMgcmVsYXRpdmUgdG8gZWFzZWxTaGFwZVxyXG4gICAgICAgICBpZihlYXNlbFNoYXBlLmhpdFRlc3QocHQueCwgcHQueSkpIC8vSWYgcGxheWVyIGlzIG92ZXIgcmVzb3VyY2VcclxuICAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnNldFJlc291cmNlcyh0aGlzLmdldFJlc291cmNlcygpICsgeC52YWx1ZSk7XHJcbiAgICAgICAgICAgIHZhciByZW1JbmRleCA9IHJlc291cmNlcy5pbmRleE9mKHgpO1xyXG4gICAgICAgICAgICByZXNvdXJjZXMuc3BsaWNlKHJlbUluZGV4LDEpO1xyXG4gICAgICAgICAgICB4LnJlbW92ZShzdGFnZSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICB9XHJcbn1cclxuXHJcblxyXG5cclxuLy9EcmFnYWJsZSBDbGFzczogTWFrZXMgb2JqZWN0cyBEcmFnYWJsZVxyXG5mdW5jdGlvbiBEcmFnYWJsZShwb3MsIGNvbG9yKXtcclxuXHJcbiAgIC8vQ2FsbCBzdXBlcmNsYXNzJ3MgY29uc3RydWN0b3JcclxuICAgRWFzZWxPYmplY3QuY2FsbCh0aGlzLCBwb3MsIGNvbG9yKTtcclxuXHJcbiAgIC8vVXBkYXRlIGNvb3JkaW5hdGVzIHdoaWxlIG9iamVjdCBpcyBtb3ZlZCB3aGlsZSBwcmVzc2VkXHJcbiAgIHRoaXMuZ2V0RWFzZWxTaGFwZSgpLm9uKFwicHJlc3Ntb3ZlXCIsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICBlLnRhcmdldC54ID0gZS5zdGFnZVg7IC8vKHN0YWdlWCwgc3RhZ2VZKSA9IG1vdXNlQ29vcmRpbmF0ZVxyXG4gICAgICBlLnRhcmdldC55ID0gZS5zdGFnZVk7XHJcbiAgIH0pO1xyXG5cclxufTtcclxuXHJcblxyXG4vL0NyZWF0ZXMgYSBKb3lzdGljayBhdCB0aGUgZ2l2ZW4gbG9jYXRpb25cclxuZnVuY3Rpb24gSm95c3RpY2socG9zKXtcclxuXHJcbiAgIHRoaXMucG9zID0gcG9zO1xyXG5cclxuICAgdGhpcy5iYXNlU2l6ZSA9IDM1O1xyXG4gICB0aGlzLmJhc2VDb2xvciA9IFwicmVkXCI7XHJcbiAgIHRoaXMuYmFzZSA9IG5ldyBDaXJjbGUodGhpcy5wb3MsIHRoaXMuYmFzZUNvbG9yLCB0aGlzLmJhc2VTaXplKTtcclxuXHJcbiAgIHRoaXMuc3RpY2tTaXplID0gMjU7XHJcbiAgIHRoaXMuc3RpY2tDb2xvciA9IFwid2hpdGVcIjtcclxuICAgdGhpcy5zdGljayA9ICBuZXcgQ2lyY2xlKHRoaXMucG9zLCB0aGlzLnN0aWNrQ29sb3IsIHRoaXMuc3RpY2tTaXplKTtcclxuXHJcbiAgIC8vTGltaXRlZCBEcmFnZ2luZ1xyXG4gICB0aGlzLnN0aWNrLmdldEVhc2VsU2hhcGUoKS5vbihcInByZXNzbW92ZVwiLCBmdW5jdGlvbihlKXtcclxuICAgICAgZS50YXJnZXQueCA9IGUuc3RhZ2VYOyAvLyhzdGFnZVgsIHN0YWdlWSkgPSBtb3VzZUNvb3JkaW5hdGVcclxuICAgICAgZS50YXJnZXQueSA9IGUuc3RhZ2VZO1xyXG4gICB9KTtcclxuICAgXHJcbiAgIHZhciBiYXNlVmFyID0gdGhpcy5iYXNlOyAvL05vIGlkZWEgd2h5IEkgaGF2ZSB0byBkbyB0aGlzOyBzY29waW5nP1xyXG4gICAvL1Jlc2V0IHN0aWNrIHRvIGJhc2UgcG90aXRpb24gb24gd2hlbiBqb3lzdGljayBpcyByZWxlYXNlZFxyXG4gICB0aGlzLnN0aWNrLmdldEVhc2VsU2hhcGUoKS5vbihcInByZXNzdXBcIiwgZnVuY3Rpb24oZSl7XHJcbiAgICAgIGUudGFyZ2V0LnggPSBiYXNlVmFyLmdldFBvcygpLng7ICBcclxuICAgICAgZS50YXJnZXQueSA9IGJhc2VWYXIuZ2V0UG9zKCkueTtcclxuICAgfSk7XHJcbiAgIFxyXG4gICB0aGlzLmdldFBvcyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5zdGljay5nZXRQb3MoKX07XHJcblxyXG4gICAvL0dldCB0aGUgZGlyZWN0aW9uIHRoZSBqb3lzdGljayBpcyBwb2ludGluZ1xyXG4gICB0aGlzLmdldERpcmVjdGlvbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHZhciB2ID0gdGhpcy5zdGljay5nZXRQb3MoKTtcclxuICAgICAgdmFyIHcgPSB0aGlzLmJhc2UuZ2V0UG9zKCk7XHJcbiAgICAgIHZhciB4MSA9IHYueCAtIHcueDsgLy9uZXcgY29vcmRpbmF0ZXNcclxuICAgICAgdmFyIHkxID0gdi55IC0gdy55O1xyXG4gICAgICB2YXIgbWFnMSA9IE1hdGguc3FydCh4MSp4MSArIHkxKnkxKTtcclxuXHJcbiAgICAgIHJldHVybiB7eDogeDEvbWFnMSwgeTogeTEvbWFnMX1cclxuICAgfTtcclxuXHJcbiAgIC8vR2V0IHRoZSBmb3JjZSBhY3Rpbmcgb24gYSBwbGF5ZXIgYnkgdGhlIGpveXN0aWNrXHJcbiAgIHRoaXMuZ2V0Rm9yY2UgPSBmdW5jdGlvbigpe1xyXG4gICAgICB2YXIgdiA9IHRoaXMuc3RpY2suZ2V0UG9zKCk7XHJcbiAgICAgIHZhciB3ID0gdGhpcy5iYXNlLmdldFBvcygpO1xyXG4gICAgICByZXR1cm4gTWF0aC5hYnMoTWF0aC5zcXJ0KHYueCp2LnggKyB2Lnkqdi55KSAtIE1hdGguc3FydCh3Lngqdy54ICsgdy55KncueSkpO1xyXG4gICB9O1xyXG5cclxuICAgdGhpcy5hZGQgPSBmdW5jdGlvbihzdGFnZSl7XHJcbiAgICAgIHN0YWdlLmFkZENoaWxkKHRoaXMuYmFzZS5nZXRFYXNlbFNoYXBlKCkpO1xyXG4gICAgICBzdGFnZS5hZGRDaGlsZCh0aGlzLnN0aWNrLmdldEVhc2VsU2hhcGUoKSk7XHJcbiAgICAgIHN0YWdlLnVwZGF0ZSgpO1xyXG4gICB9XHJcblxyXG59XHJcblxyXG5cclxuLy9DcmVhdGVzIGEgQ2l0eSBhdCB0aGUgZ2l2ZW4gbG9jYXRpb25cclxuZnVuY3Rpb24gQ2l0eShwb3MsIGJhc2VDb2xvciwgc3RhZ2UsIHR5cGUsIGNpdHlTZWxlY3Rpb25UZXh0KXtcclxuICAgdGhpcy5wb3MgPSBwb3M7XHJcbiAgIFxyXG4gICB0aGlzLnN0YWdlID0gc3RhZ2U7XHJcbiAgIFxyXG4gICB0aGlzLmNpdHlUeXBlID0gdHlwZTtcclxuICAgdGhpcy5jaXR5U2VsZWN0aW9uVGV4dCA9IGNpdHlTZWxlY3Rpb25UZXh0O1xyXG4gICBcclxuICAgdGhpcy5iYXNlU2l6ZSA9IDM1O1xyXG4gICB0aGlzLmJhc2VDb2xvciA9IGJhc2VDb2xvcjtcclxuICAgdGhpcy5iYXNlID0gbmV3IENpcmNsZSh0aGlzLnBvcywgdGhpcy5iYXNlQ29sb3IsIHRoaXMuYmFzZVNpemUpO1xyXG5cclxuICAgaWYodHlwZSA9PT0gXCJTYWZlXCIpIHtcclxuICAgICAgdGhpcy5zdGlja1NpemUgPSAyNTtcclxuICAgICAgdGhpcy5zdGlja0NvbG9yID0gXCJibHVlXCI7XHJcbiAgICAgIHRoaXMuc3RpY2sgPSAgbmV3IENpcmNsZSh0aGlzLnBvcywgdGhpcy5zdGlja0NvbG9yLCB0aGlzLnN0aWNrU2l6ZSk7XHJcbiAgIH0gZWxzZSB7IFxyXG4gICAgICB0aGlzLnN0aWNrU2l6ZSA9IDI1O1xyXG4gICAgICB0aGlzLnN0aWNrQ29sb3IgPSBiYXNlQ29sb3I7XHJcbiAgICAgIHRoaXMuc3RpY2sgPSAgbmV3IENpcmNsZSh0aGlzLnBvcywgdGhpcy5zdGlja0NvbG9yLCB0aGlzLnN0aWNrU2l6ZSk7XHJcbiAgIH1cclxuICAgXHJcblxyXG4gICB0aGlzLnRvcCA9IHBvcy55O1xyXG4gICB0aGlzLmxlZnQgPSBwb3MueDtcclxuICAgdGhpcy5oZWlnaHQgPSB0aGlzLmJhc2VTaXplO1xyXG4gICB0aGlzLndpZHRoID0gdGhpcy5iYXNlU2l6ZTtcclxuXHJcbiAgIHRoaXMuYmFzZS5nZXRFYXNlbFNoYXBlKCkub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKXtcclxuICAgICAgICBjbGlja2FibGVFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuICAgICAgICAgIGVsZW1lbnQudW5zZWxlY3RlZChzdGFnZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy9kYXRhLmNob2ljZXMucHVzaCh7XCJjaG9pY2VcIjogXCJsb29sXCJ9KTtcclxuICAgICAgICB2YXIgc3RpY2tTaXplID0gMjU7XHJcbiAgICAgICAgdmFyIHN0aWNrQ29sb3IgPSBcImJsdWVcIjtcclxuICAgICAgICB2YXIgc3RpY2sgPSAgbmV3IENpcmNsZShwb3MsIHN0aWNrQ29sb3IsIHN0aWNrU2l6ZSk7XHJcbiAgICAgICAgY2l0eVNlbGVjdGlvblRleHQudGV4dCA9IFwiQ2l0eSBTZWxlY3Rpb246IFwiICsgdHlwZTtcclxuICAgICAgICBjaXR5U2VsZWN0aW9uVGV4dC5jb2xvciA9IGJhc2VDb2xvcjtcclxuICAgICAgICBzdGFnZS5hZGRDaGlsZChzdGljay5nZXRFYXNlbFNoYXBlKCkpO1xyXG4gICAgICAgIHN0YWdlLnVwZGF0ZSgpO1xyXG4gICB9KTtcclxuICAgXHJcbiAgIHRoaXMudW5zZWxlY3RlZCA9IGZ1bmN0aW9uKHN0YWdlKXtcclxuICAgICAgICB0aGlzLnN0aWNrU2l6ZSA9IDI2O1xyXG4gICAgICAgIHRoaXMuc3RpY2tDb2xvciA9IGJhc2VDb2xvcjtcclxuICAgICAgICB0aGlzLnN0aWNrID0gIG5ldyBDaXJjbGUodGhpcy5wb3MsIHRoaXMuc3RpY2tDb2xvciwgdGhpcy5zdGlja1NpemUpO1xyXG4gICAgICAgIHN0YWdlLmFkZENoaWxkKHRoaXMuc3RpY2suZ2V0RWFzZWxTaGFwZSgpKTtcclxuICAgICAgICBzdGFnZS51cGRhdGUoKTtcclxuICAgfVxyXG4gICBcclxuICAgdGhpcy5nZXRQb3MgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuc3RpY2suZ2V0UG9zKCl9O1xyXG5cclxuICAgdGhpcy5nZXRDaXR5VHlwZSA9IGZ1bmN0aW9uKCkge3JldHVybiB0aGlzLmNpdHlUeXBlfTtcclxuICAgdGhpcy5nZXRDaXR5U2VsZWN0aW9uVGV4dCA9IGZ1bmN0aW9uKCkge3JldHVybiB0aGlzLmNpdHlTZWxlY3Rpb25UZXh0fTtcclxuXHJcbiAgIHRoaXMuYWRkID0gZnVuY3Rpb24oKXtcclxuICAgICAgdGhpcy5zdGFnZS5hZGRDaGlsZCh0aGlzLmJhc2UuZ2V0RWFzZWxTaGFwZSgpKTtcclxuICAgICAgdGhpcy5zdGFnZS5hZGRDaGlsZCh0aGlzLnN0aWNrLmdldEVhc2VsU2hhcGUoKSk7XHJcbiAgICAgIHRoaXMuc3RhZ2UudXBkYXRlKCk7XHJcbiAgIH1cclxufVxyXG5cclxuXHJcbi8vQ2xhc3MgZGVmaW5pdGlvbnM6Xl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXHJcblxyXG4vL0NyZWF0ZXMgYSBzcXVhcmUgd29ybGQgb2Ygc2l6ZSAxMDAwIHRoYXQgb3VyIHBhdGhmaW5kaW5nIGFsZ29yaXRobSBjYW4gdXNlXHJcbmZ1bmN0aW9uIGluaXRXb3JsZCgpe1xyXG4gICB2YXIgc2l6ZSA9IDEwMDA7XHJcbiAgIHZhciB3b3JsZCA9IFtdXHJcbiAgIGZvcih2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspe1xyXG4gICAgICB3b3JsZFtpXSA9IFtdXHJcbiAgICAgIGZvcih2YXIgaiA9IDA7IGogPCBzaXplOyBqKyspe1xyXG4gICAgICAgICB3b3JsZFtpXVtqXSA9MDtcclxuICAgICAgfVxyXG4gICB9XHJcbiAgIHJldHVybiB3b3JsZDtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdFRleHQoc3RhZ2UsIGNhbnZhcywgdGV4dCwgY29sb3IsIHhwb3MsIHlwb3Mpe1xyXG4gICB2YXIgbmV3VGV4dCA9IG5ldyBjcmVhdGVqcy5UZXh0KHRleHQsIFwiMjBweCBBcmlhbFwiLCBjb2xvcik7XHJcbiAgIG5ld1RleHQueCA9IHhwb3M7XHJcbiAgIG5ld1RleHQueSA9IHlwb3M7IC8vVE9ETyBtb3JlIGxvZ2ljYWxseSBwb3NpdGlvbiBSZXNvdXJjZXMgdGV4dFxyXG4gICBuZXdUZXh0LnRleHRCYXNlbGluZSA9IFwiYWxwaGFiZXRcIjsgLy9Ob3Qgc3VyZSB3aGF0IHRoaXMgc2V0dGluZyBkb2VzXHJcbiAgIHN0YWdlLmFkZENoaWxkKG5ld1RleHQpO1xyXG4gICByZXR1cm4gbmV3VGV4dDtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdEhlbHBUZXh0KHN0YWdlLCBjYW52YXMpe1xyXG4gICByZXNvdXJjZVRleHQgPSBuZXcgY3JlYXRlanMuVGV4dChcIlRoZSBjaXR5IHlvdSBoYXZlIHNlbGVjdGVkIGlzIHJlcHJlc2VudGVkIGFzIGEgYmx1ZSBkb3RcIiwgXCIyMHB4IEFyaWFsXCIsIFwiYmx1ZVwiKTtcclxuICAgcmVzb3VyY2VUZXh0LnggPSAwO1xyXG4gICByZXNvdXJjZVRleHQueSA9IGNhbnZhcy5oZWlnaHQvNjsgLy9UT0RPIG1vcmUgbG9naWNhbGx5IHBvc2l0aW9uIFJlc291cmNlcyB0ZXh0XHJcbiAgIHJlc291cmNlVGV4dC50ZXh0QmFzZWxpbmUgPSBcImFscGhhYmV0XCI7IC8vTm90IHN1cmUgd2hhdCB0aGlzIHNldHRpbmcgZG9lc1xyXG4gICBzdGFnZS5hZGRDaGlsZChyZXNvdXJjZVRleHQpO1xyXG4gICByZXR1cm4gcmVzb3VyY2VUZXh0O1xyXG59XHJcblxyXG4vL0NyZWF0ZXMgYW5kIGRpc3BsYXllcyB0aGUgUmVzb3VyY2VzOiB4IHRleHRcclxuZnVuY3Rpb24gaW5pdFJlc291cmNlVGV4dChzdGFnZSwgY2FudmFzKXtcclxuICAgcmVzb3VyY2VUZXh0ID0gbmV3IGNyZWF0ZWpzLlRleHQoXCJSZXNvdXJjZXM6IDBcIiwgXCIyMHB4IEFyaWFsXCIsIFwiIzAwRkZGRlwiKTtcclxuICAgcmVzb3VyY2VUZXh0LnggPSAwO1xyXG4gICByZXNvdXJjZVRleHQueSA9IGNhbnZhcy5oZWlnaHQvMTI7IC8vVE9ETyBtb3JlIGxvZ2ljYWxseSBwb3NpdGlvbiBSZXNvdXJjZXMgdGV4dFxyXG4gICByZXNvdXJjZVRleHQudGV4dEJhc2VsaW5lID0gXCJhbHBoYWJldFwiOyAvL05vdCBzdXJlIHdoYXQgdGhpcyBzZXR0aW5nIGRvZXNcclxuICAgc3RhZ2UuYWRkQ2hpbGQocmVzb3VyY2VUZXh0KTtcclxuICAgcmV0dXJuIHJlc291cmNlVGV4dDtcclxufVxyXG5cclxuLy9DcmVhdGVzIGFuZCBkaXNwbGF5ZXMgdGhlIENpdHkgU2VsZWN0aW9uOiB4IHRleHRcclxuZnVuY3Rpb24gaW5pdENpdHlTZWxlY3Rpb25UZXh0KHN0YWdlLCBjYW52YXMpe1xyXG4gICByZXNvdXJjZVRleHQgPSBuZXcgY3JlYXRlanMuVGV4dChcIkNpdHkgU2VsZWN0aW9uOiBTYWZlXCIsIFwiMjBweCBBcmlhbFwiLCBcIiMwMEZGRkZcIik7XHJcbiAgIHJlc291cmNlVGV4dC54ID0gMDtcclxuICAgcmVzb3VyY2VUZXh0LnkgPSBjYW52YXMuaGVpZ2h0LzEyOyAvL1RPRE8gbW9yZSBsb2dpY2FsbHkgcG9zaXRpb24gUmVzb3VyY2VzIHRleHRcclxuICAgcmVzb3VyY2VUZXh0LnRleHRCYXNlbGluZSA9IFwiYWxwaGFiZXRcIjsgLy9Ob3Qgc3VyZSB3aGF0IHRoaXMgc2V0dGluZyBkb2VzXHJcbiAgIHN0YWdlLmFkZENoaWxkKHJlc291cmNlVGV4dCk7XHJcbiAgIHJldHVybiByZXNvdXJjZVRleHQ7XHJcbn1cclxuXHJcbi8vQ3JlYXRlcyBhbiBhcnJheSBvZiByYW5kb21seSBwbGFjZWQgUmVzb3VyY2VzIG9uIHRoZSBzdGFnZVxyXG5mdW5jdGlvbiBpbml0UmVzb3VyY2VzKHN0YWdlLCBjYW52YXMpe1xyXG5cclxuICAgdmFyIG51bVJlc291cmNlcyA9IDM7IC8vVE9ETyBtYWtlIGdsb2JhbC9tYWtlIGxvZ2ljYWwgY2hvaWNlLiBUb28gaGlnaCBhIG51bWJlciBtYXkgaW5jdXIgcmVzb3VyY2UgcHJvYmxlbXNcclxuICAgdmFyIGN1cnJQb3MgPSB7eDogMCwgeTogMH07XHJcbiAgIHZhciByZXNvdXJjZXMgPSBbXTtcclxuICAgdmFyIHJlc291cmNlVmFsdWUgPSAxMDtcclxuXHJcbiAgIGZvciAoaSA9IDA7IGkgPCBudW1SZXNvdXJjZXM7IGkgKyspe1xyXG4gICAgICBjdXJyUG9zLnggPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogY2FudmFzLndpZHRoKSk7IC8vUmFuZG9tIG51bWJlciBmcm9tIHplcm8gdG8gY2FudmFzLndpZHRoXHJcbiAgICAgIGN1cnJQb3MueSA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiBjYW52YXMuaGVpZ2h0KSk7XHJcblxyXG4gICAgICB2YXIgcmVzb3VyY2UgPSBuZXcgUmVzb3VyY2UocmVzb3VyY2VWYWx1ZSk7XHJcbiAgICAgIHJlc291cmNlLnNldFBvcyhjdXJyUG9zKTtcclxuICAgICAgcmVzb3VyY2UuYWRkKHN0YWdlKTtcclxuICAgICAgcmVzb3VyY2VzLnB1c2gocmVzb3VyY2UpO1xyXG4gICB9XHJcblxyXG4gICByZXR1cm4gcmVzb3VyY2VzO1xyXG59XHJcblxyXG4vL0NyZWF0ZSBhbiBvYmplY3QgdG8gcmVwcmVzZW50IHRoZSBiYWNrZ3JvdW5kIGFuZCByZWdpc3RlciBwYXRoZmluZGluZyBldmVudHNcclxuZnVuY3Rpb24gaW5pdEJhY2tncm91bmQoc3RhZ2UsIGNhbnZhcyl7XHJcbiAgIHZhciBjb2xvciA9IFwiYmxhY2tcIjtcclxuICAgdmFyIHdpZHRoID0gY2FudmFzLndpZHRoO1xyXG4gICB2YXIgaGVpZ2h0ID0gY2FudmFzLmhlaWdodDtcclxuXHJcbiAgIC8vVE9ETyBjb252ZXJ0IHRoZSBiYWNrZ3JvdW5kIHRvIGEgd29ya2luZyBSZWN0YW5nbGVcclxuICAgLy92YXIgYmFja2dyb3VuZCA9IG5ldyBSZWN0YW5nbGUoe3g6IGNhbnZhcy53aWR0aC8yLCB5OiBjYW52YXMuaGVpZ2h0LzJ9LCBjb2xvciwgd2lkdGgsIGhlaWdodCk7XHJcbiAgIHZhciBiYWNrZ3JvdW5kID0gbmV3IENpcmNsZSgge3g6IHdpZHRoLzIsIHk6IHdpZHRoLzJ9LCBjb2xvciwgMjAwMCk7XHJcbiAgIGJhY2tncm91bmQuYWRkKHN0YWdlKTtcclxuXHJcbiAgIHJldHVybiBiYWNrZ3JvdW5kO1xyXG5cclxufVxyXG5cclxuLy9DcmVhdGUgZGVzaXJlZCBKb3lzdGlja3MgZm9yIHRoZSB1c2VyXHJcbmZ1bmN0aW9uIGluaXRKb3lzdGlja3Moc3RhZ2Upe1xyXG4gICB2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluQ2FudmFzXCIpO1xyXG4gICAvL3ZhciByaWdodCAgPSBuZXcgSm95c3RpY2soe3g6Y2FudmFzLndpZHRoIC0gY2FudmFzLndpZHRoLzYsIHk6IGNhbnZhcy5oZWlnaHQvMn0pO1xyXG4gICB2YXIgbGVmdCA9IG5ldyBKb3lzdGljayh7eDogY2FudmFzLndpZHRoLzYsIHk6IGNhbnZhcy5oZWlnaHQvMn0pO1xyXG5cclxuICAgLy9BZGQgdG8gY2FudmFzXHJcbiAgIC8vcmlnaHQuYWRkKHN0YWdlKTtcclxuICAgbGVmdC5hZGQoc3RhZ2UpO1xyXG5cclxuICAgcmV0dXJuIHtsZWZ0OiBsZWZ0fTtcclxufVxyXG5cclxuLy9DcmVhdGUgZGVzaXJlZCBDaXRpZXMgZm9yIHRoZSB1c2VyXHJcbmZ1bmN0aW9uIGluaXRDaXR5KHN0YWdlKXtcclxuICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbkNhbnZhc1wiKTtcclxuICAgLy92YXIgcmlnaHQgID0gbmV3IEpveXN0aWNrKHt4OmNhbnZhcy53aWR0aCAtIGNhbnZhcy53aWR0aC82LCB5OiBjYW52YXMuaGVpZ2h0LzJ9KTtcclxuICAgdmFyIGxlZnQgPSBuZXcgQ2l0eSh7eDogY2FudmFzLndpZHRoLzYsIHk6IGNhbnZhcy5oZWlnaHQvMn0pO1xyXG5cclxuICAgLy9BZGQgdG8gY2FudmFzXHJcbiAgIC8vcmlnaHQuYWRkKHN0YWdlKTtcclxuICAgbGVmdC5hZGQoc3RhZ2UpO1xyXG5cclxuICAgcmV0dXJuIHtsZWZ0OiBsZWZ0fTtcclxufVxyXG5cclxuLy9DcmVhdGVzIGEgcGxheWVyIGFuZCBhc3NvY2lhdGVzIGl0IHRvIGEgam95c3RpY2tcclxuZnVuY3Rpb24gaW5pdFBsYXllcihzdGFnZSwgc3RpY2spe1xyXG4gICBwbGF5ZXIgPSBuZXcgUGxheWVyKHN0aWNrKTtcclxuICAgcGxheWVyLmFkZChzdGFnZSk7XHJcbiAgIHJldHVybiBwbGF5ZXI7XHJcbn1cclxuXHJcblxyXG4vL0luaXRpYWxpemUgQSogcGF0aGZpbmRpbmcgd2l0aCBlYXN5c3RhciBsaWJhcnlcclxuZnVuY3Rpb24gaW5pdFBhdGhmaW5kaW5nKHdvcmxkLCBwbGF5ZXIsIGJhY2tncm91bmQpe1xyXG5cclxuICAgdmFyIGVhc3lzdGFyID0gbmV3IEVhc3lTdGFyLmpzKCk7XHJcbiAgIGVhc3lzdGFyLnNldEdyaWQod29ybGQpO1xyXG4gICBlYXN5c3Rhci5zZXRBY2NlcHRhYmxlVGlsZXMoWzBdKTsgLy90aWxlcyB3ZSdyZSBhYmxlIHRvIHdhbGsgb25cclxuICAgZWFzeXN0YXIuZW5hYmxlRGlhZ29uYWxzKCk7IFxyXG4gICBcclxuICAgLy9HZW5lcmF0ZSBwYXRoIHdoZW4gYmFja2dyb3VuZCBpcyBjbGlja2VkXHJcbiAgIGJhY2tncm91bmQuZ2V0RWFzZWxTaGFwZSgpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgIHZhciBwb3MgPSBwbGF5ZXIuZ2V0UG9zKCk7XHJcbiAgICAgICAgIFxyXG4gICAgICAgICBlYXN5c3Rhci5maW5kUGF0aChNYXRoLmZsb29yKHBvcy54KSwgTWF0aC5mbG9vcihwb3MueSksIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGUuc3RhZ2VYKSwgTWF0aC5mbG9vcihlLnN0YWdlWSksIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihwYXRoKXsgXHJcbiAgICAgICAgICAgICAgaWYoIHBhdGggPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQYXRoIG5vdCBmb3VuZFwiKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgZWxzZXtcclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vQnkgZGVmYXVsdCwgZWFzeXN0YXIgcHJvZHVjZXMgcGF0aHMgb2YgdmVyeSBoaWdoIHJlc29sdXRpb25cclxuICAgICAgICAgICAgICAgICAgLy9UaGUgY29kZSB3aGljaCB1cGRhdGVzIHRoZSBwbGF5ZXIncyBwb3NpdGlvbiBpbiBvcmRlciB0byBmb2xsb3cgdGhpcyBwYXRoXHJcbiAgICAgICAgICAgICAgICAgIC8vY2FuIG9ubHkgbW92ZSBvbmUgcG9zaXRpb24gcGVyIHRpY2suIEluIG9yZGVyIHRvIHNwZWVkIHVwIHRoZSBwbGF5ZXJcclxuICAgICAgICAgICAgICAgICAgLy9laXRoZXIgdGlja3MgbXVzdCBnbyBmYXN0ZXIsIG9yIHRoZSBwYXRoIGhhcyB0byBoYXZlIGxlc3MgZWxlbWVudHMgd2l0aG91dCBsb29raW5nXHJcbiAgICAgICAgICAgICAgICAgIC8vY2hvcHB5LiBUaGUgY29kZSBiZWxvdyBhdHRlbXB0cyB0aGUgbGF0dGVyLlxyXG5cclxuICAgICAgICAgICAgICAgICAgLy9SZW1vdmUgZXZlcnkgZm91cnRoIGVsZW1lbnQgb2YgdGhlIHBhdGggXHJcbiAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgIGlmKChpJTIpID09PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGguc3BsaWNlKGksMik7IC8vcmVtb3ZlIGkgZnJvbSBwYXRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIHBsYXllci5wYXRoID0gcGF0aDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgIH0pO1xyXG4gICB9KTtcclxuICAgcmV0dXJuIGVhc3lzdGFyO1xyXG59XHJcbiJdfQ==
