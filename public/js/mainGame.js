var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight; 
main();


function main(){
   //Initialize the game world
   var stage        = new createjs.Stage("mainCanvas");
   var world        = initWorld();
   var background   = initBackground(stage, canvas);
   
   //Initalize the game controls and player
   var leftJoystick = initJoysticks(stage).left;
   var player       = initPlayer(stage, leftJoystick);
       player.setCamera(new Camera(player.getPos(), canvas.width, canvas.height));
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
function EaselObject( pos, color){

   this.easelShape = new createjs.Shape();
   this.getEaselShape = function(){ return this.easelShape; };

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

//A class for representing circles
function Circle(pos, color, radius ){
   //Call constructor of superclass
   EaselObject.call(this, pos, color);  

   //Set the new radius
   this.radius = radius;

   //Function: draw a circle
   this.draw = function(){
      this.easelShape.graphics.clear();
      this.easelShape.graphics.beginFill(this.color).drawCircle(0,0,this.radius);
   }

   //Function: draw a dotted circle
   this.drawDotted = function(){
      this.easelShape.graphics.clear();

      //20 pixel lines with 5 pixel gaps
      this.easelShape.graphics.setStrokeDash([20,5]);
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
   this.value = value;
}

function DiseaseZone(playerPos){
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
       this.diseaseZone.setPos(pos);
       parentSetPos.call(this, pos); //need call so 'this' is defined as the current Player
   };

   //Override inherited add
   var parentAdd = this.add;
   this.add = function(stage){
      this.diseaseZone.add(stage);
      parentAdd.call(this, stage);
   }
      
   
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

//Controls ---------------------------------------------------------

//Creates a Joystick at the given location
function Joystick(pos){

   this.pos = pos;

   this.baseSize = 35;
   this.baseColor = "grey";
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
   this.setPos = function(pos) {
      this.base.setPos(pos);
      this.stick.setPos(pos);
   }

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

//Creates and displayes the Resources: x text
function initResourceText(stage, canvas, player){
   resourceText = new createjs.Text("Resources: "+player.getResources(), "20px Arial", "white");
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

   
   
   var background = new Rectangle( {x: width/2, y: height/2}, color, width, height);
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

//Creates a player and associates it to a joystick
function initPlayer(stage, stick){
   player = new Player(stick);
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
