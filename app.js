const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 2020;




const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'app_citations'
});

connection.connect((error)=>{
    if(error) console.log(error);
     console.log('Database Connected!');
});


app.use(express.static(path.join(__dirname, 'public','css')));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));





app.get('/',(req, res) => {
    let sql = "SELECT * FROM auteurs";
    connection.query(sql, (err, rows) => {
      console.log(rows);
        if(err) throw err;
        res.render('Home', {
            title : 'Auteurs',
            rows : rows
        });

    });
});
    // Page ajt_auteur
app.get('/add',(req, res) => {
    res.render('ajt_auteur', {
        title : 'Ajouter un auteur',
    });
});

app.post('/signUp',(req, res) => {

    let data = {id: req.body.id, nom: req.body.nom, prenom:req.body.prenom, age: req.body.age, nationalite: req.body.natio};
    let sql = "INSERT INTO auteurs SET ?";
    connection.query(sql, data,(err, results) => {
      if(err) return err;
      res.redirect('/');
    });
});

app.get('/edit/:userId',(req, res) => {

    const auteurId = req.params.userId;
    let sql = `Select * from auteurs where id = ${auteurId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('UpdateAuteur', {
            title : "Modifier l'auteur ",
            row : result[0]
        });
    });
});

app.get('/delete/:userId', function (req, res) {
    const auteurId = req.params.userId;
    let sql = `DELETE from auteurs where id = ${auteurId}`;
        connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
        console.log(result);
        });
    });

app.post('/update',(req, res) => {

  let userId = req.body.id;


    let sql = `update auteurs SET nom = '${req.body.nom}', prenom = '${req.body.prenom}', age = ${req.body.age}, nationalite = '${req.body.natio}' where id = ${userId}`;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

app.listen(port, (error)=>{
  console.log(`Listening on port ${port}`);
});
