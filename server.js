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

//require request package, for handling the API
var request = require('request');

//This is the baseURl for accessing the API database
let baseURL = 'https://api.themoviedb.org/3/';

//This is the baseURl for the images for accessing the images in the API database
let baseImgURL = 'https://image.tmdb.org/t/p/w500';

//The id of a movie in the API database
let movieIdApi = 'null';

//The APIKEY 
let APIKEY = process.env.APIKEY;

//use express() with 'app'
const app = express();

//Session
const session = require('express-session'); //Require the session package for user sessions

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

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
app.post('/succesSerie.ejs', urlencodedParser, addSerie);
app.post('/film.ejs', urlencodedParser, zoekMovie);

// Declare variable db(database) andd assign null
let db = null
//The url/link to database. This is reffered to the .env file (secure data)
const url = process.env.DB_HOST + ':' + process.env.DB_PORT;

//Create a connection with the mongo database
mongo.MongoClient.connect(url, function (err, client) {
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

//Login page
app.get('/login', function(req, res) {
  //Get all users from database to render to the login.ejs page
  let users = db.collection('users').find().toArray(done);

  function done(err, data) {
    if (err) {
      console.log('could not found users');
    } else {
      console.log('found users to put into the dropdown');
    };
     res.render("login.ejs", {
      data: data //data contains all the users
     });
  };
});

//If user clicks on 'login' button
app.post('/login', function(req, res) {
  //Look for the choosen username in the database.
  db.collection('users').findOne({name: req.body.userName}, (err, data) => {
    if (err) {
      console.log('could not find user');
    } else {
      req.session.user = data; //put the database information in the session
      console.log('Logged in as: ' + data.name);
      res.redirect('/'); //Redirect to the profile page
    };
  });
});


function addMovie(req, res) {
    //the movie the user adds to his profile
    let insertedMovie = req.body.movieTitle;

    //the rating the users gives the movie
    let insertedStars = req.body.stars;
    //log this movie for confirmation
    console.log('Movie title input: ', insertedMovie);

    //Assign the session user name to a variable
    let userSessionName = req.session.user.name;

    //search in api for the inserted movie
    request(baseURL + 'search/movie/?api_key=' + APIKEY + '&query=' + insertedMovie, function (error, response,body, req, res) {
      body = JSON.parse(body); //parse the outcome to object, so requesting data is possible
      console.log('Movie title from api: ', body.results[0].original_title); //confirming the title
      let posterLink = baseImgURL + body.results[0].poster_path; //the path to the movie poster image
      console.log('imagepath: ', posterLink);
    //Add the title of the movie into the 'favoMovies' array in the database
    db.collection('users').updateOne({name: userSessionName}, { $addToSet: {favoMovies: [body.results[0].original_title, posterLink, insertedStars] }}, function(err, req, res) {
      if (err) {
        console.log('Error, could not update');
      } else {
        console.log('Update confirmed, added/updated ' + body.results[0].original_title + ' and ' + baseImgURL + body.results[0].poster_path + ' to database');
      };
    //Closes the function that is in updateOne()
    });

    //Create a object in the database and add strings into the object. If the user adds a movie it goes into the database collection 'dating-app'
    db.collection('addedMovies').insertOne({
      title: body.results[0].original_title, //get title
      stars: insertedStars, //get stars
      imgLink: baseImgURL + body.results[0].poster_path
    });
    //Closes the function that is in request()
    });

    //Render the inserted data to the succes.ejs page
    res.render('succes.ejs', {
      data: req.body
    });
    
    //Confirmation for the data that is added to the database
    console.log('This data is added to the database:', data);
    console.log('title: ', req.body.movieTitle);
    console.log('stars: ', req.body.stars);
    console.log('imgLink: ', );
};

function addSerie(req, res) {
  //the serie the user adds to his profile
  let insertedSerie = req.body.serieTitle;

  //the rating the users gives the serie
  let insertedSerieStars = req.body.serieStars;

  //log this serie for confirmation
  console.log('Serie title input: ', insertedSerie);

  //Assign the session user name to a variable
  let userSessionName = req.session.user.name;

  //search in API for inserted serie
  request(baseURL + 'search/tv/?api_key=' + APIKEY + '&query=' + insertedSerie, function (error, response, body, req, res) {
    body = JSON.parse(body); //parse the outcome to object, so requesting data is possible
    console.log('body: ', body);
    console.log('Serie title from api: ', body.results[0].original_name); //confirming the title
    let posterLink = baseImgURL + body.results[0].poster_path;
    
    data.push({
      title: body.results[0].original_name,
      stars: insertedSerieStars
    });
    console.log('data= ', data);
    //Add the title of the serie into the 'favoSeries' array in the database
    db.collection('users').updateOne({name: userSessionName}, { $addToSet: {favoSeries: [body.results[0].original_name, posterLink, insertedSerieStars] }}, function(err, req, res) {
      if (err) {
        console.log('Error, could not update');
      } else {
        console.log('Update confirmed, added/updated ' + body.results[0].original_name + ' and ' + baseImgURL + body.results[0].poster_path + ' to database');
      };
    //Closes the function that is in updateOne()
    });
  //Closes the function that is in request()
  });
  res.render('succesSerie.ejs', {
    data: req.body
  });
  console.log('data2= ', data);
};

//The homepage / profile page
app.get('/', function (req, res) {
  if (!req.session.user) { //if user is not logged in, redirect to the login page
    res.redirect('/login');
    console.log('Redirected to login page, because user was not logged in yet');
  } else {
  //look for the user in database
  db.collection('users').findOne({
  name: req.session.user.name
  },(err, data) => {
    if (err) {
    console.log('Error, cannot find the object/user name');
  } else {
    console.log('Found user');
  };

  //Render his database / profile info into the profile page
  res.render('profile.ejs', {
    data: data
  });
}); 
};
});

//This function is to search for movies in the API database, this can be ignored! Has nothing to do with the dating-app feature.
function zoekMovie(req, res) {
  let zoekveld = req.body.zoekveld;
  console.log('Searched on: ', zoekveld);

  request(baseURL + 'search/movie/?api_key=' + APIKEY + '&query=' + zoekveld, function (error, response, body) {
    body = JSON.parse(body);
    console.log('movieId: ', body.results[0].id);
    console.log('poster path: ', body.results[0].poster_path);
    
    request(baseURL + 'movie/' + body.results[0].id + '/videos?api_key=' + APIKEY, function (error, response, body) {
      body = JSON.parse(body);
      let youtubeVideoLink = 'https://www.youtube.com/watch?v=' + body.results[0].key;
      console.log('youtube link: ' + youtubeVideoLink);
    });

    res.render('film.ejs', {
      dataApi: body.results[0],
      youtubelink: youtubeVideoLink,
      imgLink: baseImgURL + body.results[0].poster_path
    });
  });
};

app.get('/search', function (req, res) {
  res.render('search.ejs')
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
  var arrayCollection = db.collection('addedMovies').find().toArray(done);
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

app.get('/*', function (req, res) {
  res.sendFile(__dirname +'/static/404.html')
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

app.get('/:userId', function (req, res) {
  res.send(req.params.userId)
});
*/

//Confirm server running
app.listen(8000, () => console.log('Done... Server is running'))