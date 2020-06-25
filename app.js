const path = require('path');
const express = require('express');
const EJS = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 3000;


app.engine('html', EJS.renderFile);






const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'app_citations'
});

connection.connect((error)=>{
    if(error) console.log(error);
     console.log('database est connecté');
});


app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));




//------------------------------------Les routes ----------------------------------//

app.get('/',(req, res) => {
    let sql = "SELECT * FROM auteurs";
    connection.query(sql, (err, rows) => {
      console.log(rows);
        if(err) throw err;
        res.render('Home', {
            title : 'Bienvenu',
            rows : rows
        });

    });
});
app.get('/home',(req, res) => {
    let sql = "SELECT * FROM auteurs";
    connection.query(sql, (err, rows) => {
      console.log(rows);
        if(err) throw err;
        res.render('Home', {
            title : 'CITATION',
            rows : rows
        });

    });
});

//--------------------------Routes Parts Stock " Auteur - Citation " ----------------------------------//


//--------------------------"   Auteur  " ----------------------------------//

    // Page ajt_auteur
app.get('/ajt-auteur',(req, res) => {
    res.render('ajt_auteur', {
        title : 'Ajouter un auteur',
    });
});

app.post('/signUp-auteur',(req, res) => {

    let data = {nom: req.body.nom, prenom:req.body.prenom, age: req.body.age, nationalite: req.body.nationalite};
    let sql = "INSERT INTO auteurs SET ?";
    connection.query(sql, data,(err, results) => {
      if(err) return err;
      res.redirect('/');
    });
});

app.get('/edit-auteur/:userId',(req, res) => {

    const auteurId = req.params.userId;
    let sql = `Select * from auteurs where id_a = ${auteurId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('update_auteur', {
            title : "Modifier l'auteur ",
            row : result[0]
        });
    });
});

app.get('/delete-auteur/:userId', function (req, res) {
    const auteurId = req.params.userId;
    let sql = `DELETE from auteurs where id_a = ${auteurId}`;
        connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
        console.log(result);
        });
    });

app.post('/update_auteur',(req, res) => {

  let userId = req.body.id_a;


    let sql = `update auteurs SET nom = '${req.body.nom}', prenom = '${req.body.prenom}', age = ${req.body.age}, nationalite = '${req.body.natio}' where id_a = ${userId}`;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

// ______________________________________//

app.get('/citations',(req, res) => {

    let sql = " SELECT * FROM citation,auteurs ";
    connection.query(sql, (err, rows) => {
      console.log(rows);
        if(err) throw err;
        res.render('Citations', {
            title : 'Les Citations',
            rows : rows
        });

    });
});


app.get('/citations/:userId',(req, res) => {

    let userId = req.body.userId;
    let sql1 = 'SELECT * FROM citation where id_a = ${userId}';

    let sql = 'SELECT citation.id_c, auteurs.nom, auteurs.prenom, auteurs.age, auteurs.nationalite, citation.citation, citation.livre FROM citation INNER JOIN auteurs ON auteurs.id_a = ${userId}'
    connection.query(sql1, (err, rows) => {
      console.log(rows);
        if(err) throw err;
        res.render('Citation', {
            title : 'Le Citations',
            rows : rows
        });

    });
});

// Page ajt_citation
app.get('/:userId/add-citation',(req, res) => {
    res.render('addc', {
        title : 'Ajouter une citation',
    });
});

app.post('/:userId/signUp-citation',(req, res) => {

    let data = {citation:req.body.citation, livre: req.body.livre};
    let sql = "INSERT INTO citation SET ?";
    connection.query(sql, data,(err, results) => {
      if(err) return err;
      res.redirect('/');
    });
});

app.get('/edit-citation',(req, res) => {

    const citationId = req.params.citationId;
    let sql = `Select * from citation where id = ${citationId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('update_citation', {
            title : "Modifier la citation ",
            row : result[0]
        });
    });
});

app.get('/delete-citation', function (req, res) {
    const citationId = req.params.userId;
    let sql = `DELETE from citation where id_a = ${citationId}`;
        connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
        console.log(result);
        });
    });

app.post('/update_citation',(req, res) => {

  let userId = req.body.id;


    let sql = `update citation SET id_c = '${req.body.id_c}', citation = '${req.body.citation}', livre = '${req.body.livre}' where id_a = ${userId}`;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

app.listen(port, function () {
    console.log('Listening on http://localhost:3000/');
});