//Express server Back-End
const express = require('express');
var slug = require('slug');
var bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({
  extended: true
});
const app = express();
const PORT = 8000;
const data = [{
  title: '',
  genre: '',
  description: '',
}];

require('dotenv').config();

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