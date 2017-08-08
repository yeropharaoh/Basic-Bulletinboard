//instantiating neccessaries
const { Client } = require('pg')
const SQL = require('sql-template-strings')

var express = require('express');
var bodyParser = require('body-parser');
var app = express()

app.set('views', './views');
app.set('view engine', 'pug');

app.use("/", bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../public'))

const client = new Client({
	database: 'bulletinboard',
  	host: 'localhost',
 	user: process.env.POSTGRES_USER,
 	password: process.env.POSTGRES_PASSWORD,
 	port: 5000
 })

//connects to postgreSQL
client.connect()

//gets index page which has the message form
app.get('/', function(req, res) {
res.render('index');
})

//gets messages page where all messages are displayed
app.get('/messages', function(req, res) {
    client.query('SELECT * FROM messages', (err, result) => { 
       	console.log('test2', result.rows[0].title)
var messages = []
for (let i = 0; i < result.rows.length; i++){
  var message = {
    title: result.rows[i].title, 
    body: result.rows[i].body
  }  
  messages.push(message);
}
    res.render('messages', {posts: messages});
	});
});


//post to newMessage route
app.post('/newMessage', function(req, res) {
  var title = req.body.title;
  var messagebody = req.body.msgbody;
  console.log(req.body)
client.query('insert into messages (title, body) values($1, $2)', [title, messagebody], (err, result) => { 
   	console.log(err ? err.stack : 'message added to database')
    console.log('test3', result.rows)
res.redirect('/messages');
  });
});


app.listen(3000, function() {
    console.log('Listening on port 3000');
});