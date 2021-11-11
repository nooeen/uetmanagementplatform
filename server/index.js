const express = require("express");
const cookieParser = require("cookie-parser");
const pino = require("express-pino-logger")();
const route = require("./routes");
const db = require("./db");
const handlebars = require('express-handlebars');
const path = require('path');
var bodyParser  = require('body-parser');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(pino);
app.use(cookieParser());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.resolve(__dirname,'public')));

db.connect();

// Template engine
app.engine(
  'hbs',
  handlebars({
      extname: '.hbs',
      helpers: {
          sum: (a, b) => a + b,
      },
  }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));


route(app);

app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);
