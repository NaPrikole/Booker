require('dotenv').config({ silent: true });

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const http = require('http');
const moment = require('moment-timezone');
const serialize = require('serialize-javascript');
moment.tz.setDefault('UTC');

app.use('/public', express.static(path.join(__dirname, 'public')));

// let events = [    
//   { description: 'Some event 1', date: moment('2018-09-7', 'YYYY-MM-DD') },
//   { description: 'Some event 2', date: moment('2018-09-15', 'YYYY-MM-DD') },
//   { description: 'Some event 3', date: moment('2018-10-23', 'YYYY-MM-DD') },
//   { description: 'Some event 4', date: moment('2018-9-11', 'YYYY-MM-DD') },
// ];

let events = [];

app.get('/', (req, res) => {
  let template = fs.readFileSync(path.resolve('./index.html'), 'utf-8');
  let contentMarket = '<!--APP-->';
  res.send(template.replace(contentMarket, `<script>var __INITIAL_STATE__ = ${ serialize(events) }</script>`));
});

app.use(require('body-parser').json());

app.post('/add_event', (req, res) => {
  events.push(req.body);
  res.sendStatus(200);
});

const server = http.createServer(app);

if (process.env.NODE_ENV === 'development') {
  const reload = require('reload');
  const reloadServer = reload(server, app);
  require('./webpack-dev-middleware').init(app);
}

server.listen(process.env.PORT, function () {
  console.log(`Server start on port ${process.env.PORT}!`);
  if (process.env.NODE_ENV === 'development') {
    require("open")(`http://localhost:${process.env.PORT}`);
  }
});
