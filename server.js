
//Express server v1
/*const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello pizza'));

app.listen(port, () => console.log('Voorbeeld app luisterend naar port ${port}!'));*/



//Express server v2
const express = require('express')

express()
.get('/', onhome)
.listen(1900)

function onhome(req, res) {
	res.send('<h1>Hello client</h1>\n')
}

app.use('/static', express.static('public'))



//Http server
/*var http = require('http');

http.createServer(onrequest).listen(8000);

function onrequest(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  if (req.url === '/about') {
  	res.end('This is my website!\n');
  } else {
  	res.end('Hello World!\n');
  }
  res.end('Hello World!\n');
}*/