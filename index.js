var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var mysql = require('mysql');
var bodyParser = require('body-parser');


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'yash',
  database: 'book'


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


connection.connect(function(err) {
	if (err) throw err
		console.log('You are now connected')
    /*	connection.query('INSERT into books(isbn,author,img) values (12,12,12)',function(err,results){
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

io.on('connection', function(socket){
	console.log("a user connected");

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
    		if (!error && response.statusCode == 200) {
      		var info = JSON.parse(body)
      		if(info.totalItems==1){
     		bookname = info.items[0].volumeInfo.title;
     		isbn = data.msg;
     		author = info.items[0].volumeInfo.authors[0];
     		description = info.items[0].volumeInfo.description;
     		img = info.items[0].volumeInfo.imageLinks.thumbnail;
			console.log(isbn);
			console.log(author);
			console.log(description);
			console.log(img);
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
		console.log(bookname);
		console.log(author);
	});
});



