//Express server Back-End
const express = require('express');
const app = express();
const PORT = 8000;
/*
const data = {
  userQuery: req.params.userQuery
}*/

app.use(express.static('static'));
app.set('view engine', 'ejs');


app.get('/:userQuery', function (req,res) {
  res.render('index.ejs', {data : {userQuery: req.params.userQuery,
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