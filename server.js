const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, '..', 'front-app')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Rota para envio do formulário de contato
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: 'Mensagem de Contato do Site',
    text: `Nome: ${name}\nEmail: ${email}\nMensagem: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Erro ao enviar email: ' + error.message);
    }
    res.status(200).send('Email enviado com sucesso!');
  });
});

// Rota para servir o frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-app', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
