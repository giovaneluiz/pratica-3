import express from 'express'
import { connection } from './mysql.js'

const app = express()

app.use(express.json())
// view engine setup

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/movies', (req, res) => {
    connection.query('SELECT * FROM `movies` ORDER BY cod DESC', function (err, results, fields) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar dados do banco de dados' });
        }
        res.render('movies', {movies: results})
        // res.json(results); // Envia os resultados como resposta no formato JSON
    });
});

app.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM `movies` WHERE cod = ?';

    connection.query(query, [id], function (err, results, fields) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar dados do banco de dados' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Filme não encontrado' });
        }

        res.json(results[0]); // Envia o primeiro resultado como resposta no formato JSON
    });
});

// Rota para inserir um novo filme
app.post('/new', async (req, res) => {
    console.log(req.body)
    try {
        const { titulo, sinopse, duracao, imagem, dataLancamento } = req.body;
        if (!titulo || !sinopse || !duracao || !imagem || !dataLancamento) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Decodifica a imagem base64 para binário
        const imagemBinario = Buffer.from(imagem, 'base64');

        // const query = 'INSERT INTO `movies` (titulo, sinopse, duracao, imagem, dataLancamento) VALUES (?, ?, ?, ?, ?)';
        const values = [titulo, sinopse, duracao, imagemBinario, dataLancamento];

        // const [result] = connection.query(query, values);

        res.status(201).json({ message: 'Filme inserido com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao inserir dados no banco de dados' });
    }
});

app.listen(3000, console.log('Servidor rodando'))