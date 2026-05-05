const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '171105',
    database: 'estoque_db'
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar:', err);
    } else {
        console.log('Conectado ao MySQL');
    }
});


// =========================
// ROTAS
// =========================

// listar todos os itens
app.get('/estoque', (req, res) => {
    db.query('SELECT * FROM estoque', (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
});


// listar apenas capacetes
app.get('/capacetes', (req, res) => {
    db.query("SELECT * FROM estoque WHERE nome LIKE '%Capacete%'", (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
});


// retirar (-1)
app.post('/retirar/:id', (req, res) => {
    const id = req.params.id;

    db.query(
        'UPDATE estoque SET quantidade = quantidade - 1 WHERE id = ? AND quantidade > 0',
        [id],
        (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else if (result.affectedRows === 0) {
                res.json({ mensagem: 'Sem estoque disponível' });
            } else {
                res.json({ mensagem: 'Item retirado' });
            }
        }
    );
});


// adicionar (+1)
app.post('/adicionar/:id', (req, res) => {
    const id = req.params.id;

    db.query(
        'UPDATE estoque SET quantidade = quantidade + 1 WHERE id = ?',
        [id],
        (err) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json({ mensagem: 'Item adicionado' });
            }
        }
    );
});


// =========================
// SERVIDOR
// =========================
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});