//Express server Back-End
const express = require('express');
const app = express();
const PORT = 8000;

/*express.static('/static', [options]);*/
app.use(express.static('static'));
app.get('/', function (req, res) {
  res.sendFile('/static/index.html')
});

app.get('/about', function (req, res) {
  console.log(req.query)
  res.sendFile(__dirname +'/static/about.html')
});

app.get('/*', function (req, res) {
  res.sendFile(__dirname +'/static/404.html')
});

app.get('/:userId', function (req, res) {
  res.send(req.params.userId)
});

app.listen(8000, () => console.log('Done... Server is running'))