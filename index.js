var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var Q = require('q');
function getbook(name) {
  var deferred = Q.defer();
  request("http://pokeapi.co/api/v1/pokemon/"+name, function (error, response, body) {
    if (response.statusCode == 200) {
      deferred.resolve(JSON.parse(body));
    } else {
      deferred.reject(new Error("Error Getting Pokemon"));
    }
  })
  return deferred.promise;
}


app.use(express.static(__dirname + '/public'));

app.get('/', function(req , res){
	res.sendFile(__dirname+ '/public/index.html');
})

http.listen(8080, function(){
	console.log("Server running");
});

io.on('connection', function(socket){
	console.log("a user connected");

	socket.on('disconnect', function(){
		console.log("a user disconnected");
	});
	

	});



