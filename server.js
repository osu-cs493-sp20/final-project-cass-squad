const express = require('express');
const api = require('./api');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 8000;


const { connectToDB } = require('./lib/mongo');

app.use(morgan('dev'));

app.use(express.json());
app.use(express.static('public'));


app.use('/', api);

app.use('*', (err, req, res, next) => {
  console.log("== Error:", err);
  res.status(500).send({
    error: "An error occurred: Try again later."
  });
});

app.use('*', function (req, res, next) {
  console.log("====== route does not exist");
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  });
});

connectToDB(async () => {
  // await connectToRabbitMQ('images');
  app.listen(port, () => {
    console.log("== Server is running on port", port);
  });
});
