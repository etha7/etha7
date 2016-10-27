var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight; 
main();


function main(){
   var stage  = new createjs.Stage("mainCanvas");
   initBackground(stage, canvas);
   var sticks = initJoysticks(stage);
   var left = sticks.left;

   player =  new Player(left);
   player.add(stage);

   createjs.Touch.enable(stage);
   

   
   //Main game loop
   createjs.Ticker.addEventListener("tick", function(){ 
      player.move();
      stage.update();
   });

}

function Player(joystick){

   this.body = new Circle(new createjs.Shape(),"red",20, {x: canvas.width/2, y: canvas.height/2}); 
   this.joystick = joystick;

   this.getEaselShape = function(){return this.body.getEaselShape();};

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

   this.add = function(stage) {
             stage.addChild(this.getEaselShape()); 
             stage.update();
           }; 

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
