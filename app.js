const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");


const routes = require('./routes/index');


const app = express();
app.use(bodyParser.json());



var corsOptions = {origin: "http://localhost:8080/"};
app.use (cors(corsOptions));



app.use(routes);


app.get ("/", (req, res) => {
  res.json({message: "Welcome to testcode"});
  });


app.listen(3000, () => {
  console.log('Server started on port 3000');
});
module.exports = app;
