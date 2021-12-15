const express = require('express')
const mysql = require('mysql')

//create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs'
});

//connect
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("MySql connected !")
})
const app = express();
app.use(express.urlencoded({extended: false, limit: '30mb', parameterLimit: 100000}));
app.use(express.json({limit: '50mb'}));

//create DB
app.get('/createDB', (req, res) => {
    let sql = 'CREATE DATABASE nodejs';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send('Database created !');
    })
})
//create table
app.get('/createTable', (req, res) => {
    let sql = 'CREATE TABLE users(id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30) NOT NULL, mail VARCHAR(50) NOT NULL,created_at DATETIME DEFAULT CURRENT_TIMESTAMP)';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send('Table created !');
    })
})

//get all user
app.get('/users', (req, res) => {
    const {name} = req.query;
    let sql = "SELECT * FROM users";
    if (name) {
        sql += " where name LIKE ?";
    }
    let query = db.query(sql, [`%${name}%`], (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

//get user by id
app.get('/users/:id', (req, res) => {
    let sql = `SELECT * FROM users WHERE id = ?`;
    let query = db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//add user to db
app.post('/users', (req, res) => {
    let data = {name: req.body.name, mail: req.body.mail};
    let sql = 'INSERT INTO users SET ?';
    let query = db.query(sql, [data], (err, result) => {
        if (err) throw err;
        res.send({
            id: req.params.id,
            name: req.body.name,
            mail: req.body.mail
        });
    });
});

//update user
app.put('/users/:id', (req, res) => {
    let newName = req.body.name;
    let newMail = req.body.mail;
    let sql = `UPDATE users SET name =?, mail = ? WHERE id = ?`;
    let query = db.query(sql, [newName, newMail, req.params.id], (err, result) => {
        if (err) throw err;
        res.send({
            id: req.params.id,
            name: newName,
            mail: newMail
        });
    });
});

//delete user
app.delete('/users/:id', (req, res) => {
    let sql = `DELETE FROM users WHERE id = ?`;
    let query = db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.listen('3000', () => {
    console.log("Server started on port 3000");
})
