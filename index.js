const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 3000;

// Configuração da conexão com banco de dados
const db = mysql.createConnection({
  host: 'p84sgg0oc8088ss44wo80s04',
  port: 3306,
  user: 'root',
  password: 'rodrigo0196',
  database: 'marmitariafarias' 
});

// Testar conexão com o banco
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no banco de dados:', err);
    return;
  }
  console.log('✅ Conectado ao banco de dados MySQL!');
});

// Rota principal
app.get('/', (req, res) => {
  res.send('🚀 Servidor funcionando! Acesse /orders para ver os pedidos');
});

// Rota para buscar pedidos
app.get('/orders', (req, res) => {
  const query = 'SELECT * FROM o01_order ORDER BY id_order DESC LIMIT 10';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro na query:', err);
      return res.status(500).json({ 
        erro: 'Erro ao buscar pedidos',
        detalhes: err.message 
      });
    }
    
    res.json({
      success: true,
      total: results.length,
      pedidos: results
    });
  });
});

// Rota para buscar um pedido específico por ID
app.get('/orders/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM o01_order WHERE id_order = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ erro: 'Pedido não encontrado' });
    }
    
    res.json(results[0]);
  });
});

// Rota para verificar status da conexão
app.get('/status', (req, res) => {
  db.ping((err) => {
    if (err) {
      return res.status(500).json({ 
        status: 'erro',
        mensagem: 'Banco de dados desconectado',
        erro: err.message 
      });
    }
    
    res.json({ 
      status: 'ok',
      mensagem: 'Servidor e banco de dados funcionando!',
      timestamp: new Date()
    });
  });
});

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em http://0.0.0.0:${port}`);
});