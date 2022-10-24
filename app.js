const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'))

app.use((req, res, next) => {
  req.user = {
    _id: '6356f4d31ffa0922c10ecf3e'
  };
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});