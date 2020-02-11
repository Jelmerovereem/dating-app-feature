const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello pizza'));

app.listen(port, () => console.log('Voorbeeld app luisterend naar port ${port}!'));