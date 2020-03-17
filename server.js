//Express server Back-End


//require .env file so I can access secure data
require('dotenv').config();

//Require express npm package
const express = require('express');

//require mongodb for database
const mongo = require('mongodb');

//require slug package for converting every input into a string. (so users can't post javascript code into a form)
const slug = require('slug');

//require bodyparser package for getting/requesting info out of a form. (req, res)
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({
  extended: true
});

//This is the baseURl for accessing the API database
let baseURL = 'https://api.themoviedb.org/3/';

//The id of a movie in the API database
let movieIdApi = 'null';

//The APIKEY 
let APIKEY = process.env.APIKEY;

//require request package, for handling the API
var request = require('request');

//use express() with 'app'
const app = express();

//app running on port 8000
const PORT = 8000;

//declaring empty array variables
let data = [];
let dataApi = [];
let dataZelf = [];

//Middleware set-up
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine', 'ejs');
app.post('/succes.ejs', urlencodedParser, addMovie);
app.post('/film.ejs', urlencodedParser, zoekMovie)

// Declare variable db(database) andd assign null
let db = null
//The url/link to database. This is reffered to the .env file (secure data)
const url = process.env.DB_HOST + ':' + process.env.DB_PORT;

//Create a connection with the mongo database
mongo.MongoClient.connect(url, function (err, client, req, res) {
    if (err) {
      //if there is an error, log:
      console.log('Error, database connection failed');
    } else {
      //if the connection succeeded, log:
      console.log('database connection succeeded')
    }
    //looking up the database in mongo.
    db = client.db(process.env.DB_NAME);
  });

function addMovie(req, res) {
    //the movie the user adds to his profile
    let insertedMovie = req.body.movieTitle;
    //log this movie for confirmation
    console.log('Movie title input: ', insertedMovie);

    //search in api for the inserted movie
    request(baseURL + 'search/movie/?api_key=' + APIKEY + '&query=' + insertedMovie, function (error, response,body) {
      body = JSON.parse(body); //parse the outcome to object, so requesting data is possible
      console.log('Movie title from api: ', body.results[0].original_title); //confirming the title

    //Add the title of the movie into the 'favoMovies' array in the database
    db.collection('users').updateOne({id: 1}, { $addToSet: {favoMovies: body.results[0].original_title}}, function(err, req, res) {
      if (err) {
        console.log('Error, could not update');
      } else {
        console.log('Update confirmed');
      };
    //Closes the function that is in updateOne()
    });

    //Create a object in the database and add strings into the object. If the user adds a movie it goes into the database collection 'dating-app'
    db.collection('addedMovies').insertOne({
      title: req.body.movieTitle, //get title
      stars: req.body.stars //get stars
    });

    //Push the inserted data into the data variable, so it can be rendered to succes.ejs
    data.push({
      title: body.results[0].original_title,
      stars: req.body.stars
    });
    //Render the inserted data to the succes.ejs page
    res.render('succes.ejs', {
      data: req.body
    });
    //Closes the function that is in request()
    });
    
    //Confirmation for the data that is added to the database
    console.log('This data is added to the database:', req.body);
    console.log('title: ', req.body.movieTitle);
    console.log('stars: ', req.body.stars)
};

//This function is to search for movies in the API database, this can be ignored! Has nothing to do with the dating-app feature.
function zoekMovie(req, res) {
  let zoekveld = req.body.zoekveld;
  console.log('Searched on: ', zoekveld);

  request(baseURL + 'search/movie/?api_key=' + APIKEY + '&query=' + zoekveld, function (error, response, body) {
    body = JSON.parse(body);
/*    console.log('error:', error);
    console.log('statusCode:', response); 
    console.log('body:', body);*/
    /*console.log('Filmtitel:', body.results[0].original_title);
    console.log('Beschrijving:', body.results[0].overview);*/
    /*dataApi.push({
      title: body.results[0].original_title,
      description: body.results[0].overview 
    });*//*
    dataZelf.push({
      lol: "test",
      youtubeLink: 'https://www.youtube.com/results?search_query=' + body.results[0].original_title
    })*/
    let youtubeLink = 'https://www.youtube.com/results?search_query=' + body.results[0].original_title;
    res.render('film.ejs', {
      dataApi: body.results[0],
      dataZelf: youtubeLink
    });
    console.log('youtubelink= ', youtubeLink);
    console.log('dataZelf= ', dataZelf);
    //console.log('dataZelf.youtubeLink= ', dataZelf[0].youtubeLink);
    //console.log(req.body);
    //console.log(body.results[0])
    console.log(dataApi);
    //console.log('Object:', dataApi[0]);
    //console.log('description: ', dataApi[0].description);
    //console.log('dit is data: ', dataApi);
  });
};

//The homepage / profile page
app.get('/', function (req, res) {
  //look for the only user in database, my jobstory doesn't need more users than 1.
  db.collection('users').findOne({
  _id: mongo.ObjectID('5e70f258881f3e33fc62b39f')
  }, done); 

  //Check if the user has been found
  function done(err, data) {
  if (err) {
    console.log('Error, cannot find the object/user name');
  } else {
    console.log('Found user');
  };
  //Confirm data from the user
  console.log('naam= ', data.name);
  console.log('Favomovies: ', data.favoMovies)

  //Render his database / profile info into the profile page
  res.render('profile.ejs', {
    data: data
  });
};
});

app.get('/contact', function (req, res){
  res.render('contact.ejs')
});

//This get/function is to search for movies in the API database, this can be ignored! Has nothing to do with the dating-app feature.
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
    };
    console.log(data.title);
    //render the object to movie.ejs
    res.render('movie.ejs', {
      data: data
    });
  };
});


//This get/function is to search for movies in the API database, this can be ignored! Has nothing to do with the dating-app feature.
app.get('/movies', function (req, res) {
  //find all objects in database collection
  var arrayCollection = db.collection('dating-app').find().toArray(done);
  function done(err, data) {
    if (err) {
      console.log('Error, cannot find objects in database');
    } else {
      console.log('Found the objects in database');
    };
    console.log(data);
    console.log(data[0].title);
    res.render('movies.ejs', {
      data: data
    });
  };
});

/*app.get('/:userQuery', function (req,res) {
  res.render('search.ejs', {data : {userQuery: req.params.userQuery,
                                    searchResults: ['user1', 'user2', 'user3'],
                                    loggedIn: false,
                                    username: 'John Lopez'}})
});*/
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

//Confirm server running
app.listen(8000, () => console.log('Done... Server is running'))