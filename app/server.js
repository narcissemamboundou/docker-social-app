const express = require("express")
var bodyParser = require('body-parser')
const app = express()
let path = require('path');
let MongoClient = require('mongodb').MongoClient;
let fs = require('fs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());



app.use(express.static('./app/public'))

/*app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "./app/public/index.html"));
  });*/


  app.get('/profile-picture', function (req, res) {
    let img = fs.readFileSync(path.join(__dirname, "./app/images/1.jpg"));
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
  });
  
  // use when starting application locally
  let mongoUrlLocal = "mongodb://machine64:root@localhost:27017";
  
  // use when starting application as docker container
  let mongoUrlDocker = "mongodb://machine64:root@mongodb";
  
  // pass these options to mongo client connect request to avoid DeprecationWarning for current Server Discovery and Monitoring engine
  let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
  
  // "user-account" in demo with docker. 
  //let databaseName = "user-account";
  // "social-app-db" in demo with docker-compose
  let databaseName = "social-app-db";
  
  app.post('/update-profile', function (req, res) {
    let userObj = req.body;
  
    MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
      if (err) throw err;
  
      let db = client.db(databaseName);
      userObj['userid'] = 1;
  
      let myquery = { userid: 1 };
      let newvalues = { $set: userObj };
  
      db.collection("users").updateOne(myquery, newvalues, {upsert: true}, function(err, res) {
        if (err) throw err;
        client.close();
      });
  
    });
    // Send response
    res.send(userObj);
  });
  
  app.get('/get-profile', function (req, res) {
    let response = {};
    // Connect to the db
    MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
      if (err) throw err;
  
      let db = client.db(databaseName);
  
      let myquery = { userid: 1 };
  
      db.collection("users").findOne(myquery, function (err, result) {
        if (err) throw err;
        response = result;
        client.close();
  
        // Send response
        res.send(response ? response : {});
      });
    });
  });

app.listen(3000, ()=>console.log("social-app listen at http://localhost:3000/"))