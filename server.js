const express = require('express');

const mysql = require('mysql2');

const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static(__dirname));


// ==========================
// MYSQL RAILWAY
// ==========================

const banco = mysql.createConnection({

    host: process.env.MYSQLHOST,

    user: process.env.MYSQLUSER,

    password: process.env.MYSQLPASSWORD,

    database: process.env.MYSQLDATABASE,

    port: process.env.MYSQLPORT

});

banco.connect((erro) => {

    if (erro) {

        console.log('Erro MySQL');

        console.log(erro);

        return;

    }

    console.log('MySQL conectado');

});


// ==========================
// LISTAR PRODUTOS
// ==========================

app.get('/estoque', (req, res) => {

    banco.query(

        'SELECT * FROM produtos',

        (erro, resultado) => {

            if (erro) {

                res.status(500).send(erro);

                return;

            }

            res.json(resultado);

        }

    );

});


// ==========================
// ADICIONAR
// ==========================

app.post('/adicionar/:id', (req, res) => {

    const id = req.params.id;

    banco.query(

        'UPDATE produtos SET quantidade = quantidade + 1 WHERE id = ?',

        [id],

        (erro) => {

            if (erro) {

                res.status(500).send(erro);

                return;

            }

            res.send('OK');

        }

    );

});


// ==========================
// RETIRAR
// ==========================

app.post('/retirar/:id', (req, res) => {

    const id = req.params.id;

    banco.query(

        `
        UPDATE produtos
        SET quantidade = quantidade - 1
        WHERE id = ?
        AND quantidade > 0
        `,

        [id],

        (erro) => {

            if (erro) {

                res.status(500).send(erro);

                return;

            }

            res.send('OK');

        }

    );

});


// ==========================
// PORTA RAILWAY
// ==========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Servidor rodando na porta ${PORT}`);

});