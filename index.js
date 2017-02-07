var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var request = require('request');
var mysql = require('mysql');
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'yash',
	database: 'book'
})
app.use(express.static(__dirname + '/public'));

app.get('/', function(req , res){
	res.sendFile(__dirname+ '/public/index.html');
})

http.listen(8080, function(){
	console.log("Server running");
});
connection.connect(function(err) {
	if (err) throw err
		console.log('You are now connected')
	io.on('connection', function(socket){
		console.log("a user connected")
		var fullinfo;
		connection.query('select * from books',function(err,results){
			if(err) throw err;
			fullinfo=results;
		})

		socket.on('disconnect', function(){
			console.log("a user disconnected");
		});

		socket.on('isbn' , function(data){
			var	bookname = 'none';
			var isbn = 'none';
			var author = 'none';
			var description= 'none';
			var img = 'none';
			request("https://www.googleapis.com/books/v1/volumes?q=isbn:"+data.msg, function (error, response, body) {
				if (!error) {
					var info = JSON.parse(body)
					if(info.totalItems!==0){
						bookname = info.items[0].volumeInfo.title;
						isbn = data.msg;
						author = info.items[0].volumeInfo.authors[0];
						description = info.items[0].volumeInfo.description;
						img = info.items[0].volumeInfo.imageLinks.thumbnail;
						connection.query('INSERT INTO books(ISBN,name,author,description,img) VALUES (?,?,?,?,?)',[isbn,bookname,author,description,img],function(err,results){
							if(err) throw err
								connection.query('SELECT COUNT(*) AS r FROM books',function(err,results){
									if(err) throw err
										var x= results;
									var n = x[0].r;
									connection.query('SELECT * FROM books',function(err,results){
										if(err) throw err
											fullinfo=results;
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
					}
					else{
						socket.emit('rply' , "Book not available");
					}
				}
				else{
					socket.emit('rply' , "Book not available");
				}
			});

		});


		socket.on('name' , function(data){
			var	bookname = data.name;
			var author = data.author;
			connection.query('INSERT INTO books(name,author) VALUES (?,?)',[bookname,author],function(err,results){
				if(err) throw err
					connection.query('SELECT COUNT(*) AS r FROM books',function(err,results){
						if(err) throw err
							var x= results;
						var n = x[0].r;
						connection.query('SELECT * FROM books',function(err,results){
							if(err) throw err
								fullinfo=results;
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

		socket.on('getData', function(data){
			console.log(fullinfo)
			socket.emit('recieveData' ,fullinfo);
		})
	})
})





