var express = require('express'),
	app 	= express(),
	server = require('http').Server(app),
    Helper   = require('./app/helper/general'),
    mosca = require('mosca'),
    port = process.env.PORT || 8080;


var ascoltatore = {
  //using ascoltatore
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var settings = {
  port: 1883,
  backend: ascoltatore
};




app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


Helper.Pagina('/','home',{ title: "Inicio"},app);

server.listen(port);
console.log('En linea en http://localhost:' + port);


/** mqtt Server **/

var server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
  console.log('Published', packet.payload.toString());
});

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server (MQTT) is up and running in http://localhost:'+settings.port);
}



/** Fin mqtt server **/



process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});







