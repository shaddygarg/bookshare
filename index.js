var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '9914647680',
	database: 'book'
})

connection.connect(function(err) {
	var isbn="123",name="123",author="ld",description="dij",img="djk";
	if (err) throw err
		console.log('You are now connected')
	connection.query('INSERT INTO books(ISBN,name,author,description,img) VALUES (?,?,?,?,?)',[isbn,name,author,description,img],function(err,results){
		if(err) throw err
			connection.query('SELECT COUNT(*) AS r FROM books',function(err,results){
				if(err) throw err
					var x = results;
				var n = x[0].r;
				connection.query('SELECT * FROM books',function(err,results){
					if(err) throw err
						for(var i=0;i<n;i++){
							console.log(i+1+".");
							console.log(results[i].ISBN);
							console.log(results[i].name);
							console.log(results[i].author);
							console.log(results[i].description);
							console.log(results[i].img);
						}
					})
			})
	})
})


app.use(express.static(__dirname + '/public'));

app.get('/', function(req , res){
	res.sendFile(__dirname+ '/public/index.html');
})

http.listen(8080, function(){
	console.log("Server running");
});


