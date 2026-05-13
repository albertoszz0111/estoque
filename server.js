console.log('CODIGO NOVO RODANDO');

const express = require('express');

const mysql = require('mysql2');

const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static(__dirname));

const banco = mysql.createConnection({

    host: 'yamanote.proxy.rlwy.net',

    user: 'root',

    password: 'SaTbDnUXSAOCTnzXaSRwxkxPAFYIMdLF',

    database: 'railway',

    port: 35078

});

banco.connect((erro) => {

    if (erro) {

        console.log('ERRO MYSQL');
        console.log(erro);

        return;

    }

    console.log('MYSQL CONECTADO');

});

app.get('/', (req, res) => {

    res.send('API ONLINE');

});

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`PORTA ${PORT}`);

});