'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride=require('method-override');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('erorr', err => { throw err });
const PORT = process.env.PORT || 3000;
const app = express();
// app.use('*', notFoundHandler);

// app.use(erorrHandler);
app.use(express.static('./public'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));app.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.get('/search', showForm)
app.post('/search', getBook)
app.post('/select',getSelectedBook)
app.post('/add',addToDB)
app.get('/',getFromDB)
app.put('/update/:book_id', update)
app.delete('/delete/:book_id', deleteBook)


function showForm(req, res) {
    res.render('pages/form');
};

function getBook(req, res) {
    let url = 'https://www.googleapis.com/books/v1/volumes?q=';
    if (req.body.searchResult === 'title') {
        url = url + req.body.text
    } else if (req.body.searchResult === 'author') {
        url = url + req.body.text
    }
    superagent.get(url)
        .then(data => {
            let books = data.body.items
                // res.status(200).json(books)
            res.render('pages/show', { bookFromResult: books })
        });
};
function getFromDB(req,res){
    const SQL ='SELECT * FROM result';
    client.query(SQL)
    .then(select =>{
        res.render('pages/index',{selected:select.rows})
    })
}
function getSelectedBook(req,res){
    let { title, authors, isbn, description, imgURL } = req.body;
    res.render('pages/selectedbook',{book:req.body})
}
function addToDB(req,res){
    let {title,authors,isbn,description,imgURL}=req.body;
    let SQL='INSERT INTO result (title,authors,isbn,description,imgurl) VALUES($1,$2,$3,$4,$5)';
    let values =[title,authors,isbn,description,imgURL];
    client.query(SQL,values)
    .then( res.redirect('/'))
}
function update(req,res){
    let {title,authors,isbn,description,imgURL}=req.body;
 let SQL ='UPDATE result SET title=$1 ,authors=$2 , isbn=$3, description=$4, imgURL=$5 WHERE id=$6';
 let values =[title,authors,isbn,description,imgURL,req.params.book_id];
 client.query(SQL,values)
 .then(res.redirect('/'))
}

function deleteBook(req, res) {
    let SQL = 'DElETE FROM result WHERE id=$1'
    let values = [req.params.book_id]
    client.query(SQL, values)
        .then(res.redirect('/'))
}

function notFoundHandler(req, res) {
    res.status(404).send('Not Found')
};

function erorrHandler(erorr, req, res) {
    res.status(500).send(erorr)
};
client.connect()
    .then(() => {
        app.listen(PORT, () => console.log(`listen on port ${PORT}`))
    })
    .catch(erorr => {
        erorrHandler(erorr, req, res)
    })