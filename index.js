var express = require('express');
var cors = require('cors');
var app = express();
var mysql = require('mysql');
var url = require('url');

app.use(cors());


// Database

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "projetnode"
})
con.connect(function (err) {
    if (err) {
        console.log('error in connection');
    }
    console.log('connection done');
})

// Configure Routes

// Create Project
app.get('/createProjet/:name/:description/', function (req, res, next) {
    var name = req.params.name;
    var description = req.params.description;
    var sql = `INSERT INTO projets (name, description) VALUES ('${name}', '${description}')`;
    con.query(sql, function (err, result) {
        if (err) {
            res.status(200).json({'error': err})
        }
        else
        {
            res.status(200).json({'sucess': 'the project was successfully created'})
        }
    });
});


// Retrieve Projects
app.get('/getProjets', function (req, res, next) {
    con.query(
        'SELECT * FROM projets',
        function (err, rows) {
            if (err) throw err;
            console.log(err);
            if (rows.length > 0) {
                res.status(200).json({
                    'projets': rows
                })
            } else {
                rows = 'null';
            }
        }
    )
});
// By id
app.get('/getProjets/:id/', function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
    app.options('*', (req, res) => {
        // allowed XHR methods  
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
        res.send();
    });

    con.query(
        'SELECT * FROM projets WHERE id = ' + req.params.id,
        function (err, rows) {
            if (err) throw err;
            console.log(err);
            if (rows.length > 0) {
                res.status(200).json({
                    'projets': rows
                });
            } else {
                res.status(200).json({
                    'projets': 'there is no such id in the database'
                });
            }
        }
    )
});

// Update Project
app.get('/updateProjet/:id/:name/:description/', function (req, res, next) {
    var id = req.params.id;
    var name = req.params.name;
    var description = req.params.description;
    var sql = `UPDATE projets SET name = '${name}', description = '${description}' WHERE id = ${id}`;
    con.query(sql, function (err, result) {
        if (err) {
            res.status(200).json({'error': err})
        }
        else
        {
            res.status(200).json({'sucess': 'the project was successfully updated'})
        }
    });
});

// Delete projet by id
app.get('/deleteProjet/:id', function (req, res, next) {
    var id = req.params.id;
    var sql = `DELETE FROM projets WHERE id = ${id}`;
    con.query(sql, function (err, result) {
        if (err) {
            res.status(200).json({'error': err})
        }
        else
        {
            res.status(200).json({'sucess': 'the project has been deleted'})
        }
    });
});

// Error 404
app.use(function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        'Error': 'Url not found'
    });
});



app.listen(8080);