//Express server Back-End
const express = require('express');
const mongo = require('mongodb');
var slug = require('slug');
var bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({
  extended: true
});
const app = express();
const PORT = 8000;
const data = [{
  id: '1',
  title: 'Wonder woman',
  genre: 'Action',
  description: 'Cool DC Comics movie about a greek Goddess',
},
{
  id: '2',
  title: 'Titanic',
  genre: 'Romance',
  description: 'Best movie ever.',
},
{
  id: '3',
  title: 'The Expandables 1',
  genre: 'Action',
  description: 'Cool action movie starring Sylvester Stallone',
},
{
  id: '4',
  title: 'The Expandables 2',
  genre: 'Action',
  description: 'Cool action movie starring Sylvester Stallone part 2',
}
];

//require .env file zodat je daar database connectie links uit kan halen
require('dotenv').config();

// Maak variable db(database) aan en zet deze eerst op null
let db = null
//Dit is je database link van mongodb, dit moet goed in je .env staan
const url = process.env.DB_HOST + ':' + process.env.DB_PORT;

mongo.MongoClient.connect(url, function (err, client) {
  if (err) throw err
  //maak eerst via compass een database aan! Zet die naam in je .env onder DB_NAME
  db = client.db(process.env.DB_NAME);
  //checken of je client/database correct is geconnect
  console.log(client);
  //Voeg objecten toe van 'data' array
  db.collection('dating-app').insertMany(data); 
});


app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine', 'ejs');
app.post('/succes.ejs', urlencodedParser, postFormulier);
app.post('/contact.ejs', urlencodedParser, postFormulier)

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
}

app.get('/', function (req, res){
  res.render('profile.ejs')
});

app.get('/contact', function (req, res){
  res.render('contact.ejs')
});

app.get('/add', function (req, res) {
  res.render('add.ejs')
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