const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const config = require('./db');
const pizzaController = require('./controllers/pizzaController');
const ingredientController = require('./controllers/ingredientController');

const PORT = 4000;

mongoose.connect(config.DB).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database' +err)
});

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Length, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
  
  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.status(200).end();  // For OPTIONS requests, a 200 response is sent immediately
  } else {
    next();  // Continues normal workflow
  }
  
  // next();
});

app.use('/ingredient', ingredientController);
app.use('/pizza', pizzaController);

app.listen(PORT, function(){
    console.log('Your node js server is running on PORT:',PORT);
});

// pizza : {"img" : "", "name" : "dzadaz", "description" : "dzadaza", "lat" : "43.4814976", "long" : "5.4042623999999995","ingredients" : [""], "created_at" : ""}
// ingredient : {"img" : "", "name" : "dzadaz", "description" : "dzadaza", "weight" : "43.48", "price" : "5.4","deleted" : true, "created_at" : ""}


// db.createCollection('pizza', { autoIndexId: true })
// db.createCollection('ingredient', { autoIndexId: true })
