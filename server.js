//Express server Back-End
const express = require('express');
const mongo = require('mongodb');
const slug = require('slug');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({
  extended: true
});
const app = express();
const PORT = 8000;
const data = [];

//require .env file zodat je daar database connectie links uit kan halen
require('dotenv').config();

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine', 'ejs');
app.post('/succes.ejs', urlencodedParser, addMovie);

// Maak variable db(database) aan en zet deze eerst op null
let db = null
//Dit is je database link van mongodb, dit moet goed in je .env staan
const url = process.env.DB_HOST + ':' + process.env.DB_PORT;



mongo.MongoClient.connect(url, function (err, client, req, res) {
    if (err) {
      console.log('Error, database connection failed');
    } else {
      console.log('database connection succeeded')
    }
    //Zoek in de client naar de database.
    db = client.db(process.env.DB_NAME);
  });

function addMovie(req, res) {
    //Voeg objecten toe van 'data' array aan database
    db.collection('dating-app').insertOne({
      title: req.body.title,
      genre: req.body.genre,
      description: req.body.description
    });
    res.render('succes.ejs', {
      data: req.body
    });
    console.log(data);
};

function postFormulier(req, res){
  data.push({
      title: req.body.title,
      genre: req.body.genre,
      description: req.body.description
    });
  res.render('succes.ejs', {
    data: req.body 
  });
  console.log(data);
  console.log(req.body);
};

app.get('/', function (req, res){
  res.render('profile.ejs')
});

app.get('/contact', function (req, res){
  res.render('contact.ejs')
});

app.get('/add', function (req, res) {
  res.render('add.ejs')
});

app.get('/movie', function (req, res) {
  //Find object in database collection, after that invoke/perform 'done' function
  db.collection('dating-app').findOne({
    _id: mongo.ObjectID('5e70ae1f4b9f5d017b3e215a')
  }, done);

  //if there is an error, log the error. If there is no error log confirmation and log the object
  function done(err, data) {
    if (err) {
      console.log('Error, cannot find mongo objectID');
    } else {
      console.log('Found mongo objectID');
      /*console.log(data.title);*/
    };
    console.log(data.title);
    //render the object to movie.ejs
    res.render('movie.ejs', {
      data: data
    });
  };
  
});

app.get('/:userQuery', function (req,res) {
  res.render('search.ejs', {data : {userQuery: req.params.userQuery,
                                    searchResults: ['user1', 'user2', 'user3'],
                                    loggedIn: false,
                                    username: 'John Lopez'}})
});


/*app.get('/', function (req, res) {
  res.sendFile('/static/index.html')
});*/

/*app.get('/about', function (req, res) {
  console.log(req.query)
  res.sendFile(__dirname +'/static/about.html')
});

app.get('/*', function (req, res) {
  res.sendFile(__dirname +'/static/404.html')
});

app.get('/:userId', function (req, res) {
  res.send(req.params.userId)
});
*/


app.listen(8000, () => console.log('Done... Server is running'))