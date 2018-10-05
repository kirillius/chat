// Входная точка backend приложения
var express = require("express"),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    methodOverride = require("method-override"),
    request = require("request"),
    session = require("express-session"),
    passport = require('passport'),
    mongoClient = require("mongodb").MongoClient,
    socketIO = require('socket.io');

var _ = require('lodash');

var app = express();
require("./app/passport")(app);

app.locals.root_dir = __dirname ;
app.locals.app_dir = __dirname + '/app';
app.locals.public_dir = __dirname + '/public';

// Указание на frontend папку как публичную, подключение вспомогательных модулей в express.js
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(methodOverride());

app.use(session({
    secret: 'G598tjpa5IqzzBy6ZFti',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Старт express.js приложения, установка на определенный порт
var server = app.listen(process.env.PORT || 2300, function () {
    var port = server.address().port;
    console.log("App now running on port " + port);
});

var io = socketIO.listen(server);
var socketUsers = [];
io.sockets.on('connection', function (socket) {
    var nameUser = socket.handshake.query['user'];
    var userId = socket.handshake.query['userId'];

    var socketUser = {socket: socket.id, user: userId};
    if(userId && !_.find(socketUsers, function(item) {
        item.user==userId;
    }))
        socketUsers.push(socketUser);

    socket.broadcast.emit('newUser', nameUser);

    socket.on('message', function(message){
        io.sockets.emit('messageToAll', message, nameUser);
    });

    socket.on('secretMessage', function(messageObj){
        var socketObj = _.find(socketUsers, function(item) {
            return item.user==messageObj.userId;
        });

        if(!socketObj)
            return;

        io.to(socketObj.socket).emit('messageToUser', messageObj.message, nameUser, userId);
    });

    socket.on('disconnect', function(){
        var socketUser = _.find(socketUsers, {socket: socket.id});
        _.remove(socketUsers, socketUser);
    });
});

require('./app/routes')(app);

/*var config = require('./app/config').getCurrentConfig(app);
mongoClient.connect(config.database.server, function(err, client){
    if(err){
        return console.log(err);
    }

    console.log("success connection to mongo");

    var db = client.db(config.database.name);
    require('./app/models').init(function(){
        console.log('Models created success, created routes');
        require('./app/routes')(app, db);
    });
    //client.close();
});*/

process.on('uncaughtException', function (err) {
    console.log('uncaughtException', err);
});

module.exports = app;
