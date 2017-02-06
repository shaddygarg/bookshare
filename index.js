var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'yash',
  database: 'book'

})

connection.connect(function(err) {
	if (err) throw err
		console.log('You are now connected')
	/*connection.query('INSERT into books(isbn,author,img) values (12,12,12)',function(err,results){
		if(err) throw err
			console.log('INSERTED')
		connection.query('select * from books',function(err,results){
			if(err) throw err
				console.log(results)
		})
	})*/
})


app.use(express.static(__dirname + '/public'));

app.get('/', function(req , res){
	res.sendFile(__dirname+ '/public/index.html');
})

http.listen(8080, function(){
	console.log("Server running");
});


