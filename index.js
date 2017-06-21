const express = require('express')
    , methodOverride = require('method-override')
    , bodyParser = require('body-parser')
    , npid = require('npid')
    , uuid = require('uuid')
    , app = express()
    , server = require('http').createServer(app)
    , io = require("./lib/socket")(server);


app.set('port', process.env.HEROKU_NODEJS_PORT || 3000);
app.set('ipaddr', process.env.HEROKU_NODEJS_IP || "127.0.0.1");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride());
app.use('/components', express.static(__dirname + '/components'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/icons', express.static(__dirname + '/icons'));
app.set("view engine", "ejs");
app.set('views', __dirname + '/public/views');
app.use(express.static(__dirname + '/public'));;



app.get('/', (request, response) => {
    response.render('pages/index');
});

server.listen(app.get('port'), app.get('ipaddr'), () => {
    console.log('Express server listening on IP : ' + app.get('ipaddr') + ' and port ' + app.get('port'));
})