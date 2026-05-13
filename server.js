const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));


// ==========================
// MYSQL
// ==========================

const banco = mysql.createConnection({

    host: 'mysql.railway.internal',
    user: 'root',
    password: 'SaTbDnUXSAOCTnzXaSRwxkxPAFYIMdLF',
    database: 'railway'

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
        'SELECT quantidade FROM produtos WHERE id = ?',
        [id],
        (erro, resultado) => {

            if (erro) {

                res.status(500).send(erro);
                return;
            }

            if (resultado[0].quantidade <= 0) {

                res.status(400).send('Sem estoque');
                return;

            }

            banco.query(
                'UPDATE produtos SET quantidade = quantidade - 1 WHERE id = ?',
                [id],
                (erro2) => {

                    if (erro2) {

                        res.status(500).send(erro2);
                        return;
                    }

                    res.send('OK');

                }
            );

        }
    );

});


// ==========================
// SERVIDOR
// ==========================

app.listen(3000, () => {

    console.log('Servidor rodando em http://localhost:3000');

});