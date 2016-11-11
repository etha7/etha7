
/**
 * Module dependencies.
 */

var express    = require('express');
var http       = require('http');
var path       = require('path');
var handlebars = require('express3-handlebars');

//Server requirements
var util       = require('util'),
    io         = require('socket.io'),
    Player     = require('./public/js/Classes.js').Player;


/* Game server code */
var gameport = 8000;
var socket,
    players;

    function init() {
      players = [];
      socket = io.listen(gameport);
      setEventHandlers();
    };

    var setEventHandlers = function() {
      socket.sockets.on("connection", onSocketConnection);
    }

    function onSocketConnection(client){
      util.log("Server :: New player has connected : "+client.id);
      client.on("disconnect", oncClientDisconnect);
      client.on("new player", onNewPlayer);
      client.on("move player", onMovePlayer);
    }

    function onClientDisconnect(){
      util.log("Server :: player has disconnected : "+this.id);
      var removePlayer = playerById(this.id);

      if(!removePlayer) {
         util.log("Player not found: "+this.id);
         return;
      };

      //Remove player from players array
      players.splice(players.indexOf(removePlayer), 1);

      //Broadcast removed player
      this.broadcast.emit("new player", { id: newPlayer.id, 
                                           x: newPlayer.getPos().x, 
                                           y: newPlayer.getPos().y });

    }

    function onNewPlayer(data){
      var newPlayer = new Player(data.x, data.y);
      newPlayer.id = this.id;

      //update all clients but current
      this.broadcast.emit("new player", { id: newPlayer.id, 
                                          x: newPlayer.getX(), 
                                          y: newPlayer.getY() });
      var i, existingPlayer;
      for (i = 0; i < players.length; i++) {
         existingPlayer = players[i];

         //Add existingPlayer to new client
         this.emit("new player", { id: existingPlayer.id,
                                    x: existing.getX(),
                                    y: existingPlayer.getY() });
      };

      //Add new player to list of added players
      players.push(newPlayer);
    }


    function onMovePlayer(data){
       var movePlayer = playerById(this.id);
       if(!movePlayer) {
            util.log("Player not found: "+this.id);
            return;
       };
       movePlayer.setPos({x: data.x, y: data.y});

       this.broadcast.emit("move player", { id: movePlayer.id, 
                                             x: moveplayer.getPos().x, 
                                             y: movePlayer.getPos().y });

    }

    init();

//Define all views\webpages
var index   = require('./routes/index');
var scientist = require('./routes/scientist');
var citizen = require('./routes/citizen');
var map = require('./routes/map');
var login = require('./routes/login');

//Define the app
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/', login.view);
app.get('/scientist', scientist.view);
app.get('/citizen', citizen.view);
app.get('/map', map.view);
app.get('/index', index.view);

//app.get('/science/:role', science.view);
// Example route
// app.get('/users', user.list);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
