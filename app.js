const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const axios = require('axios');

app.use(bodyParser.urlencoded({ extended : true}))

app.get('/', function(req, res) {
  res.render('index', { title: "Qui prend quoi"});
  console.log(req.body)
});

app.post('/party', function(req, res) {
  axios
    .post(`${process.env.API_URL}/party`, req.body)
    .then(({ data }) => res.redirect(`/party/${data._id}`))
    .catch((err) => res.send(err));
});

//Page Evénement
app.get('/party/:id', function(req, res){
  axios
  .get(`${process.env.API_URL}/party/${req.params.id}`)
  .then(({ data }) =>
    res.render('party', {
      party: data,
      title: data.name,
      url: `${process.env.FRONT_URL}:${process.env.PORT}/party/${data._id}`
    }),
  )
  .catch((err) => console.log(err));
})

app.post('/party/:id/items', (req, res) => {
  axios
    .post(`${process.env.API_URL}/party/${req.params.id}/items`, req.body) 
    .then((data) => res.redirect(`/party/${req.params.id}`))
    .catch((err) => console.log(err))
  ;
});

app.delete('/party/:id/items/:idItem', (req, res) => {
  axios
    .delete(`${process.env.API_URL}/party/${req.params.id}/items/${req.params.idItem}`)
    .then((data) => res.redirect(`/party/${req.params.id}`))
    .catch((err) => console.log(err))
  ;
});


app.use(express.static('public'));
app.use(express.static('pwa'));
app.listen(process.env.PORT, () => console.log(`Front app listening on port ${process.env.PORT}!`));
app.set('view engine', 'pug');

