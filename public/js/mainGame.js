var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight; 
main();


function main(){
   var stage        = new createjs.Stage("mainCanvas");
   var world        = initWorld();
   var background   = initBackground(stage, canvas);
   var left         = initJoysticks(stage).left;
   var player       = initPlayer(stage, left);
   var resources    = initResources(stage, canvas);
   var resourceText = initResourceText(stage,canvas, player);

   //Initialize easystar pathfinding
   var easystar = new EasyStar.js();
   easystar.setGrid(world);
   easystar.setAcceptableTiles([0]);
   easystar.enableDiagonals();
   background.getEaselShape().on("click", function(e){
         var pos = player.getPos();
         easystar.findPath(Math.floor(pos.x), Math.floor(pos.y), 
                           Math.floor(e.stageX), Math.floor(e.stageY), function(path){ 
              if( path === null) {
                  console.log("Path not found");
              }
              else{

                  console.log("length before");
                  console.log(path.length);
                  //Remove every fourth element of path
                  for(var i = 0; i < path.length; i++)
                  {
                     if((i%2) === 0)
                     {
                        path.splice(i,2); //remove i from path
                        i++;
                     }
                  }

                  console.log("length after");
                  console.log(path.length);
                  player.path = path;
              }
         });
   });

   createjs.Touch.enable(stage);
   
   window.addEventListener("resize", function(){
      stage.canvas.width  = window.innerWidth;
      stage.canvas.height = window.innerHeight;
   }, false);
   
   //Main game loop
   var FPS = 50;
   createjs.Ticker.setFPS(FPS);
   createjs.Ticker.addEventListener("tick", function(){
      easystar.calculate();
      player.move();
      player.pickup(stage, resources);
      player.goPath();
      resourceText.text = "Resources: "+player.getResources();
      stage.update();
   });

}

function Resource(value){
   this.body = new Circle(new createjs.Shape(),"blue",10, {x: 0, y: 0})
   this.value = value;

   this.getEaselShape = function(){return this.body.getEaselShape()};
   this.getPos = function(){return this.body.getPos();};
   this.setPos = function(pos){
      this.body.getEaselShape().x = pos.x;
      this.body.getEaselShape().y = pos.y;
      };
   this.add = function(stage) {this.body.add(stage);};
   this.remove = function(stage) {stage.removeChild(this.getEaselShape())};
}

Array.prototype.equals = function( array ) {
  return this.length == array.length && 
           this.every( function(this_i,i) { return this_i == array[i] } )  
  }

function Player(joystick){
  
   this.body = new Circle(new createjs.Shape(),"red",20, {x: canvas.width/2, y: canvas.height/2}); 
   this.joystick = joystick;
   this.resources = 0;
   this.path = [];

   this.goPath = function(){
      
      if(this.path.equals([]) === false)
      {
         this.body.setPos({x: this.path[0].x, y: this.path[0].y});
         this.path.splice(0,1); //Remove element 0;
      }
   }

   this.getEaselShape = function(){return this.body.getEaselShape();};
   this.getResources = function(){ return this.resources;};
   this.setResources = function(newResources){ this.resources = newResources};
   this.getPos = function(){return this.body.getPos();};
   
   //Update player's location with respect to joystick
   this.move = function () {

      //Move player with left joystick
      var playerPos = this.body.getPos();
      var direction = this.joystick.getDirection();
      if(isNaN(direction.x) || isNaN(direction.y))
      {
         direction.x = 0;
         direction.y = 0;
      }
      playerPos.x += this.joystick.getForce()*direction.x;
      playerPos.y += this.joystick.getForce()*direction.y;
      this.body.setPos(playerPos);
   };

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

   //Add player to stage
   this.add = function(stage) {
             stage.addChild(this.getEaselShape()); 
             stage.update();
           }; 
           
   //Get underlying Easle.js shape
   this.getEaselShape = function(){return this.body.getEaselShape();};
}



//Dragable Class: Makes objects Dragable
function Dragable(shape){
   this.shape = shape;
   this.getEaselShape = function() {return this.shape.getEaselShape()};
   
   this.getEaselShape().on("pressmove", function(e){
      e.target.x = e.stageX; //(stageX, stageY) = mouseCoordinate
      e.target.y = e.stageY;
   });
};

function Circle(easelShape, color, radius, center){
   
   this.shape   = easelShape; //underlying Easel.js shape
   this.getEaselShape = function(){return this.shape;};
   this.shape.x = center.x;
   this.shape.y = center.y;

   this.radius  = radius;
   this.center  = center;
   this.color   = color;

   this.draw = function(){
      this.shape.graphics.beginFill(this.color).drawCircle(0,0,this.radius);
   }
   this.draw();
   this.add = function(stage) {
      stage.addChild(this.getEaselShape());
      stage.update();
   }
   this.getPos = function() {return {x: this.getEaselShape().x, y: this.getEaselShape().y}};
   this.setPos = function(pos) {this.getEaselShape().x = pos.x, this.getEaselShape().y = pos.y};
}

function Rectangle(easelShape, color, width, height, center){
   
   this.shape   = easelShape; //underlying Easel.js shape
   this.getEaselShape = function(){return this.shape;};

   this.center  = center;
   this.color   = color;

   this.shape.x = this.center.x;
   this.shape.y = this.center.y;

   this.draw = function(){
      this.shape.graphics.beginFill(this.color).drawRect(center.x,center.y,this.width, this.height);
   }
   this.draw();

   this.add = function(stage){
      stage.addChild(this.getEaselShape());
      stage.update();
   }
}

function Joystick(center){

   this.center = center 

   this.baseSize = 35;
   this.baseColor = "grey";
   this.base = new Circle(new createjs.Shape(), this.baseColor, this.baseSize, this.center);

   this.stickSize = 25;
   this.stickColor = "white";
   this.stick =  new Circle(new createjs.Shape(),this.stickColor,this.stickSize, this.center);

   //Limited Dragging
   this.stick.getEaselShape().on("pressmove", function(e){
      e.target.x = e.stageX; //(stageX, stageY) = mouseCoordinate
      e.target.y = e.stageY;
   });

   var baseVar = this.base;
   //Reset drag on mouseUp
   this.stick.getEaselShape().on("pressup", function(e){
      e.target.x = baseVar.getPos().x;  
      e.target.y = baseVar.getPos().y;
   });
   
   this.getPos = function() { return this.stick.getPos()};

   this.getDirection = function(){
      var v = this.stick.getPos();
      var w = this.base.getPos();
      var x1 = v.x - w.x; //new coordinates
      var y1 = v.y - w.y;
      var mag1 = Math.sqrt(x1*x1 + y1*y1);

      return {x: x1/mag1, y: y1/mag1}
   };
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

function initResourceText(stage, canvas, player){
   resourceText = new createjs.Text("Resources: "+player.getResources(), "20px Arial", "#000000");
   resourceText.x = 0;
   resourceText.y = canvas.height/12;
   resourceText.textBaseline = "alphabet";
   stage.addChild(resourceText);
   return resourceText;

}

function initResources(stage, canvas){

   var numResources = 3;
   var currPos = {x: 0, y: 0};
   var resources = [];
   var resourceValue = 10;

   for (i = 0; i < numResources; i ++){
      currPos.x = Math.floor((Math.random() * canvas.width));
      currPos.y = Math.floor((Math.random() * canvas.height));

      var resource = new Resource(resourceValue);
      resource.setPos(currPos);
      resource.add(stage);
      resources.push(resource);
   }
   return resources;
}
function initBackground(stage, canvas){
   var color = "green";
   var width = canvas.width;
   var height = canvas.height;
   //var background = new Rectangle(new createjs.Shape(), color, width, height, {x: canvas.width/2, y: canvas.height/2});
   var background = new Circle(new createjs.Shape(),color,1000, {x: width/2, y: width/2});
   background.add(stage);

   return background;

}

function initJoysticks(stage){
   var canvas = document.getElementById("mainCanvas");
   //var right  = new Joystick({x:canvas.width - canvas.width/6, y: canvas.height/2});
   var left = new Joystick({x: canvas.width/6, y: canvas.height/2});

   //Add to canvas
   //right.add(stage);
   left.add(stage);

   return {left: left};
}

//Inits a player with a joystick
function initPlayer(stage, stick){
   player = new Player(stick);
   player.add(stage);
   return player;
}
