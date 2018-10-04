// Входная точка backend приложения
var express = require("express"),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    methodOverride = require("method-override"),
    request = require("request"),
    session = require("express-session"),
    passport = require('passport'),
    mongoClient = require("mongodb").MongoClient;

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

var config = require('./app/config').getCurrentConfig(app);
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
});

process.on('uncaughtException', function (err) {
    console.log('uncaughtException', err);
});

module.exports = app;
