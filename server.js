var express = require('express'),
	app 	= express(),
	server = require('http').Server(app),
    Helper   = require('./app/helper/general'),
    port = process.env.PORT || 8080;


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


Helper.Pagina('/','home',{ title: "Inicio"},app);

server.listen(port);
console.log('En linea en http://localhost:' + port);


process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

