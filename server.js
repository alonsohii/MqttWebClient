var express = require('express'),
	app 	= express(),
	server = require('http').Server(app),
    Helper   = require('./app/helper/general'),
    mosca = require('mosca'),
    port = process.env.PORT || 8080,
    io = require('socket.io')(server),
    mqtt    = require('mqtt');

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
console.log('En linea servidor HTTP http://localhost:' + port);



/*********** MQTT Server ***********/

var server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
  console.log('Published', packet.payload.toString());
});

server.on('ready', setup);
 
/*********** Fin MQTT Server ***********/


// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server (MQTT) is up and running in http://localhost:'+settings.port);




	/*********** Manejo del cliente ***********/



	var client = mqtt.connect('mqtt://localhost:1883');
	 
	io.sockets.on('connection', function (socket) {
		//console.log('Se han conectado a socket');
	    // socket connection indicates what mqtt topic to subscribe to in data.topic
	    socket.on('subscribe', function (data) {
	        console.log('Subscribing to '+data.topic);
	        socket.join(data.topic);
	        client.subscribe(data.topic);
	    });
	    // when socket connection publishes a message, forward that message
	    // the the mqtt broker
	    socket.on('publish', function (data) {
	        console.log('Publishing to '+data.topic);
	        client.publish(data.topic,data.payload);
	    });
	});
	 
	// listen to messages coming from the mqtt broker
	client.on('message', function (topic, payload, packet) {
	    console.log(topic+'='+payload);
	    io.sockets.emit('mqtt',{'topic':String(topic),
	                            'payload':String(payload)});
	});



	/*********** Fin manejo cliente ***********/

}








process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});







